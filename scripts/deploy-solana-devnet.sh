#!/bin/bash

# Solana Biometric NFT Deployment Script
# Deploys the Anchor program to devnet

echo "🚀 Deploying Solana Biometric NFT Program..."

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor not found. Installing..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

# Set Solana config to devnet
echo "⚙️  Setting Solana config to devnet..."
solana config set --url devnet

# Check wallet balance
echo "💰 Checking wallet balance..."
solana balance

# Build the program
echo "🔨 Building Anchor program..."
cd contracts/solana/biometric-nft
anchor build

# Get the program ID from the keypair
echo "📋 Getting program ID..."
PROGRAM_ID=$(solana address -k target/deploy/biometric_nft-keypair.json)
echo "Program ID: $PROGRAM_ID"

# Deploy to devnet
echo "🎯 Deploying to devnet..."
solana program deploy target/deploy/biometric_nft.so --url devnet

# Update the frontend with the real program ID
echo "📝 Updating frontend with program ID: $PROGRAM_ID"
cd ../../../

# Replace the placeholder program ID in the frontend
sed -i "s/BiometricNftProgram1111111111111111111111/$PROGRAM_ID/g" src/utils/solana-client.ts
sed -i "s/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS/$PROGRAM_ID/g" contracts/solana/biometric-nft/programs/biometric-nft/src/lib.rs

echo "✅ Deployment completed!"
echo "Program ID: $PROGRAM_ID"
echo "🌐 Program deployed to Solana devnet"
echo "📱 Frontend updated with real program ID"