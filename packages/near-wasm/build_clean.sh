#!/bin/bash

# Build script for NEAR WASM contract

echo "Building NEAR WASM contract..."

# Check if cargo-near is installed
if cargo near --version >/dev/null 2>&1; then
    echo "Using cargo-near to build..."
    cargo near build
    WASM_SOURCE="target/near/nft_near_wasm.wasm"
else
    echo "cargo-near not found. Attempting standard cargo build (may fail with near-sdk 5.x)..."
    
    # Check if wasm32-unknown-unknown target is installed
    if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
        echo "Installing wasm32-unknown-unknown target..."
        rustup target add wasm32-unknown-unknown
    fi

    echo "Compiling contract with standard cargo build (NEAR_SKIP_CHECK=1)..."
    export NEAR_SKIP_CHECK=1
    if cargo build --target wasm32-unknown-unknown --release; then
        echo "Cargo build succeeded."
    else
        echo "Cargo build failed. Full output:"
        cargo build --target wasm32-unknown-unknown --release --verbose
    fi
    WASM_SOURCE="target/wasm32-unknown-unknown/release/nft_near_wasm.wasm"
fi

# Check if build was successful
if [ -f "$WASM_SOURCE" ]; then
    echo "Build successful!"
    echo "WASM file location: $WASM_SOURCE"
    
    # Ensure destination directory exists
    mkdir -p ../wasm-contracts
    
    # Copy to a more convenient location
    cp "$WASM_SOURCE" ../wasm-contracts/nft_near_wasm.wasm
    echo "Copied WASM file to ../wasm-contracts/nft_near_wasm.wasm"
else
    echo "Build failed! Output file not found at $WASM_SOURCE"
    exit 1
fi