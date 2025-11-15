#!/bin/bash
# Script to set up the remaining 3 grant repositories

echo "============================================"
echo "Setting Up Remaining Grant Repositories"
echo "============================================"

# Make extraction scripts executable
chmod +x ../blockchain-nft-interactive/scripts/extract-mintbase-grant.sh
chmod +x ../blockchain-nft-interactive/scripts/extract-rust-grant.sh
chmod +x ../blockchain-nft-interactive/scripts/extract-polkadot-grant.sh

# Extract Mintbase grant (only if it doesn't exist)
if [ ! -d "../grant-repositories/mintbase-creative-marketplace" ]; then
    echo ""
    echo "============================================"
    echo "Extracting Mintbase Grant..."
    echo "============================================"
    ../blockchain-nft-interactive/scripts/extract-mintbase-grant.sh
else
    echo ""
    echo "✅ Mintbase grant repository already exists, skipping..."
fi

# Extract Rust grant (only if it doesn't exist)
if [ ! -d "../grant-repositories/rust-emotional-engine" ]; then
    echo ""
    echo "============================================"
    echo "Extracting Rust Grant..."
    echo "============================================"
    ../blockchain-nft-interactive/scripts/extract-rust-grant.sh
else
    echo ""
    echo "✅ Rust grant repository already exists, skipping..."
fi

# Extract Polkadot grant (only if it doesn't exist)
if [ ! -d "../grant-repositories/polkadot-creative-identity" ]; then
    echo ""
    echo "============================================"
    echo "Extracting Polkadot Grant..."
    echo "============================================"
    ../blockchain-nft-interactive/scripts/extract-polkadot-grant.sh
else
    echo ""
    echo "✅ Polkadot grant repository already exists, skipping..."
fi

# List all repositories
echo ""
echo "============================================"
echo "All Grant Repositories:"
echo "============================================"
ls -la ../grant-repositories

echo ""
echo "============================================"
echo "Repository Setup Summary"
echo "============================================"
echo "1. near-creative-engine - NEAR Foundation Grant (already exists)"
echo "2. solana-emotional-metadata - Solana Foundation Grant (already exists)" 
echo "3. filecoin-creative-storage - Filecoin Foundation Grant (already exists)"
echo "4. mintbase-creative-marketplace - Mintbase Foundation Grant"
echo "5. rust-emotional-engine - Rust Foundation Grant"
echo "6. polkadot-creative-identity - Web3 Foundation Grant"

echo ""
echo "Next steps:"
echo "1. Create GitHub repositories for the new grants (4-6)"
echo "2. Initialize each new repository with git init"
echo "3. Add remotes and push initial commits"
echo "4. Continue working in main blockchain-nft-interactive project"
echo "5. Extract and commit to individual repos when needed"
echo ""