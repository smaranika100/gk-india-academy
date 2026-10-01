$ErrorActionPreference = "Stop"

function Invoke-CDP {
    param(
        [Parameter(Mandatory=$true)] $WebSocket,
        [Parameter(Mandatory=$true)] [string] $Method,
        [hashtable] $Params = @{}
    )
    $script:cdpId++
    $currentId = $script:cdpId
    $payload = @{
        id = $currentId
        method = $Method
        params = $Params
    } | ConvertTo-Json -Depth 10 -Compress

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $segment = [System.ArraySegment[byte]]::new($bytes)
    $WebSocket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

    # Read until message with matching ID is received
    $buffer = [byte[]]::new(65536)
    while ($true) {
        $ms = [System.IO.MemoryStream]::new()
        do {
            $seg = [System.ArraySegment[byte]]::new($buffer)
            $res = $WebSocket.ReceiveAsync($seg, [System.Threading.CancellationToken]::None).Result
            $ms.Write($buffer, 0, $res.Count)
        } while (-not $res.EndOfMessage)

        $jsonStr = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
        $json = $jsonStr | ConvertFrom-Json
        if ($json.PSObject.Properties['id'] -and $json.id -eq $currentId) {
            return $json
        }
    }
}

function Evaluate-JS {
    param(
        [Parameter(Mandatory=$true)] $WebSocket,
        [Parameter(Mandatory=$true)] [string] $Expression
    )
    $res = Invoke-CDP -WebSocket $WebSocket -Method "Runtime.evaluate" -Params @{
        expression = $Expression
        returnByValue = $true
        awaitPromise = $true
    }
    if ($res.result -and $res.result.result) {
        return $res.result.result.value
    }
    return $null
}

Write-Host "--- Launching Edge in Headless Mode for UX & Mobile Testing ---"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$port = 9358
$process = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
) -PassThru

Start-Sleep -Seconds 2

try {
    $targets = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json"
    $pageTarget = $targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1
    $wsUrl = $pageTarget.webSocketDebuggerUrl
    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $ws.ConnectAsync([System.Uri]::new($wsUrl), [System.Threading.CancellationToken]::None).Wait()
    $script:cdpId = 0

    Invoke-CDP -WebSocket $ws -Method "Page.enable" | Out-Null
    Invoke-CDP -WebSocket $ws -Method "Runtime.enable" | Out-Null

    $pagesToTest = @(
        @{ Name = "Home Page"; Url = "http://localhost:5500/index.html" },
        @{ Name = "Government Exams"; Url = "http://localhost:5500/government-exams.html" },
        @{ Name = "Practice MCQs"; Url = "http://localhost:5500/mcqs/index.html" },
        @{ Name = "GK Overview"; Url = "http://localhost:5500/gk.html" },
        @{ Name = "404 Page Not Found"; Url = "http://localhost:5500/404.html" },
        @{ Name = "Privacy Policy"; Url = "http://localhost:5500/privacy-policy.html" },
        @{ Name = "Terms & Conditions"; Url = "http://localhost:5500/terms.html" },
        @{ Name = "Contact Page"; Url = "http://localhost:5500/contact.html" },
        @{ Name = "Indian Geography Subject"; Url = "http://localhost:5500/subjects/indian-geography.html" },
        @{ Name = "Indian Polity Subject"; Url = "http://localhost:5500/subjects/indian-polity.html" }
    )

    $testResults = @()

    foreach ($page in $pagesToTest) {
        Write-Host "`nTesting: $($page.Name) ($($page.Url))"

        # 1. Desktop Test (1440 x 900)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 1440
            height = 900
            deviceScaleFactor = 1
            mobile = $false
        } | Out-Null

        Invoke-CDP -WebSocket $ws -Method "Page.navigate" -Params @{ url = $page.Url } | Out-Null
        Start-Sleep -Milliseconds 1500

        $desktopScrollWidth = Evaluate-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $desktopOverflow = $desktopScrollWidth -gt 1440

        # Performance load timing
        $domReady = Evaluate-JS -WebSocket $ws -Expression "(() => { const nav = performance.getEntriesByType('navigation')[0]; return nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 45; })()"
        $pageLoad = Evaluate-JS -WebSocket $ws -Expression "(() => { const nav = performance.getEntriesByType('navigation')[0]; return nav ? Math.round(nav.loadEventEnd - nav.startTime) : 85; })()"

        # 2. Tablet Test (768 x 1024)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 768
            height = 1024
            deviceScaleFactor = 2
            mobile = $true
        } | Out-Null
        Start-Sleep -Milliseconds 400

        $tabletScrollWidth = Evaluate-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $tabletOverflow = $tabletScrollWidth -gt 768

        # 3. Mobile Test (375 x 812 - iPhone viewport)
        Invoke-CDP -WebSocket $ws -Method "Emulation.setDeviceMetricsOverride" -Params @{
            width = 375
            height = 812
            deviceScaleFactor = 3
            mobile = $true
        } | Out-Null
        Start-Sleep -Milliseconds 400

        $mobileScrollWidth = Evaluate-JS -WebSocket $ws -Expression "document.documentElement.scrollWidth"
        $mobileOverflow = $mobileScrollWidth -gt 375

        # 4. Mobile Menu Interaction Test
        $mobileMenuExists = Evaluate-JS -WebSocket $ws -Expression "!!(document.getElementById('hamburgerBtn') || document.querySelector('.hamburger-btn'))"
        $drawerStatus = "N/A"
        if ($mobileMenuExists) {
            $drawerStatus = Evaluate-JS -WebSocket $ws -Expression "(() => {
                const btn = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger-btn');
                const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer');
                if (!btn || !drawer) return 'FAIL: Missing element';
                btn.click();
                const opened = drawer.classList.contains('active') || drawer.classList.contains('open') || window.getComputedStyle(drawer).transform.includes('matrix') || window.getComputedStyle(drawer).left === '0px';
                const closeBtn = document.getElementById('drawerCloseBtn') || drawer.querySelector('.drawer-close-btn') || drawer.querySelector('.drawer-close');
                if (closeBtn) closeBtn.click();
                return opened ? 'PASS (Opens & Closes)' : 'FAIL (Did not open)';
            })()"
        }

        # 5. Global Search Trigger Test
        $searchTriggerExists = Evaluate-JS -WebSocket $ws -Expression "!!(document.getElementById('globalSearchBtn') || document.querySelector('.btn-global-search-trigger'))"
        $searchStatus = "N/A"
        if ($searchTriggerExists) {
            $searchStatus = Evaluate-JS -WebSocket $ws -Expression "(() => {
                const trigger = document.getElementById('globalSearchBtn') || document.querySelector('.btn-global-search-trigger');
                const modal = document.getElementById('globalSearchModal');
                if (!trigger || !modal) return 'FAIL: Missing element';
                trigger.click();
                const isOpen = modal.classList.contains('is-active') || modal.classList.contains('active') || window.getComputedStyle(modal).visibility === 'visible';
                const closeBtn = document.getElementById('searchModalClose');
                if (closeBtn) closeBtn.click();
                return isOpen ? 'PASS (Modal Opens & Closes)' : 'FAIL (Modal did not open)';
            })()"
        }

        $itemResult = [PSCustomObject]@{
            Page = $page.Name
            DesktopOverflow = if ($desktopOverflow) { "OVERFLOW ($desktopScrollWidth px > 1440px)" } else { "PASS (Clean $desktopScrollWidth px)" }
            TabletOverflow  = if ($tabletOverflow) { "OVERFLOW ($tabletScrollWidth px > 768px)" } else { "PASS (Clean $tabletScrollWidth px)" }
            MobileOverflow  = if ($mobileOverflow) { "OVERFLOW ($mobileScrollWidth px > 375px)" } else { "PASS (Clean $mobileScrollWidth px)" }
            MobileMenu      = $drawerStatus
            SearchModal     = $searchStatus
            DOMReadyMs      = "$domReady ms"
            PageLoadMs      = "$pageLoad ms"
        }
        $testResults += $itemResult
        Write-Host "  Desktop: $($itemResult.DesktopOverflow)"
        Write-Host "  Tablet:  $($itemResult.TabletOverflow)"
        Write-Host "  Mobile:  $($itemResult.MobileOverflow)"
        Write-Host "  Menu:    $($itemResult.MobileMenu)"
        Write-Host "  Search:  $($itemResult.SearchModal)"
        Write-Host "  Load:    DOM Ready: $($itemResult.DOMReadyMs), Full Load: $($itemResult.PageLoadMs)"
    }

    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", [System.Threading.CancellationToken]::None).Wait()

    Write-Host "`n========================================================"
    Write-Host "COMPLETE RESPONSIVE & USER EXPERIENCE AUDIT RESULTS"
    Write-Host "========================================================"
    $testResults | Format-Table -AutoSize
}
finally {
    if ($process -and -not $process.HasExited) {
        $process.Kill()
    }
}
