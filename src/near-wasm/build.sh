#!/bin/bash
set -e

# Build script for NEAR WASM contract
echo "Building NEAR WASM contract..."

# Check if Rust is installed
if ! command -v rustc &> /dev/null
then
    echo "Rust is not installed. Please install Rust first."
    exit 1
fi

# Check if wasm32-unknown-unknown target is installed
if ! rustc --print target-list | grep -q wasm32-unknown-unknown
then
    echo "Adding wasm32-unknown-unknown target..."
    rustup target add wasm32-unknown-unknown
fi

# Build the contract
echo "Compiling contract..."
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release

# Create res directory if it doesn't exist
mkdir -p res

# Copy the built contract to res directory
echo "Copying contract to res/contract.wasm..."
cp target/wasm32-unknown-unknown/release/*.wasm res/contract.wasm

echo "Build completed successfully!"
echo "Contract is located at: res/contract.wasm"