#!/bin/bash

# Manual NEAR Testnet Deployment Script
# Use this after creating a testnet account manually

set -e

echo "🚀 Manual NEAR Testnet Deployment Setup..."

# Configuration - UPDATE THIS WITH YOUR CREATED ACCOUNT
CONTRACT_NAME="biometric-soulbound-nft"
DEPLOYER_ACCOUNT="biometric-deployer.testnet"  # Change this to your created account
TIMESTAMP=$(date +%s)
SUBACCOUNT_NAME="${CONTRACT_NAME}-${TIMESTAMP}"

echo "📋 Deployment Configuration:"
echo "  Deployer Account: $DEPLOYER_ACCOUNT"
echo "  Contract Subaccount: $SUBACCOUNT_NAME.$DEPLOYER_ACCOUNT"
echo "  Network: testnet"

# Build the contract first
echo "🔨 Building NEAR Contract..."
cd contracts/near/soulbound-nft

# Clean and build
cargo clean
cargo build --target wasm32-unknown-unknown --release

# Verify build
WASM_PATH="target/wasm32-unknown-unknown/release/biometric_soulbound_nft.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo "❌ Contract compilation failed!"
    exit 1
fi

CONTRACT_SIZE=$(wc -c < "$WASM_PATH")
echo "✅ Contract built successfully! WASM size: $CONTRACT_SIZE bytes"

cd ../../../

echo "📝 Deployment Commands:"
echo ""
echo "# 1. Create subaccount (run this first):"
echo "near create-account $SUBACCOUNT_NAME.$DEPLOYER_ACCOUNT \\"
echo "    --masterAccount $DEPLOYER_ACCOUNT \\"
echo "    --initialBalance 10"
echo ""
echo "# 2. Deploy contract:"
echo "near deploy $SUBACCOUNT_NAME.$DEPLOYER_ACCOUNT \\"
echo "    $WASM_PATH \\"
echo "    --accountId $DEPLOYER_ACCOUNT \\"
echo "    --initFunction new \\"
echo "    --initArgs '{\"owner_id\": \"'$DEPLOYER_ACCOUNT'\", \"metadata\": {\"spec\": \"nft-1.0.0\", \"name\": \"Biometric Soulbound NFT\", \"symbol\": \"BSNFT\", \"icon\": \"https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco\", \"base_uri\": \"https://ipfs.io/ipfs/\"}}' \\"
echo "    --gas 300000000000000"
echo ""
echo "# 3. Test the contract:"
echo "near view $SUBACCOUNT_NAME.$DEPLOYER_ACCOUNT nft_metadata"
echo ""
echo "🎯 Steps:"
echo "1. Go to https://wallet.testnet.near.org/create"
echo "2. Create account (suggested: biometric-deployer.testnet)"
echo "3. Save the account name above"
echo "4. Run the commands above with your account name"
echo ""
echo "💡 After account creation, you'll get testnet NEAR tokens automatically"
echo "💡 Then you can deploy using the commands above"