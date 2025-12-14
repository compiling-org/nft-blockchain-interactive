#!/bin/bash

# PROPER Cleanup - Move only blockchain tools, keep project components

echo "🔧 PROPER CLEANUP - Moving only blockchain tools to compiling..."

# Create proper blockchain tools directory in compiling
mkdir -p /c/Users/kapil/compiling/blockchain-tools

# Move ONLY the actual blockchain node/source code (not project components)
echo "Moving actual blockchain tools..."

# Move Polkadot full node source code (this is a blockchain tool, not project component)
if [ -d "polkadot" ] && [ -f "polkadot/Cargo.toml" ] && grep -q "polkadot" polkadot/Cargo.toml 2>/dev/null; then
    echo "Moving Polkadot blockchain node to compiling..."
    mv polkadot /c/Users/kapil/compiling/blockchain-tools/
fi

# Move Lotus Filecoin node (this is a blockchain tool, not project component)  
if [ -d "lotus" ] && [ -f "lotus/build" ] 2>/dev/null; then
    echo "Moving Lotus Filecoin node to compiling..."
    mv lotus /c/Users/kapil/compiling/blockchain-tools/
fi

# Move Iron Learn (this appears to be a blockchain tool)
if [ -d "iron_learn" ]; then
    echo "Moving Iron Learn to compiling..."
    mv iron_learn /c/Users/kapil/compiling/blockchain-tools/
fi

# Move polkadot-deployments (this appears to be blockchain deployment tools)
if [ -d "polkadot-deployments" ]; then
    echo "Moving Polkadot deployments to compiling..."
    mv polkadot-deployments /c/Users/kapil/compiling/blockchain-tools/
fi

# Clean up build artifacts from project (these can be rebuilt)
echo "Cleaning build artifacts..."
rm -rf node_modules
rm -rf api/node_modules 2>/dev/null || true
rm -rf target 2>/dev/null || true
rm -rf contracts/*/target 2>/dev/null || true

# Show what we moved
echo ""
echo "📋 MOVED TO COMPILING/BLOCKCHAIN-TOOLS:"
ls -la /c/Users/kapil/compiling/blockchain-tools/ 2>/dev/null || echo "Nothing moved yet"

echo ""
echo "✅ KEPT IN PROJECT (essential components):"
echo "- src/ (frontend components)"
echo "- contracts/ (smart contracts)"  
echo "- scripts/ (deployment scripts)"
echo "- config files"
echo ""
echo "🎯 Project is now clean with only essential blockchain functionality!"