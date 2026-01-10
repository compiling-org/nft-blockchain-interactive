#!/bin/bash
export NEAR_SKIP_CHECK=1
echo "Running cargo build with NEAR_SKIP_CHECK=1"
cd packages/near-wasm || exit 1
cargo build --target wasm32-unknown-unknown --release --verbose
