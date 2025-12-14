#!/bin/bash

# Add .gitignore files to all grant repositories to prevent massive files

GRANT_REPOS_DIR="/c/Users/kapil/compiling/grant-repositories"
GITIGNORE_TEMPLATE="/c/Users/kapil/compiling/blockchain-nft-interactive/grant-gitignore-template"

echo "Adding .gitignore files to grant repositories..."

cd "$GRANT_REPOS_DIR"

for grant_dir in */; do
    if [ -d "$grant_dir" ] && [ "$grant_dir" != "*/" ]; then
        echo "Adding .gitignore to $grant_dir..."
        cp "$GITIGNORE_TEMPLATE" "$grant_dir/.gitignore"
        
        # Also add to git and commit
        cd "$grant_dir"
        git add .gitignore
        git commit -m "Add .gitignore to prevent large files" 2>/dev/null || true
        cd ..
    fi
done

echo "✅ .gitignore files added to all grant repositories!"