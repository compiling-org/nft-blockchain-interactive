#!/bin/bash

# Phase 2 Cross-Chain AI Integration Deployment Script
# Deploys comprehensive AI/ML contracts across Filecoin, NEAR, and Solana testnets

set -e

echo "🚀 Starting Phase 2 Cross-Chain AI Integration Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NEAR_NETWORK="testnet"
SOLANA_NETWORK="devnet"
FILECOIN_NETWORK="calibration"

# Contract directories
NEAR_CROSS_CHAIN_DIR="contracts/near/cross-chain-ai"
NEAR_SOULBOUND_DIR="contracts/near/soulbound-ai-governance"
SOLANA_CROSS_CHAIN_DIR="src/solana-program/programs/cross-chain-ai"
SOLANA_SOULBOUND_DIR="src/solana-program/programs/soulbound-ai"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Rust
    if ! command -v rustc &> /dev/null; then
        print_error "Rust is not installed"
        exit 1
    fi
    
    # Check Cargo
    if ! command -v cargo &> /dev/null; then
        print_error "Cargo is not installed"
        exit 1
    fi
    
    # Check NEAR CLI
    if ! command -v near &> /dev/null; then
        print_error "NEAR CLI is not installed"
        exit 1
    fi
    
    # Check Solana CLI
    if ! command -v solana &> /dev/null; then
        print_error "Solana CLI is not installed"
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Setup NEAR accounts and deploy contracts
deploy_near_contracts() {
    print_status "Deploying NEAR cross-chain AI contracts..."
    
    # Create NEAR account for cross-chain AI
    print_status "Creating NEAR account for cross-chain AI..."
    near create-account cross-chain-ai.$NEAR_ACCOUNT --masterAccount $NEAR_ACCOUNT --initialBalance 10
    
    # Build and deploy cross-chain AI contract
    print_status "Building cross-chain AI contract..."
    cd $NEAR_CROSS_CHAIN_DIR
    cargo build --target wasm32-unknown-unknown --release
    
    print_status "Deploying cross-chain AI contract..."
    near deploy cross-chain-ai.$NEAR_ACCOUNT \
        --wasmFile target/wasm32-unknown-unknown/release/cross_chain_ai.wasm \
        --initFunction new \
        --initArgs '{"owner": "cross-chain-ai.'$NEAR_ACCOUNT'"}'
    
    print_success "Cross-chain AI contract deployed to: cross-chain-ai.$NEAR_ACCOUNT"
    
    # Build and deploy soulbound governance contract
    print_status "Building soulbound AI governance contract..."
    cd ../../$NEAR_SOULBOUND_DIR
    cargo build --target wasm32-unknown-unknown --release
    
    print_status "Creating NEAR account for soulbound governance..."
    near create-account soulbound-ai-governance.$NEAR_ACCOUNT --masterAccount $NEAR_ACCOUNT --initialBalance 10
    
    print_status "Deploying soulbound AI governance contract..."
    near deploy soulbound-ai-governance.$NEAR_ACCOUNT \
        --wasmFile target/wasm32-unknown-unknown/release/soulbound_ai_governance.wasm \
        --initFunction new \
        --initArgs '{"owner": "soulbound-ai-governance.'$NEAR_ACCOUNT'"}'
    
    print_success "Soulbound AI governance contract deployed to: soulbound-ai-governance.$NEAR_ACCOUNT"
    
    cd ../../../
}

# Setup Solana programs
deploy_solana_programs() {
    print_status "Deploying Solana cross-chain AI programs..."
    
    # Build cross-chain AI program
    print_status "Building Solana cross-chain AI program..."
    cd $SOLANA_CROSS_CHAIN_DIR
    anchor build
    
    # Deploy cross-chain AI program
    print_status "Deploying cross-chain AI program..."
    PROGRAM_ID=$(solana program deploy target/deploy/cross_chain_ai.so | grep "Program Id:" | awk '{print $3}')
    
    print_success "Cross-chain AI program deployed to: $PROGRAM_ID"
    
    # Update program ID in lib.rs
    print_status "Updating program ID in source files..."
    sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" src/lib.rs
    
    # Build soulbound AI program
    print_status "Building Solana soulbound AI program..."
    cd ../../$SOLANA_SOULBOUND_DIR
    anchor build
    
    # Deploy soulbound AI program
    print_status "Deploying soulbound AI program..."
    SOULBOUND_PROGRAM_ID=$(solana program deploy target/deploy/soulbound_ai.so | grep "Program Id:" | awk '{print $3}')
    
    print_success "Soulbound AI program deployed to: $SOULBOUND_PROGRAM_ID"
    
    # Update program ID in lib.rs
    sed -i "s/declare_id!(\".*\")/declare_id!(\"$SOULBOUND_PROGRAM_ID\")/" src/lib.rs
    
    cd ../../../
}

# Setup Filecoin integration
setup_filecoin_integration() {
    print_status "Setting up Filecoin integration..."
    
    # Create Filecoin wallet
    print_status "Creating Filecoin wallet..."
    lotus wallet new secp256k1 > filecoin_wallet.txt
    FILECOIN_WALLET=$(cat filecoin_wallet.txt)
    
    print_success "Filecoin wallet created: $FILECOIN_WALLET"
    
    # Request testnet FIL from faucet
    print_status "Requesting testnet FIL from faucet..."
    echo "Please request testnet FIL for wallet $FILECOIN_WALLET from:"
    echo "https://faucet.calibration.fildev.network/"
    echo "Press Enter when you have received the testnet FIL..."
    read -p ""
    
    # Check balance
    BALANCE=$(lotus wallet balance $FILECOIN_WALLET)
    print_status "Filecoin wallet balance: $BALANCE"
}

# Test cross-chain functionality
test_cross_chain_functionality() {
    print_status "Testing cross-chain AI functionality..."
    
    # Test NEAR contracts
    print_status "Testing NEAR cross-chain AI contract..."
    near call cross-chain-ai.$NEAR_ACCOUNT create_data_stream \
        '{"stream_id": "test_stream_1", "target_chain": "solana", "ipfs_hash": "QmTest123", "encrypted_data": "dGVzdF9kYXRh", "epoch": 1}' \
        --accountId cross-chain-ai.$NEAR_ACCOUNT
    
    print_status "Testing NEAR soulbound governance contract..."
    near call soulbound-ai-governance.$NEAR_ACCOUNT mint_soulbound_token \
        '{"token_id": "soulbound_test_1", "metadata": {"title": "Test Soulbound", "description": "Test AI governance token", "media": "ipfs://QmTest", "media_hash": "dGVzdGhhc2g=", "copies": 1, "issued_at": "1640995200000000000", "extra": "{\"role\": \"ai_researcher\"}"}, "biometric_hash": "dGVzdGJpb21ldHJpYw=="}' \
        --accountId soulbound-ai-governance.$NEAR_ACCOUNT
    
    # Test Solana programs
    print_status "Testing Solana cross-chain AI program..."
    cd src/solana-program
    anchor test
    cd ../../
    
    print_success "Cross-chain functionality tests completed"
}

# Setup AI model integration
setup_ai_integration() {
    print_status "Setting up AI model integration..."
    
    # Install TensorFlow.js
    npm install @tensorflow/tfjs @tensorflow/tfjs-node
    
    # Install face-api.js for emotion recognition
    npm install face-api.js
    
    # Install additional AI libraries
    npm install @tensorflow/tfjs-vis @tensorflow/tfjs-backend-webgl
    
    print_status "Downloading pre-trained AI models..."
    node scripts/download-ai-models.js
    
    print_success "AI integration setup completed"
}

# Create deployment configuration
create_deployment_config() {
    print_status "Creating deployment configuration..."
    
    cat > deployment-config.json << EOF
{
  "networks": {
    "near": {
      "network": "$NEAR_NETWORK",
      "crossChainAI": "cross-chain-ai.$NEAR_ACCOUNT",
      "soulboundAIGovernance": "soulbound-ai-governance.$NEAR_ACCOUNT"
    },
    "solana": {
      "network": "$SOLANA_NETWORK",
      "crossChainAI": "$PROGRAM_ID",
      "soulboundAI": "$SOULBOUND_PROGRAM_ID"
    },
    "filecoin": {
      "network": "$FILECOIN_NETWORK",
      "wallet": "$FILECOIN_WALLET"
    }
  },
  "ai_models": {
    "emotion_recognition": {
      "model_url": "https://storage.googleapis.com/tfjs-models/tfjs/face-landmarks-detection/mesh/1/model.json",
      "backend": "tensorflow"
    },
    "biometric_verification": {
      "model_url": "https://storage.googleapis.com/tfjs-models/tfjs/face-landmarks-detection/mesh/1/model.json",
      "backend": "tensorflow"
    },
    "cross_chain_intelligence": {
      "type": "custom",
      "purpose": "Analyze cross-chain data patterns"
    },
    "governance_analytics": {
      "type": "custom",
      "purpose": "Predict governance outcomes"
    },
    "federated_learning_coordinator": {
      "type": "custom",
      "purpose": "Coordinate federated learning"
    }
  },
  "features": {
    "cross_chain_data_streaming": true,
    "ai_inference_contracts": true,
    "interactive_nfts": true,
    "soulbound_governance": true,
    "federated_learning": true,
    "biometric_verification": true,
    "emotion_recognition": true,
    "bitte_protocol_integration": true
  },
  "deployment_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "2.0.0"
}
EOF

    print_success "Deployment configuration created: deployment-config.json"
}

# Main deployment function
main() {
    print_status "Starting Phase 2 Cross-Chain AI Integration Deployment"
    
    # Check if NEAR account is provided
    if [ -z "$NEAR_ACCOUNT" ]; then
        print_error "Please set NEAR_ACCOUNT environment variable"
        exit 1
    fi
    
    # Run deployment steps
    check_prerequisites
    deploy_near_contracts
    deploy_solana_programs
    setup_filecoin_integration
    setup_ai_integration
    test_cross_chain_functionality
    create_deployment_config
    
    print_success "Phase 2 Cross-Chain AI Integration Deployment Completed!"
    print_status "Check deployment-config.json for contract addresses and configuration"
    
    echo ""
    echo "Next steps:"
    echo "1. Test the interactive NFT component with emotion recognition"
    echo "2. Verify cross-chain data streaming functionality"
    echo "3. Test soulbound token governance system"
    echo "4. Run federated learning coordination tests"
    echo "5. Integrate with Bitte Protocol AI agents"
}

# Run main function
main "$@"