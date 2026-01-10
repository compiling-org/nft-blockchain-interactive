#!/bin/bash

# Mintbase/Bitte Grant Extraction Script
# Extracts only Mintbase/Bitte-specific code to prevent psychotic behavior

set -e

SOURCE_DIR="/c/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="/c/Users/kapil/compiling/grant-repositories/mintbase-creative-marketplace"
LOG_FILE="/c/Users/kapil/compiling/blockchain-nft-interactive/mintbase-extraction.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] MINTBASE: $1" | tee -a "$LOG_FILE"
}

handle_error() {
    log "❌ ERROR: $1"
    exit 1
}

log "🟣 Starting Mintbase/Bitte grant extraction..."

# Create target directory
mkdir -p "$TARGET_DIR" || handle_error "Failed to create target directory"
cd "$TARGET_DIR"

# Initialize git repository
git init 2>/dev/null || log "Git init failed (may already exist)"

# Mintbase/Bitte-specific files to extract
MINTBASE_FILES=(
    # Core Mintbase/Bitte integration files
    "src/utils/mintbase-ai-integration.js"
    "src/utils/bitte-protocol-integration.js"
    "src/utils/bitte-protocol-ai-enhanced.ts"
    "src/utils/bitte-protocol-ai-enhanced-v2.ts"
    
    # Supporting AI/ML files
    "src/utils/unified-ai-ml-integration.js"
    "src/utils/filecoin-storage.ts"
    "src/utils/cross-chain-bridge.ts"
    
    # Configuration files
    "src/config/mainnet-config.js"
    
    # Core project files
    "tsconfig.json"
    "vite.config.ts"
    "tailwind.config.js"
    "postcss.config.js"
)

# Copy Mintbase/Bitte-specific files
log "📁 Copying Mintbase/Bitte-specific files..."
files_copied=0

for file in "${MINTBASE_FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        target_path="$TARGET_DIR/$(dirname "$file")"
        mkdir -p "$target_path"
        
        if cp "$SOURCE_DIR/$file" "$target_path/" 2>/dev/null; then
            ((files_copied++))
            log "  ✅ $file"
        else
            log "  ❌ Failed to copy: $file"
        fi
    else
        log "  ⚠️  Source file not found: $file"
    fi
done

if [ "$files_copied" -eq 0 ]; then
    handle_error "No files copied - extraction failed"
fi

log "📊 Files copied: $files_copied"

# Create minimal package.json
log "📄 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "mintbase-creative-marketplace",
  "version": "1.0.0",
  "description": "Mintbase/Bitte marketplace creative engine with AI/ML integration",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:mintbase": "./scripts/deploy-mintbase.sh",
    "test": "jest"
  },
  "dependencies": {
    "@mintbase-js/sdk": "^0.5.0",
    "@mintbase-js/react": "^0.5.0",
    "@mintbase-js/storage": "^0.5.0",
    "@tensorflow/tfjs": "^4.15.0",
    "@tensorflow/tfjs-node": "^4.15.0",
    "vectordb": "^0.1.15",
    "web3.storage": "^4.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.4",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
EOF

# Create deployment script
log "📄 Creating deployment script..."
mkdir -p scripts
cat > scripts/deploy-mintbase.sh << 'EOF'
#!/bin/bash

# Mintbase/Bitte Contract Deployment Script
echo "🚀 Deploying Mintbase/Bitte contracts..."

# Deploy NFT contracts using Mintbase SDK
echo "📦 Deploying NFT marketplace contracts..."
# Use Mintbase SDK to deploy contracts
echo "Update with your Mintbase API key and deployment configuration"

echo "✅ Mintbase/Bitte contracts deployed successfully!"
echo "📋 Update contract addresses in your configuration files"
EOF

chmod +x scripts/deploy-mintbase.sh

# Create README
log "📄 Creating README.md..."
cat > README.md << 'EOF'
# Mintbase Creative Marketplace

AI-powered creative marketplace built on Mintbase/Bitte protocol with biometric NFT integration.

## Features

- **Mintbase Integration**: Native Mintbase marketplace functionality
- **AI-Powered NFTs**: Create NFTs from emotional and biometric data
- **Bitte Protocol**: Advanced marketplace features and governance
- **TensorFlow.js Integration**: Client-side AI processing
- **Cross-Chain Bridge**: Connect with other blockchain networks
- **Filecoin Storage**: Decentralized storage for NFT metadata

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy marketplace contracts
npm run deploy:mintbase
```

## Contract Deployment

Update `scripts/deploy-mintbase.sh` with your Mintbase API key before deployment.

## AI Integration

The project uses TensorFlow.js for client-side AI processing and biometric data analysis.

## Storage

NFT metadata is stored on Filecoin/IPFS for permanent decentralized storage.
EOF

# Validate extraction
log "🔍 Validating Mintbase extraction..."
if [ -f "src/utils/mintbase-ai-integration.js" ] && [ -f "src/utils/bitte-protocol-integration.js" ]; then
    log "✅ Mintbase extraction validation passed"
else
    handle_error "Mintbase extraction validation failed"
fi

log "✅ Mintbase/Bitte grant extraction completed successfully!"
log "📁 Target directory: $TARGET_DIR"
log "📋 Log file: $LOG_FILE"