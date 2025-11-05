#!/bin/bash
# Package the project for production deployment
# Creates deployable bundles for each grant

echo "============================================"
echo "📦 Packaging for Deployment"
echo "Creating production bundles for all 6 grants"
echo "============================================"

DEPLOY_DIR="deployment-packages"
mkdir -p $DEPLOY_DIR

# Package NEAR Grant
echo ""
echo "📦 Packaging NEAR Grant..."
mkdir -p $DEPLOY_DIR/near-grant
cp -r src/near-wasm $DEPLOY_DIR/near-grant/
cp -r test-website/index.html $DEPLOY_DIR/near-grant/frontend.html
cp test-website/blockchain.js $DEPLOY_DIR/near-grant/
cp build-near-grant.sh $DEPLOY_DIR/near-grant/
echo "✅ NEAR Grant packaged"

# Package Mintbase Grant
echo ""
echo "📦 Packaging Mintbase Grant..."
mkdir -p $DEPLOY_DIR/mintbase-grant
cp -r src/marketplace $DEPLOY_DIR/mintbase-grant/
cp -r marketplace-frontend $DEPLOY_DIR/mintbase-grant/
cp test-website/mintbase-integration.js $DEPLOY_DIR/mintbase-grant/
cp build-mintbase-grant.sh $DEPLOY_DIR/mintbase-grant/
echo "✅ Mintbase Grant packaged"

# Package Solana Grant
echo ""
echo "📦 Packaging Solana Grant..."
mkdir -p $DEPLOY_DIR/solana-grant
cp -r src/solana-client $DEPLOY_DIR/solana-grant/
cp test-website/blockchain.js $DEPLOY_DIR/solana-grant/
cp build-solana-grant.sh $DEPLOY_DIR/solana-grant/
echo "✅ Solana Grant packaged"

# Package Filecoin Grant
echo ""
echo "📦 Packaging Filecoin Grant..."
mkdir -p $DEPLOY_DIR/filecoin-grant
cp -r src/ipfs-integration $DEPLOY_DIR/filecoin-grant/
cp test-website/blockchain.js $DEPLOY_DIR/filecoin-grant/
cp build-filecoin-grant.sh $DEPLOY_DIR/filecoin-grant/
echo "✅ Filecoin Grant packaged"

# Package Rust Grant
echo ""
echo "📦 Packaging Rust Foundation Grant..."
mkdir -p $DEPLOY_DIR/rust-grant
cp -r src/rust-client $DEPLOY_DIR/rust-grant/
cp build-rust-grant.sh $DEPLOY_DIR/rust-grant/
echo "✅ Rust Grant packaged"

# Package Polkadot Grant
echo ""
echo "📦 Packaging Polkadot Grant..."
mkdir -p $DEPLOY_DIR/polkadot-grant
cp -r src/polkadot-pallets $DEPLOY_DIR/polkadot-grant/
cp build-polkadot-grant.sh $DEPLOY_DIR/polkadot-grant/
echo "✅ Polkadot Grant packaged"

# Package complete platform
echo ""
echo "📦 Packaging Complete Platform..."
mkdir -p $DEPLOY_DIR/complete-platform
cp -r test-website $DEPLOY_DIR/complete-platform/
cp -r marketplace-frontend $DEPLOY_DIR/complete-platform/
cp GRANT_MODULES.json $DEPLOY_DIR/complete-platform/
cp README.md $DEPLOY_DIR/complete-platform/
echo "✅ Complete platform packaged"

# Create deployment manifest
cat > $DEPLOY_DIR/DEPLOYMENT_MANIFEST.txt << EOF
Blockchain NFT Interactive - Deployment Packages
================================================

Generated: $(date)

Individual Grant Packages:
--------------------------
📁 near-grant/          - NEAR Fractal Studio & WGSL Studio
📁 mintbase-grant/      - Mintbase Marketplace & DAO
📁 solana-grant/        - Solana Neuroemotive AI & Stream Diffusion
📁 filecoin-grant/      - Filecoin Universal Storage
📁 rust-grant/          - Rust Foundation Core Engine
📁 polkadot-grant/      - Polkadot Cross-Chain & Soulbound

Complete Platform:
------------------
📁 complete-platform/   - All 6 grants unified

Deployment Instructions:
------------------------

Individual Grant:
1. cd deployment-packages/[grant-name]
2. ./build-[grant]-grant.sh
3. Deploy to respective blockchain
4. Update frontend contract addresses

Complete Platform:
1. cd deployment-packages/complete-platform
2. Build all grants (see README.md)
3. Deploy all contracts
4. Serve test-website/ on web server

EOF

echo ""
echo "============================================"
echo "✅ Packaging Complete!"
echo "============================================"
echo ""
echo "📦 Packages created in: $DEPLOY_DIR/"
echo "📄 See: $DEPLOY_DIR/DEPLOYMENT_MANIFEST.txt"
echo ""
echo "Ready for production deployment!"
echo ""
