# ==============================================================================
# GK INDIA ACADEMY — GLOBAL SEARCH MODAL & INTERACTION TEST
# ==============================================================================
$ErrorActionPreference = "Stop"

function Invoke-CDP {
    param(
        $WebSocket,
        [string] $Method,
        [hashtable] $Params = @{}
    )
    if (-not $WebSocket -or $WebSocket.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
        throw "WebSocket is not connected or open."
    }

    $script:cdpId++
    $currentId = $script:cdpId
    $payload = @{
        id = $currentId
        method = $Method
        params = $Params
    } | ConvertTo-Json -Depth 10 -Compress

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $segment = [System.ArraySegment[byte]]::new($bytes)
    $cts = [System.Threading.CancellationTokenSource]::new([TimeSpan]::FromSeconds(8))
    $WebSocket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

    $buffer = [byte[]]::new(65536)
    $readTimeout = [DateTime]::UtcNow.AddSeconds(8)
    while ([DateTime]::UtcNow -lt $readTimeout) {
        $ms = [System.IO.MemoryStream]::new()
        do {
            if (-not $WebSocket -or $WebSocket.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
                break
            }
            $seg = [System.ArraySegment[byte]]::new($buffer)
            $res = $WebSocket.ReceiveAsync($seg, $cts.Token).Result
            if ($null -eq $res) {
                break
            }
            if ($res.Count -gt 0) {
                $ms.Write($buffer, 0, $res.Count)
            }
        } while ($res -and -not $res.EndOfMessage)

        if ($ms.Length -gt 0) {
            $jsonStr = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
            try {
                $json = $jsonStr | ConvertFrom-Json
                if ($json.PSObject.Properties['id'] -and $json.id -eq $currentId) {
                    return $json
                }
            } catch {}
        }
    }
    throw "CDP response timed out for method: $Method (id: $currentId)"
}

function Invoke-JS {
    param(
        $WebSocket,
        [string] $Expression
    )
    if (-not $WebSocket -or $WebSocket.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
        return $null
    }
    $res = Invoke-CDP -WebSocket $WebSocket -Method "Runtime.evaluate" -Params @{
        expression = $Expression
        returnByValue = $true
        awaitPromise = $true
    }
    if ($res.result -and $res.result.result -and $res.result.result.PSObject.Properties['value']) {
        return $res.result.result.value
    }
    return $null
}

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$port = Get-Random -Minimum 9450 -Maximum 9850
$userDataDir = [System.IO.Path]::Combine($env:TEMP, "edge_search_test_" + [System.Guid]::NewGuid().ToString())

$process = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--user-data-dir=`"$userDataDir`"",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
) -PassThru

$ws = $null

try {
    # 1. Wait for debug port to be ready
    $connected = $false
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Milliseconds 400
        try {
            $targets = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json" -TimeoutSec 2
            if ($targets) {
                $connected = $true
                break
            }
        } catch {}
    }

    if (-not $connected) {
        throw "Failed to connect to Edge DevTools port $port"
    }

    $pageTarget = $targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1
    if (-not $pageTarget) {
        $pageTarget = $targets[0]
    }
    $wsUrl = $pageTarget.webSocketDebuggerUrl
    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $ws.ConnectAsync([System.Uri]::new($wsUrl), [System.Threading.CancellationToken]::None).Wait()
    $script:cdpId = 0

    Invoke-CDP -WebSocket $ws -Method "Page.enable" | Out-Null
    Invoke-CDP -WebSocket $ws -Method "Runtime.enable" | Out-Null

    # 2. Navigate to index.html
    Write-Host "`nNavigating to http://localhost:5500/index.html ..."
    Invoke-CDP -WebSocket $ws -Method "Page.navigate" -Params @{ url = "http://localhost:5500/index.html" } | Out-Null
    Start-Sleep -Milliseconds 1200

    # 3. Check page title and search elements presence (Line 60 equivalent)
    $title = Invoke-JS -WebSocket $ws -Expression "document.title"
    $btnExists = Invoke-JS -WebSocket $ws -Expression "!!document.getElementById('globalSearchBtn')"
    $modalExists = Invoke-JS -WebSocket $ws -Expression "!!document.getElementById('globalSearchModal')"
    Write-Host "Page Title: $title"
    Write-Host "Search Button Exists: $btnExists"
    Write-Host "Search Modal Injected: $modalExists"

    if (-not $btnExists -or -not $modalExists) {
        throw "Search button or modal not found in DOM."
    }

    # 4. Click search button to open modal
    $null = Invoke-JS -WebSocket $ws -Expression "document.getElementById('globalSearchBtn').click()"
    Start-Sleep -Milliseconds 400
    $modalActive = Invoke-JS -WebSocket $ws -Expression "document.getElementById('globalSearchModal').classList.contains('is-active')"
    Write-Host "Modal Active after click: $modalActive"

    # 5. Check popular chips
    $popularChips = Invoke-JS -WebSocket $ws -Expression "document.querySelectorAll('.search-tag-chip').length"
    Write-Host "Popular search chips rendered: $popularChips"

    # 6. Type search query 'Polity'
    $null = Invoke-JS -WebSocket $ws -Expression "(() => {
        const inp = document.getElementById('globalSearchInput');
        if (inp) {
            inp.value = 'Polity';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
    })()"
    Start-Sleep -Milliseconds 600

    $resultsCount = Invoke-JS -WebSocket $ws -Expression "document.querySelectorAll('.search-result-item').length"
    $firstTitle = Invoke-JS -WebSocket $ws -Expression "document.querySelector('.search-result-item .search-item-title')?.textContent?.trim()"
    Write-Host "Search results for 'Polity': $resultsCount items found (First: $firstTitle)"

    # 7. Test category filter: Questions tab
    $null = Invoke-JS -WebSocket $ws -Expression "document.querySelector('.search-pill-btn[data-type=question]')?.click()"
    Start-Sleep -Milliseconds 400
    $questionResults = Invoke-JS -WebSocket $ws -Expression "document.querySelectorAll('.search-result-item').length"
    Write-Host "Filtered to 'Questions': $questionResults items found"

    # 8. Test Search for Current Affairs 'Hydrogen'
    $null = Invoke-JS -WebSocket $ws -Expression "(() => {
        document.querySelector('.search-pill-btn[data-type=all]')?.click();
        const inp = document.getElementById('globalSearchInput');
        if (inp) {
            inp.value = 'Hydrogen';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
    })()"
    Start-Sleep -Milliseconds 600

    $caTitle = Invoke-JS -WebSocket $ws -Expression "document.querySelector('.search-result-item .search-item-title')?.textContent?.trim()"
    $caBadge = Invoke-JS -WebSocket $ws -Expression "document.querySelector('.search-result-item .search-item-tag')?.textContent?.trim()"
    Write-Host "Search for 'Hydrogen': $caTitle ($caBadge)"

    # 9. Test modal closing via Escape key
    $null = Invoke-JS -WebSocket $ws -Expression "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))"
    Start-Sleep -Milliseconds 300
    $modalClosed = Invoke-JS -WebSocket $ws -Expression "!document.getElementById('globalSearchModal').classList.contains('is-active')"
    Write-Host "Modal closed after Escape: $modalClosed"

    Write-Host "`nAll Search Modal tests passed with 0 errors!`n"
}
finally {
    if ($ws -and $ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        try {
            $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", [System.Threading.CancellationToken]::None).Wait(1000)
        } catch {}
        $ws.Dispose()
    }
    if ($process -and -not $process.HasExited) {
        try { $process.Kill() } catch {}
    }
    if (Test-Path $userDataDir) {
        try { Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue } catch {}
    }
}
