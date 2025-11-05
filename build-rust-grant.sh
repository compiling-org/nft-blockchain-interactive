#!/bin/bash
# Build script for Rust Foundation Grant - NUWE Stripped
# Core library used by other grants
# Can be run independently

echo "============================================"
echo "Building Rust Foundation Grant"
echo "NUWE Stripped - Core Creative Engine"
echo "============================================"

echo ""
echo "📦 Building core Rust library..."
cd src/rust-client
cargo build --release

if [ $? -eq 0 ]; then
    echo "✅ Core library built successfully"
    echo "📁 Output: target/release/"
else
    echo "❌ Core library build failed"
    exit 1
fi

# Build for WASM
echo ""
echo "📦 Building WASM for browser..."
wasm-pack build --target web --out-dir ../../test-website/wasm

if [ $? -eq 0 ]; then
    echo "✅ Browser WASM built successfully"
    echo "📁 Output: test-website/wasm/"
else
    echo "⚠️  Browser WASM build failed"
    echo "⚠️  Check Cargo.toml dependencies for WASM compatibility"
fi

# Run tests
echo ""
echo "🧪 Running tests..."
cargo test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "⚠️  Some tests failed"
fi

cd ../..

echo ""
echo "============================================"
echo "✅ Rust Foundation Grant Build Complete!"
echo "============================================"
echo ""
echo "Deployment files:"
echo "  - Native library: src/rust-client/target/release/"
echo "  - WASM module: test-website/wasm/"
echo ""
echo "Usage:"
echo "  - Include as dependency in other grants' Cargo.toml"
echo "  - Import WASM in browser: import init from './wasm/nft_rust_client.js'"
echo ""
echo "Note: This core library is used by:"
echo "  - NEAR Grant (fractal generation)"
echo "  - Mintbase Grant (creative metadata)"
echo "  - Solana Grant (emotional AI processing)"
echo ""
