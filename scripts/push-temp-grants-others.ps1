Param(
  [string]$SourceRoot = 'C:\Users\kapil\compiling\blockchain-nft-interactive',
  [string]$SolanaRepo = 'C:\Users\kapil\compiling\grant-repositories\solana-emotional-metadata',
  [string]$FilecoinRepo = 'C:\Users\kapil\compiling\grant-repositories\filecoin-creative-storage',
  [string]$PolkadotRepo = 'C:\Users\kapil\compiling\grant-repositories\polkadot-creative-identity',
  [string]$RustRepo = 'C:\Users\kapil\compiling\grant-repositories\rust-foundation-audiovisual',
  [string]$SolanaRemote = 'https://github.com/compiling-org/solana-emotional-metadata.git',
  [string]$FilecoinRemote = 'https://github.com/compiling-org/filecoin-creative-storage.git',
  [string]$PolkadotRemote = 'https://github.com/compiling-org/polkadot-creative-identity.git',
  [string]$RustRemote = 'https://github.com/compiling-org/rust-foundation-audiovisual.git'
)

$ErrorActionPreference = 'Stop'

function Ensure-Dir { param([string]$Path) if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path | Out-Null } }
function Copy-IfExists { param([string]$Src, [string]$DestDir)
  if (Test-Path $Src) { Ensure-Dir $DestDir; Copy-Item -Force $Src $DestDir; Write-Host ('  + ' + $Src.Substring($SourceRoot.Length+1)) } else { Write-Host ('  - (missing) ' + $Src.Substring($SourceRoot.Length+1)) }
}

$TempRoot = Join-Path $env:LOCALAPPDATA ('grant-push-' + (Get-Date).ToString('yyyyMMddHHmmss'))
Ensure-Dir $TempRoot
Write-Host ('TEMP_ROOT=' + $TempRoot)

# --- Solana ---
$SolanaTemp = Join-Path $TempRoot 'solana-emotional-metadata'
Write-Host ('Copying Solana repo to temp: ' + $SolanaTemp)
robocopy $SolanaRepo $SolanaTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
Ensure-Dir (Join-Path $SolanaTemp 'src\utils')
Ensure-Dir (Join-Path $SolanaTemp 'src\components')
Ensure-Dir (Join-Path $SolanaTemp 'src\pages')
Ensure-Dir (Join-Path $SolanaTemp 'src\solana-programs\biometric-nft\programs\biometric-nft\src')
Ensure-Dir (Join-Path $SolanaTemp 'src\solana-programs\tests')
Write-Host 'Applying updated files to Solana temp repo'
Copy-IfExists (Join-Path $SourceRoot 'src\utils\solana-client.ts') (Join-Path $SolanaTemp 'src\utils')
Copy-IfExists (Join-Path $SourceRoot 'src\utils\solana-enhanced-integration.ts') (Join-Path $SolanaTemp 'src\utils')
Copy-IfExists (Join-Path $SourceRoot 'src\components\SolanaAIPanel.tsx') (Join-Path $SolanaTemp 'src\components')
Copy-IfExists (Join-Path $SourceRoot 'src\pages\SolanaEmotionalNFT.tsx') (Join-Path $SolanaTemp 'src\pages')
Copy-IfExists (Join-Path $SourceRoot 'src\solana-programs\biometric-nft\programs\biometric-nft\src\lib.rs') (Join-Path $SolanaTemp 'src\solana-programs\biometric-nft\programs\biometric-nft\src')
Copy-IfExists (Join-Path $SourceRoot 'src\solana-programs\biometric-nft\Cargo.toml') (Join-Path $SolanaTemp 'src\solana-programs\biometric-nft')
Copy-IfExists (Join-Path $SourceRoot 'src\solana-programs\biometric-nft\Anchor.toml') (Join-Path $SolanaTemp 'src\solana-programs\biometric-nft')
Copy-IfExists (Join-Path $SourceRoot 'src\solana-programs\tests\solana-emotional-metadata.ts') (Join-Path $SolanaTemp 'src\solana-programs\tests')
git -C $SolanaTemp add -A
try { git -C $SolanaTemp commit -m 'Update Solana client, components, and programs' | Out-Null } catch { Write-Host 'No changes to commit (Solana) or commit failed' }
git -C $SolanaTemp remote remove origin 2>$null
git -C $SolanaTemp remote add origin $SolanaRemote
$solBranch = (git -C $SolanaTemp rev-parse --abbrev-ref HEAD).Trim()
try { git -C $SolanaTemp push origin $solBranch } catch { Write-Host ('Push failed for Solana: ' + $_.Exception.Message) }

# --- Filecoin ---
$FilecoinTemp = Join-Path $TempRoot 'filecoin-creative-storage'
Write-Host ('Copying Filecoin repo to temp: ' + $FilecoinTemp)
robocopy $FilecoinRepo $FilecoinTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
Ensure-Dir (Join-Path $FilecoinTemp 'src\utils')
Ensure-Dir (Join-Path $FilecoinTemp 'src\components')
Write-Host 'Applying updated files to Filecoin temp repo'
foreach ($f in @(
  'src\utils\filecoin-ai-integration.ts',
  'src\utils\filecoin-ai-integration-enhanced.ts',
  'src\utils\filecoin-storage.ts',
  'src\utils\real-filecoin-storage.js',
  'src\utils\real-ipfs-storage.js',
  'src\utils\real-web3storage.js',
  'src\utils\real-web3storage-manager.js'
)) { Copy-IfExists (Join-Path $SourceRoot $f) (Join-Path $FilecoinTemp ([System.IO.Path]::GetDirectoryName($f))) }
Copy-IfExists (Join-Path $SourceRoot 'src\components\FilecoinStorageIntegration.tsx') (Join-Path $FilecoinTemp 'src\components')
Copy-IfExists (Join-Path $SourceRoot 'src\components\FilecoinAIPanel.tsx') (Join-Path $FilecoinTemp 'src\components')
git -C $FilecoinTemp add -A
try { git -C $FilecoinTemp commit -m 'Update Filecoin storage integration and AI utilities' | Out-Null } catch { Write-Host 'No changes to commit (Filecoin) or commit failed' }
git -C $FilecoinTemp remote remove origin 2>$null
git -C $FilecoinTemp remote add origin $FilecoinRemote
$filBranch = (git -C $FilecoinTemp rev-parse --abbrev-ref HEAD).Trim()
try { git -C $FilecoinTemp push origin $filBranch } catch { Write-Host ('Push failed for Filecoin: ' + $_.Exception.Message) }

# --- Polkadot ---
$PolkadotTemp = Join-Path $TempRoot 'polkadot-creative-identity'
Write-Host ('Copying Polkadot repo to temp: ' + $PolkadotTemp)
robocopy $PolkadotRepo $PolkadotTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
Ensure-Dir (Join-Path $PolkadotTemp 'src\utils')
Ensure-Dir (Join-Path $PolkadotTemp 'src\polkadot-client\src')
Write-Host 'Applying updated files to Polkadot temp repo'
foreach ($f in @(
  'src\utils\polkadot-client.ts',
  'src\utils\polkadot-client-working.ts',
  'src\utils\polkadot-ai-bridge.ts',
  'src\utils\polkadot-ai-examples.js'
)) { Copy-IfExists (Join-Path $SourceRoot $f) (Join-Path $PolkadotTemp ([System.IO.Path]::GetDirectoryName($f))) }
foreach ($f in @(
  'src\polkadot-client\src\lib.rs',
  'src\polkadot-client\src\emotional_bridge.rs',
  'src\polkadot-client\src\extrinsics.rs',
  'src\polkadot-client\src\soulbound.rs',
  'src\polkadot-client\src\xcm_messaging.rs',
  'src\polkadot-client\Cargo.toml'
)) { Copy-IfExists (Join-Path $SourceRoot $f) (Join-Path $PolkadotTemp ([System.IO.Path]::GetDirectoryName($f))) }
git -C $PolkadotTemp add -A
try { git -C $PolkadotTemp commit -m 'Update Polkadot client and AI bridge utilities' | Out-Null } catch { Write-Host 'No changes to commit (Polkadot) or commit failed' }
git -C $PolkadotTemp remote remove origin 2>$null
git -C $PolkadotTemp remote add origin $PolkadotRemote
$polBranch = (git -C $PolkadotTemp rev-parse --abbrev-ref HEAD).Trim()
try { git -C $PolkadotTemp push origin $polBranch } catch { Write-Host ('Push failed for Polkadot: ' + $_.Exception.Message) }

# --- Rust ---
$RustTemp = Join-Path $TempRoot 'rust-foundation-audiovisual'
Write-Host ('Copying Rust repo to temp: ' + $RustTemp)
robocopy $RustRepo $RustTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
Ensure-Dir (Join-Path $RustTemp 'rust-client\src')
Ensure-Dir (Join-Path $RustTemp 'rust-client\shaders')
Write-Host 'Applying updated files to Rust temp repo'
foreach ($f in (Get-ChildItem -Path (Join-Path $SourceRoot 'src\rust-client\src') -Filter '*.rs' -ErrorAction SilentlyContinue)) {
  Copy-IfExists $f.FullName (Join-Path $RustTemp 'rust-client\src')
}
foreach ($s in (Get-ChildItem -Path (Join-Path $SourceRoot 'src\rust-client\shaders') -ErrorAction SilentlyContinue)) {
  Copy-IfExists $s.FullName (Join-Path $RustTemp 'rust-client\shaders')
}
git -C $RustTemp add -A
try { git -C $RustTemp commit -m 'Update Rust WebGPU engine and integrations' | Out-Null } catch { Write-Host 'No changes to commit (Rust) or commit failed' }
git -C $RustTemp remote remove origin 2>$null
git -C $RustTemp remote add origin $RustRemote
$rustBranch = (git -C $RustTemp rev-parse --abbrev-ref HEAD).Trim()
try { git -C $RustTemp push origin $rustBranch } catch { Write-Host ('Push failed for Rust: ' + $_.Exception.Message) }

Write-Host ('DONE. TEMP_ROOT=' + $TempRoot)
