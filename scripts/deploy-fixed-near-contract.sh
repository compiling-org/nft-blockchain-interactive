#!/bin/bash

# Fixed NEAR Contract Deployment Script
# Addresses deserialization errors with proper contract structure

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Deploying Fixed NEAR Biometric Soulbound NFT Contract${NC}"

# Configuration
CONTRACT_NAME="biometric-soulbound-fixed"
ACCOUNT_ID="${NEAR_ACCOUNT_ID:-fractal-studio-final.testnet}"
INITIAL_BALANCE="10"

# Check if NEAR CLI is available
if ! command -v near &> /dev/null; then
    echo -e "${RED}❌ NEAR CLI not found. Please install NEAR CLI${NC}"
    exit 1
fi

# Check if account is configured
if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ NEAR_ACCOUNT_ID not set. Please set your NEAR account${NC}"
    echo -e "${YELLOW}Run: export NEAR_ACCOUNT_ID=your-account.testnet${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Configuration:${NC}"
echo -e "  Contract: $CONTRACT_NAME"
echo -e "  Account: $ACCOUNT_ID"
echo -e "  Network: testnet"

# Build the contract
echo -e "${GREEN}🔨 Building contract...${NC}"
cd contracts/near/soulbound-nft

# Clean previous builds
cargo clean

# Build for wasm32 target
echo -e "${GREEN}🎯 Building for wasm32-unknown-unknown...${NC}"
cargo build --target wasm32-unknown-unknown --release

# Check if build was successful
if [ ! -f "target/wasm32-unknown-unknown/release/soulbound_nft.wasm" ]; then
    echo -e "${RED}❌ Contract build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Contract built successfully${NC}"

# Deploy the contract
echo -e "${GREEN}🚀 Deploying contract...${NC}"

# Create subaccount for the contract
SUBACCOUNT_ID="$CONTRACT_NAME.$ACCOUNT_ID"
echo -e "${GREEN}📦 Creating subaccount: $SUBACCOUNT_ID${NC}"

# Create subaccount if it doesn't exist
near create-account "$SUBACCOUNT_ID" --masterAccount "$ACCOUNT_ID" --initialBalance "$INITIAL_BALANCE" || true

# Deploy the contract
echo -e "${GREEN}📤 Deploying WASM to $SUBACCOUNT_ID${NC}"
near deploy "$SUBACCOUNT_ID" \
    --wasmFile target/wasm32-unknown-unknown/release/soulbound_nft.wasm \
    --initFunction new_default_meta \
    --initArgs '{"owner_id": "'$SUBACCOUNT_ID'"}'

# Verify deployment
echo -e "${GREEN}🔍 Verifying deployment...${NC}"
sleep 5

# Test contract view methods
echo -e "${GREEN}🧪 Testing contract view methods...${NC}"

# Test nft_metadata
echo -e "${YELLOW}Testing nft_metadata...${NC}"
near view "$SUBACCOUNT_ID" nft_metadata

# Test with sample emotion data
echo -e "${GREEN}🎭 Testing biometric NFT minting...${NC}"

# Create sample emotion data
EMOTION_DATA='{
    "primary_emotion": "Happy",
    "confidence": 0.85,
    "secondary_emotions": [["Excited", 0.7], ["Joyful", 0.6]],
    "arousal": 0.6,
    "valence": 0.8
}'

# Test minting (this will fail if contract has issues)
echo -e "${YELLOW}Testing nft_mint with biometric data...${NC}"
near call "$SUBACCOUNT_ID" nft_mint \
    '{"token_id": "test_token_1", "receiver_id": "'$ACCOUNT_ID'", "emotion_data": '$EMOTION_DATA', "quality_score": 0.8, "biometric_hash": "test_hash_123456"}' \
    --accountId "$ACCOUNT_ID" \
    --gas 300000000000000 \
    --deposit 0.1

# Test verification
echo -e "${YELLOW}Testing biometric verification...${NC}"
near view "$SUBACCOUNT_ID" verify_biometric '{"token_id": "test_token_1", "biometric_hash": "test_hash_123456"}'

# Test token retrieval
echo -e "${YELLOW}Testing token retrieval...${NC}"
near view "$SUBACCOUNT_ID" nft_token '{"token_id": "test_token_1"}'

# Test owner tokens
echo -e "${YELLOW}Testing owner tokens...${NC}"
near view "$SUBACCOUNT_ID" nft_tokens_for_owner '{"account_id": "'$ACCOUNT_ID'"}'

echo -e "${GREEN}✅ Contract deployment and testing completed!${NC}"
echo -e "${GREEN}📋 Contract deployed to: $SUBACCOUNT_ID${NC}"
echo -e "${GREEN}🔗 View on NEAR Explorer: https://explorer.testnet.near.org/accounts/$SUBACCOUNT_ID${NC}"

# Save deployment info
echo -e "${GREEN}💾 Saving deployment information...${NC}"
cat > "../../../deployed-contracts.txt" << EOF
NEAR Contract Deployment - $(date)
Contract: $SUBACCOUNT_ID
Network: testnet
Deployer: $ACCOUNT_ID
WASM: target/wasm32-unknown-unknown/release/soulbound_nft.wasm

Test Commands:
near view $SUBACCOUNT_ID nft_metadata
near view $SUBACCOUNT_ID nft_token '{"token_id": "test_token_1"}'
near view $SUBACCOUNT_ID verify_biometric '{"token_id": "test_token_1", "biometric_hash": "test_hash_123456"}'
near view $SUBACCOUNT_ID nft_tokens_for_owner '{"account_id": "$ACCOUNT_ID"}'
EOF

echo -e "${GREEN}🎉 Deployment complete! Check deployed-contracts.txt for details${NC}"