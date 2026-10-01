# ==============================================================================
# GK INDIA ACADEMY — VERIFY ADMIN AUTHENTICATION FLOW
# ==============================================================================
$ErrorActionPreference = "Stop"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$port = Get-Random -Minimum 9450 -Maximum 9850
$userDataDir = [System.IO.Path]::Combine($env:TEMP, "edge_admin_auth_" + [System.Guid]::NewGuid().ToString().Substring(0, 8))
$edgeProcess = Start-Process -FilePath $edgePath -ArgumentList @(
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
    $ws.ConnectAsync([Uri]::new($wsUrl), [System.Threading.CancellationToken]::None).Wait()

    $script:cdpId = 0
    function Invoke-CDP {
        param(
            [string]$Method,
            [hashtable]$Params = @{}
        )
        if (-not $ws -or $ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
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
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        $buffer = [byte[]]::new(65536)
        $readTimeout = [DateTime]::UtcNow.AddSeconds(8)
        while ([DateTime]::UtcNow -lt $readTimeout) {
            $ms = [System.IO.MemoryStream]::new()
            do {
                if (-not $ws -or $ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
                    break
                }
                $seg = [System.ArraySegment[byte]]::new($buffer)
                $res = $ws.ReceiveAsync($seg, $cts.Token).Result
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

    Invoke-CDP -Method "Page.enable" | Out-Null
    Invoke-CDP -Method "Runtime.enable" | Out-Null

    Write-Host "=========================================================="
    Write-Host "TEST 1: Direct Dashboard Access Without Session -> Expect Redirect to Login"
    Write-Host "=========================================================="
    Invoke-CDP -Method "Page.navigate" -Params @{ url = "http://localhost:5500/admin/dashboard.html" } | Out-Null
    Start-Sleep -Seconds 2

    $currentUrl = (Invoke-CDP -Method "Runtime.evaluate" -Params @{ expression = "window.location.href"; returnByValue = $true }).result.result.value
    Write-Host "Current URL after accessing protected dashboard: $currentUrl"
    if ($currentUrl -like "*login*") {
        Write-Host "PASS: Successfully redirected unauthenticated visitor to login."
    } else {
        Write-Host "FAIL: Did not redirect to login."
    }

    Write-Host "`n=========================================================="
    Write-Host "TEST 2: Click Demo Admin Login on Login Page"
    Write-Host "=========================================================="
    $null = Invoke-CDP -Method "Runtime.evaluate" -Params @{
        expression = "document.getElementById('demo-login-btn').click(); 'Demo Clicked'"
        returnByValue = $true
    }

    Start-Sleep -Seconds 3

    $afterLoginUrl = (Invoke-CDP -Method "Runtime.evaluate" -Params @{ expression = "window.location.href"; returnByValue = $true }).result.result.value
    Write-Host "Current URL after Demo Sign In: $afterLoginUrl"

    Write-Host "`n=========================================================="
    Write-Host "TEST 3: Verify Dashboard Uncloaks & Displays Authenticated Admin"
    Write-Host "=========================================================="
    $dashboardCheck = (Invoke-CDP -Method "Runtime.evaluate" -Params @{
        expression = @"
(() => {
    const cloak = document.getElementById('admin-auth-loading');
    const root = document.getElementById('admin-app-root');
    const email = document.getElementById('sidebar-user-email');
    const cloakDisplay = cloak ? window.getComputedStyle(cloak).display : 'missing';
    const rootDisplay = root ? window.getComputedStyle(root).display : 'missing';
    const emailText = email ? email.textContent : 'missing';
    return {
        cloakHidden: cloakDisplay === 'none',
        rootVisible: rootDisplay === 'flex',
        email: emailText,
        url: window.location.href
    };
})()
"@
        returnByValue = $true
    }).result.result.value

    Write-Host "Cloak Hidden (not stuck): $($dashboardCheck.cloakHidden)"
    Write-Host "App Root Visible:         $($dashboardCheck.rootVisible)"
    Write-Host "Sidebar Admin Email:      $($dashboardCheck.email)"

    Start-Sleep -Seconds 2

    # Verify it stays on dashboard and doesn't get kicked out by onAuthStateChange!
    $urlAfterWait = (Invoke-CDP -Method "Runtime.evaluate" -Params @{ expression = "window.location.href"; returnByValue = $true }).result.result.value
    Write-Host "URL after 2 seconds on dashboard: $urlAfterWait"
    if ($urlAfterWait -like "*dashboard*") {
        Write-Host "PASS: User stays authenticated on dashboard without being kicked out!"
    } else {
        Write-Host "FAIL: User was kicked out to $urlAfterWait"
    }

    Write-Host "`n=========================================================="
    Write-Host "TEST 4: Logout from Dashboard"
    Write-Host "=========================================================="
    Invoke-CDP -Method "Runtime.evaluate" -Params @{
        expression = "document.getElementById('admin-topbar-logout-btn').click(); 'Logout Clicked'"
        returnByValue = $true
    } | Out-Null

    Start-Sleep -Seconds 2

    $logoutUrl = (Invoke-CDP -Method "Runtime.evaluate" -Params @{ expression = "window.location.href"; returnByValue = $true }).result.result.value
    Write-Host "URL after Logout: $logoutUrl"
    if ($logoutUrl -like "*login*") {
        Write-Host "PASS: Successfully logged out and returned to login page."
    } else {
        Write-Host "FAIL: Did not return to login page after logout."
    }
}
finally {
    if ($ws -and $ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        try {
            $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", [System.Threading.CancellationToken]::None).Wait(1000)
        } catch {}
        $ws.Dispose()
    }
    if ($edgeProcess -and -not $edgeProcess.HasExited) {
        try { $edgeProcess.Kill() } catch {}
    }
    if (Test-Path $userDataDir) {
        try { Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue } catch {}
    }
}
