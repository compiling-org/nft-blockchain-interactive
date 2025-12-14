param()

$repos = @(
  @{ Name='near-creative-engine'; Path='c:\Users\kapil\compiling\grant-repositories\near-creative-engine'; Branch='main' },
  @{ Name='solana-emotional-metadata'; Path='c:\Users\kapil\compiling\grant-repositories\solana-emotional-metadata'; Branch='master' },
  @{ Name='filecoin-creative-storage'; Path='c:\Users\kapil\compiling\grant-repositories\filecoin-creative-storage'; Branch='main' },
  @{ Name='mintbase-creative-marketplace'; Path='c:\Users\kapil\compiling\grant-repositories\bitte-protocol-ai'; Branch='main' },
  @{ Name='polkadot-creative-identity'; Path='c:\Users\kapil\compiling\grant-repositories\polkadot-creative-identity'; Branch='main' },
  @{ Name='rust-emotional-engine'; Path='c:\Users\kapil\compiling\grant-repositories\rust-foundation-audiovisual'; Branch='main' }
)

$deletedReport = @()

foreach ($r in $repos) {
  if (-not (Test-Path $r.Path)) { $deletedReport += "${($r.Name)}: PATH-NOT-FOUND"; continue }
  Set-Location $r.Path

  $candidates = @()
  $patterns = @('*_SPECIFIC_*.md')

  foreach ($pat in $patterns) {
    $candidates += Get-ChildItem -Recurse -Filter $pat -ErrorAction SilentlyContinue
  }

  # Exclude core docs
  $coreNames = @('README.md','TECHNICAL_ARCHITECTURE.md','IMPLEMENTATION_STATUS_REPORT.md')
  $toDelete = @()
  foreach ($f in $candidates) {
    if ($coreNames -contains $f.Name) { continue }
    $toDelete += $f
  }

  if ($toDelete.Count -gt 0) {
    foreach ($f in $toDelete) { git rm --cached --force -- "$($f.FullName)" | Out-Null }
    # Also remove from filesystem to avoid re-adding
    foreach ($f in $toDelete) { Remove-Item -Force "$($f.FullName)" }
    git add -A | Out-Null
    git commit -m "docs: remove project-specific duplicate docs" | Out-Null
    git push origin $r.Branch | Out-Null
    $deletedReport += "${($r.Name)}: removed ${($toDelete.Count)} files"
  } else {
    $deletedReport += "${($r.Name)}: no duplicates found"
  }
}

$deletedReport -join "`n"