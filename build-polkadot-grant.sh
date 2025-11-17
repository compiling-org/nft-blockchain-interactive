#!/bin/bash
# Build script for Polkadot/Web3 Grant - Cross-Chain & Soulbound
# Can be run independently from other grants

echo "============================================"
echo "Building Polkadot/Web3 Grant Components"
echo "Cross-Chain Bridge & Soulbound Tokens"
echo "============================================"

# Build Polkadot pallets
echo ""
echo "📦 Building Substrate pallets..."
cd src/polkadot-pallets
cargo build --release

if [ $? -eq 0 ]; then
    echo "✅ Polkadot pallets built successfully"
    echo "📁 Output: target/release/"
else
    echo "❌ Pallet build failed"
    exit 1
fi

cd ../..

# Copy specific documentation to grant repository
echo ""
echo "📄 Copying specific documentation..."
cp POLKADOT_SPECIFIC_README.md ../grant-repositories/polkadot-creative-identity/README.md
cp POLKADOT_SPECIFIC_TECHNICAL_ARCHITECTURE.md ../grant-repositories/polkadot-creative-identity/TECHNICAL_ARCHITECTURE.md  
cp POLKADOT_SPECIFIC_IMPLEMENTATION_REPORT.md ../grant-repositories/polkadot-creative-identity/IMPLEMENTATION_REPORT.md

echo ""
echo "============================================"
echo "✅ Polkadot Grant Build Complete!"
echo "============================================"
echo ""
echo "Deployment files:"
echo "  - Pallets: src/polkadot-pallets/target/release/"
echo "  - Frontend: test-website/index.html (Soulbound & Cross-Chain tabs)"
echo ""
echo "To deploy:"
echo "  1. Set up Substrate node"
echo "  2. Add pallets to runtime"
echo "  3. Deploy to testnet (Rococo/Westend)"
echo "  4. Configure Polkadot.js in frontend"
echo "  5. Serve test-website/ on web server"
echo ""
echo "Note: This grant provides cross-chain functionality for:"
echo "  - Bridging emotional data from Solana to other chains"
echo "  - Soulbound tokens for all ecosystems"
echo "  - Cross-chain NFT interoperability"
echo ""
