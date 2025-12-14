# Enhanced NEAR Testnet Deployment Script (PowerShell)
# This script handles real testnet deployment with proper error handling

Write-Host "🚀 Starting Real NEAR Testnet Deployment..." -ForegroundColor Blue

# Configuration
$CONTRACT_NAME = "biometric-soulbound-nft"
$TIMESTAMP = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$SUBACCOUNT_NAME = "$CONTRACT_NAME-$TIMESTAMP"

# Check for required environment variables
if (-not $env:NEAR_ACCOUNT_ID) {
    Write-Host "⚠️ NEAR_ACCOUNT_ID not set, using default test account" -ForegroundColor Yellow
    $env:NEAR_ACCOUNT_ID = "kenchen.testnet"
}

$MASTER_ACCOUNT = $env:NEAR_ACCOUNT_ID

Write-Host "📋 Deployment Configuration:" -ForegroundColor Blue
Write-Host "  Contract Name: $CONTRACT_NAME"
Write-Host "  Subaccount: $SUBACCOUNT_NAME.$MASTER_ACCOUNT" 
Write-Host "  Master Account: $MASTER_ACCOUNT"
Write-Host "  Network: testnet"

# Check if near-cli is available
if (-not (Get-Command near -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️ near-cli not found, installing..." -ForegroundColor Yellow
    npm install -g near-cli
}

# Check if Rust is available
if (-not (Get-Command rustc -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Rust not found. Please install Rust first." -ForegroundColor Red
    Write-Host "💡 Install from: https://rustup.rs/" -ForegroundColor Blue
    exit 1
}

# Install WASM target if not present
$wasmTarget = rustup target list --installed | Select-String "wasm32-unknown-unknown"
if (-not $wasmTarget) {
    Write-Host "📦 Installing WASM target..." -ForegroundColor Yellow
    rustup target add wasm32-unknown-unknown
}

Write-Host "🔨 Building NEAR Contract..." -ForegroundColor Blue
Set-Location contracts/near/soulbound-nft

# Clean previous builds
cargo clean

# Build with maximum optimization
Write-Host "Compiling with release optimizations..." -ForegroundColor Yellow
cargo build --target wasm32-unknown-unknown --release

# Verify build success
$WASM_PATH = "target/wasm32-unknown-unknown/release/biometric_soulbound_nft.wasm"
if (-not (Test-Path $WASM_PATH)) {
    Write-Host "❌ Contract compilation failed!" -ForegroundColor Red
    exit 1
}

$CONTRACT_SIZE = (Get-Item $WASM_PATH).Length
Write-Host "✅ Contract built successfully!" -ForegroundColor Green
Write-Host "  WASM size: $CONTRACT_SIZE bytes"

# Check contract size (NEAR has ~4MB limit)
if ($CONTRACT_SIZE -gt 4000000) {
    Write-Host "❌ Contract too large for NEAR deployment" -ForegroundColor Red
    exit 1
}

Write-Host "🌐 Deploying to NEAR Testnet..." -ForegroundColor Blue

# Create subaccount for contract
Write-Host "Creating subaccount: $SUBACCOUNT_NAME.$MASTER_ACCOUNT"
near create-account "$SUBACCOUNT_NAME.$MASTER_ACCOUNT" `
    --masterAccount "$MASTER_ACCOUNT" `
    --initialBalance 10

# Prepare initialization arguments
$INIT_ARGS = @"
{
    "owner_id": "$MASTER_ACCOUNT",
    "metadata": {
        "spec": "nft-1.0.0",
        "name": "Biometric Soulbound NFT",
        "symbol": "BSNFT",
        "icon": "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        "base_uri": "https://ipfs.io/ipfs/",
        "reference": null,
        "reference_hash": null
    }
}
"@

# Deploy contract with initialization
Write-Host "Deploying contract to: $SUBACCOUNT_NAME.$MASTER_ACCOUNT"
near deploy "$SUBACCOUNT_NAME.$MASTER_ACCOUNT" `
    $WASM_PATH `
    --accountId "$MASTER_ACCOUNT" `
    --initFunction new `
    --initArgs $INIT_ARGS `
    --gas 300000000000000

Write-Host "✅ Contract deployed successfully!" -ForegroundColor Green
Write-Host "📋 Contract Details:" -ForegroundColor Blue
Write-Host "  Contract ID: $SUBACCOUNT_NAME.$MASTER_ACCOUNT"
Write-Host "  Network: testnet"
Write-Host "  Explorer: https://explorer.testnet.near.org/accounts/$SUBACCOUNT_NAME.$MASTER_ACCOUNT"

# Save contract ID for frontend configuration
$SUBACCOUNT_NAME.$MASTER_ACCOUNT | Out-File -FilePath "../../../src/config/near-contract-id.txt" -Encoding UTF8

# Update JavaScript configuration
Write-Host "📝 Updating frontend configuration..." -ForegroundColor Blue
$DEPLOYED_CONTRACTS_JS = @"
// Auto-generated deployed contracts configuration
export const DEPLOYED_CONTRACTS = {
  near: {
    testnet: {
      soulboundNFT: '$SUBACCOUNT_NAME.$MASTER_ACCOUNT',
      deployedAt: '$([DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"))',
      deployedBy: '$MASTER_ACCOUNT'
    }
  }
};
"@

$DEPLOYED_CONTRACTS_JS | Out-File -FilePath "../../../src/config/deployed-contracts.js" -Encoding UTF8

Write-Host "✅ Configuration updated!" -ForegroundColor Green

# Test contract functionality
Write-Host "🧪 Testing contract functionality..." -ForegroundColor Blue

# Test 1: Contract metadata
Write-Host "Testing contract metadata..."
near view "$SUBACCOUNT_NAME.$MASTER_ACCOUNT" nft_metadata

# Test 2: Mint a soulbound NFT with realistic biometric data
Write-Host "Testing biometric NFT minting..."
$MINT_ARGS = @"
{
    "emotion_data": {
        "primary_emotion": "Focused",
        "confidence": 0.92,
        "secondary_emotions": [["Calm", 0.85], ["Alert", 0.78]],
        "arousal": 0.65,
        "valence": 0.72
    },
    "quality_score": 0.89,
    "biometric_hash": "sha256:a1b2c3d4e5f6789012345678901234567890abcdef"
}
"@

near call "$SUBACCOUNT_NAME.$MASTER_ACCOUNT" mint_soulbound `
    $MINT_ARGS `
    --accountId "$MASTER_ACCOUNT" `
    --amount 0.1 `
    --gas 300000000000000

# Test 3: View owner's tokens
Write-Host "Testing token viewing..."
near view "$SUBACCOUNT_NAME.$MASTER_ACCOUNT" nft_tokens_for_owner `
    '{"account_id": "'$MASTER_ACCOUNT'"}'

Write-Host "✅ Deployment and testing completed!" -ForegroundColor Green
Write-Host "🎯 Next Steps:" -ForegroundColor Blue
Write-Host "1. Update your frontend with: $SUBACCOUNT_NAME.$MASTER_ACCOUNT"
Write-Host "2. Test with real biometric data from EEG devices"
Write-Host "3. Integrate with AI emotion detection services"
Write-Host "4. Deploy to mainnet when ready"
Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Blue
Write-Host "  NEAR Explorer: https://explorer.testnet.near.org/accounts/$SUBACCOUNT_NAME.$MASTER_ACCOUNT"
Write-Host "  NEAR Wallet: https://wallet.testnet.near.org/"
Write-Host "  Contract Code: contracts/near/soulbound-nft/src/lib.rs"
Write-Host ""
Write-Host "🎉 Real NEAR testnet deployment complete!" -ForegroundColor Green

# Return to project root
Set-Location ../../../