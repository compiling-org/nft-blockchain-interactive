#!/bin/bash
# Build script for Mintbase Grant - Marketplace & DAO
# Can be run independently from other grants

echo "============================================"
echo "Building Mintbase Grant Components"
echo "Marketplace & DAO Governance"
echo "============================================"

# Build Mintbase marketplace contracts
echo ""
echo "📦 Building Mintbase marketplace contracts..."
cd src/marketplace
cargo build --target wasm32-unknown-unknown --release

if [ $? -eq 0 ]; then
    echo "✅ Marketplace contracts built successfully"
    echo "📁 Output: target/wasm32-unknown-unknown/release/"
else
    echo "❌ Marketplace contract build failed"
    exit 1
fi

cd ../..

# Copy specific documentation to grant repository
echo ""
echo "📄 Copying specific documentation..."
cp MINTBASE_SPECIFIC_README.md ../grant-repositories/mintbase-creative-marketplace/README.md
cp MINTBASE_SPECIFIC_TECHNICAL_ARCHITECTURE.md ../grant-repositories/mintbase-creative-marketplace/TECHNICAL_ARCHITECTURE.md  
cp MINTBASE_SPECIFIC_IMPLEMENTATION_REPORT.md ../grant-repositories/mintbase-creative-marketplace/IMPLEMENTATION_REPORT.md

echo ""
echo "============================================"
echo "✅ Mintbase Grant Build Complete!"
echo "============================================"
echo ""
echo "Deployment files:"
echo "  - Smart contracts: src/marketplace/target/wasm32-unknown-unknown/release/"
echo "  - Frontend: marketplace-frontend/index.html"
echo "  - Integration: test-website/mintbase-integration.js"
echo ""
echo "To deploy:"
echo "  1. Deploy contracts to NEAR/Mintbase testnet"
echo "  2. Update contract IDs in test-website/mintbase-integration.js"
echo "  3. Install Mintbase JS SDK: npm install @mintbase-js/sdk"
echo "  4. Serve marketplace-frontend/ on web server"
echo ""
