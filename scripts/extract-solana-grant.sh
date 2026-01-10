#!/bin/bash

# Solana Grant Extraction Script
# This script extracts ONLY Solana-specific code from the main project
# DO NOT copy the entire project - only Solana-related functionality

set -e  # Exit on any error

echo "🔍 Starting Solana grant extraction..."

# Define source and target directories
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/grant-repositories/solana-creative-engine"

# Create target directory structure
echo "📁 Creating Solana project structure..."
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/src/contracts/solana/biometric-nft/programs/biometric-nft/src"
mkdir -p "$TARGET_DIR/src/contracts/solana/cross-chain-ai/programs/cross-chain-ai/src"
mkdir -p "$TARGET_DIR/src/solana-client/src"

# Copy core Solana integration files
echo "📋 Copying Solana integration files..."
cp "$SOURCE_DIR/src/utils/solana-client.ts" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/solana-enhanced-integration.ts" "$TARGET_DIR/src/utils/"
if [ -f "$SOURCE_DIR/src/utils/solana-client-enhanced.ts" ]; then
    cp "$SOURCE_DIR/src/utils/solana-client-enhanced.ts" "$TARGET_DIR/src/utils/"
fi

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" "$TARGET_DIR/src/utils/"

# Copy Solana smart contracts
echo "🏗️ Copying Solana smart contracts..."
if [ -f "$SOURCE_DIR/src/solana-program/programs/biometric-nft/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/solana-program/programs/biometric-nft/src/lib.rs" "$TARGET_DIR/src/contracts/solana/biometric-nft/programs/biometric-nft/src/"
elif [ -f "$SOURCE_DIR/contracts/solana/biometric-nft/programs/biometric-nft/src/lib.rs" ]; then
    cp "$SOURCE_DIR/contracts/solana/biometric-nft/programs/biometric-nft/src/lib.rs" "$TARGET_DIR/src/contracts/solana/biometric-nft/programs/biometric-nft/src/"
fi

if [ -f "$SOURCE_DIR/src/solana-program/programs/cross-chain-ai/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/solana-program/programs/cross-chain-ai/src/lib.rs" "$TARGET_DIR/src/contracts/solana/cross-chain-ai/programs/cross-chain-ai/src/"
elif [ -f "$SOURCE_DIR/contracts/solana/cross-chain-ai/programs/cross-chain-ai/src/lib.rs" ]; then
    cp "$SOURCE_DIR/contracts/solana/cross-chain-ai/programs/cross-chain-ai/src/lib.rs" "$TARGET_DIR/src/contracts/solana/cross-chain-ai/programs/cross-chain-ai/src/"
fi

# Copy Solana client libraries
echo "⚙️ Copying Solana client libraries..."
if [ -f "$SOURCE_DIR/src/solana-client/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/solana-client/src/lib.rs" "$TARGET_DIR/src/solana-client/src/"
fi
if [ -f "$SOURCE_DIR/src/solana-client/src/neuroemotive.rs" ]; then
    cp "$SOURCE_DIR/src/solana-client/src/neuroemotive.rs" "$TARGET_DIR/src/solana-client/src/"
fi
if [ -f "$SOURCE_DIR/src/solana-client/src/storage_advanced.rs" ]; then
    cp "$SOURCE_DIR/src/solana-client/src/storage_advanced.rs" "$TARGET_DIR/src/solana-client/src/"
fi

# Create Solana-specific package.json
echo "📦 Creating Solana-specific package.json..."
cat > "$TARGET_DIR/package.json" << 'EOF'
{
  "name": "solana-creative-engine",
  "version": "1.0.0",
  "description": "Solana Creative Engine with AI/ML Integration",
  "main": "src/index.js",
  "scripts": {
    "build": "anchor build",
    "test": "anchor test",
    "deploy:devnet": "anchor deploy --provider.cluster devnet",
    "deploy:testnet": "anchor deploy --provider.cluster testnet",
    "deploy:mainnet": "anchor deploy --provider.cluster mainnet"
  },
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@solana/spl-token": "^0.3.9",
    "@project-serum/anchor": "^0.28.0",
    "@coral-xyz/anchor": "^0.28.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "anchor-cli": "^0.28.0"
  },
  "keywords": ["solana", "blockchain", "ai", "nft", "biometric"],
  "author": "Solana Creative Engine Team",
  "license": "MIT"
}
EOF

# Create Solana-specific Cargo.toml
echo "🔧 Creating Solana-specific Cargo.toml..."
cat > "$TARGET_DIR/Cargo.toml" << 'EOF'
[workspace]
members = [
    "src/contracts/solana/*"
]
resolver = "2"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"

[profile.release.package."*"]
opt-level = "z"
EOF

# Create Anchor.toml
echo "⚓ Creating Anchor.toml..."
cat > "$TARGET_DIR/Anchor.toml" << 'EOF'
[features]
seeds = false
skip-lint = false

[programs.localnet]
solana_creative_engine = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[programs.devnet]
solana_creative_engine = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'"
EOF

# Create README.md for Solana project
echo "📖 Creating Solana README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# Solana Creative Engine

A high-performance AI-powered creative engine built on Solana, featuring biometric authentication, emotional NFTs, and lightning-fast transactions.

## Features

- **Biometric Authentication**: AI-powered biometric verification using EEG, heart rate, and facial recognition
- **Emotional NFTs**: Create NFTs based on real-time emotional data and biometric signals
- **High Performance**: Leverage Solana's fast transaction speeds and low costs
- **AI/ML Integration**: Advanced machine learning for emotion classification and pattern recognition
- **Cross-Chain Bridge**: Interoperability with NEAR, Filecoin, and other blockchains

## Quick Start

### Prerequisites
- Node.js 16+
- Rust toolchain
- Solana CLI
- Anchor framework

### Installation
```bash
npm install
```

### Build Programs
```bash
anchor build
```

### Deploy to Devnet
```bash
npm run deploy:devnet
```

## Architecture

### Core Components

1. **Solana Client** (`src/utils/solana-client.ts`)
   - High-performance Solana blockchain interaction
   - Biometric session processing
   - AI-powered emotion analysis
   - NFT minting with biometric data

2. **Solana Enhanced Integration** (`src/utils/solana-enhanced-integration.ts`)
   - Advanced Solana program interactions
   - Cross-chain bridge functionality
   - Real-time biometric data processing

3. **Smart Programs**
   - Biometric NFT program with emotion-based metadata
   - Cross-chain AI bridge for interoperability
   - High-performance emotional state management

## Usage

### Connect to Solana
```javascript
import { SolanaClient } from './src/utils/solana-client';

const solanaClient = new SolanaClient({
  network: 'devnet',
  programId: 'YourProgramId'
});

await solanaClient.connect();
```

### Create Biometric NFT
```javascript
const session = {
  sessionId: 'unique-session-id',
  userId: 'user-wallet-address',
  biometricData: {
    eeg: [/* EEG data */],
    heartRate: [/* heart rate data */],
    emotions: [/* emotion data */]
  }
};

const nft = await solanaClient.createEmotionalNFT(session, {
  title: 'My Emotional NFT',
  description: 'Created from biometric data',
  media: artBuffer
});
```

## License
MIT
EOF

echo "✅ Solana grant extraction completed!"
echo "📊 Summary:"
echo "  - Core Solana integration files copied"
echo "  - Solana smart contracts extracted"
echo "  - Solana client libraries included"
echo "  - Solana-specific package.json created"
echo "  - Solana-specific Cargo.toml created"
echo "  - Anchor.toml configuration created"
echo "  - README.md with Solana-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run 'anchor build' to build programs"
echo "  4. Test Solana integration functionality"
echo "  5. Push to GitHub repository"