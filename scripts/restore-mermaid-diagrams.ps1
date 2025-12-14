param()

$repos = @(
  @{ Name='near-creative-engine'; Path='c:\Users\kapil\compiling\grant-repositories\near-creative-engine'; Branch='main' },
  @{ Name='solana-emotional-metadata'; Path='c:\Users\kapil\compiling\grant-repositories\solana-emotional-metadata'; Branch='master' },
  @{ Name='filecoin-creative-storage'; Path='c:\Users\kapil\compiling\grant-repositories\filecoin-creative-storage'; Branch='main' },
  @{ Name='mintbase-creative-marketplace'; Path='c:\Users\kapil\compiling\grant-repositories\bitte-protocol-ai'; Branch='main' },
  @{ Name='polkadot-creative-identity'; Path='c:\Users\kapil\compiling\grant-repositories\polkadot-creative-identity'; Branch='main' },
  @{ Name='rust-emotional-engine'; Path='c:\Users\kapil\compiling\grant-repositories\rust-foundation-audiovisual'; Branch='main' }
)

$lines = @(
  '### Architecture Diagram',
  '',
  '```mermaid',
  'graph LR',
  '    U[User Input] --> BIOMETRIC[Biometric Capture]',
  '    BIOMETRIC --> AI[Emotion Model]',
  '    AI --> META[Emotional Metadata]',
  '    META --> CONTRACT[Chain Contract/Program]',
  '    CONTRACT --> NFT[NFT Mint/Update]',
  '    NFT --> IPFS[IPFS Storage]',
  '    CONTRACT --> WALLET[Wallet]',
  '    WALLET --> TX[Signed Transaction]',
  '```',
  '',
  '### Component Flow',
  '',
  '```mermaid',
  'graph TB',
  '    subgraph Client',
  '        UI[UI]',
  '        GPU[WebGPU]',
  '        MODEL[TF.js/AI]',
  '    end',
  '    subgraph Blockchain',
  '        CHAIN[Contract/Program]',
  '        METADATA[On-chain Metadata]',
  '    end',
  '    subgraph Storage',
  '        IPFS[IPFS/Filecoin]',
  '    end',
  '    UI --> GPU',
  '    GPU --> MODEL',
  '    MODEL --> CREATE[Create Emotional Metadata]',
  '    CREATE --> CHAIN',
  '    CHAIN --> METADATA',
  '    METADATA --> IPFS',
  '```'
)

$archMermaid = ($lines -join [Environment]::NewLine)

foreach ($r in $repos) {
  if (Test-Path $r.Path) {
    Set-Location $r.Path
    $techPath = Join-Path $r.Path 'TECHNICAL_ARCHITECTURE.md'
    $changed = $false

    if (-not (Test-Path $techPath)) {
      Set-Content -Path $techPath -Value $archMermaid -Encoding UTF8
      $changed = $true
    } else {
      $content = Get-Content -Path $techPath -Raw
      if ($content -notmatch '```mermaid') {
        Add-Content -Path $techPath -Value $archMermaid
        $changed = $true
      }
    }

    if ($changed) {
      git add TECHNICAL_ARCHITECTURE.md | Out-Null
      git commit -m "docs: restore mermaid diagrams in TECHNICAL_ARCHITECTURE.md" | Out-Null
      git push origin $r.Branch | Out-Null
      Write-Output ("{0}: UPDATED & PUSHED" -f $r.Name)
    } else {
      Write-Output ("{0}: OK (diagrams present)" -f $r.Name)
    }
  } else {
    Write-Output ("{0}: PATH NOT FOUND" -f $r.Name)
  }
}
