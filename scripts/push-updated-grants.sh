#!/bin/bash

# Push updated grant repositories to GitHub with .gitignore and new files

GRANT_REPOS=(
    "bitte-protocol-ai:https://github.com/compiling-org/bitte-protocol-ai-biometric.git"
    "filecoin-creative-storage:https://github.com/compiling-org/filecoin-foundation-ai-biometric.git"
    "near-creative-engine:https://github.com/compiling-org/near-foundation-ai-biometric.git"
    "polkadot-creative-identity:https://github.com/compiling-org/polkadot-creative-identity-ai-biometric.git"
    "rust-foundation-audiovisual:https://github.com/compiling-org/rust-foundation-audiovisual.git"
    "solana-nft-marketplace:https://github.com/compiling-org/solana-foundation-ai-biometric.git"
)

cd /c/Users/kapil/compiling/grant-repositories

for repo_info in "${GRANT_REPOS[@]}"; do
    IFS=':' read -r folder_name repo_url <<< "$repo_info"
    
    echo "=== Updating $folder_name ==="
    
    if [ -d "$folder_name" ]; then
        cd "$folder_name"
        
        git remote get-url origin >/dev/null 2>&1 || git remote add origin "$repo_url"
        
        # Add all new files and changes
        git add -A
        
        # Commit if there are changes
        if ! git diff-index --quiet HEAD --; then
            git commit -m "Update with .gitignore and REAL AI/ML implementation files"
            
            # Push to GitHub
            echo "Pushing to $repo_url..."
            git push origin main 2>/dev/null || git push origin master 2>/dev/null || echo "Push failed for $folder_name"
            
            echo "✅ $folder_name updated"
        else
            echo "No changes in $folder_name"
        fi
        
        cd ..
    else
        echo "❌ Directory $folder_name not found"
    fi
    echo ""
done

echo "🎉 All grant repositories updated on GitHub!"
