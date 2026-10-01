# ==============================================================================
# GK INDIA ACADEMY — COMPREHENSIVE RESPONSIVE & USER EXPERIENCE TEST SUITE
# ==============================================================================
$ErrorActionPreference = "Stop"

function Invoke-CDP {
    param(
        $WebSocket,
        [string] $Method,
        [hashtable] $Params = @{}
    )
    if (-not $WebSocket -or $WebSocket.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
        throw "WebSocket is not connected or open. Current state: $(if ($WebSocket) { $WebSocket.State } else { 'null' })"
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

    # Read until message with matching ID is received (with 8s timeout)
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
    try {
        $res = Invoke-CDP -WebSocket $WebSocket -Method "Runtime.evaluate" -Params @{
            expression = $Expression
            returnByValue = $true
            awaitPromise = $true
        }
        if ($res -and $res.result -and $res.result.result) {
            return $res.result.result.value
        }
    } catch {
        Write-Warning "Evaluate-JS error: $_"
    }
    return $null
}

Write-Host "=========================================================="
Write-Host "1. STARTING HEADLESS BROWSER INSTANCE"
Write-Host "=========================================================="

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path $edgePath)) {
    Write-Error "Microsoft Edge executable not found at standard paths."
    exit 1
}

# Unique port and temp data dir to avoid any collision
$port = Get-Random -Minimum 9400 -Maximum 9800
$userDataDir = [System.IO.Path]::Combine($env:TEMP, "edge_test_suite_" + [System.Guid]::NewGuid().ToString().Substring(0,8))

$process = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--user-data-dir=$userDataDir",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
) -PassThru

# Wait for Edge CDP endpoint with retry
$connected = $false
$targets = $null
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Milliseconds 600
    try {
        $targets = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json" -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($targets) {
            $connected = $true
            break
        }
    } catch {}
}

if (-not $connected -or -not $targets) {
    Write-Error "Failed to connect to Edge CDP endpoint at port $port."
    if ($process) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
    exit 1
}

$pageTarget = $targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1
if (-not $pageTarget) {
    $pageTarget = $targets[0]
}

$wsUrl = $pageTarget.webSocketDebuggerUrl
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([System.Uri]::new($wsUrl), [System.Threading.CancellationToken]::None).Wait()
$script:cdpId = 0

try {
    Invoke-CDP -WebSocket $ws -Method "Page.enable" | Out-Null
    Invoke-CDP -WebSocket $ws -Method "Runtime.enable" | Out-Null

    $pagesToTest = @(
        @{ Name = "Home Page"; Url = "http://localhost:5500/index.html" },
        @{ Name = "Government Exams"; Url = "http://localhost:5500/government-exams.html" },
        @{ Name = "Practice MCQs"; Url = "http://localhost:5500/mcqs/index.html" },
        @{ Name = "GK Overview"; Url = "http://localhost:5500/gk.html" },
        @{ Name = "Contact Page"; Url = "http://localhost:5500/contact.html" },
        @{ Name = "Privacy Policy"; Url = "http://localhost:5500/privacy-policy.html" },
        @{ Name = "Terms & Conditions"; Url = "http://localhost:5500/terms.html" },
        @{ Name = "Disclaimer"; Url = "http://localhost:5500/disclaimer.html" },
        @{ Name = "Cookie Policy"; Url = "http://localhost:5500/cookie-policy.html" },
        @{ Name = "Indian Geography Subject"; Url = "http://localhost:5500/subjects/indian-geography.html" }
    )

    $results = @()

    foreach ($page in $pagesToTest) {
        Write-Host "Auditing: $($page.Name)..."

        # 1. Desktop Test (1440 x 900)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 1440; height = 900; deviceScaleFactor = 1; mobile = $false
        } | Out-Null

        Invoke-CDP -WebSocket $ws -Method "Page.navigate" -Params @{ url = $page.Url } | Out-Null
        Start-Sleep -Milliseconds 800

        $desktopWidth = Invoke-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $desktopPass = ($desktopWidth -le 1440)

        # 2. Tablet Test (768 x 1024)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 768; height = 1024; deviceScaleFactor = 2; mobile = $true
        } | Out-Null
        Start-Sleep -Milliseconds 400
        $tabletWidth = Invoke-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $tabletPass = ($tabletWidth -le 768)

        # 3. Mobile Test (375 x 812)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 375; height = 812; deviceScaleFactor = 3; mobile = $true
        } | Out-Null
        Start-Sleep -Milliseconds 400
        $mobileWidth = Invoke-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $mobilePass = ($mobileWidth -le 375)

        # 4. Mobile Menu Interaction
        $drawerStatus = Invoke-JS -WebSocket $ws -Expression "(() => {
            const btn = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger-btn');
            const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer');
            if (!btn || !drawer) return 'N/A';
            btn.click();
            const isOpen = drawer.classList.contains('active') || drawer.classList.contains('open') || window.getComputedStyle(drawer).transform.includes('matrix');
            const closeBtn = document.getElementById('drawerCloseBtn') || drawer.querySelector('.drawer-close-btn');
            if (closeBtn) closeBtn.click();
            return isOpen ? 'PASS' : 'FAIL';
        })()"

        # 5. Global Search Trigger Test
        $searchStatus = Invoke-JS -WebSocket $ws -Expression "(() => {
            const trigger = document.getElementById('globalSearchBtn') || document.querySelector('.btn-global-search-trigger');
            const modal = document.getElementById('globalSearchModal');
            if (!trigger || !modal) return 'N/A';
            trigger.click();
            const isOpen = modal.classList.contains('is-active') || modal.classList.contains('active') || window.getComputedStyle(modal).visibility === 'visible';
            const closeBtn = document.getElementById('searchModalClose');
            if (closeBtn) closeBtn.click();
            return isOpen ? 'PASS' : 'FAIL';
        })()"

        $results += [PSCustomObject]@{
            Page = $page.Name
            Desktop = if ($desktopPass) { "PASS ($desktopWidth px)" } else { "OVERFLOW ($desktopWidth px)" }
            Tablet  = if ($tabletPass) { "PASS ($tabletWidth px)" } else { "OVERFLOW ($tabletWidth px)" }
            Mobile  = if ($mobilePass) { "PASS ($mobileWidth px)" } else { "OVERFLOW ($mobileWidth px)" }
            Menu    = $drawerStatus
            Search  = $searchStatus
        }
    }

    Write-Host "`n=========================================================="
    Write-Host "FINAL TEST RESULTS SUMMARY"
    Write-Host "=========================================================="
    $results | Format-Table -AutoSize

} finally {
    if ($ws) {
        try { $ws.Dispose() } catch {}
    }
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
}
