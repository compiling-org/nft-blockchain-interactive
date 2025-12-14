#!/bin/bash

# Solana Biometric NFT Program Deployment Script
# Deploys the Anchor program to Solana devnet

set -e

echo "🚀 Deploying Solana Biometric NFT Program..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROGRAM_NAME="biometric-nft"
CLUSTER="devnet"
WALLET_PATH="~/.config/solana/id.json"

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}Error: Anchor is not installed${NC}"
    echo "Please install Anchor: https://project-serum.github.io/anchor/getting-started/installation.html"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI is not installed${NC}"
    echo "Please install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo -e "${RED}Error: Rust is not installed${NC}"
    echo "Please install Rust: https://rustup.rs/"
    exit 1
fi

echo -e "${YELLOW}Building Solana program...${NC}"
cd src/solana-programs/biometric-nft

# Build the program
echo "Compiling Anchor program..."
anchor build

# Check if build was successful
if [ ! -f "target/idl/biometric_nft.json" ]; then
    echo -e "${RED}Error: Program compilation failed - IDL not found${NC}"
    exit 1
fi

if [ ! -f "target/deploy/biometric_nft.so" ]; then
    echo -e "${RED}Error: Program compilation failed - binary not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Program built successfully!${NC}"

# Set Solana cluster
echo -e "${YELLOW}Setting Solana cluster to ${CLUSTER}...${NC}"
solana config set --url https://api.${CLUSTER}.solana.com

# Check wallet balance
echo -e "${YELLOW}Checking wallet balance...${NC}"
solana balance

# Deploy to devnet
echo -e "${YELLOW}Deploying to Solana ${CLUSTER}...${NC}"
anchor deploy

# Get program ID
echo -e "${YELLOW}Getting program ID...${NC}"
PROGRAM_ID=$(solana program show --output json | jq -r '.programId')

echo -e "${GREEN}✅ Program deployed successfully!${NC}"
echo -e "${GREEN}Program ID: ${PROGRAM_ID}${NC}"

# Update the program ID in the client
echo -e "${YELLOW}Updating program ID in client...${NC}"
sed -i.bak "s/BiometricNftProgram1111111111111111111111/${PROGRAM_ID}/g" src/utils/solana-client.ts
sed -i.bak "s/BiometricNftProgram1111111111111111111111/${PROGRAM_ID}/g" src/solana-programs/biometric-nft/programs/biometric-nft/src/lib.rs
sed -i.bak "s/BiometricNftProgram1111111111111111111111/${PROGRAM_ID}/g" src/solana-programs/biometric-nft/Anchor.toml

echo -e "${GREEN}✅ Program ID updated in client code!${NC}"

# Test the program
echo -e "${YELLOW}Testing program functionality...${NC}"

# Run tests
anchor test

echo -e "${GREEN}✅ Program testing completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update PROGRAM_ID in your frontend configuration"
echo "2. Test with real biometric data and AI inference"
echo "3. Deploy to mainnet when ready"

# Save program ID for frontend
echo ${PROGRAM_ID} > ../../../src/config/solana-program-id.txt

echo -e "${GREEN}🎉 Solana Biometric NFT deployment completed!${NC}"