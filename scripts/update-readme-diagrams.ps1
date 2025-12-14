param()

$repos = @(
  @{ Name='near-creative-engine'; Path='c:\Users\kapil\compiling\grant-repositories\near-creative-engine'; Branch='main'; Lines=@(
    '### Architecture Diagram','',
    '```mermaid','graph LR',
    '    U[User Input] --> BIOMETRIC[Biometric Capture]',
    '    BIOMETRIC --> AI[Emotion Model]',
    '    AI --> META[Emotional Metadata]',
    '    META --> CONTRACT[NEAR Contract]',
    '    CONTRACT --> NFT[NFT Mint]',
    '    NFT --> IPFS[IPFS Storage]','```','',
    '### Component Flow','',
    '```mermaid','graph TB',
    '    subgraph Client','        UI[Fractal Studio UI]','        GPU[WebGPU Engine]','        MODEL[TensorFlow.js Model]','    end',
    '    subgraph Blockchain','        NEARCONTRACT[NEAR WASM Contract]','        METADATA[On-chain Emotional State]','    end',
    '    subgraph Storage','        IPFS[IPFS/Filecoin]','    end',
    '    UI --> GPU','    GPU --> MODEL','    MODEL --> NEARCONTRACT','    NEARCONTRACT --> METADATA','    METADATA --> IPFS','```'
  ) },
  @{ Name='filecoin-creative-storage'; Path='c:\Users\kapil\compiling\grant-repositories\filecoin-creative-storage'; Branch='main'; Lines=@(
    '### Architecture Diagram','',
    '```mermaid','graph LR',
    '    APP[App] --> COMP[Compression Engine]',
    '    COMP --> IPFS[IPFS]',
    '    IPFS --> LOTUS[Lotus Client]',
    '    LOTUS --> MINERS[Filecoin Miners]','```','',
    '### Component Flow','',
    '```mermaid','graph TB',
    '    subgraph Application','        UI[React UI]','        API[Storage API]','    end',
    '    subgraph Compression','        DELTA[Delta Encoding]','        RLE[RLE]','    end',
    '    subgraph Storage','        IPFS_LOCAL[Local IPFS]','        WEB3[Web3.Storage]','    end',
    '    UI --> API','    API --> DELTA','    API --> RLE','    DELTA --> IPFS_LOCAL','    RLE --> IPFS_LOCAL','```'
  ) },
  @{ Name='mintbase-creative-marketplace'; Path='c:\Users\kapil\compiling\grant-repositories\bitte-protocol-ai'; Branch='main'; Lines=@(
    '### Architecture Diagram','',
    '```mermaid','graph LR',
    '    UI[Marketplace UI] --> MM[Marketplace Manager]',
    '    MM --> CM[CreativeMarketplace Contract]',
    '    CM --> NEAR[NEAR Storage]',
    '    CM --> IPFS[IPFS Metadata]','```','',
    '### Component Flow','',
    '```mermaid','graph TB',
    '    subgraph Client','        UI[React UI]','        EM[Emotion Analyzer]','    end',
    '    subgraph Blockchain','        CM[Marketplace Contract]','        DAO[DAO Governance]','    end',
    '    UI --> EM','    EM --> CM','    CM --> DAO','```'
  ) },
  @{ Name='polkadot-creative-identity'; Path='c:\Users\kapil\compiling\grant-repositories\polkadot-creative-identity'; Branch='main'; Lines=@(
    '### Architecture Diagram','',
    '```mermaid','graph LR',
    '    CLIENT[PolkadotClient] --> RPC[Subxt RPC]',
    '    CLIENT --> ID[Identity/Soulbound]',
    '    CLIENT --> BRIDGE[Cross-Chain Bridge]','```','',
    '### Component Flow','',
    '```mermaid','graph TB',
    '    subgraph Analytics','        PRE[Preprocess]','        TREND[Trend Analysis]','        PRED[Prediction]','    end',
    '    INPUT[Emotional Data] --> PRE','    PRE --> TREND','    TREND --> PRED','```'
  ) },
  @{ Name='rust-emotional-engine'; Path='c:\Users\kapil\compiling\grant-repositories\rust-foundation-audiovisual'; Branch='main'; Lines=@(
    '### Architecture Diagram','',
    '```mermaid','graph LR',
    '    INPUT[Biometric/Audio] --> CANDLE[Candle Classifier]',
    '    CANDLE --> AUDIO[Glicol Synthesis]',
    '    CANDLE --> VISUAL[WebGPU Rendering]','```','',
    '### Component Flow','',
    '```mermaid','graph TB',
    '    subgraph AI','        CLASS[Emotion Classifier]','    end',
    '    subgraph Audio','        GLICOL[Glicol Engine]','    end',
    '    subgraph Visual','        WGPU[WebGPU]','    end',
    '    INPUT --> CLASS','    CLASS --> GLICOL','    CLASS --> WGPU','```'
  ) }
)

foreach ($r in $repos) {
  if (-not (Test-Path $r.Path)) { Write-Output ("{0}: PATH-NOT-FOUND" -f $r.Name); continue }
  $readme = Join-Path $r.Path 'README.md'
  if (Test-Path $readme) {
    $content = Get-Content -Path $readme -Raw -ErrorAction SilentlyContinue
    $hasMermaid = $content -match '```mermaid'
    if (-not $hasMermaid) {
      Set-Location $r.Path
      foreach ($l in $r.Lines) { Add-Content -Path 'README.md' -Value $l }
      git add README.md | Out-Null
      git commit -m "docs: add mermaid architecture diagrams to README" | Out-Null
      git push origin $r.Branch | Out-Null
      Write-Output ("{0}: README UPDATED & PUSHED" -f $r.Name)
    } else {
      Write-Output ("{0}: README OK (diagrams present)" -f $r.Name)
    }
  } else {
    Write-Output ("{0}: README MISSING" -f $r.Name)
  }
}