# ==============================================================================
# GK INDIA ACADEMY - DATABASE RESTORATION SCRIPT
# ==============================================================================
# Restores database records from a previously generated backup directory.
# Usage:
#   .\supabase\restore.ps1
#   .\supabase\restore.ps1 -BackupDir "backups\backup-2026-03-29_23-45-00"
# ==============================================================================

param(
    [string]$BackupDir = ""
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $root ".env"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  GK India Academy - Database Restoration Utility" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Determine which backup folder to use
$backupsRoot = Join-Path $root "backups"

if (-not $BackupDir) {
    if (Test-Path $backupsRoot) {
        $latest = Get-ChildItem -Path $backupsRoot -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1
        if ($latest) {
            $BackupDir = $latest.FullName
        }
    }
}

if (-not $BackupDir -or -not (Test-Path $BackupDir)) {
    Write-Host "No backup directory found at: $BackupDir" -ForegroundColor Red
    Write-Host "Please run .\supabase\backup.ps1 first to create a backup." -ForegroundColor Yellow
    exit 1
}

Write-Host "Using Backup Directory: $BackupDir" -ForegroundColor Yellow

# Check for metadata
$metaFile = Join-Path $BackupDir "metadata.json"
if (Test-Path $metaFile) {
    $meta = Get-Content $metaFile -Raw | ConvertFrom-Json
    Write-Host "Backup Timestamp: $($meta.timestamp)"
    Write-Host "Total Records in Backup: $($meta.totalRecords)"
}

# 2. Parse .env for Supabase credentials
$config = @{
    SUPABASE_URL = ""
    SUPABASE_KEY = ""
}

if (Test-Path $envPath -PathType Leaf) {
    Get-Content $envPath | ForEach-Object {
        $trimmed = $_.Trim()
        if ($trimmed -and -not $trimmed.StartsWith("#")) {
            $parts = $trimmed -split "=", 2
            if ($parts.Length -eq 2) {
                $k = $parts[0].Trim()
                $v = $parts[1].Trim().Trim('"').Trim("'")
                if ($k -eq "SUPABASE_URL") { $config["SUPABASE_URL"] = $v }
                if ($k -eq "SUPABASE_SERVICE_ROLE_KEY" -and $v) { $config["SUPABASE_KEY"] = $v }
                if (-not $config["SUPABASE_KEY"] -and ($k -eq "SUPABASE_ANON_KEY" -or $k -eq "VITE_SUPABASE_ANON_KEY")) {
                    $config["SUPABASE_KEY"] = $v
                }
            }
        }
    }
}

$hasCloudConfig = ($config["SUPABASE_URL"] -and $config["SUPABASE_KEY"] -and $config["SUPABASE_URL"] -ne "https://your-project-id.supabase.co")

if ($hasCloudConfig) {
    Write-Host "Restoring directly into Supabase Cloud: $($config["SUPABASE_URL"])" -ForegroundColor Green
    $headers = @{
        "apikey" = $config["SUPABASE_KEY"]
        "Authorization" = "Bearer $($config["SUPABASE_KEY"])"
        "Content-Type" = "application/json"
        "Prefer" = "resolution=merge-duplicates"
    }

    $jsonFiles = Get-ChildItem -Path $BackupDir -Filter "*.json" | Where-Object { $_.Name -ne "metadata.json" }

    foreach ($file in $jsonFiles) {
        $table = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        Write-Host "  -> Restoring table '$table' ... " -NoNewline
        try {
            $content = Get-Content -Path $file.FullName -Raw
            $records = $content | ConvertFrom-Json
            if ($records.Count -gt 0) {
                $uri = "$($config["SUPABASE_URL"].TrimEnd('/'))/rest/v1/$table"
                $null = Invoke-RestMethod -Uri $uri -Headers $headers -Method Post -Body $content -UseBasicParsing
                Write-Host "Success ($($records.Count) records upserted)" -ForegroundColor Green
            } else {
                Write-Host "Empty table, skipped" -ForegroundColor Gray
            }
        } catch {
            Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`nSupabase cloud credentials not set in .env." -ForegroundColor Yellow
    Write-Host "To execute this restore in Supabase SQL Editor:" -ForegroundColor Cyan
    $dumpPath = Join-Path $BackupDir "restore-dump.sql"
    if (Test-Path $dumpPath) {
        Write-Host "1. Open Supabase Dashboard -> SQL Editor"
        Write-Host "2. Copy the contents of: $dumpPath"
        Write-Host "3. Click 'Run' to apply the database restore."
    }
}

Write-Host "`nRestoration procedure completed." -ForegroundColor Green
