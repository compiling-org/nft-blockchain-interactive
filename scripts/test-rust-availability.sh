#!/bin/bash

# Simple build test without relying on missing utilities
echo "Testing Rust availability..."

# Try to run cargo directly
cargo --version
echo "Cargo version check completed"

# Try to build the NEAR contract
echo "Building NEAR contract..."
cd contracts/near/soulbound-nft
cargo build --target wasm32-unknown-unknown --release

echo "Build completed"