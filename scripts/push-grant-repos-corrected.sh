#!/bin/bash
# Script to push all grant repositories to GitHub with correct URL mapping

echo "============================================"
echo "Pushing Grant Repositories to GitHub - CORRECTED"
echo "============================================"

# Change to grant repositories directory
cd "C:/Users/kapil/compiling/grant-repositories"

# Define repositories and their GitHub URLs with Bitte->Mintbase mapping
declare -A repos=(
    ["near-creative-engine"]="https://github.com/compiling-org/near-creative-engine.git"
    ["solana-emotional-metadata"]="https://github.com/compiling-org/solana-emotional-metadata.git"
    ["filecoin-creative-storage"]="https://github.com/compiling-org/filecoin-creative-storage.git"
    ["bitte-creative-marketplace"]="https://github.com/compiling-org/mintbase-creative-marketplace.git"  # Bitte uses Mintbase URL
    ["rust-emotional-engine"]="https://github.com/compiling-org/rust-emotional-engine.git"
    ["polkadot-creative-identity"]="https://github.com/compiling-org/polkadot-creative-identity.git"
)

# Process each repository
for repo_name in "${!repos[@]}"; do
    github_url="${repos[$repo_name]}"
    
    echo "Processing $repo_name..."
    
    if [ -d "$repo_name" ]; then
        cd "$repo_name"
        
        # Check if git is initialized
        if [ ! -d ".git" ]; then
            echo "Initializing git repository for $repo_name..."
            git init
        fi
        
        # Check current branch and set to main if needed
        current_branch=$(git branch --show-current 2>/dev/null || echo "master")
        if [ "$current_branch" != "main" ]; then
            echo "Renaming branch from $current_branch to main..."
            git branch -m main 2>/dev/null || git checkout -b main
        fi
        
        # Check if there are changes to commit
        if [ -n "$(git status --porcelain)" ]; then
            echo "Adding and committing files..."
            git add .
            git commit -m "Initial commit: $repo_name with honest implementation status

✅ Real Components:
- Core engine structures and UI frameworks
- WebGPU fractal generation (where applicable)
- Basic contract architectures

⚠️ Partial Implementation:
- Contract deployment scripts need work
- Some blockchain integrations incomplete
- Testing coverage limited

❌ Simulated Components:
- All blockchain transactions use alert() popups
- No real smart contract deployments
- Wallet connections are mocked

🎯 Next Steps:
- Deploy contracts to testnets
- Replace alert() popups with real transactions
- Implement proper wallet integration
- Add comprehensive testing"
        fi
        
        # Add or update remote origin
        echo "Setting remote origin to: $github_url"
        git remote remove origin 2>/dev/null || true
        git remote add origin "$github_url"
        
        # Force push to main branch
        echo "Pushing to GitHub..."
        if git push -u origin main --force; then
            echo "✅ Successfully pushed $repo_name to GitHub"
            echo "GitHub URL: $github_url"
        else
            echo "❌ Failed to push $repo_name - may need manual intervention"
        fi
        
        echo ""
        
        # Return to parent directory
        cd ..
    else
        echo "❌ Directory $repo_name not found - skipping"
        echo ""
    fi
done

echo "============================================"
echo "Grant Repository Push Process Complete!"
echo "============================================"
echo ""
echo "Repository URLs:"
echo "- NEAR Creative Engine: https://github.com/compiling-org/near-creative-engine"
echo "- Solana Emotional Metadata: https://github.com/compiling-org/solana-emotional-metadata"
echo "- Filecoin Creative Storage: https://github.com/compiling-org/filecoin-creative-storage"
echo "- Bitte Creative Marketplace: https://github.com/compiling-org/mintbase-creative-marketplace (uses mintbase URL)"
echo "- Rust Emotional Engine: https://github.com/compiling-org/rust-emotional-engine"
echo "- Polkadot Creative Identity: https://github.com/compiling-org/polkadot-creative-identity"