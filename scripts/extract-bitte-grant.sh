#!/bin/bash

# Bitte Protocol Grant Extraction Script
# This script extracts ONLY Bitte Protocol-specific code from the main project
# DO NOT copy the entire project - only Bitte Protocol-related functionality

set -e  # Exit on any error

echo "🔍 Starting Bitte Protocol grant extraction..."

# Define source and target directories
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/grant-repositories/bitte-creative-engine"

# Create target directory structure
echo "📁 Creating Bitte Protocol project structure..."
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/src/mintbase"

# Copy core Bitte Protocol integration files
echo "📋 Copying Bitte Protocol integration files..."
cp "$SOURCE_DIR/src/utils/mintbase-ai-integration.js" "$TARGET_DIR/src/utils/"
if [ -f "$SOURCE_DIR/src/utils/bitte-protocol-ai-enhanced-v2.ts" ]; then
    cp "$SOURCE_DIR/src/utils/bitte-protocol-ai-enhanced-v2.ts" "$TARGET_DIR/src/utils/"
fi
cp "$SOURCE_DIR/src/utils/bitte-protocol-integration.js" "$TARGET_DIR/src/utils/"

# Copy Mintbase integration files
if [ -f "$SOURCE_DIR/src/mintbase/nuwe-ai-ml-integration.js" ]; then
    cp "$SOURCE_DIR/src/mintbase/nuwe-ai-ml-integration.js" "$TARGET_DIR/src/mintbase/"
fi

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/cross-chain-bridge.js" "$TARGET_DIR/src/utils/"

# Create Bitte Protocol-specific package.json
echo "📦 Creating Bitte Protocol-specific package.json..."
cat > "$TARGET_DIR/package.json" << 'EOF'
{
  "name": "bitte-creative-engine",
  "version": "1.0.0",
  "description": "Bitte Protocol Creative Engine with AI/ML Integration",
  "main": "src/index.js",
  "scripts": {
    "build": "npm run build",
    "test": "npm test",
    "deploy:testnet": "near deploy --accountId YOUR_TESTNET_ACCOUNT --wasmFile out/main.wasm",
    "deploy:mainnet": "near deploy --accountId YOUR_MAINNET_ACCOUNT --wasmFile out/main.wasm"
  },
  "dependencies": {
    "@mintbase-js/sdk": "^0.9.0",
    "@mintbase-js/data": "^0.9.0",
    "@mintbase-js/react": "^0.9.0",
    "@mintbase-js/storage": "^0.9.0",
    "near-api-js": "^2.1.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "keywords": ["bitte", "mintbase", "blockchain", "ai", "nft", "marketplace"],
  "author": "Bitte Protocol Creative Engine Team",
  "license": "MIT"
}
EOF

# Create README.md for Bitte Protocol project
echo "📖 Creating Bitte Protocol README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# Bitte Protocol Creative Engine

A next-generation AI-powered creative marketplace built on Bitte Protocol (formerly Mintbase), featuring biometric authentication, emotional NFTs, and advanced marketplace functionality.

## Features

- **AI-Powered Marketplace**: Advanced AI integration for NFT discovery and recommendations
- **Biometric Authentication**: AI-powered biometric verification using EEG, heart rate, and facial recognition
- **Emotional NFTs**: Create NFTs based on real-time emotional data and biometric signals
- **Advanced Marketplace**: Sophisticated marketplace with AI-driven pricing and discovery
- **Cross-Chain Bridge**: Interoperability with NEAR, Solana, Filecoin, and other blockchains

## Quick Start

### Prerequisites
- Node.js 16+
- NEAR account for Bitte Protocol access

### Installation
```bash
npm install
```

### Connect to Bitte Protocol
```bash
# Set up your NEAR account
near login

# Deploy to testnet
npm run deploy:testnet
```

## Architecture

### Core Components

1. **Bitte Protocol AI Integration** (`src/utils/bitte-protocol-integration.js`)
   - NEAR blockchain integration via Bitte Protocol
   - Biometric session processing
   - AI-powered emotion analysis
   - NFT minting with biometric data

2. **Mintbase AI Integration** (`src/utils/mintbase-ai-integration.js`)
   - Advanced marketplace functionality
   - AI-driven NFT recommendations
   - Emotional data integration
   - Cross-chain bridge functionality

3. **Nuwe AI/ML Integration** (`src/mintbase/nuwe-ai-ml-integration.js`)
   - Specialized AI/ML processing for creative content
   - Biometric data analysis
   - Emotional pattern recognition
   - Creative content generation

## Usage

### Connect to Bitte Protocol
```javascript
import { BitteProtocolIntegration } from './src/utils/bitte-protocol-integration';

const bitteProtocol = new BitteProtocolIntegration({
  network: 'testnet',
  accountId: 'your-account.testnet'
});

await bitteProtocol.initialize();
```

### Create Emotional NFT on Marketplace
```javascript
const session = {
  sessionId: 'unique-session-id',
  userId: 'user-account.testnet',
  biometricData: {
    eeg: [/* EEG data */],
    heartRate: [/* heart rate data */],
    emotions: [/* emotion data */]
  }
};

const nft = await bitteProtocol.createEmotionalNFT(session, {
  title: 'My Emotional NFT',
  description: 'Created from biometric data',
  media: artBlob,
  price: '1.5' // Price in NEAR
});
```

### AI-Powered Marketplace Discovery
```javascript
// Get AI-recommended NFTs based on emotional profile
const recommendations = await bitteProtocol.getEmotionalRecommendations({
  valence: 0.8,      // Positive emotion
  arousal: 0.6,      // Medium energy
  dominance: 0.7     // High control
});

console.log('AI recommendations:', recommendations);
```

## Marketplace Features

- **Emotional Search**: Find NFTs based on emotional content
- **AI Pricing**: Dynamic pricing based on emotional impact
- **Biometric Verification**: Verify creator identity through biometrics
- **Cross-Chain Trading**: Trade NFTs across multiple blockchains
- **Creative Analytics**: AI-powered insights for creators and collectors

## License
MIT
EOF

echo "✅ Bitte Protocol grant extraction completed!"
echo "📊 Summary:"
echo "  - Core Bitte Protocol integration files copied"
echo "  - Mintbase marketplace functionality included"
echo "  - AI/ML biometric processing integrated"
echo "  - Bitte Protocol-specific package.json created"
echo "  - README.md with marketplace-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Test Bitte Protocol integration functionality"
echo "  4. Push to GitHub repository"