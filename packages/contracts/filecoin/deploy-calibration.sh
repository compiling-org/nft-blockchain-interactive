#!/bin/bash
exec > deployment_log.txt 2>&1

# Filecoin Calibration Testnet Deployment Script
# This script automates deployment to Filecoin Calibration testnet

set -e

echo "🚀 Filecoin Biometric NFT Actor Deployment Script"
echo "=================================================="
```
LOTUS_BIN_PREFIX="docker compose -f filecoin-fvm-localnet/docker-compose.yaml exec -T lotus env LOTUS_API_INFO=ws://lotus:1235/rpc/v0"
```
# Configuration
NETWORK="local-devnet"
RPC_URL="ws://lotus:1235/rpc/v0"
CHAIN_ID=31415926

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
    
    if ! $LOTUS_BIN_PREFIX lotus --version &> /dev/null; then
        print_error "Docker Compose not found. Please install Docker Compose."
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
    
    cd packages/contracts/filecoin/biometric-nft-actor
    
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
    WALLET_ADDR="$($LOTUS_BIN_PREFIX lotus wallet default)"
    
    if [ -z "$WALLET_ADDR" ]; then
        print_warning "No default wallet found. Creating new wallet..."
        "$LOTUS_BIN_PREFIX" lotus wallet new
        WALLET_ADDR="$($LOTUS_BIN_PREFIX lotus wallet default)"
    fi
    
    print_status "Using wallet: $WALLET_ADDR"
    
    # Check current balance
    BALANCE="$($LOTUS_BIN_PREFIX lotus wallet balance $WALLET_ADDR)"
    print_status "Current balance: $BALANCE"
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
    CREATION_OUTPUT="$("$LOTUS_BIN_PREFIX" lotus chain create-actor "$WASM_PATH" 2>&1)"
    
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
        STATE_OUTPUT="$("$LOTUS_BIN_PREFIX" lotus chain read-obj "$ACTOR_ID")"
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
    build_actor
    request_testnet_funds
    print_status "Installing actor code..."
    WASM_PATH="contracts/filecoin/biometric-nft-actor/target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm"
    if "$LOTUS_BIN_PREFIX" lotus chain --help | grep -q "install-actor"; then
        INSTALL_OUTPUT="$("$LOTUS_BIN_PREFIX" lotus chain install-actor "$WASM_PATH" 2>&1 || true)"
        CODE_CID=$(echo "$INSTALL_OUTPUT" | grep -oP 'Actor Code CID: \K[^\s]+' || echo "")
        if [ -z "$CODE_CID" ]; then
            print_error "Failed to install actor code"
            print_error "$INSTALL_OUTPUT"
            exit 1
        fi
        print_status "Creating actor on chain..."
        CREATE_OUTPUT="$("$LOTUS_BIN_PREFIX" lotus chain create-actor "$CODE_CID" 2>&1 || true)"
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
    fi
    
    print_status "🎉 Filecoin calibration flow completed"
    print_status "Summary file: contracts/filecoin/deployment-info.json"
}

# Run main function
main "$@"
