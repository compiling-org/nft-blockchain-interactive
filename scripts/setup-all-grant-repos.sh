#!/bin/bash
# Master script to set up all grant repositories

echo "============================================"
echo "Setting Up All Grant Repositories"
echo "============================================"

# Make all extraction scripts executable
chmod +x ../blockchain-nft-interactive/scripts/extract-*.sh

# Extract NEAR grant
echo ""
echo "============================================"
echo "Extracting NEAR Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-near-grant.sh

# Extract Solana grant
echo ""
echo "============================================"
echo "Extracting Solana Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-solana-grant.sh

# Extract Filecoin grant
echo ""
echo "============================================"
echo "Extracting Filecoin Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-filecoin-grant.sh

# Extract Mintbase grant
echo ""
echo "============================================"
echo "Extracting Mintbase Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-mintbase-grant.sh

# Extract Rust grant
echo ""
echo "============================================"
echo "Extracting Rust Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-rust-grant.sh

# Extract Polkadot grant
echo ""
echo "============================================"
echo "Extracting Polkadot Grant..."
echo "============================================"
../blockchain-nft-interactive/scripts/extract-polkadot-grant.sh

# List all created repositories
echo ""
echo "============================================"
echo "All Grant Repositories Created:"
echo "============================================"
ls -la ../grant-repositories

echo ""
echo "============================================"
echo "Repository Setup Summary"
echo "============================================"
echo "1. near-creative-engine - NEAR Foundation Grant"
echo "2. solana-emotional-metadata - Solana Foundation Grant" 
echo "3. filecoin-creative-storage - Filecoin Foundation Grant"
echo "4. mintbase-creative-marketplace - Mintbase Foundation Grant"
echo "5. rust-emotional-engine - Rust Foundation Grant"
echo "6. polkadot-creative-identity - Web3 Foundation Grant"

echo ""
echo "Next steps:"
echo "1. Create GitHub repositories for each grant"
echo "2. Initialize each repository with git init"
echo "3. Add remotes and push initial commits"
echo "4. Set up CI/CD pipelines"
echo "5. Update documentation in each repository"
echo ""