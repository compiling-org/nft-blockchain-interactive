#!/bin/bash
# Build script for Filecoin Grant - Universal Storage
# Can be run independently from other grants
# Note: Used by all other grants as storage layer

echo "============================================"
echo "Building Filecoin Grant Components"
echo "Universal IPFS/Filecoin Storage"
echo "============================================"

echo ""
echo "📦 Building IPFS integration library..."
cd src/ipfs-integration
cargo build --release

if [ $? -eq 0 ]; then
    echo "✅ IPFS library built successfully"
    echo "📁 Output: target/release/"
else
    echo "❌ IPFS library build failed"
    exit 1
fi

# Build WASM for browser
echo ""
echo "📦 Building WASM for browser..."
wasm-pack build --target web --out-dir ../../test-website/wasm-ipfs

if [ $? -eq 0 ]; then
    echo "✅ Browser WASM built successfully"
    echo "📁 Output: test-website/wasm-ipfs/"
else
    echo "⚠️  Browser WASM build failed (optional)"
fi

cd ../..

echo ""
echo "============================================"
echo "✅ Filecoin Grant Build Complete!"
echo "============================================"
echo ""
echo "Deployment files:"
echo "  - Library: src/ipfs-integration/target/release/"
echo "  - Frontend: test-website/blockchain.js (IPFS functions)"
echo ""
echo "To deploy:"
echo "  1. Set up IPFS node or use Web3.Storage/NFT.Storage"
echo "  2. Configure API keys in blockchain.js"
echo "  3. Pin important data to Filecoin"
echo ""
echo "Note: This storage layer is used by:"
echo "  - NEAR Grant (fractal sessions)"
echo "  - Mintbase Grant (NFT metadata)"
echo "  - Solana Grant (emotional data)"
echo ""
