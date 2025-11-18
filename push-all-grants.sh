#!/bin/bash

# Script to push all grant repositories to GitHub
echo "🚀 Pushing all grant repositories to GitHub..."

# Array of grant repositories and their GitHub URLs
declare -A repos=(
    ["near-creative-engine"]="https://github.com/compiling-org/near-creative-engine.git"
    ["solana-emotional-metadata"]="https://github.com/compiling-org/solana-emotional-metadata.git"
    ["filecoin-creative-storage"]="https://github.com/compiling-org/filecoin-creative-storage.git"
    ["mintbase-creative-marketplace"]="https://github.com/compiling-org/mintbase-creative-marketplace.git"
    ["rust-emotional-engine"]="https://github.com/compiling-org/rust-emotional-engine.git"
    ["polkadot-creative-identity"]="https://github.com/compiling-org/polkadot-creative-identity.git"
)

# Function to setup and push a repository
setup_and_push() {
    local repo_name=$1
    local repo_url=$2
    
    echo "📦 Setting up $repo_name..."
    
    cd "../grant-repositories/$repo_name" || exit 1
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
    fi
    
    # Add remote if not already done
    if ! git remote get-url origin >/dev/null 2>&1; then
        git remote add origin "$repo_url"
    fi
    
    # Add all files
    git add -A
    
    # Commit if there are changes
    if ! git diff-index --quiet HEAD --; then
        git commit -m "Updated with comprehensive living documentation and specific implementation details"
    fi
    
    # Push to GitHub (with force to overwrite existing content)
    echo "🚀 Pushing $repo_name to GitHub..."
    git push -f -u origin main || git push -f -u origin master
    
    cd ../../blockchain-nft-interactive
    echo "✅ Completed $repo_name"
    echo ""
}

# Process each repository
for repo_name in "${!repos[@]}"; do
    repo_url="${repos[$repo_name]}"
    setup_and_push "$repo_name" "$repo_url"
done

echo "🎉 All grant repositories have been pushed to GitHub!"
echo ""
echo "📋 Summary of pushed repositories:"
for repo_name in "${!repos[@]}"; do
    echo "  ✅ $repo_name"
done