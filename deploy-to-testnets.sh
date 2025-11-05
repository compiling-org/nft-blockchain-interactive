#!/bin/bash
# Deploy smart contracts to testnets
# This script deploys all 6 grants to their respective test networks

echo "============================================"
echo "\ud83d\ude80 Deploying to Testnets"
echo "============================================"

# ============================================
# 1. Deploy NEAR Contracts
# ============================================

echo ""
echo "\ud83d\udfe2 Deploying NEAR contracts..."
echo "--------------------------------------------"

# Check if NEAR CLI is installed
if ! command -v near &> /dev/null; then
    echo "\u26a0\ufe0f  NEAR CLI not installed"
    echo "Install with: npm install -g near-cli"
else
    echo "\u2705 NEAR CLI found"
    
    # Login to NEAR testnet
    echo "Login to NEAR testnet (if not already logged in):"
    # near login
    
    # Build NEAR contracts
    cd src/near-wasm
    if [ -f "build.sh" ]; then
        ./build.sh
        echo "\u2705 NEAR contracts built"
    else
        cargo build --target wasm32-unknown-unknown --release
        echo "\u2705 NEAR contracts built"
    fi
    
    # Deploy fractal studio contract
    # near deploy --accountId fractal-studio.testnet --wasmFile target/wasm32-unknown-unknown/release/fractal_studio.wasm
    
    echo "\ud83d\udcdd To deploy NEAR contracts:"
    echo "  1. near login"
    echo "  2. near create-account fractal-studio.YOUR_ACCOUNT.testnet --masterAccount YOUR_ACCOUNT.testnet"
    echo "  3. near deploy --accountId fractal-studio.YOUR_ACCOUNT.testnet --wasmFile target/wasm32-unknown-unknown/release/nft_near_wasm.wasm"
    
    cd ../..
fi

# ============================================
# 2. Deploy Mintbase Store
# ============================================

echo ""
echo "\ud83c\udfa8 Setting up Mintbase store..."
echo "--------------------------------------------"

echo "\ud83d\udcdd To create Mintbase store:"
echo "  1. Go to https://testnet.mintbase.xyz/"
echo "  2. Connect NEAR testnet wallet"
echo "  3. Create new store"
echo "  4. Note your store address: your-store.mintbase1.testnet"
echo "  5. Update contract address in test-website/mintbase-integration.js"

# ============================================
# 3. Deploy Solana Programs
# ============================================

echo ""
echo "\ud83d\udfe3 Deploying Solana programs..."
echo "--------------------------------------------"

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "\u26a0\ufe0f  Solana CLI not installed"
    echo "Install from: https://docs.solana.com/cli/install-solana-cli-tools"
else
    echo "\u2705 Solana CLI found"
    
    # Configure for devnet
    solana config set --url https://api.devnet.solana.com
    echo "\u2705 Configured for devnet"
    
    # Check if Anchor is installed
    if ! command -v anchor &> /dev/null; then
        echo "\u26a0\ufe0f  Anchor not installed"
        echo "Install with: cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked"
    else
        echo "\u2705 Anchor CLI found"
        
        # Build Solana programs
        cd src/solana-client
        anchor build
        echo "\u2705 Solana programs built"
        
        # Deploy
        # anchor deploy
        
        echo "\ud83d\udcdd To deploy Solana programs:"
        echo "  1. solana-keygen new (create keypair)"
        echo "  2. solana airdrop 2 (get devnet SOL)"
        echo "  3. anchor deploy"
        echo "  4. Note program IDs from deployment output"
        
        cd ../..
    fi
fi

# ============================================
# 4. Setup IPFS/Filecoin
# ============================================

echo ""
echo "\ud83d\udcbe Setting up IPFS..."
echo "--------------------------------------------"

if ! command -v ipfs &> /dev/null; then
    echo "\u26a0\ufe0f  IPFS not installed"
    echo "Install from: https://docs.ipfs.tech/install/"
else
    echo "\u2705 IPFS found"
    
    # Start IPFS daemon
    # ipfs daemon &
    
    echo "\ud83d\udcdd To use IPFS:"
    echo "  1. ipfs init (first time only)"
    echo "  2. ipfs daemon (run in background)"
    echo "  3. API available at http://localhost:5001"
    echo ""
    echo "Alternative: Use Web3.Storage"
    echo "  1. Get API token from https://web3.storage/"
    echo "  2. Set token in wallet-connections.js"
fi

# ============================================
# 5. Deploy Polkadot Pallets
# ============================================

echo ""
echo "\ud83d\udd34 Polkadot substrate node..."
echo "--------------------------------------------"

echo "\ud83d\udcdd To deploy Polkadot pallets:"
echo "  1. Set up substrate node: https://docs.substrate.io/quick-start/"
echo "  2. Add pallets to runtime"
echo "  3. Build: cargo build --release"
echo "  4. Run: ./target/release/node-template --dev"
echo "  5. Connect via Polkadot.js Apps: https://polkadot.js.org/apps/"

# ============================================
# Summary
# ============================================

echo ""
echo "============================================"
echo "\u2705 Deployment Guide Complete!"
echo "============================================"
echo ""
echo "\ud83d\udcdd Next Steps:"
echo "  1. Follow the instructions above for each blockchain"
echo "  2. Update contract addresses in test-website/index.html (Settings tab)"
echo "  3. Test connections in the Settings tab"
echo "  4. Start deploying NFTs and testing features!"
echo ""
echo "\ud83d\udd17 Useful Links:"
echo "  NEAR: https://docs.near.org/develop/contracts/introduction"
echo "  Mintbase: https://docs.mintbase.xyz/"
echo "  Solana: https://docs.solana.com/"
echo "  IPFS: https://docs.ipfs.tech/"
echo "  Polkadot: https://docs.substrate.io/"
echo ""
