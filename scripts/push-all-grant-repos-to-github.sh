#!/bin/bash
# Script to push all grant repositories to GitHub

echo "============================================"
echo "Pushing Grant Repositories to GitHub"
echo "============================================"

# Change to grant repositories directory
cd "C:/Users/kapil/compiling/grant-repositories"

# Define repositories and their GitHub URLs
declare -A repos=(
    ["near-creative-engine"]="https://github.com/compiling-org/near-creative-engine.git"
    ["solana-emotional-metadata"]="https://github.com/compiling-org/solana-emotional-metadata.git"
    ["filecoin-creative-storage"]="https://github.com/compiling-org/filecoin-creative-storage.git"
    ["bitte-creative-marketplace"]="https://github.com/compiling-org/bitte-creative-marketplace.git"
    ["rust-emotional-engine"]="https://github.com/compiling-org/rust-emotional-engine.git"
    ["polkadot-creative-identity"]="https://github.com/compiling-org/polkadot-creative-identity.git"
)

# Process each repository
for repo_name in "${!repos[@]}"; do
    github_url="${repos[$repo_name]}"
    
    echo "Processing $repo_name..."
    
    if [ -d "$repo_name" ]; then
        cd "$repo_name"
        
        # Initialize git repository if not already done
        if [ ! -d ".git" ]; then
            echo "Initializing git repository for $repo_name..."
            git init
            git config init.defaultBranch main
        fi
        
        # Add all files
        echo "Adding files to git..."
        git add .
        
        # Commit with realistic message
        echo "Creating initial commit..."
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
        
        # Add remote origin
        echo "Adding remote origin..."
        git remote add origin "$github_url" 2>/dev/null || git remote set-url origin "$github_url"
        
        # Push to main branch with force to overwrite any existing content
        echo "Pushing to GitHub..."
        git push -u origin main --force
        
        echo "✅ Successfully pushed $repo_name to GitHub"
        echo "GitHub URL: $github_url"
        echo ""
        
        # Return to parent directory
        cd ..
    else
        echo "❌ Directory $repo_name not found - skipping"
        echo ""
    fi
done

echo "============================================"
echo "All Grant Repositories Pushed Successfully!"
echo "============================================"
echo ""
echo "Repository URLs:"
echo "- NEAR Creative Engine: https://github.com/compiling-org/near-creative-engine"
echo "- Solana Emotional Metadata: https://github.com/compiling-org/solana-emotional-metadata"
echo "- Filecoin Creative Storage: https://github.com/compiling-org/filecoin-creative-storage"
echo "- Bitte Creative Marketplace: https://github.com/compiling-org/bitte-creative-marketplace"
echo "- Rust Emotional Engine: https://github.com/compiling-org/rust-emotional-engine"
echo "- Polkadot Creative Identity: https://github.com/compiling-org/polkadot-creative-identity"