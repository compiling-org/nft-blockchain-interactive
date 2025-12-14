#!/bin/bash

# Extract REAL AI/ML implementation to all 6 grant repositories
# This script copies the actual working AI/ML code and updated documents

set -e

SOURCE_DIR="/c/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="/c/Users/kapil/compiling/grant-repositories"

# Real AI/ML files to copy
REAL_AI_FILES=(
    "src/rust-client/src/enhanced_webgpu_engine.rs"
    "src/rust-client/src/real_ai_inference.rs"
    "src/rust-client/src/enhanced_biometric_engine.rs"
    "src/utils/hybrid-ai-architecture.js"
    "src/utils/hybrid-ai-architecture.test.js"
    "contracts/near/cross-chain-ai/src/lib.rs"
    "contracts/near/soulbound-ai-governance/src/lib.rs"
    "contracts/solana/biometric-nft/programs/biometric-nft/src/lib.rs"
    "contracts/filecoin/biometric-nft-actor/src/lib.rs"
    "contracts/cross-chain/CrossChainDataBridge.sol"
)

# Updated documents to copy
UPDATED_DOCS=(
    "docs/bitte-protocol-grant-application.md"
    "docs/filecoin-foundation-grant.md"
    "docs/near-foundation-grant.md"
    "docs/solana-foundation-grant.md"
    "docs/web3-foundation-grant.md"
    "docs/RUST_SPECIFIC_README.md"
    "docs/RUST_SPECIFIC_IMPLEMENTATION_REPORT.md"
    "docs/RUST_SPECIFIC_TECHNICAL_ARCHITECTURE.md"
)

# Grant repositories
GRANTS=(
    "bitte-protocol-ai"
    "filecoin-creative-storage"
    "near-creative-engine"
    "polkadot-creative-identity"
    "rust-foundation-audiovisual"
    "solana-nft-marketplace"
)

echo "🚀 Extracting REAL AI/ML implementation to grant repositories..."

for grant in "${GRANTS[@]}"; do
    echo ""
    echo "📦 Processing $grant..."
    
    GRANT_DIR="$TARGET_DIR/$grant"
    
    if [ ! -d "$GRANT_DIR" ]; then
        echo "❌ Grant directory $GRANT_DIR not found - creating it"
        mkdir -p "$GRANT_DIR"
    fi
    
    # Copy REAL AI/ML files
    echo "  Copying AI/ML files..."
    for file in "${REAL_AI_FILES[@]}"; do
        if [ -f "$SOURCE_DIR/$file" ]; then
            # Create target directory structure
            target_dir="$(dirname "$GRANT_DIR/$file")"
            mkdir -p "$target_dir"
            cp "$SOURCE_DIR/$file" "$GRANT_DIR/$file"
            echo "    ✅ $file"
        else
            echo "    ⚠️  $file not found in source"
        fi
    done
    
    # Copy updated documents
    echo "  Copying updated documents..."
    for doc in "${UPDATED_DOCS[@]}"; do
        if [ -f "$SOURCE_DIR/$doc" ]; then
            # Create docs directory if needed
            mkdir -p "$GRANT_DIR/docs"
            cp "$SOURCE_DIR/$doc" "$GRANT_DIR/docs/"
            echo "    ✅ $doc"
        else
            echo "    ⚠️  $doc not found in source"
        fi
    done
    
    # Copy minimal package.json and Cargo.toml (without dependencies)
    if [ -f "$SOURCE_DIR/package.json" ]; then
        # Create minimal package.json with just name and version
        echo '{"name": "'$grant'", "version": "1.0.0", "description": "AI/ML enhanced blockchain project"}' > "$GRANT_DIR/package.json"
        echo "  ✅ Minimal package.json"
    fi
    
    if [ -f "$SOURCE_DIR/Cargo.toml" ]; then
        # Create minimal Cargo.toml
        echo '[package]' > "$GRANT_DIR/Cargo.toml"
        echo 'name = "'$grant'"' >> "$GRANT_DIR/Cargo.toml"
        echo 'version = "0.1.0"' >> "$GRANT_DIR/Cargo.toml"
        echo 'edition = "2021"' >> "$GRANT_DIR/Cargo.toml"
        echo '' >> "$GRANT_DIR/Cargo.toml"
        echo '[dependencies]' >> "$GRANT_DIR/Cargo.toml"
        echo "  ✅ Minimal Cargo.toml"
    fi
    
    echo "  🎉 $grant updated with REAL AI/ML implementation"
done

echo ""
echo "✅ All grants extracted with REAL AI/ML code and updated documents!"
echo "📊 Total grants processed: ${#GRANTS[@]}"
echo "🎯 Ready to push to GitHub repositories"