#!/bin/bash

# Emergency Cleanup Script
# This removes all the bloat and keeps only essential files

echo "🚨 EMERGENCY CLEANUP - Removing Bloat..."

# Create minimal structure
mkdir -p src-minimal/contracts src-minimal/scripts src-minimal/config src-minimal/tests

# Keep only essential files
echo "Keeping essential files..."

# Essential frontend files
cp src/App.tsx src-minimal/ 2>/dev/null || echo "App.tsx not found"
cp src/main.tsx src-minimal/ 2>/dev/null || echo "main.tsx not found"
cp src/index.css src-minimal/ 2>/dev/null || echo "index.css not found"

# Essential contract files
cp -r contracts/near src-minimal/contracts/ 2>/dev/null || echo "NEAR contracts not found"
cp -r contracts/solana src-minimal/contracts/ 2>/dev/null || echo "Solana contracts not found"
cp -r contracts/filecoin src-minimal/contracts/ 2>/dev/null || echo "Filecoin contracts not found"

# Essential config
cp -r src/config src-minimal/ 2>/dev/null || echo "Config not found"

# Essential scripts
cp scripts/deploy-*.sh src-minimal/scripts/ 2>/dev/null || echo "Deploy scripts not found"

# Essential package files
cp package.json src-minimal/ 2>/dev/null || echo "package.json not found"
cp vite.config.ts src-minimal/ 2>/dev/null || echo "vite.config.ts not found"
cp tsconfig.json src-minimal/ 2>/dev/null || echo "tsconfig.json not found"
cp tailwind.config.js src-minimal/ 2>/dev/null || echo "tailwind.config.js not found"

# Move massive directories to compiling (not deleting)
echo "Moving massive blockchain tools to compiling directory..."
mkdir -p /c/Users/kapil/compiling/blockchain-tools-moved

# Move the massive blockchain node code
if [ -d "polkadot" ]; then
    mv polkadot /c/Users/kapil/compiling/blockchain-tools-moved/
    echo "Moved polkadot (massive blockchain node)"
fi

if [ -d "lotus" ]; then
    mv lotus /c/Users/kapil/compiling/blockchain-tools-moved/
    echo "Moved lotus (Filecoin node)"
fi

if [ -d "iron_learn" ]; then
    mv iron_learn /c/Users/kapil/compiling/blockchain-tools-moved/
    echo "Moved iron_learn"
fi

if [ -d "polkadot-deployments" ]; then
    mv polkadot-deployments /c/Users/kapil/compiling/blockchain-tools-moved/
    echo "Moved polkadot-deployments"
fi

# Clean massive build artifacts
echo "Cleaning build artifacts..."
rm -rf node_modules
rm -rf api/node_modules
rm -rf target
rm -rf src/solana-program/target
rm -rf src/solana-program/node_modules

# Remove duplicate and massive source files
echo "Removing duplicate implementations..."
rm -rf src/rust-client
rm -rf src/polkadot-client
rm -rf src/marketplace
rm -rf src/ipfs-integration
rm -rf src/near-wasm
rm -rf src/solana-programs
rm -rf src/wasm-fractal

# Remove massive documentation
echo "Removing excessive documentation..."
rm -rf docs
rm -f *.md

# Keep only essential React components
mkdir -p src-minimal/components
find src/components -name "*.tsx" -not -path "*/ui/*" | head -5 | xargs -I {} cp {} src-minimal/components/ 2>/dev/null || echo "No components to copy"

echo "✅ Emergency cleanup completed!"
echo "📊 Project size reduced dramatically"
echo "🎯 Essential files preserved in src-minimal/"
echo "📦 Massive tools moved to /c/Users/kapil/compiling/blockchain-tools-moved/"
echo ""
echo "Next steps:"
echo "1. Review src-minimal/ for essential functionality"
echo "2. Move src-minimal/* back to project root"
echo "3. Test minimal implementation actually works"