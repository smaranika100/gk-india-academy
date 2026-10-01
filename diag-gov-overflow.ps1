# ==============================================================================
# GK INDIA ACADEMY — GOVERNMENT EXAMS RESPONSIVE OVERFLOW DIAGNOSTIC
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
$userDataDir = [System.IO.Path]::Combine($env:TEMP, "edge_diag_gov_" + [System.Guid]::NewGuid().ToString())
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
    # Wait for debug port to be ready
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

    # 1. Desktop Check (1440 x 900)
    Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
        width = 1440; height = 900; deviceScaleFactor = 1; mobile = $false
    } | Out-Null
    Invoke-CDP -WebSocket $ws -Method "Page.navigate" -Params @{ url = "http://localhost:5500/government-exams.html" } | Out-Null
    Start-Sleep -Milliseconds 1200

    $desktopDiag = Invoke-JS -WebSocket $ws -Expression "(() => {
        const docW = document.documentElement.clientWidth;
        const grid = document.getElementById('popularExamsGrid');
        const container = grid ? grid.closest('.container') : null;
        const card = grid ? grid.querySelector('.gov-exam-card') : null;
        return {
            windowWidth: window.innerWidth,
            clientWidth: docW,
            scrollWidth: document.documentElement.scrollWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > docW,
            containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
            containerRight: container ? Math.round(container.getBoundingClientRect().right) : null,
            gridWidth: grid ? Math.round(grid.getBoundingClientRect().width) : null,
            gridRight: grid ? Math.round(grid.getBoundingClientRect().right) : null,
            cardWidth: card ? Math.round(card.getBoundingClientRect().width) : null
        };
    })()"

    Write-Host "`n=== DIAGNOSTIC: DESKTOP (1440px) ==="
    $desktopDiag | Format-List

    # 2. Tablet Check (768 x 1024)
    Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
        width = 768; height = 1024; deviceScaleFactor = 2; mobile = $true
    } | Out-Null
    Start-Sleep -Milliseconds 600

    $tabletDiag = Invoke-JS -WebSocket $ws -Expression "(() => {
        const docW = document.documentElement.clientWidth;
        const grid = document.getElementById('popularExamsGrid');
        const container = grid ? grid.closest('.container') : null;
        const card = grid ? grid.querySelector('.gov-exam-card') : null;
        return {
            windowWidth: window.innerWidth,
            clientWidth: docW,
            scrollWidth: document.documentElement.scrollWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > docW,
            containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
            containerRight: container ? Math.round(container.getBoundingClientRect().right) : null,
            gridWidth: grid ? Math.round(grid.getBoundingClientRect().width) : null,
            gridRight: grid ? Math.round(grid.getBoundingClientRect().right) : null,
            cardWidth: card ? Math.round(card.getBoundingClientRect().width) : null
        };
    })()"

    Write-Host "=== DIAGNOSTIC: TABLET (768px) ==="
    $tabletDiag | Format-List

    # 3. Mobile Check (375 x 812)
    Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
        width = 375; height = 812; deviceScaleFactor = 3; mobile = $true
    } | Out-Null
    Start-Sleep -Milliseconds 600

    $mobileDiag = Invoke-JS -WebSocket $ws -Expression "(() => {
        const docW = document.documentElement.clientWidth;
        const grid = document.getElementById('popularExamsGrid');
        const container = grid ? grid.closest('.container') : null;
        const card = grid ? grid.querySelector('.gov-exam-card') : null;
        return {
            windowWidth: window.innerWidth,
            clientWidth: docW,
            scrollWidth: document.documentElement.scrollWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > docW,
            containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
            containerRight: container ? Math.round(container.getBoundingClientRect().right) : null,
            gridWidth: grid ? Math.round(grid.getBoundingClientRect().width) : null,
            gridRight: grid ? Math.round(grid.getBoundingClientRect().right) : null,
            cardWidth: card ? Math.round(card.getBoundingClientRect().width) : null
        };
    })()"

    Write-Host "=== DIAGNOSTIC: MOBILE (375px) ==="
    $mobileDiag | Format-List

    Write-Host "Diagnostic completed successfully with 0 errors.`n"
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
