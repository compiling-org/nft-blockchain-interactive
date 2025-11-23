#!/bin/bash
# Build script for Bitte Creative Marketplace grant

echo "Building Bitte Creative Marketplace grant..."

# Build marketplace contracts
cd src/marketplace
echo "Building marketplace contracts..."
cargo build --target wasm32-unknown-unknown --release

cd ../..
echo "✅ Bitte Creative Marketplace build completed!"