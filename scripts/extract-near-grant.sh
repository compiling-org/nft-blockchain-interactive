#!/bin/bash

# NEAR Grant Extraction Script
# This script extracts ONLY NEAR-specific code from the main project
# DO NOT copy the entire project - only NEAR-related functionality

set -e  # Exit on any error

echo "🔍 Starting NEAR grant extraction..."

# Define source and target directories
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/grant-repositories/near-creative-engine"

# Create target directory structure
echo "📁 Creating NEAR project structure..."
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/src/contracts/near/soulbound-nft/src"
mkdir -p "$TARGET_DIR/src/contracts/near/cross-chain-ai/src"
mkdir -p "$TARGET_DIR/src/near-wasm/src"
mkdir -p "$TARGET_DIR/src/pages"
mkdir -p "$TARGET_DIR/src/services"

# Copy core NEAR integration files
echo "📋 Copying NEAR integration files..."
cp "$SOURCE_DIR/src/utils/near-ai-integration.ts" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/near-fractal-ai-integration.ts" "$TARGET_DIR/src/utils/"

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/services/myNearWalletService.ts" "$TARGET_DIR/src/services/"
cp "$SOURCE_DIR/src/pages/NEARCreativeEngine.tsx" "$TARGET_DIR/src/pages/NEARWalletTest.tsx"

# Copy NEAR smart contracts
echo "🏗️ Copying NEAR smart contracts..."
cp "$SOURCE_DIR/contracts/near/soulbound-nft/src/lib.rs" "$TARGET_DIR/src/contracts/near/soulbound-nft/src/"
if [ -f "$SOURCE_DIR/contracts/near/soulbound-nft/src/metadata.rs" ]; then
    cp "$SOURCE_DIR/contracts/near/soulbound-nft/src/metadata.rs" "$TARGET_DIR/src/contracts/near/soulbound-nft/src/"
fi

cp "$SOURCE_DIR/contracts/near/cross-chain-ai/src/lib.rs" "$TARGET_DIR/src/contracts/near/cross-chain-ai/src/"
if [ -f "$SOURCE_DIR/contracts/near/cross-chain-ai/src/metadata.rs" ]; then
    cp "$SOURCE_DIR/contracts/near/cross-chain-ai/src/metadata.rs" "$TARGET_DIR/src/contracts/near/cross-chain-ai/src/"
fi

# Copy NEAR WASM files
echo "⚙️ Copying NEAR WASM integration..."
cp "$SOURCE_DIR/src/near-wasm/src/lib.rs" "$TARGET_DIR/src/near-wasm/src/"
if [ -f "$SOURCE_DIR/src/near-wasm/src/simple_nft.rs" ]; then
    cp "$SOURCE_DIR/src/near-wasm/src/simple_nft.rs" "$TARGET_DIR/src/near-wasm/src/"
fi
if [ -f "$SOURCE_DIR/src/near-wasm/src/collaboration.rs" ]; then
    cp "$SOURCE_DIR/src/near-wasm/src/collaboration.rs" "$TARGET_DIR/src/near-wasm/src/"
fi
if [ -f "$SOURCE_DIR/src/near-wasm/src/dynamic_nft.rs" ]; then
    cp "$SOURCE_DIR/src/near-wasm/src/dynamic_nft.rs" "$TARGET_DIR/src/near-wasm/src/"
fi

# Create NEAR-specific package.json
echo "📦 Creating NEAR-specific package.json..."
cat > "$TARGET_DIR/package.json" << 'EOF'
{
  "name": "near-creative-engine",
  "version": "1.0.0",
  "description": "NEAR Creative Engine with AI/ML Integration",
  "main": "src/index.js",
  "scripts": {
    "build": "cargo build --target wasm32-unknown-unknown",
    "test": "cargo test",
    "deploy:testnet": "near deploy --accountId YOUR_TESTNET_ACCOUNT --wasmFile target/wasm32-unknown-unknown/release/near_creative_engine.wasm",
    "deploy:mainnet": "near deploy --accountId YOUR_MAINNET_ACCOUNT --wasmFile target/wasm32-unknown-unknown/release/near_creative_engine.wasm"
  },
  "dependencies": {
    "near-api-js": "^2.1.4",
    "@near-wallet-selector/core": "^8.9.3",
    "@near-wallet-selector/near-wallet": "^8.9.3",
    "@near-wallet-selector/meteor-wallet": "^8.9.3",
    "@near-wallet-selector/sender": "^8.9.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "keywords": ["near", "blockchain", "ai", "nft", "biometric"],
  "author": "NEAR Creative Engine Team",
  "license": "MIT"
}
EOF

# Create NEAR-specific Cargo.toml
echo "🔧 Creating NEAR-specific Cargo.toml..."
cat > "$TARGET_DIR/Cargo.toml" << 'EOF'
[package]
name = "near-creative-engine"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "4.1.1"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"

[profile.release.package."*"]
opt-level = "z"
EOF

# Create README.md for NEAR project
echo "📖 Creating NEAR README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# NEAR Creative Engine

A sophisticated AI-powered creative engine built on the NEAR blockchain, featuring biometric authentication, emotional NFTs, and cross-chain interoperability.

## Features

- **Biometric Authentication**: AI-powered biometric verification using EEG, heart rate, and facial recognition
- **Emotional NFTs**: Create NFTs based on real-time emotional data and biometric signals
- **Cross-Chain Bridge**: Interoperability with Solana, Filecoin, and other blockchains
- **AI/ML Integration**: Advanced machine learning for emotion classification and pattern recognition
- **Soulbound Tokens**: Non-transferable NFTs tied to biometric identity

## Quick Start

### Prerequisites
- Node.js 16+
- Rust toolchain
- NEAR CLI

### Installation
```bash
npm install
```

### Build Contracts
```bash
cargo build --target wasm32-unknown-unknown
```

### Deploy to Testnet
```bash
npm run deploy:testnet
```

## Architecture

### Core Components

1. **NEAR AI Integration** (`src/utils/near-ai-integration.ts`)
   - Biometric session processing
   - AI-powered emotion analysis
   - NFT minting with biometric data

2. **NEAR Fractal AI** (`src/utils/near-fractal-ai-integration.ts`)
   - Fractal pattern generation based on emotions
   - WGSL shader generation for WebGPU rendering
   - Real-time fractal animation

3. **Smart Contracts**
   - Soulbound NFT contract with biometric authentication
   - Cross-chain AI bridge for interoperability
   - Dynamic NFT with emotional state updates

## Usage

### Connect to NEAR
```javascript
import { createNEARAIIntegration } from './src/utils/near-ai-integration';

const nearAI = createNEARAIIntegration({
  networkId: 'testnet',
  contractId: 'your-contract.testnet'
});

await nearAI.initialize();
```

### Create Biometric NFT
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

const nft = await nearAI.createAIBiometricNFT(session, {
  title: 'My Emotional NFT',
  description: 'Created from biometric data',
  media: artBlob
});
```

## License
MIT
EOF

echo "✅ NEAR grant extraction completed!"
echo "📊 Summary:"
echo "  - Core NEAR integration files copied"
echo "  - NEAR smart contracts extracted"
echo "  - NEAR WASM integration included"
echo "  - NEAR-specific package.json created"
echo "  - NEAR-specific Cargo.toml created"
echo "  - README.md with NEAR-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run 'cargo build --target wasm32-unknown-unknown' to build contracts"
echo "  4. Test NEAR integration functionality"
echo "  5. Push to GitHub repository"
