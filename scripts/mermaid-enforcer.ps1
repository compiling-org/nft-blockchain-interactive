param()

$ErrorActionPreference = 'Stop'

$changed = git diff --cached --name-only | Where-Object { $_.ToLower().EndsWith(".md") }
if (-not $changed) { exit 0 }

$issues = @()

foreach ($file in $changed) {
    $current = Get-Content -Raw -- $file
    $prev = ""
    try { $prev = git show ("HEAD:" + $file) } catch { $prev = $null }

    $currMermaidCount = ([regex]::Matches($current, '```mermaid')).Count
    $prevMermaidCount = 0
    if ($prev) { $prevMermaidCount = ([regex]::Matches($prev, '```mermaid')).Count }

    if ($prev -and ($currMermaidCount -lt $prevMermaidCount)) {
        $issues.Add("Mermaid blocks decreased in $file ($currMermaidCount < $prevMermaidCount)")
    }

    if ($current -match '```mermaid\s*```') {
        $issues.Add("Empty mermaid block detected in $file")
    }

    # Detect unclosed mermaid fences: count of full blocks should match openings
    $fullBlockCount = ([regex]::Matches($current, '```mermaid[\s\S]*?```', 'Singleline')).Count
    if ($fullBlockCount -lt $currMermaidCount) {
        $issues.Add("Unclosed mermaid block detected in $file")
    }

    if ($current -match '<br/>') {
        $issues.Add("Invalid line break '<br/>' found in $file")
    }
    if ($current -match '```mermaid[\s\S]*?<br/>') {
        $issues.Add("HTML breaks '<br/>' found inside mermaid in $file")
    }
}

if ($issues.Count -gt 0) {
    $issues | ForEach-Object { Write-Host $_ }
    exit 1
}

exit 0
