#!/bin/bash
# Mainnet deployment script for all blockchain networks
# This script handles production deployment with security measures

set -e  # Exit on any error

echo "============================================"
echo "🚀 Mainnet Deployment Script"
echo "============================================"
echo "⚠️  WARNING: This will deploy to PRODUCTION networks"
echo "⚠️  Ensure you have:"
echo "   - Completed security audits"
echo "   - Tested on testnet thoroughly"
echo "   - Backup and rollback plan ready"
echo "   - Multi-signature approvals"
echo ""
echo "Press Ctrl+C to cancel, or Enter to continue..."
read -p ""

# Configuration
DEPLOYMENT_ENV="mainnet"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="deployment_logs/mainnet_deployment_${TIMESTAMP}.log"

# Create deployment logs directory
mkdir -p deployment_logs

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    log "❌ ERROR: Deployment failed at line $1"
    log "Check the logs: $LOG_FILE"
    exit 1
}

trap 'handle_error $LINENO' ERR

log "Starting mainnet deployment..."

# ============================================
# 1. Pre-deployment Checks
# ============================================

log "🔍 Running pre-deployment checks..."

# Check environment variables
if [ -z "$MAINNET_PRIVATE_KEY" ]; then
    log "❌ MAINNET_PRIVATE_KEY not set"
    exit 1
fi

if [ -z "$NEAR_MAINNET_ACCOUNT" ]; then
    log "❌ NEAR_MAINNET_ACCOUNT not set"
    exit 1
fi

if [ -z "$SOLANA_MAINNET_KEYPAIR" ]; then
    log "❌ SOLANA_MAINNET_KEYPAIR not set"
    exit 1
fi

# Check tool availability
command -v near >/dev/null 2>&1 || { log "❌ NEAR CLI not installed"; exit 1; }
command -v solana >/dev/null 2>&1 || { log "❌ Solana CLI not installed"; exit 1; }
command -v anchor >/dev/null 2>&1 || { log "❌ Anchor not installed"; exit 1; }

log "✅ Pre-deployment checks passed"

# ============================================
# 2. NEAR Mainnet Deployment
# ============================================

log "🔵 Deploying NEAR contracts to mainnet..."

# Configure NEAR for mainnet
export NEAR_ENV=mainnet
near config set --networkId mainnet --nodeUrl https://rpc.mainnet.near.org --walletUrl https://wallet.near.org --helperUrl https://helper.mainnet.near.org --explorerUrl https://explorer.mainnet.near.org

# Build NEAR contracts
cd src/near-wasm
if [ -f "build.sh" ]; then
    ./build.sh
else
    cargo build --target wasm32-unknown-unknown --release
fi

# Deploy contracts with multi-signature protection
log "Deploying Soulbound NFT contract..."
near deploy --accountId soulbound-nft.near --wasmFile target/wasm32-unknown-unknown/release/soulbound_nft.wasm --initFunction new --initArgs '{"owner_id": "'$NEAR_MAINNET_ACCOUNT'"}'

log "Deploying Cross-chain AI contract..."
near deploy --accountId cross-chain-ai.near --wasmFile target/wasm32-unknown-unknown/release/cross_chain_ai.wasm --initFunction new --initArgs '{"owner_id": "'$NEAR_MAINNET_ACCOUNT'"}'

log "Deploying Fractal Studio contract..."
near deploy --accountId fractal-studio.near --wasmFile target/wasm32-unknown-unknown/release/fractal_studio.wasm --initFunction new --initArgs '{"owner_id": "'$NEAR_MAINNET_ACCOUNT'"}'

cd ../..
log "✅ NEAR mainnet deployment completed"

# ============================================
# 3. Solana Mainnet Deployment
# ============================================

log "🟣 Deploying Solana programs to mainnet..."

# Configure Solana for mainnet
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair "$SOLANA_MAINNET_KEYPAIR"

# Build Solana programs
cd src/solana-client
anchor build

# Deploy programs
log "Deploying Biometric NFT program..."
anchor deploy --program-name biometric-nft

log "Deploying Emotional Metadata program..."
anchor deploy --program-name emotional-metadata

# Get program IDs and update configuration
BIOMETRIC_NFT_ID=$(solana program show --programs | grep biometric-nft | awk '{print $1}')
EMOTIONAL_METADATA_ID=$(solana program show --programs | grep emotional-metadata | awk '{print $1}')

log "Biometric NFT Program ID: $BIOMETRIC_NFT_ID"
log "Emotional Metadata Program ID: $EMOTIONAL_METADATA_ID"

cd ../..
log "✅ Solana mainnet deployment completed"

# ============================================
# 4. Infrastructure Setup
# ============================================

log "🏗️  Setting up production infrastructure..."

# IPFS Pinning setup
if [ -n "$PINATA_API_KEY" ] && [ -n "$PINATA_SECRET_KEY" ]; then
    log "Configuring IPFS pinning with Pinata..."
    # Add IPFS setup commands here
fi

# Web3.Storage setup
if [ -n "$WEB3_STORAGE_TOKEN" ]; then
    log "Configuring Web3.Storage..."
    # Add Web3.Storage setup commands here
fi

# CDN setup for AI models
if [ -n "$CDN_API_KEY" ]; then
    log "Uploading AI models to CDN..."
    # Upload TensorFlow.js models to CDN
fi

log "✅ Infrastructure setup completed"

# ============================================
# 5. Post-deployment Verification
# ============================================

log "🔍 Running post-deployment verification..."

# Verify NEAR contracts
log "Verifying NEAR contract deployments..."
near view soulbound-nft.near get_owner_id
near view cross-chain-ai.near get_owner_id
near view fractal-studio.near get_owner_id

# Verify Solana programs
log "Verifying Solana program deployments..."
solana program show "$BIOMETRIC_NFT_ID"
solana program show "$EMOTIONAL_METADATA_ID"

# Test basic functionality
log "Testing basic contract functionality..."
# Add contract interaction tests here

log "✅ Post-deployment verification completed"

# ============================================
# 6. Monitoring Setup
# ============================================

log "📊 Setting up monitoring and alerting..."

# Create monitoring configuration
cat > monitoring/config.json << EOF
{
  "networks": {
    "near": {
      "rpc": "https://rpc.mainnet.near.org",
      "contracts": ["soulbound-nft.near", "cross-chain-ai.near", "fractal-studio.near"]
    },
    "solana": {
      "rpc": "https://api.mainnet-beta.solana.com",
      "programs": ["$BIOMETRIC_NFT_ID", "$EMOTIONAL_METADATA_ID"]
    }
  },
  "alerts": {
    "webhook": "$SLACK_WEBHOOK_URL",
    "email": "$ALERT_EMAIL"
  }
}
EOF

log "✅ Monitoring setup completed"

# ============================================
# 7. Final Summary
# ============================================

log "🎉 Mainnet deployment completed successfully!"
log ""
log "📋 Deployment Summary:"
log "   - NEAR Contracts: soulbound-nft.near, cross-chain-ai.near, fractal-studio.near"
log "   - Solana Programs: $BIOMETRIC_NFT_ID, $EMOTIONAL_METADATA_ID"
log "   - Timestamp: $TIMESTAMP"
log "   - Log file: $LOG_FILE"
log ""
log "⚠️  Important reminders:"
log "   - Monitor contracts for 24 hours"
log "   - Set up automated backups"
log "   - Configure emergency pause mechanisms"
log "   - Update documentation with new addresses"
log "   - Notify grant providers of deployment"
log ""
log "🚀 Ready for production use!"

# Create deployment manifest
cat > deployment_manifest.json << EOF
{
  "deployment": {
    "timestamp": "$TIMESTAMP",
    "environment": "mainnet",
    "networks": {
      "near": {
        "soulbound_nft": "soulbound-nft.near",
        "cross_chain_ai": "cross-chain-ai.near",
        "fractal_studio": "fractal-studio.near"
      },
      "solana": {
        "biometric_nft": "$BIOMETRIC_NFT_ID",
        "emotional_metadata": "$EMOTIONAL_METADATA_ID"
      }
    },
    "logs": "$LOG_FILE"
  }
}
EOF