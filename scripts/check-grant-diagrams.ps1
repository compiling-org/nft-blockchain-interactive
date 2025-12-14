param()

$repos = @(
  @{ Name='near-creative-engine'; Path='c:\Users\kapil\compiling\grant-repositories\near-creative-engine' },
  @{ Name='solana-emotional-metadata'; Path='c:\Users\kapil\compiling\grant-repositories\solana-emotional-metadata' },
  @{ Name='filecoin-creative-storage'; Path='c:\Users\kapil\compiling\grant-repositories\filecoin-creative-storage' },
  @{ Name='mintbase-creative-marketplace'; Path='c:\Users\kapil\compiling\grant-repositories\bitte-protocol-ai' },
  @{ Name='polkadot-creative-identity'; Path='c:\Users\kapil\compiling\grant-repositories\polkadot-creative-identity' },
  @{ Name='rust-emotional-engine'; Path='c:\Users\kapil\compiling\grant-repositories\rust-foundation-audiovisual' }
)

$targets = @('TECHNICAL_ARCHITECTURE.md','README.md')

foreach ($r in $repos) {
  if (-not (Test-Path $r.Path)) { Write-Output ("{0}: PATH-NOT-FOUND" -f $r.Name); continue }
  foreach ($f in $targets) {
    $p = Join-Path $r.Path $f
    if (Test-Path $p) {
      $content = Get-Content -Path $p -Raw -ErrorAction SilentlyContinue
      $merm = ([regex]::Matches($content,'```mermaid')).Count
      $graphs = ([regex]::Matches($content,'\bgraph\s+(LR|TB)')).Count
      $seq = ([regex]::Matches($content,'sequenceDiagram')).Count
      Write-Output ("{0}/{1}: mermaid={2} graphs={3} seq={4}" -f $r.Name,$f,$merm,$graphs,$seq)
    } else {
      Write-Output ("{0}/{1}: MISSING" -f $r.Name,$f)
    }
  }
}