$port = 5500
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "SERVER_STARTED: http://localhost:$port/"
} catch {
    # If 5500 is busy, try 5501
    $port = 5501
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "SERVER_STARTED: http://localhost:$port/"
}

function Get-EnvConfig {
    $envPath = Join-Path $root ".env"
    $config = @{
        SUPABASE_URL = ""
        SUPABASE_ANON_KEY = ""
    }
    if (Test-Path $envPath -PathType Leaf) {
        $lines = Get-Content $envPath
        foreach ($line in $lines) {
            $trimmed = $line.Trim()
            if ($trimmed -and -not $trimmed.StartsWith("#")) {
                $parts = $trimmed -split "=", 2
                if ($parts.Length -eq 2) {
                    $key = $parts[0].Trim()
                    $val = $parts[1].Trim().Trim('"').Trim("'")
                    if ($key -eq "SUPABASE_URL" -or $key -eq "VITE_SUPABASE_URL") {
                        $config["SUPABASE_URL"] = $val
                    }
                    if ($key -eq "SUPABASE_ANON_KEY" -or $key -eq "VITE_SUPABASE_ANON_KEY") {
                        $config["SUPABASE_ANON_KEY"] = $val
                    }
                }
            }
        }
    }
    if (-not $config["SUPABASE_URL"] -and $env:SUPABASE_URL) { $config["SUPABASE_URL"] = $env:SUPABASE_URL }
    if (-not $config["SUPABASE_ANON_KEY"] -and $env:SUPABASE_ANON_KEY) { $config["SUPABASE_ANON_KEY"] = $env:SUPABASE_ANON_KEY }
    return $config
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $rawPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($rawPath)) { $rawPath = "index.html" }

        # Dynamic endpoint for client environment variables (only anon key and URL)
        if ($rawPath -eq "admin/env.js") {
            $cfg = Get-EnvConfig
            $jsContent = "window.__ENV = { SUPABASE_URL: '$($cfg["SUPABASE_URL"])', SUPABASE_ANON_KEY: '$($cfg["SUPABASE_ANON_KEY"])' };"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsContent)
            $response.ContentType = "application/javascript; charset=utf-8"
            $response.AddHeader("Cache-Control", "no-store, no-cache, must-revalidate")
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }
        if ($rawPath -eq "api/config") {
            $cfg = Get-EnvConfig
            $jsonContent = '{"SUPABASE_URL":"' + $cfg["SUPABASE_URL"] + '","SUPABASE_ANON_KEY":"' + $cfg["SUPABASE_ANON_KEY"] + '"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonContent)
            $response.ContentType = "application/json; charset=utf-8"
            $response.AddHeader("Cache-Control", "no-store, no-cache, must-revalidate")
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        $filePath = Join-Path $root $rawPath

        # Check directory / index.html
        if (Test-Path $filePath -PathType Container) {
            $indexPath = Join-Path $filePath "index.html"
            if (Test-Path $indexPath -PathType Leaf) {
                $filePath = $indexPath
            }
        }
        # Check .html extension if path without extension
        if (-not (Test-Path $filePath -PathType Leaf) -and (Test-Path "$filePath.html" -PathType Leaf)) {
            $filePath = "$filePath.html"
        }
        # Clean route fallback for admin modules (/admin, /admin/dashboard, /admin/topics, etc.)
        if (-not (Test-Path $filePath -PathType Leaf) -and ($rawPath -like "admin/*" -or $rawPath -eq "admin") -and (-not [System.IO.Path]::HasExtension($filePath))) {
            $adminDashPath = Join-Path $root "admin\dashboard.html"
            if (Test-Path $adminDashPath -PathType Leaf) {
                $filePath = $adminDashPath
            }
        }
        # Clean route fallback for government-exams detail: /government-exams/[slug]
        if (-not (Test-Path $filePath -PathType Leaf) -and ($rawPath -like "government-exams/*") -and (-not [System.IO.Path]::HasExtension($filePath))) {
            $detailPath = Join-Path $root "government-exams\detail.html"
            if (Test-Path $detailPath -PathType Leaf) {
                $filePath = $detailPath
            }
        }
        # Clean route fallback for mcqs: /mcqs/[category]
        if (-not (Test-Path $filePath -PathType Leaf) -and ($rawPath -like "mcqs/*" -or $rawPath -eq "mcqs") -and (-not [System.IO.Path]::HasExtension($filePath))) {
            $mcqPath = Join-Path $root "mcqs\index.html"
            if (Test-Path $mcqPath -PathType Leaf) {
                $filePath = $mcqPath
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".webp" { "image/webp" }
                Default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            # Prevent caching for admin pages to guarantee session checking on back button navigation
            if ($rawPath -like "admin*" -or $rawPath -like "*/admin*") {
                $response.AddHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                $response.AddHeader("Pragma", "no-cache")
                $response.AddHeader("Expires", "0")
            }
            $response.StatusCode = 200
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $errBytes.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        }
        $response.Close()
    } catch {
        # ignore client disconnects
    }
}
