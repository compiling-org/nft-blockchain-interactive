#!/bin/bash

# Fix all grant repositories with correct blockchain-specific documentation
# This script replaces the generic Bitte READMEs with proper blockchain-specific content

set -e

GRANT_REPOS_DIR="/c/Users/kapil/compiling/grant-repositories"
SOURCE_DIR="/c/Users/kapil/compiling/blockchain-nft-interactive"

echo "🔧 Fixing grant repositories with correct blockchain-specific documentation..."

# Define correct README content for each repository
declare -A REPO_READMES=(
    ["solana-nft-marketplace"]="$SOURCE_DIR/solana-README-template.md"
    ["rust-foundation-audiovisual"]="$SOURCE_DIR/rust-README-template.md"
    ["near-creative-engine"]="$SOURCE_DIR/near-README-template.md"
    ["bitte-protocol-ai"]="$SOURCE_DIR/docs/bitte-protocol-grant-application.md"
    ["filecoin-creative-storage"]="$SOURCE_DIR/docs/FILECOIN_SPECIFIC_README.md"
    ["polkadot-creative-identity"]="$SOURCE_DIR/docs/POLKADOT_SPECIFIC_README.md"
)

# Define correct package.json names
declare -A PACKAGE_NAMES=(
    ["solana-nft-marketplace"]="solana-emotional-nft-marketplace"
    ["rust-foundation-audiovisual"]="rust-audiovisual-ai-engine"
    ["near-creative-engine"]="near-creative-ai-engine"
    ["bitte-protocol-ai"]="bitte-protocol-ai-biometric"
    ["filecoin-creative-storage"]="filecoin-creative-ai-storage"
    ["polkadot-creative-identity"]="polkadot-creative-ai-identity"
)

# Define correct Cargo.toml names
declare -A CARGO_NAMES=(
    ["solana-nft-marketplace"]="solana_emotional_nft_marketplace"
    ["rust-foundation-audiovisual"]="rust_audiovisual_ai_engine"
    ["near-creative-engine"]="near_creative_ai_engine"
    ["bitte-protocol-ai"]="bitte_protocol_ai_biometric"
    ["filecoin-creative-storage"]="filecoin_creative_ai_storage"
    ["polkadot-creative-identity"]="polkadot_creative_ai_identity"
)

for repo_name in "${!REPO_READMES[@]}"; do
    echo ""
    echo "📦 Processing $repo_name..."
    
    REPO_DIR="$GRANT_REPOS_DIR/$repo_name"
    
    if [ ! -d "$REPO_DIR" ]; then
        echo "❌ Repository directory $REPO_DIR not found"
        continue
    fi
    
    cd "$REPO_DIR"
    
    # Replace README.md with correct blockchain-specific content
    if [ -f "${REPO_READMES[$repo_name]}" ]; then
        echo "  ✅ Replacing README.md with blockchain-specific content"
        cp "${REPO_READMES[$repo_name]}" README.md
    else
        echo "  ⚠️  README template not found: ${REPO_READMES[$repo_name]}"
    fi
    
    # Fix package.json project name
    if [ -f "package.json" ]; then
        echo "  ✅ Updating package.json project name"
        sed -i "s/\"name\":.*/\"name\": \"${PACKAGE_NAMES[$repo_name]}\",/" package.json
        
        # Update description to be blockchain-specific
        case "$repo_name" in
            "solana-nft-marketplace")
                sed -i 's/\"description\":.*/\"description\": \"Solana NFT marketplace with AI-enhanced emotional metadata and biometric authentication\",/' package.json
                ;;
            "rust-foundation-audiovisual")
                sed -i 's/\"description\":.*/\"description\": \"Rust-based audiovisual AI engine with real-time synthesis and biometric integration\",/' package.json
                ;;
            "near-creative-engine")
                sed -i 's/\"description\":.*/\"description\": \"NEAR Protocol creative engine with AI-enhanced biometric authentication and emotional NFTs\",/' package.json
                ;;
            "bitte-protocol-ai")
                sed -i 's/\"description\":.*/\"description\": \"Bitte Protocol AI-enhanced biometric authentication engine with cross-chain inference\",/' package.json
                ;;
            "filecoin-creative-storage")
                sed -i 's/\"description\":.*/\"description\": \"Filecoin creative storage with AI-enhanced biometric authentication and decentralized AI models\",/' package.json
                ;;
            "polkadot-creative-identity")
                sed -i 's/\"description\":.*/\"description\": \"Polkadot creative identity with AI-enhanced biometric authentication and cross-chain identity\",/' package.json
                ;;
        esac
    fi
    
    # Fix Cargo.toml project name
    if [ -f "Cargo.toml" ]; then
        echo "  ✅ Updating Cargo.toml project name"
        sed -i "s/^name = .*/name = \"${CARGO_NAMES[$repo_name]}\"/" Cargo.toml
        
        # Update description to be blockchain-specific
        case "$repo_name" in
            "solana-nft-marketplace")
                sed -i 's/"Solana NFT marketplace with AI-enhanced emotional metadata"/' Cargo.toml
                ;;
            "rust-foundation-audiovisual")
                sed -i 's/"Rust-based audiovisual AI engine with real-time synthesis"/' Cargo.toml
                ;;
            "near-creative-engine")
                sed -i 's/"NEAR Protocol creative engine with AI-enhanced biometric authentication"/' Cargo.toml
                ;;
            "bitte-protocol-ai")
                sed -i 's/"Bitte Protocol AI-enhanced biometric authentication engine"/' Cargo.toml
                ;;
            "filecoin-creative-storage")
                sed -i 's/"Filecoin creative storage with AI-enhanced biometric authentication"/' Cargo.toml
                ;;
            "polkadot-creative-identity")
                sed -i 's/"Polkadot creative identity with AI-enhanced biometric authentication"/' Cargo.toml
                ;;
        esac
    fi
    
    # Remove wrong documentation files that don't belong to this repository
    echo "  ✅ Cleaning up wrong documentation files"
    case "$repo_name" in
        "solana-nft-marketplace")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f BITTE_SPECIFIC_*.md
            rm -f NEAR_SPECIFIC_*.md
            rm -f FILECOIN_SPECIFIC_*.md
            rm -f POLKADOT_SPECIFIC_*.md
            rm -f RUST_SPECIFIC_*.md
            ;;
        "rust-foundation-audiovisual")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f BITTE_SPECIFIC_*.md
            rm -f NEAR_SPECIFIC_*.md
            rm -f FILECOIN_SPECIFIC_*.md
            rm -f POLKADOT_SPECIFIC_*.md
            rm -f SOLANA_SPECIFIC_*.md
            ;;
        "near-creative-engine")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f BITTE_SPECIFIC_*.md
            rm -f RUST_SPECIFIC_*.md
            rm -f FILECOIN_SPECIFIC_*.md
            rm -f POLKADOT_SPECIFIC_*.md
            rm -f SOLANA_SPECIFIC_*.md
            ;;
        "bitte-protocol-ai")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f NEAR_SPECIFIC_*.md
            rm -f RUST_SPECIFIC_*.md
            rm -f FILECOIN_SPECIFIC_*.md
            rm -f POLKADOT_SPECIFIC_*.md
            rm -f SOLANA_SPECIFIC_*.md
            ;;
        "filecoin-creative-storage")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f BITTE_SPECIFIC_*.md
            rm -f NEAR_SPECIFIC_*.md
            rm -f RUST_SPECIFIC_*.md
            rm -f POLKADOT_SPECIFIC_*.md
            rm -f SOLANA_SPECIFIC_*.md
            ;;
        "polkadot-creative-identity")
            rm -f MINTBASE_SPECIFIC_*.md
            rm -f BITTE_SPECIFIC_*.md
            rm -f NEAR_SPECIFIC_*.md
            rm -f RUST_SPECIFIC_*.md
            rm -f FILECOIN_SPECIFIC_*.md
            rm -f SOLANA_SPECIFIC_*.md
            ;;
    esac
    
    echo "  🎉 $repo_name documentation fixed"
    
done

echo ""
echo "✅ All grant repositories have been fixed with correct blockchain-specific documentation!"
echo "📊 Summary:"
echo "  - Fixed README.md files for all 6 repositories"
echo "  - Updated package.json project names and descriptions"
echo "  - Updated Cargo.toml project names and descriptions"
echo "  - Removed incorrect documentation files"
echo ""
echo "🚀 Ready to push updated documentation to GitHub!"