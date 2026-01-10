#!/bin/bash
set -e

# Define paths to Windows binaries
# Note: Using single quotes to prevent backslash expansion issues if we were strictly in win-land, 
# but here in WSL we access them via /mnt/c
WIN_CARGO="/mnt/c/Users/kapil/.cargo/bin/cargo.exe"
WIN_CARGO_NEAR="/mnt/c/Users/kapil/.cargo/bin/cargo-near.exe"

echo "==================================================="
echo "🛠️  Building NEAR Contract via Windows Toolchain"
echo "   Cargo: $($WIN_CARGO --version)"
echo "   Path: $(pwd)"
echo "==================================================="

# Export PATH to include Windows cargo bin just in case
export PATH=$PATH:/mnt/c/Users/kapil/.cargo/bin

# Check if cargo-near.exe exists
if [ -f "$WIN_CARGO_NEAR" ]; then
    echo "✅ Found cargo-near.exe"
    # Execute build using Windows binary
    # We use 'near build' subcommand. 
    # Note: 'cargo.exe near' might rely on cargo finding the subcommand executable in PATH.
    # explicit invoking might be safer: "$WIN_CARGO" near build
    
    "$WIN_CARGO" near build --no-docker
else
    echo "⚠️  cargo-near.exe not found at $WIN_CARGO_NEAR"
    echo "   Attempting standard cargo build..."
    # Fallback to standard build with target
    "$WIN_CARGO" build --target wasm32-unknown-unknown --release
fi

echo "✅ Build Process script finished."
