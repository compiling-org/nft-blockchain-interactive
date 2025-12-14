#!/bin/bash

# Cross-Chain AI Contract Deployment Script
# Deploys AI/ML coordination contracts across Filecoin, NEAR, and Solana testnets

set -e

echo "🚀 Starting Cross-Chain AI Contract Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NEAR_ACCOUNT="blockchain-nft-interactive.testnet"
SOLANA_PROGRAM_DIR="src/solana-program/programs/cross-chain-ai"
NEAR_CONTRACT_DIR="contracts/near/cross-chain-ai"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists near; then
    print_error "NEAR CLI not found. Please install it first."
    exit 1
fi

if ! command_exists solana; then
    print_error "Solana CLI not found. Please install it first."
    exit 1
fi

if ! command_exists anchor; then
    print_error "Anchor CLI not found. Please install it first."
    exit 1
fi

print_status "All prerequisites found!"

# Deploy NEAR Cross-Chain AI Contract
print_status "Deploying NEAR Cross-Chain AI Contract..."
cd "$NEAR_CONTRACT_DIR"

# Build the contract
print_status "Building NEAR contract..."
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
print_status "Deploying to NEAR testnet..."
near deploy "$NEAR_ACCOUNT" \
    target/wasm32-unknown-unknown/release/cross_chain_ai.wasm \
    --accountId "$NEAR_ACCOUNT" \
    --networkId testnet \
    --nodeUrl https://rpc.testnet.near.org

# Initialize the contract
print_status "Initializing NEAR contract..."
near call "$NEAR_ACCOUNT" new '{}' \
    --accountId "$NEAR_ACCOUNT" \
    --networkId testnet \
    --nodeUrl https://rpc.testnet.near.org

cd - > /dev/null

print_status "NEAR Cross-Chain AI Contract deployed successfully!"

# Deploy Solana Cross-Chain AI Program
print_status "Deploying Solana Cross-Chain AI Program..."
cd "$SOLANA_PROGRAM_DIR"

# Build the program
print_status "Building Solana program..."
anchor build

# Get the program ID
PROGRAM_ID=$(solana address -k target/deploy/cross_chain_ai-keypair.json)
print_status "Solana Program ID: $PROGRAM_ID"

# Deploy to devnet
print_status "Deploying to Solana devnet..."
solana program deploy \
    target/deploy/cross_chain_ai.so \
    --keypair ~/.config/solana/id.json \
    --url https://api.devnet.solana.com \
    --program-id "$PROGRAM_ID"

cd - > /dev/null

print_status "Solana Cross-Chain AI Program deployed successfully!"

# Create configuration file
print_status "Creating cross-chain AI configuration..."
cat > src/config/cross-chain-ai.json << EOF
{
  "contracts": {
    "near": {
      "network": "testnet",
      "account": "$NEAR_ACCOUNT",
      "contract_id": "$NEAR_ACCOUNT",
      "rpc_url": "https://rpc.testnet.near.org"
    },
    "solana": {
      "network": "devnet",
      "program_id": "$PROGRAM_ID",
      "rpc_url": "https://api.devnet.solana.com"
    }
  },
  "chains": {
    "filecoin": {
      "chain_id": "314",
      "network": "calibration"
    },
    "near": {
      "chain_id": "397", 
      "network": "testnet"
    },
    "solana": {
      "chain_id": "501",
      "network": "devnet"
    }
  },
  "ai_models": {
    "inference": {
      "enabled": true,
      "max_processing_time_ms": 2000,
      "min_confidence": 0.85
    },
    "training": {
      "enabled": true,
      "federated_learning": true,
      "privacy_budget": 1.0,
      "convergence_threshold": 0.001
    }
  },
  "cross_chain": {
    "streaming": {
      "enabled": true,
      "batch_size": 100,
      "sync_interval_ms": 5000
    },
    "bridges": {
      "near_solana": true,
      "solana_filecoin": true,
      "filecoin_near": true
    }
  }
}
EOF

print_status "Configuration file created at src/config/cross-chain-ai.json"

# Test the deployments
print_status "Testing cross-chain AI contract deployments..."

# Test NEAR contract
print_status "Testing NEAR contract..."
near view "$NEAR_ACCOUNT" get_active_streams_count '{}' \
    --accountId "$NEAR_ACCOUNT" \
    --networkId testnet \
    --nodeUrl https://rpc.testnet.near.org

# Test Solana program
print_status "Testing Solana program..."
solana account "$PROGRAM_ID" \
    --url https://api.devnet.solana.com

print_status "Cross-chain AI contract deployment completed successfully!"
echo "================================================"
echo -e "${GREEN}✅ All Cross-Chain AI Contracts Deployed${NC}"
echo ""
echo "📋 Deployment Summary:"
echo "  • NEAR Contract: $NEAR_ACCOUNT"
echo "  • Solana Program: $PROGRAM_ID"
echo "  • Configuration: src/config/cross-chain-ai.json"
echo ""
echo "🎯 Next Steps:"
echo "  1. Deploy Filecoin calibration contract"
echo "  2. Test cross-chain data streaming"
echo "  3. Implement AI inference integration"
echo "  4. Create interactive NFT system"
echo "================================================"