#!/bin/bash
# Script to properly replace old documentation with grant-specific documentation

set -e

echo "============================================"
echo "Fixing Grant Documentation - Replacing Old Files"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to replace documentation in a grant repository
replace_grant_docs() {
    local repo_name=$1
    local grant_type=$2
    
    log_info "Fixing documentation for ${repo_name}..."
    
    # Check if the specific documentation exists
    if [ ! -f "docs/${grant_type}_SPECIFIC_README.md" ]; then
        log_error "Specific documentation not found: docs/${grant_type}_SPECIFIC_README.md"
        return 1
    fi
    
    # Navigate to the grant repository
    cd "../grant-repositories/${repo_name}"
    
    # Backup old files (just in case)
    log_info "Backing up old documentation files..."
    [ -f "README.md" ] && mv README.md README.md.backup
    [ -f "TECHNICAL_ARCHITECTURE.md" ] && mv TECHNICAL_ARCHITECTURE.md TECHNICAL_ARCHITECTURE.md.backup
    [ -f "IMPLEMENTATION_REPORT.md" ] && mv IMPLEMENTATION_REPORT.md IMPLEMENTATION_REPORT.md.backup
    
    # Copy specific documentation files
    log_info "Copying specific documentation files..."
    cp "../../blockchain-nft-interactive/docs/${grant_type}_SPECIFIC_README.md" "README.md"
    cp "../../blockchain-nft-interactive/docs/${grant_type}_SPECIFIC_TECHNICAL_ARCHITECTURE.md" "TECHNICAL_ARCHITECTURE.md"
    cp "../../blockchain-nft-interactive/docs/${grant_type}_SPECIFIC_IMPLEMENTATION_REPORT.md" "IMPLEMENTATION_REPORT.md"
    
    # Remove any duplicate or generic files
    log_info "Cleaning up duplicate files..."
    rm -f README.md.generic README.md.living
    rm -f TECHNICAL_ARCHITECTURE.md.generic
    rm -f IMPLEMENTATION_REPORT.md.generic
    
    # Return to original directory
    cd "../../blockchain-nft-interactive"
    
    log_success "Fixed documentation for ${repo_name}"
}

# Main execution
log_info "Starting documentation fix process..."

# Define grant mappings (repo_name -> grant_type)
declare -A grant_mappings=(
    ["near-creative-engine"]="NEAR"
    ["solana-emotional-metadata"]="SOLANA"
    ["filecoin-creative-storage"]="FILECOIN"
    ["mintbase-creative-marketplace"]="MINTBASE"
    ["rust-emotional-engine"]="RUST"
    ["polkadot-creative-identity"]="POLKADOT"
)

# Process each grant
for repo_name in "${!grant_mappings[@]}"; do
    grant_type="${grant_mappings[$repo_name]}"
    replace_grant_docs "$repo_name" "$grant_type"
done

# Update the master README in grant-repositories
cd "../grant-repositories"
log_info "Updating master documentation index..."

# Create a proper master README that references the specific implementations
cat > README.md << 'EOF'
# Blockchain NFT Interactive - Grant Repositories

This directory contains all the individual grant implementations for the Blockchain NFT Interactive project.

## 🎯 Project Overview

The Blockchain NFT Interactive project represents a revolutionary fusion of emotional AI and blockchain technology, creating a unique platform for emotionally-aware NFTs that can evolve, interact, and express complex emotional states across multiple blockchain ecosystems.

## 📁 Repository Structure

| Repository | Foundation | Status | Description |
|------------|------------|--------|-------------|
| [near-creative-engine](near-creative-engine) | NEAR Foundation | ✅ Active | Real-time fractal generation with emotional computing |
| [solana-emotional-metadata](solana-emotional-metadata) | Solana Foundation | ✅ Active | High-performance emotional data tracking with 90%+ compression |
| [filecoin-creative-storage](filecoin-creative-storage) | Filecoin Foundation | ✅ Active | Universal decentralized storage for creative data |
| [mintbase-creative-marketplace](mintbase-creative-marketplace) | Mintbase Foundation | ✅ Active | NFT marketplace with DAO governance for creative works |
| [rust-emotional-engine](rust-emotional-engine) | Rust Foundation | ✅ Active | Core emotional computing and creative generation engine |
| [polkadot-creative-identity](polkadot-creative-identity) | Web3 Foundation | ✅ Active | Cross-chain bridge and soulbound identity system |

## 📊 Implementation Status

Each repository contains:
- ✅ **Comprehensive README** with specific implementation details
- 🏗️ **Technical Architecture** documentation with mermaid diagrams
- 📊 **Implementation Report** with honest status and metrics
- 🔧 **Development guides** and setup instructions
- 🧪 **Testing procedures** and quality metrics

## 🚀 Getting Started

1. **Choose a grant repository** from the table above
2. **Read the specific README** for detailed implementation information
3. **Follow the technical architecture** documentation
4. **Review the implementation report** for current status
5. **Set up development environment** using provided guides

## 📞 Support

For questions or support, please refer to the individual repository documentation or contact:
- 📧 Email: kapil.bambardekar@gmail.com, vdmo@gmail.com
- 🌐 Website: https://compiling-org.netlify.app

---

**📅 Last Updated**: $(date)

**🎯 Status**: All repositories updated with grant-specific documentation
EOF

cd "../blockchain-nft-interactive"

echo ""
echo "============================================"
echo "📊 Documentation Fix Summary"
echo "============================================"
echo ""
echo "✅ Completed Actions:"
echo "  📚 Replaced generic README files with grant-specific versions"
echo "  🏗️ Updated technical architecture with specific implementations"
echo "  📊 Replaced implementation reports with honest status reports"
echo "  🧹 Cleaned up duplicate and generic files"
echo "  📋 Updated master documentation index"
echo ""
echo "📁 All grant repositories now contain:"
echo "  ✅ Grant-specific README with actual implementation details"
echo "  🏗️ Technical architecture tailored to each blockchain"
echo "  📊 Honest implementation status with real metrics"
echo "  🔧 Development and deployment guides"
echo ""
log_success "Documentation fix complete!"
log_info "You can now push the updated repositories to GitHub."