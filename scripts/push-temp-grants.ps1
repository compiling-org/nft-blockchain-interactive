Param(
  [string]$SourceRoot = 'C:\Users\kapil\compiling\blockchain-nft-interactive',
  [string]$BitteRepo = 'C:\Users\kapil\compiling\grant-repositories\bitte-protocol-ai',
  [string]$NearRepo = 'C:\Users\kapil\compiling\grant-repositories\near-creative-engine',
  [string]$BitteRemote = 'https://github.com/compiling-org/mintbase-creative-marketplace.git',
  [string]$NearRemote = 'https://github.com/compiling-org/near-foundation-ai-biometric.git'
)

$ErrorActionPreference = 'Stop'

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path | Out-Null }
}

$TempRoot = Join-Path $env:LOCALAPPDATA ('grant-push-' + (Get-Date).ToString('yyyyMMddHHmmss'))
Ensure-Dir $TempRoot
Write-Host ('TEMP_ROOT=' + $TempRoot)

$BitteTemp = Join-Path $TempRoot 'bitte-protocol-ai'
$NearTemp  = Join-Path $TempRoot 'near-creative-engine'

Write-Host ('Copying Bitte repo to temp: ' + $BitteTemp)
robocopy $BitteRepo $BitteTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null

Write-Host ('Copying NEAR repo to temp: ' + $NearTemp)
robocopy $NearRepo $NearTemp *.* /MIR /NFL /NDL /NJH /NJS /NP | Out-Null

Ensure-Dir (Join-Path $BitteTemp 'src\components')
Ensure-Dir (Join-Path $BitteTemp 'src\pages')
Ensure-Dir (Join-Path $BitteTemp 'src\services')
Ensure-Dir (Join-Path $BitteTemp 'contracts\near\soulbound-nft\src')
Ensure-Dir (Join-Path $BitteTemp 'contracts\near\cross-chain-ai\src')

Ensure-Dir (Join-Path $NearTemp 'src\components')
Ensure-Dir (Join-Path $NearTemp 'src\pages')
Ensure-Dir (Join-Path $NearTemp 'src\services')
Ensure-Dir (Join-Path $NearTemp 'src\near-wasm\src')
Ensure-Dir (Join-Path $NearTemp 'src\contracts\near\soulbound-nft\src')
Ensure-Dir (Join-Path $NearTemp 'src\contracts\near\cross-chain-ai\src')

Write-Host 'Applying updated files to Bitte temp repo'
foreach ($f in @(
  'src\components\WGSLWebGPUFractal.tsx',
  'src\components\MediaPipeSensors.tsx',
  'src\components\LeapMotionSensors.tsx',
  'src\components\RealBitteMarketplace.tsx',
  'src\pages\EnhancedBitteMarketplace.tsx',
  'src\services\myNearWalletService.ts',
  'src\services\realMarketplaceService.ts',
  'src\services\bitteWalletService.ts'
)) {
  $src = Join-Path $SourceRoot $f
  if (Test-Path $src) {
    $destDir = Join-Path $BitteTemp ([System.IO.Path]::GetDirectoryName($f))
    Ensure-Dir $destDir
    Copy-Item -Force $src $destDir
    Write-Host ('  + ' + $f)
  } else {
    Write-Host ('  - (missing) ' + $f)
  }
}
foreach ($f in @(
  'contracts\near\soulbound-nft\src\lib.rs',
  'contracts\near\cross-chain-ai\src\lib.rs'
)) {
  $src = Join-Path $SourceRoot $f
  if (Test-Path $src) {
    $destDir = Join-Path $BitteTemp ([System.IO.Path]::GetDirectoryName($f))
    Ensure-Dir $destDir
    Copy-Item -Force $src $destDir
    Write-Host ('  + ' + $f)
  } else {
    Write-Host ('  - (missing) ' + $f)
  }
}

Write-Host 'Applying updated files to NEAR temp repo'
foreach ($f in @(
  'src\near-wasm\src\lib.rs',
  'src\services\myNearWalletService.ts',
  'src\components\ComprehensiveNEARCreativeEngine.tsx'
)) {
  $src = Join-Path $SourceRoot $f
  if (Test-Path $src) {
    $destDir = Join-Path $NearTemp ([System.IO.Path]::GetDirectoryName($f))
    Ensure-Dir $destDir
    Copy-Item -Force $src $destDir
    Write-Host ('  + ' + $f)
  } else {
    Write-Host ('  - (missing) ' + $f)
  }
}

Write-Host 'Committing and pushing Bitte temp repo'
git -C $BitteTemp add -A
try {
  git -C $BitteTemp commit -m 'Update marketplace components, WGSL renderer, sensors, wallet service' | Out-Null
} catch {
  Write-Host 'No changes to commit (Bitte) or commit failed'
}
git -C $BitteTemp remote remove origin 2>$null
git -C $BitteTemp remote add origin $BitteRemote
$branch = (git -C $BitteTemp rev-parse --abbrev-ref HEAD).Trim()
try {
  git -C $BitteTemp push origin $branch
} catch {
  Write-Host ('Push failed for Bitte: ' + $_.Exception.Message)
}

Write-Host 'Committing and pushing NEAR temp repo'
git -C $NearTemp add -A
try {
  git -C $NearTemp commit -m 'Update NEAR creative engine components and wallet service' | Out-Null
} catch {
  Write-Host 'No changes to commit (NEAR) or commit failed'
}
git -C $NearTemp remote remove origin 2>$null
git -C $NearTemp remote add origin $NearRemote
$branch2 = (git -C $NearTemp rev-parse --abbrev-ref HEAD).Trim()
try {
  git -C $NearTemp push origin $branch2
} catch {
  Write-Host ('Push failed for NEAR: ' + $_.Exception.Message)
}

Write-Host ('DONE. TEMP_ROOT=' + $TempRoot)
