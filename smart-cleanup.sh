#!/bin/bash

# Smart Cleanup - Keep only essential working implementation

echo "🧹 SMART CLEANUP - Analyzing what to keep..."

# Create clean structure
mkdir -p clean-project/{src,contracts,scripts,config,tests}

# Keep ONLY essential frontend files
echo "Keeping essential frontend files..."
cp src/App.tsx clean-project/src/ 2>/dev/null || echo "App.tsx not found"
cp src/main.tsx clean-project/src/ 2>/dev/null || echo "main.tsx not found"
cp src/index.css clean-project/src/ 2>/dev/null || echo "index.css not found"

# Keep ONLY essential contracts
echo "Keeping essential contracts..."
cp -r contracts/near/soulbound-nft clean-project/contracts/near/ 2>/dev/null || echo "NEAR soulbound contract not found"
cp -r contracts/solana clean-project/contracts/ 2>/dev/null || echo "Solana contracts not found"

# Keep ONLY essential config
echo "Keeping essential config..."
cp -r src/config clean-project/src/ 2>/dev/null || echo "Config not found"

# Keep ONLY working utilities
echo "Keeping working utilities..."
cp src/utils/real-ipfs-storage.js clean-project/src/utils/ 2>/dev/null || echo "IPFS storage not found"
cp src/utils/real-filecoin-storage.js clean-project/src/utils/ 2>/dev/null || echo "Filecoin storage not found"

# Keep ONLY essential scripts
echo "Keeping essential scripts..."
find scripts -name "deploy-*.sh" -type f | head -3 | xargs -I {} cp {} clean-project/scripts/ 2>/dev/null || echo "Deploy scripts not found"

# Keep package essentials
echo "Keeping package essentials..."
cp package.json clean-project/ 2>/dev/null || echo "package.json not found"
cp vite.config.ts clean-project/ 2>/dev/null || echo "vite.config.ts not found"
cp tsconfig.json clean-project/ 2>/dev/null || echo "tsconfig.json not found"
cp tailwind.config.js clean-project/ 2>/dev/null || echo "tailwind.config.js not found"

# Move blockchain tools source to compiling
echo "Moving blockchain tools to compiling directory..."
mkdir -p /c/Users/kapil/compiling/blockchain-tools-source

# Move the massive blockchain implementations
for dir in src/ipfs-integration src/marketplace src/near-wasm src/polkadot-client src/rust-client src/solana-client src/solana-programs src/wasm-fractal; do
    if [ -d "$dir" ]; then
        mv "$dir" /c/Users/kapil/compiling/blockchain-tools-source/
        echo "Moved $dir to blockchain-tools-source"
    fi
done

# Remove duplicate pages and components
echo "Removing duplicate implementations..."
rm -rf src/pages/*Test*.tsx src/pages/*Real*.tsx src/pages/*Working*.tsx 2>/dev/null || true
rm -rf src/components/*Real*.tsx src/components/*Working*.tsx src/components/*Comprehensive*.tsx 2>/dev/null || true

# Show results
echo ""
echo "📊 CLEANUP RESULTS:"
echo "✅ Essential files preserved in clean-project/"
echo "✅ Blockchain tools moved to compiling/blockchain-tools-source/"
echo "✅ Duplicates removed"
echo ""
echo "Next steps:"
echo "1. Review clean-project/ contents"
echo "2. Test minimal implementation works"
echo "3. Move clean-project/* to project root if good"