# ==============================================================================
# GK INDIA ACADEMY — TRANSCRIPT STEP INSPECTOR
# ==============================================================================

function Get-TranscriptStep {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [int] $Index,

        [Parameter(Mandatory = $true)]
        [string] $Label
    )

    $transcriptPath = "C:\Users\urmil\.gemini\antigravity-ide\brain\d1a73ad6-4141-4251-bbe1-b4d374f2ff6c\.system_generated\logs\transcript_full.jsonl"
    if (-not (Test-Path $transcriptPath)) {
        Write-Warning "Transcript file not found at: $transcriptPath"
        return
    }

    $lines = Get-Content -Path $transcriptPath -Encoding UTF8
    Write-Output "=== $Label (Line $Index) ==="
    if ($Index -gt 0 -and $Index -le $lines.Length) {
        $obj = $lines[$Index - 1] | ConvertFrom-Json
        if ($obj.tool_calls) {
            foreach ($tc in $obj.tool_calls) {
                Write-Output "Tool: $($tc.name)"
                if ($tc.args.TargetFile) { Write-Output "Target: $($tc.args.TargetFile)" }
                if ($tc.args.CodeContent) {
                    Write-Output "--- CodeContent ---"
                    Write-Output $tc.args.CodeContent
                }
                if ($tc.args.ReplacementContent) {
                    Write-Output "--- ReplacementContent ---"
                    Write-Output $tc.args.ReplacementContent
                }
            }
        }
        if ($obj.content) {
            Write-Output "--- Content ---"
            Write-Output $obj.content
        }
    }
}
