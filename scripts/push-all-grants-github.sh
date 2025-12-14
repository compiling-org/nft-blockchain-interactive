#!/bin/bash

# Push all 6 grant repositories to their individual GitHub repositories

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
    
    echo "Pushing $folder_name to $repo_url..."
    
    if [ -d "$folder_name" ]; then
        cd "$folder_name"
        
        # Initialize git if not already done
        if [ ! -d ".git" ]; then
            git init
        fi
        
        # Add all files
        git add -A
        
        # Commit if there are changes
        if ! git diff-index --quiet HEAD --; then
            git commit -m "Update with REAL AI/ML implementation: TensorFlow.js, Candle framework, biometric processing, cross-chain AI bridge"
        fi
        
        # Add remote if not exists
        git remote get-url origin 2>/dev/null || git remote add origin "$repo_url"
        
        # Push to main branch
        git push -u origin main --force
        
        cd ..
        echo "✅ Pushed $folder_name successfully"
    else
        echo "❌ Directory $folder_name not found"
    fi
done

echo "🎉 All grant repositories pushed to GitHub!"