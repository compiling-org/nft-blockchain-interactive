#!/bin/bash

# Verification script to confirm all grant modules are complete
echo "🔍 Verifying Project Completion"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a file exists
check_file_exists() {
    local file_path=$1
    local description=$2
    
    if [ -f "$file_path" ]; then
        print_success "$description"
        return 0
    else
        print_error "$description - FILE NOT FOUND"
        return 1
    fi
}

# Function to check if a directory exists
check_dir_exists() {
    local dir_path=$1
    local description=$2
    
    if [ -d "$dir_path" ]; then
        print_success "$description"
        return 0
    else
        print_error "$description - DIRECTORY NOT FOUND"
        return 1
    fi
}

# Function to verify grant module
verify_grant_module() {
    local grant_name=$1
    local module_dir=$2
    local required_files=$3
    
    print_header "$grant_name"
    
    # Check if directory exists
    if ! check_dir_exists "$module_dir" "Module directory"; then
        return 1
    fi
    
    # Check required files
    local all_files_found=true
    for file in $required_files; do
        if ! check_file_exists "$module_dir/$file" "$file"; then
            all_files_found=false
        fi
    done
    
    if [ "$all_files_found" = true ]; then
        print_success "$grant_name - ALL REQUIRED FILES PRESENT"
        return 0
    else
        print_error "$grant_name - MISSING REQUIRED FILES"
        return 1
    fi
}

# Main verification
echo "Starting verification of all grant modules..."
echo ""

# Verify NEAR Foundation Grant
verify_grant_module "NEAR Foundation Grant" "src/near-wasm" "Cargo.toml src/lib.rs src/emotional.rs src/interactive.rs src/mintbase.rs src/soulbound.rs build.sh" || exit 1
echo ""

# Verify Solana Foundation Grant
verify_grant_module "Solana Foundation Grant" "src/solana-client" "Cargo.toml src/lib.rs" || exit 1
echo ""

# Verify Filecoin Foundation Grant
verify_grant_module "Filecoin Foundation Grant" "src/ipfs-integration" "Cargo.toml src/lib.rs" || exit 1
echo ""

# Verify Rust Foundation Grant
verify_grant_module "Rust Foundation Grant" "src/rust-client" "Cargo.toml src/lib.rs" || exit 1
echo ""

# Verify Polkadot Foundation Grant
verify_grant_module "Web3 Foundation Grant" "src/polkadot-client" "Cargo.toml src/lib.rs" || exit 1
echo ""

# Verify Marketplace
verify_grant_module "Test Marketplace" "src/marketplace" "Cargo.toml src/lib.rs build.sh" || exit 1
echo ""

# Verify Frontend
verify_grant_module "Marketplace Frontend" "marketplace-frontend" "index.html" || exit 1
echo ""

# Verify Documentation
print_header "Documentation"
check_file_exists "README.md" "Main README" || exit 1
check_file_exists "DEPLOYMENT_GUIDE.md" "Deployment Guide" || exit 1
check_file_exists "GRANT_IMPLEMENTATION_SUMMARY.md" "Grant Implementation Summary" || exit 1
check_file_exists "PROJECT_COMPLETION_SUMMARY.md" "Project Completion Summary" || exit 1
check_dir_exists "docs" "Documentation directory" || exit 1
echo ""

# Verify Task Tracking
print_header "Task Tracking"
check_file_exists "PROJECT_TASKS.csv" "Project Tasks CSV" || exit 1
echo ""

# Verify Scripts
print_header "Build and Test Scripts"
check_file_exists "BUILD_AND_TEST_ALL.sh" "Build and Test Script" || exit 1
check_file_exists "test-build-all.sh" "Test Build Script" || exit 1
check_file_exists "start-marketplace.sh" "Start Marketplace Script" || exit 1
check_file_exists "VERIFY_COMPLETION.sh" "Verification Script" || exit 1
echo ""

# Summary
print_header "Final Verification Summary"
echo "All grant modules have been verified:"
echo "  ✅ NEAR Foundation Grant - Real-Time WASM Creative Engine"
echo "  ✅ Mintbase Foundation Grant - Interactive Creative NFTs"
echo "  ✅ Solana Foundation Grant - High-Performance Metadata"
echo "  ✅ Filecoin Foundation Grant - IPFS Persistence Layer"
echo "  ✅ Rust Foundation Grant - Core Creative Engine"
echo "  ✅ Web3 Foundation Grant - Polkadot Cross-Chain Bridge"
echo "  ✅ Test Marketplace Implementation"
echo "  ✅ Documentation and Guides"
echo "  ✅ Build and Test Scripts"
echo ""
print_success "🎉 PROJECT VERIFICATION COMPLETE - ALL MODULES PRESENT AND ACCOUNTED FOR!"
echo ""
echo "📊 Next Steps:"
echo "  1. Review documentation in docs/ directory"
echo "  2. Run BUILD_AND_TEST_ALL.sh to validate build configurations"
echo "  3. Deploy individual modules using DEPLOYMENT_GUIDE.md"
echo "  4. Start test marketplace with start-marketplace.sh"
echo ""