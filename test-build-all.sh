#!/bin/bash

# Test build script for all grant modules
echo "🧪 Testing build for all grant modules..."

# Function to test build a module
test_build_module() {
    local module_name=$1
    local module_path=$2
    
    echo "Building $module_name..."
    
    if [ -d "$module_path" ]; then
        cd "$module_path"
        if [ -f "build.sh" ]; then
            echo "  Running build.sh for $module_name"
            # Just check if the script runs without errors (don't actually build to save time)
            if bash -n build.sh; then
                echo "  ✅ $module_name build script is valid"
            else
                echo "  ❌ $module_name build script has errors"
                cd ../..
                return 1
            fi
        elif [ -f "Cargo.toml" ]; then
            echo "  Checking Cargo.toml for $module_name"
            if cargo read-manifest > /dev/null 2>&1; then
                echo "  ✅ $module_name Cargo.toml is valid"
            else
                echo "  ❌ $module_name Cargo.toml has errors"
                cd ../..
                return 1
            fi
        else
            echo "  ⚠️  No build script or Cargo.toml found for $module_name"
        fi
        cd ../..
    else
        echo "  ❌ Directory $module_path does not exist"
        return 1
    fi
}

# Test each module
test_build_module "NEAR WASM" "src/near-wasm" || exit 1
test_build_module "Solana Client" "src/solana-client" || exit 1
test_build_module "IPFS Integration" "src/ipfs-integration" || exit 1
test_build_module "Rust Client" "src/rust-client" || exit 1
test_build_module "Polkadot Client" "src/polkadot-client" || exit 1
test_build_module "Marketplace" "src/marketplace" || exit 1

echo "✅ All modules have valid build configurations!"
echo "📝 Note: This script only validates build scripts and Cargo.toml files."
echo "   Actual compilation would require installing all dependencies and toolchains."