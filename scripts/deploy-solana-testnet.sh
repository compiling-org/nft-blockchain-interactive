#!/bin/bash

# Solana Program Deployment with Phantom Wallet Integration
# Works with existing Phantom wallet setup

set -e

echo "🚀 Solana Program Deployment with Phantom Wallet"
echo "==============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Setting up Solana environment...${NC}"

# Set Solana to testnet (safer for testing)
echo "Setting Solana CLI to testnet..."
solana config set --url https://api.testnet.solana.com

# Check current configuration
echo -e "${BLUE}🔍 Current Solana Configuration:${NC}"
solana config get

# Check balance
echo -e "${BLUE}💰 Checking wallet balance...${NC}"
solana balance || echo -e "${YELLOW}⚠️  No balance found - will need airdrop${NC}"

echo -e "${BLUE}🔨 Building Solana Program...${NC}"
cd contracts/solana/biometric-nft

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the program
echo "Building program with Anchor..."
anchor build

# Find the compiled program
echo -e "${BLUE}📦 Finding compiled program...${NC}"
PROGRAM_SO=$(find target/deploy -name "*.so" | head -1)
if [ -z "$PROGRAM_SO" ]; then
    echo -e "${RED}❌ No compiled program found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Program built: $PROGRAM_SO${NC}"

# Get current program ID from lib.rs
echo -e "${BLUE}🔑 Current Program ID from lib.rs:${NC}"
grep "declare_id!" programs/biometric-nft/src/lib.rs

# Deploy to testnet
echo -e "${BLUE}🚀 Deploying to testnet...${NC}"
echo "This will create a new program ID"

# Request airdrop if needed
CURRENT_BALANCE=$(solana balance | grep -o '[0-9]*' | head -1)
if [ "$CURRENT_BALANCE" -lt 2 ]; then
    echo "Requesting airdrop..."
    solana airdrop 2
fi

# Deploy the program
echo "Deploying program..."
solana program deploy $PROGRAM_SO --url testnet

# Get the new program ID
NEW_PROGRAM_ID=$(solana program show $(solana-keygen pubkey) --url testnet | grep "Program Id" | awk '{print $3}')
if [ -n "$NEW_PROGRAM_ID" ]; then
    echo -e "${GREEN}✅ Program deployed successfully!${NC}"
    echo "New Program ID: $NEW_PROGRAM_ID"
    
    # Update the program ID in the source code
    echo "Updating program ID in lib.rs..."
    sed -i "s/declare_id!(\"[^\"]*\")/declare_id!(\"$NEW_PROGRAM_ID\")/" programs/biometric-nft/src/lib.rs
    
    # Rebuild with new ID
    echo "Rebuilding with new program ID..."
    anchor build
    
    # Update client code
    echo "Updating client code..."
    cd ../../../
    sed -i "s/\"address\": \"[^\"]*\"/\"address\": \"$NEW_PROGRAM_ID\"/" src/utils/solana-client.ts
    sed -i "s/\"address\": \"[^\"]*\"/\"address\": \"$NEW_PROGRAM_ID\"/" contracts/solana/biometric-nft/idl.json
    
    echo -e "${GREEN}✅ All files updated with new program ID: $NEW_PROGRAM_ID${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${BLUE}🧪 Testing deployment...${NC}"
solana program show $NEW_PROGRAM_ID --url testnet

echo -e "${GREEN}🎉 Solana program deployment complete!${NC}"
echo "Program ID: $NEW_PROGRAM_ID"
echo "Network: testnet"
echo "Update your frontend with the new program ID"