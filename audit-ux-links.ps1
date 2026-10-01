$root = $PSScriptRoot
$htmlFiles = Get-ChildItem -Path $root -Filter *.html -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" -and $_.FullName -notmatch "dist"
}

Write-Host "=========================================================="
Write-Host "1. AUDITING BROKEN LINKS ACROSS ALL $($htmlFiles.Count) HTML PAGES"
Write-Host "=========================================================="

$brokenLinks = @()
$totalLinks = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $relPath = $file.FullName.Substring($root.Length + 1)
    $fileDir = $file.DirectoryName

    # Find all href="..."
    $hrefMatches = [regex]::Matches($content, 'href\s*=\s*["'']([^"'']+)["'']')
    foreach ($m in $hrefMatches) {
        $totalLinks++
        $href = $m.Groups[1].Value.Trim()

        # Skip external, anchor-only, mailto, tel, javascript, template literals, and query-only
        if ($href -match '^(https?://|mailto:|tel:|javascript:|#|\{\{|\$\{|\?)') {
            continue
        }

        # Handle in-page or other-page anchor: e.g. "index.html#categories" or "/#categories" or "index.html?category=history"
        $pathPart = $href.Split('?')[0].Split('#')[0]

        if ([string]::IsNullOrWhiteSpace($pathPart)) {
            continue
        }

        # Resolve path
        $targetFile = $null
        if ($pathPart.StartsWith('/')) {
            # Web-root relative
            $clean = $pathPart.TrimStart('/')
            if ($clean -eq "") { $targetFile = Join-Path $root "index.html" }
            else {
                $targetFile = Join-Path $root $clean
            }
        } else {
            # Relative to current file
            $targetFile = Join-Path $fileDir $pathPart
        }

        # If it's a directory, look for index.html inside
        if (Test-Path $targetFile -PathType Container) {
            $targetFile = Join-Path $targetFile "index.html"
        }
        # If no extension, try .html
        if (-not (Test-Path $targetFile) -and (Test-Path "$targetFile.html")) {
            $targetFile = "$targetFile.html"
        }

        if (-not (Test-Path $targetFile)) {
            $brokenLinks += [PSCustomObject]@{
                Source = $relPath
                Href = $href
                ResolvedTo = $targetFile
                Issue = "Target file does not exist"
            }
        }
    }
}

Write-Host "Total links checked: $totalLinks"
Write-Host "Broken links found: $($brokenLinks.Count)"
foreach ($b in $brokenLinks) {
    Write-Host " [BROKEN] in $($b.Source) -> href='$($b.Href)'" -ForegroundColor Red
}

Write-Host "`n=========================================================="
Write-Host "2. AUDITING ACCESSIBLE FORMS & BUTTONS"
Write-Host "=========================================================="

$accessibilityIssues = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $relPath = $file.FullName.Substring($root.Length + 1)

    # Check inputs without aria-label, aria-labelledby, or id with associated label
    $inputMatches = [regex]::Matches($content, '<input\s+([^>]+)>')
    foreach ($im in $inputMatches) {
        $attrs = $im.Groups[1].Value
        $typeMatch = [regex]::Match($attrs, 'type\s*=\s*["'']([^"'']+)["'']')
        $inputType = if ($typeMatch.Success) { $typeMatch.Groups[1].Value.ToLower() } else { "text" }
        if ($inputType -in @("hidden", "submit", "button", "reset")) { continue }

        $hasAriaLabel = $attrs -match 'aria-label\s*=' -or $attrs -match 'aria-labelledby\s*=' -or $attrs -match 'title\s*='
        $idMatch = [regex]::Match($attrs, 'id\s*=\s*["'']([^"'']+)["'']')
        $hasForLabel = $false
        if ($idMatch.Success) {
            $inputElId = $idMatch.Groups[1].Value
            $hasForLabel = $content -match "<label[^>]+for\s*=\s*[`"']$inputElId[`"']"
        }

        if (-not $hasAriaLabel -and -not $hasForLabel) {
            $lineNum = ($content.Substring(0, $im.Index) -split "`n").Length
            $accessibilityIssues += [PSCustomObject]@{
                File = "$relPath (Line $lineNum)"
                Element = "<input $attrs>"
                Issue = "Input missing accessible label (aria-label, title, or <label for='...'>)"
            }
        }
    }

    # Check buttons without text or aria-label
    $btnMatches = [regex]::Matches($content, '<button\s+([^>]*)>([\s\S]*?)</button>')
    foreach ($bm in $btnMatches) {
        $attrs = $bm.Groups[1].Value
        $innerHtml = $bm.Groups[2].Value.Trim()
        $hasAria = $attrs -match 'aria-label\s*=' -or $attrs -match 'title\s*='
        # Strip html tags to see if there is text
        $innerText = [regex]::Replace($innerHtml, '<[^>]+>', '').Trim()
        if (-not $hasAria -and [string]::IsNullOrWhiteSpace($innerText)) {
            $accessibilityIssues += [PSCustomObject]@{
                File = $relPath
                Element = "<button $attrs>...</button>"
                Issue = "Icon-only or empty button missing aria-label or title"
            }
        }
    }
}

Write-Host "Accessibility label/button issues found: $($accessibilityIssues.Count)"
foreach ($a in $accessibilityIssues) {
    Write-Host " [A11Y] in $($a.File): $($a.Issue) -> $($a.Element.Substring(0, [Math]::Min(60, $a.Element.Length)))" -ForegroundColor Yellow
}
