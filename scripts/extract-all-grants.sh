#!/bin/bash

# Comprehensive Grant Extraction Script
# Extracts only the blockchain-specific code for each grant project
# This prevents the psychotic behavior of copying entire projects

set -e

SOURCE_DIR="/c/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="/c/Users/kapil/compiling/grant-repositories"

echo "🚀 Starting comprehensive grant extraction..."
echo "📍 Source: $SOURCE_DIR"
echo "📍 Target: $TARGET_DIR"

# Grant configurations - 5 projects (mintbase/bitte are same)
declare -A GRANTS=(
    ["near-creative-engine"]="NEAR blockchain with AI integration"
    ["solana-creative-engine"]="Solana blockchain with AI integration" 
    ["filecoin-creative-storage"]="Filecoin storage with AI integration"
    ["mintbase-creative-marketplace"]="Mintbase/Bitte marketplace with AI"
    ["polkadot-creative-identity"]="Polkadot identity with AI integration"
)

# Function to extract NEAR-specific code
extract_near_grant() {
    local grant_name="$1"
    local target_dir="$TARGET_DIR/$grant_name"
    
    echo ""
    echo "🔷 Extracting NEAR-specific code for $grant_name..."
    
    # Create target directory
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Initialize git repo
    git init
    
    # Copy NEAR-specific source files
    echo "  📁 Copying NEAR integration files..."
    mkdir -p src/utils
    cp "$SOURCE_DIR/src/utils/near-ai-integration.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/near-fractal-ai-integration.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/near-ai-integration-enhanced.ts" src/utils/ 2>/dev/null || echo "    Enhanced NEAR integration not found"
    
    # Copy NEAR WASM contracts
    echo "  📁 Copying NEAR WASM contracts..."
    mkdir -p src/near-wasm/src
    cp "$SOURCE_DIR/src/near-wasm/src/lib.rs" src/near-wasm/src/
    cp "$SOURCE_DIR/src/near-wasm/Cargo.toml" src/near-wasm/
    
    # Copy NEAR smart contracts
    echo "  📁 Copying NEAR smart contracts..."
    mkdir -p contracts/near/soulbound-nft/src
    mkdir -p contracts/near/cross-chain-ai/src
    cp "$SOURCE_DIR/contracts/near/soulbound-nft/src/lib.rs" contracts/near/soulbound-nft/src/
    cp "$SOURCE_DIR/contracts/near/soulbound-nft/Cargo.toml" contracts/near/soulbound-nft/
    cp "$SOURCE_DIR/contracts/near/cross-chain-ai/src/lib.rs" contracts/near/cross-chain-ai/src/
    cp "$SOURCE_DIR/contracts/near/cross-chain-ai/Cargo.toml" contracts/near/cross-chain-ai/
    
    # Copy supporting AI/ML files
    echo "  📁 Copying AI/ML support files..."
    cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/cross-chain-bridge.ts" src/utils/
    
    # Create minimal package.json
    echo "  📄 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "near-creative-engine",
  "version": "1.0.0",
  "description": "NEAR blockchain creative engine with AI integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:near": "./scripts/deploy-near.sh"
  },
  "dependencies": {
    "near-api-js": "^2.1.4",
    "@tensorflow/tfjs": "^4.15.0",
    "@tensorflow/tfjs-node": "^4.15.0",
    "vectordb": "^0.1.15"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF
    
    # Create minimal Cargo.toml for Rust contracts
    echo "  📄 Creating Cargo.toml..."
    cat > Cargo.toml << 'EOF'
[workspace]
members = [
    "src/near-wasm",
    "contracts/near/soulbound-nft",
    "contracts/near/cross-chain-ai"
]
resolver = "2"
EOF
    
    # Create deployment script
    echo "  📄 Creating deployment script..."
    mkdir -p scripts
    cat > scripts/deploy-near.sh << 'EOF'
#!/bin/bash
# Deploy NEAR contracts to testnet

echo "Deploying NEAR contracts..."
cd contracts/near/soulbound-nft && cargo near deploy --accountId YOUR_ACCOUNT.testnet
cd ../cross-chain-ai && cargo near deploy --accountId YOUR_ACCOUNT.testnet
echo "NEAR contracts deployed!"
EOF
    chmod +x scripts/deploy-near.sh
    
    # Create README
    echo "  📄 Creating README.md..."
    cp "$SOURCE_DIR/docs/NEAR_SPECIFIC_README.md" README.md 2>/dev/null || echo "# NEAR Creative Engine" > README.md
    
    echo "  ✅ NEAR grant extraction complete!"
}

# Function to extract Solana-specific code
extract_solana_grant() {
    local grant_name="$1"
    local target_dir="$TARGET_DIR/$grant_name"
    
    echo ""
    echo "🟢 Extracting Solana-specific code for $grant_name..."
    
    # Create target directory
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Initialize git repo
    git init
    
    # Copy Solana-specific source files
    echo "  📁 Copying Solana integration files..."
    mkdir -p src/utils
    cp "$SOURCE_DIR/src/utils/solana-client.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/solana-enhanced-integration.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/solana-client-enhanced.ts" src/utils/ 2>/dev/null || echo "    Enhanced Solana integration not found"
    
    # Copy Solana program files
    echo "  📁 Copying Solana programs..."
    mkdir -p src/solana-program/src
    cp "$SOURCE_DIR/src/solana-program/src/lib.rs" src/solana-program/src/
    cp "$SOURCE_DIR/src/solana-program/Cargo.toml" src/solana-program/
    
    # Copy Solana Anchor programs
    echo "  📁 Copying Solana Anchor programs..."
    mkdir -p src/solana-programs/biometric-nft/programs/biometric-nft/src
    cp "$SOURCE_DIR/src/solana-programs/biometric-nft/programs/biometric-nft/src/lib.rs" src/solana-programs/biometric-nft/programs/biometric-nft/src/
    cp "$SOURCE_DIR/src/solana-programs/biometric-nft/Anchor.toml" src/solana-programs/biometric-nft/
    cp "$SOURCE_DIR/src/solana-programs/biometric-nft/Cargo.toml" src/solana-programs/biometric-nft/
    
    # Copy supporting AI/ML files
    echo "  📁 Copying AI/ML support files..."
    cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/cross-chain-bridge.ts" src/utils/
    
    # Create minimal package.json
    echo "  📄 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "solana-creative-engine",
  "version": "1.0.0",
  "description": "Solana blockchain creative engine with AI integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:solana": "anchor build && anchor deploy"
  },
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@solana/spl-token": "^0.3.9",
    "@project-serum/anchor": "^0.26.0",
    "@tensorflow/tfjs": "^4.15.0",
    "vectordb": "^0.1.15"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "@types/node": "^20.10.4"
  }
}
EOF
    
    # Create README
    echo "  📄 Creating README.md..."
    cp "$SOURCE_DIR/docs/SOLANA_SPECIFIC_README.md" README.md 2>/dev/null || echo "# Solana Creative Engine" > README.md
    
    echo "  ✅ Solana grant extraction complete!"
}

# Function to extract Filecoin-specific code
extract_filecoin_grant() {
    local grant_name="$1"
    local target_dir="$TARGET_DIR/$grant_name"
    
    echo ""
    echo "🟡 Extracting Filecoin-specific code for $grant_name..."
    
    # Create target directory
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Initialize git repo
    git init
    
    # Copy Filecoin-specific source files
    echo "  📁 Copying Filecoin integration files..."
    mkdir -p src/utils
    cp "$SOURCE_DIR/src/utils/filecoin-ai-integration.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/filecoin-ai-integration-enhanced.ts" src/utils/ 2>/dev/null || echo "    Enhanced Filecoin integration not found"
    cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/real-filecoin-storage.js" src/utils/
    cp "$SOURCE_DIR/src/utils/real-ipfs-storage.js" src/utils/
    cp "$SOURCE_DIR/src/utils/real-web3storage.js" src/utils/
    cp "$SOURCE_DIR/src/utils/real-web3storage-manager.js" src/utils/
    
    # Copy Filecoin actor contracts
    echo "  📁 Copying Filecoin actor contracts..."
    mkdir -p contracts/filecoin/biometric-nft-actor/src
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/src/lib.rs" contracts/filecoin/biometric-nft-actor/src/
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/Cargo.toml" contracts/filecoin/biometric-nft-actor/
    
    # Copy supporting AI/ML files
    echo "  📁 Copying AI/ML support files..."
    cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/cross-chain-bridge.ts" src/utils/
    
    # Create minimal package.json
    echo "  📄 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "filecoin-creative-storage",
  "version": "1.0.0",
  "description": "Filecoin storage creative engine with AI integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:filecoin": "./scripts/deploy-filecoin.sh"
  },
  "dependencies": {
    "web3.storage": "^4.5.0",
    "@web3-storage/w3up-client": "^12.0.0",
    "@tensorflow/tfjs": "^4.15.0",
    "vectordb": "^0.1.15"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF
    
    # Create README
    echo "  📄 Creating README.md..."
    cp "$SOURCE_DIR/docs/FILECOIN_SPECIFIC_README.md" README.md 2>/dev/null || echo "# Filecoin Creative Storage" > README.md
    
    echo "  ✅ Filecoin grant extraction complete!"
}

# Function to extract Mintbase/Bitte-specific code
extract_mintbase_grant() {
    local grant_name="$1"
    local target_dir="$TARGET_DIR/$grant_name"
    
    echo ""
    echo "🟣 Extracting Mintbase/Bitte-specific code for $grant_name..."
    
    # Create target directory
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Initialize git repo
    git init
    
    # Copy Mintbase/Bitte-specific source files
    echo "  📁 Copying Mintbase/Bitte integration files..."
    mkdir -p src/utils
    cp "$SOURCE_DIR/src/utils/mintbase-ai-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/bitte-protocol-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/bitte-protocol-ai-enhanced.ts" src/utils/ 2>/dev/null || echo "    Enhanced Bitte integration not found"
    cp "$SOURCE_DIR/src/utils/bitte-protocol-ai-enhanced-v2.ts" src/utils/ 2>/dev/null || echo "    V2 Bitte integration not found"
    
    # Copy supporting AI/ML files
    echo "  📁 Copying AI/ML support files..."
    cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/cross-chain-bridge.ts" src/utils/
    
    # Create minimal package.json
    echo "  📄 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "mintbase-creative-marketplace",
  "version": "1.0.0",
  "description": "Mintbase/Bitte marketplace creative engine with AI integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:mintbase": "./scripts/deploy-mintbase.sh"
  },
  "dependencies": {
    "@mintbase-js/sdk": "^0.5.0",
    "@mintbase-js/react": "^0.5.0",
    "@mintbase-js/storage": "^0.5.0",
    "@tensorflow/tfjs": "^4.15.0",
    "vectordb": "^0.1.15"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF
    
    # Create README
    echo "  📄 Creating README.md..."
    cp "$SOURCE_DIR/docs/MINTBASE_SPECIFIC_README.md" README.md 2>/dev/null || echo "# Mintbase Creative Marketplace" > README.md
    
    echo "  ✅ Mintbase/Bitte grant extraction complete!"
}

# Function to extract Polkadot-specific code
extract_polkadot_grant() {
    local grant_name="$1"
    local target_dir="$TARGET_DIR/$grant_name"
    
    echo ""
    echo "🟠 Extracting Polkadot-specific code for $grant_name..."
    
    # Create target directory
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Initialize git repo
    git init
    
    # Copy Polkadot-specific source files
    echo "  📁 Copying Polkadot integration files..."
    mkdir -p src/utils
    cp "$SOURCE_DIR/src/utils/polkadot-client.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/polkadot-client-working.ts" src/utils/ 2>/dev/null || echo "    Working Polkadot client not found"
    cp "$SOURCE_DIR/src/utils/polkadot-ai-bridge.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/polkadot-ai-examples.js" src/utils/
    
    # Copy Polkadot client Rust files
    echo "  📁 Copying Polkadot client files..."
    mkdir -p src/polkadot-client/src
    cp "$SOURCE_DIR/src/polkadot-client/src/lib.rs" src/polkadot-client/src/
    cp "$SOURCE_DIR/src/polkadot-client/src/emotional_bridge.rs" src/polkadot-client/src/
    cp "$SOURCE_DIR/src/polkadot-client/src/extrinsics.rs" src/polkadot-client/src/
    cp "$SOURCE_DIR/src/polkadot-client/src/soulbound.rs" src/polkadot-client/src/
    cp "$SOURCE_DIR/src/polkadot-client/src/xcm_messaging.rs" src/polkadot-client/src/
    cp "$SOURCE_DIR/src/polkadot-client/Cargo.toml" src/polkadot-client/
    
    # Copy supporting AI/ML files
    echo "  📁 Copying AI/ML support files..."
    cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" src/utils/
    cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" src/utils/
    cp "$SOURCE_DIR/src/utils/cross-chain-bridge.ts" src/utils/
    
    # Create minimal package.json
    echo "  📄 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "polkadot-creative-identity",
  "version": "1.0.0",
  "description": "Polkadot identity creative engine with AI integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:polkadot": "./scripts/deploy-polkadot.sh"
  },
  "dependencies": {
    "@polkadot/api": "^10.11.2",
    "@polkadot/extension-dapp": "^0.46.8",
    "@polkadot/keyring": "^12.6.2",
    "@polkadot/util": "^12.6.2",
    "@tensorflow/tfjs": "^4.15.0",
    "vectordb": "^0.1.15"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF
    
    # Create README
    echo "  📄 Creating README.md..."
    cp "$SOURCE_DIR/docs/POLKADOT_SPECIFIC_README.md" README.md 2>/dev/null || echo "# Polkadot Creative Identity" > README.md
    
    echo "  ✅ Polkadot grant extraction complete!"
}

# Main extraction process
echo ""
echo "🎯 Starting extraction process for all grants..."

# Extract each grant
extract_near_grant "near-creative-engine"
extract_solana_grant "solana-creative-engine"
extract_filecoin_grant "filecoin-creative-storage"
extract_mintbase_grant "mintbase-creative-marketplace"
extract_polkadot_grant "polkadot-creative-identity"

echo ""
echo "✅ All grant extractions complete!"
echo "📊 Summary:"
echo "  - NEAR Creative Engine: Extracted NEAR-specific AI integration"
echo "  - Solana Creative Engine: Extracted Solana-specific AI integration"
echo "  - Filecoin Creative Storage: Extracted Filecoin storage with AI"
echo "  - Mintbase Creative Marketplace: Extracted Mintbase/Bitte marketplace"
echo "  - Polkadot Creative Identity: Extracted Polkadot identity with AI"
echo ""
echo "🚀 Ready to push to GitHub repositories!"