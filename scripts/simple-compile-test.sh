#!/bin/bash

# Simple compilation test without complex utilities
echo "Testing NEAR contract compilation..."

# Change to contract directory
cd contracts/near/soulbound-nft

# Try to compile with cargo directly
echo "Running cargo build..."
cargo build --target wasm32-unknown-unknown --release

echo "Build completed with exit code: $?"