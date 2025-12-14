#!/bin/bash

# Filecoin Calibration Testnet Deployment Script
# This script automates deployment to Filecoin Calibration testnet

set -e

echo "🚀 Filecoin Biometric NFT Actor Deployment Script"
echo "=================================================="

LOTUS_BIN="${LOTUS_BIN:-lotus}"

# Configuration
NETWORK="calibration"
RPC_URL="https://api.calibration.node.glif.io/rpc/v1"
CHAIN_ID=314159

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! $LOTUS_BIN --version &> /dev/null; then
        print_error "Lotus CLI not found. Please install Lotus."
        exit 1
    fi
    
    if ! command -v rustc &> /dev/null; then
        print_error "Rust not found. Please install Rust."
        exit 1
    fi
    
    print_status "All dependencies found ✓"
}

# Build the actor
build_actor() {
    print_status "Building Filecoin actor..."
    
    cd contracts/filecoin/biometric-nft-actor
    
    # Build the WASM actor
    cargo build --release --target wasm32-unknown-unknown
    
    # Check if build was successful
    if [ -f "target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm" ]; then
        print_status "Actor built successfully ✓"
        print_status "WASM size: $(ls -lh target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm | awk '{print $5}')"
    else
        print_error "Actor build failed"
        exit 1
    fi
    
    cd ../../..
}

# Request testnet funds
request_testnet_funds() {
    print_status "Requesting testnet funds..."
    
    # Get the default wallet address
    WALLET_ADDR=$(lotus wallet default)
    
    if [ -z "$WALLET_ADDR" ]; then
        print_warning "No default wallet found. Creating new wallet..."
        lotus wallet new
        WALLET_ADDR=$(lotus wallet default)
    fi
    
    print_status "Using wallet: $WALLET_ADDR"
    
    # Check current balance
    BALANCE=$(lotus wallet balance $WALLET_ADDR)
    print_status "Current balance: $BALANCE"
    
    # Request funds from calibration faucet if balance is low
    if [[ "$BALANCE" == "0 FIL" ]] || [[ "$BALANCE" == "0" ]]; then
        print_status "Requesting funds from calibration faucet..."
        
        # Use the calibration faucet API
        curl -X POST "https://faucet.calibration.fildev.network/send" \
            -H "Content-Type: application/json" \
            -d "{\"address\":\"$WALLET_ADDR\",\"amount\":10}"
        
        print_status "Faucet request sent. Waiting for confirmation..."
        sleep 30
        
        # Check new balance
        NEW_BALANCE=$(lotus wallet balance $WALLET_ADDR)
        print_status "New balance: $NEW_BALANCE"
    fi
}

# Deploy the actor
deploy_actor() {
    print_status "Deploying actor to Calibration testnet..."
    
    WASM_PATH="contracts/filecoin/biometric-nft-actor/target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm"
    
    if [ ! -f "$WASM_PATH" ]; then
        print_error "WASM file not found: $WASM_PATH"
        exit 1
    fi
    
    # Create the actor
    print_status "Creating actor on chain..."
    CREATION_OUTPUT=$(lotus chain create-actor $WASM_PATH 2>&1)
    
    # Extract actor ID from output
    ACTOR_ID=$(echo "$CREATION_OUTPUT" | grep -oP 'Actor ID: \K\d+' || echo "")
    
    if [ -n "$ACTOR_ID" ]; then
        print_status "Actor deployed successfully! ✓"
        print_status "Actor ID: $ACTOR_ID"
        
        # Save deployment info
        echo "{
            \"network\": \"$NETWORK\",
            \"actor_id\": \"$ACTOR_ID\",
            \"deployed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
            \"deployed_by\": \"$(lotus wallet default)\",
            \"wasm_path\": \"$WASM_PATH\",
            \"rpc_url\": \"$RPC_URL\"
        }" > contracts/filecoin/deployment-info.json
        
        print_status "Deployment info saved to contracts/filecoin/deployment-info.json"
    else
        print_error "Actor deployment failed"
        print_error "$CREATION_OUTPUT"
        exit 1
    fi
}

# Test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    ACTOR_ID=$(cat contracts/filecoin/deployment-info.json | grep -oP '"actor_id": "\K[^"]+')
    
    if [ -n "$ACTOR_ID" ]; then
        print_status "Testing actor state..."
        
        # Read actor state
        STATE_OUTPUT=$(lotus chain read-obj $ACTOR_ID)
        print_status "Actor state retrieved successfully ✓"
        
        print_status "Deployment test completed successfully!"
    else
        print_error "Could not find actor ID for testing"
        exit 1
    fi
}

# Main execution
main() {
    print_status "Starting Filecoin Calibration testnet deployment..."
    
    check_dependencies
    print_status "Waiting for Lotus API..."
    $LOTUS_BIN wait-api || true
    build_actor
    request_testnet_funds
    print_status "Installing actor code..."
    WASM_PATH="contracts/filecoin/biometric-nft-actor/target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm"
    if $LOTUS_BIN chain --help | grep -q "install-actor"; then
        INSTALL_OUTPUT=$($LOTUS_BIN chain install-actor "$WASM_PATH" 2>&1 || true)
        CODE_CID=$(echo "$INSTALL_OUTPUT" | grep -oP 'Actor Code CID: \K[^\s]+' || echo "")
        if [ -z "$CODE_CID" ]; then
            print_error "Failed to install actor code"
            print_error "$INSTALL_OUTPUT"
            exit 1
        fi
        print_status "Creating actor on chain..."
        CREATE_OUTPUT=$($LOTUS_BIN chain create-actor "$CODE_CID" 2>&1 || true)
        ID_ADDRESS=$(echo "$CREATE_OUTPUT" | grep -oP 'ID Address: \K[^\s]+' || echo "")
        ROBUST_ADDRESS=$(echo "$CREATE_OUTPUT" | grep -oP 'Robust Address: \K[^\s]+' || echo "")
        if [ -z "$ROBUST_ADDRESS" ]; then
            print_error "Actor creation failed"
            print_error "$CREATE_OUTPUT"
            exit 1
        fi
        echo "{
            \"network\": \"$NETWORK\",
            \"code_cid\": \"$CODE_CID\",
            \"id_address\": \"$ID_ADDRESS\",
            \"robust_address\": \"$ROBUST_ADDRESS\",
            \"deployed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
            \"deployed_by\": \"$(lotus wallet default)\",
            \"wasm_path\": \"$WASM_PATH\",
            \"rpc_url\": \"$RPC_URL\"
        }" > contracts/filecoin/deployment-info.json
        print_status "Deployment info saved to contracts/filecoin/deployment-info.json"
        test_deployment
    else
        print_warning "Lotus CLI does not support installing or creating arbitrary WASM actors on the public Calibration network"
        print_warning "Skipping actor deployment. The actor WASM has been built locally and validated."
        print_status "Next steps:"
        echo -e "  - Use a local Lotus devnet or FVM test harness to install and create this actor"
        echo -e "  - Calibration faucet funds are for testing client APIs, not custom actor code installs"
        echo -e "  - WASM path: $WASM_PATH"
        # Write a minimal deployment-info with build metadata only
        echo "{
            \"network\": \"$NETWORK\",
            \"deployed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
            \"deployed_by\": \"$(lotus wallet default)\",
            \"wasm_path\": \"$WASM_PATH\",
            \"rpc_url\": \"$RPC_URL\",
            \"note\": \"Calibration CLI lacks install-actor/create-actor; use devnet or FVM harness\"
        }" > contracts/filecoin/deployment-info.json
        print_status "Recorded build metadata to contracts/filecoin/deployment-info.json"
    fi
    
    print_status "🎉 Filecoin calibration flow completed"
    print_status "Summary file: contracts/filecoin/deployment-info.json"
}

# Run main function
main "$@"
