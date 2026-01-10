#!/bin/bash
echo "==================================================="
echo "🛠️  Building NEAR Contract (WSL: Ubuntu)"
echo "==================================================="

# Use 'Ubuntu' distro as identified, force interactive shell to load env vars
# and executing the build commands directly.
wsl -d Ubuntu bash -i -c "
    echo 'Please enter sudo password if prompted...';
    source ~/.cargo/env; 
    cd packages/near-wasm; 
    
    echo 'Checking tools...';
    rustc --version; 
    cargo near --version || echo 'cargo-near not in PATH (will fallback)';
    
    echo 'Building...';
    # Try cargo-near first (standard)
    if command -v cargo-near &> /dev/null; then
        cargo near build --no-docker
    else
        # Fallback to standard cargo build
        echo '⚠️ cargo-near not found, using cargo build...';
        RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
    fi
"
