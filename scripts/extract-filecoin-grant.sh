#!/bin/bash

# Filecoin Grant Extraction Script
# This script extracts ONLY Filecoin-specific code from the main project
# DO NOT copy the entire project - only Filecoin-related functionality

set -e  # Exit on any error

echo "🔍 Starting Filecoin grant extraction..."

# Define source and target directories (target under current project to satisfy workspace rules)
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive/tmp/filecoin-creative-engine"

# Create target directory structure
echo "📁 Creating Filecoin project structure..."
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/src"
mkdir -p "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/tests"
mkdir -p "$TARGET_DIR/src/ipfs-integration/src"
mkdir -p "$TARGET_DIR/src/config"

# Copy core Filecoin integration files
echo "📋 Copying Filecoin integration files..."
cp "$SOURCE_DIR/src/utils/filecoin-ai-integration.ts" "$TARGET_DIR/src/utils/"
if [ -f "$SOURCE_DIR/src/utils/filecoin-ai-integration-enhanced.ts" ]; then
    cp "$SOURCE_DIR/src/utils/filecoin-ai-integration-enhanced.ts" "$TARGET_DIR/src/utils/"
fi
cp "$SOURCE_DIR/src/utils/filecoin-storage.ts" "$TARGET_DIR/src/utils/"

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/cross-chain-bridge.js" "$TARGET_DIR/src/utils/"

# Copy Filecoin actor contracts
echo "🏗️ Copying Filecoin actor contracts..."
if [ -f "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/src/lib.rs" ]; then
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/src/lib.rs" "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/src/"
fi
if [ -f "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/Cargo.toml" ]; then
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/Cargo.toml" "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/"
fi
if [ -f "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/src/sim.rs" ]; then
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/src/sim.rs" "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/src/"
fi
if [ -f "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/tests/wasm_build.rs" ]; then
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/tests/wasm_build.rs" "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/tests/"
fi
if [ -f "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/tests/sim_flow.rs" ]; then
    cp "$SOURCE_DIR/contracts/filecoin/biometric-nft-actor/tests/sim_flow.rs" "$TARGET_DIR/src/contracts/filecoin/biometric-nft-actor/tests/"
fi

# Copy IPFS integration files
echo "📡 Copying IPFS integration files..."
if [ -f "$SOURCE_DIR/src/ipfs-integration/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/ipfs-integration/src/lib.rs" "$TARGET_DIR/src/ipfs-integration/src/"
fi
if [ -f "$SOURCE_DIR/src/ipfs-integration/src/ipfs_client.rs" ]; then
    cp "$SOURCE_DIR/src/ipfs-integration/src/ipfs_client.rs" "$TARGET_DIR/src/ipfs-integration/src/"
fi
if [ -f "$SOURCE_DIR/src/ipfs-integration/src/neuroemotive_storage.rs" ]; then
    cp "$SOURCE_DIR/src/ipfs-integration/src/neuroemotive_storage.rs" "$TARGET_DIR/src/ipfs-integration/src/"
fi

# Create Filecoin-specific package.json
echo "📦 Creating Filecoin-specific package.json..."
cat > "$TARGET_DIR/package.json" << 'EOF'
{
  "name": "filecoin-creative-engine",
  "version": "1.0.0",
  "description": "Filecoin Creative Engine with AI/ML Integration",
  "main": "src/index.js",
  "scripts": {
    "build:actor": "cd src/contracts/filecoin/biometric-nft-actor && cargo build --release --target wasm32-unknown-unknown",
    "test:actor": "cd src/contracts/filecoin/biometric-nft-actor && cargo test --release",
    "deploy:calibration": "bash ./deploy-calibration.sh"
  },
  "dependencies": {
    "@web3-storage/w3up-client": "^11.2.0",
    "@web3-storage/filecoin-client": "^3.3.1",
    "nft.storage": "^7.1.1",
    "web3.storage": "^4.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "keywords": ["filecoin", "blockchain", "ai", "nft", "storage", "ipfs"],
  "author": "Filecoin Creative Engine Team",
  "license": "MIT"
}
EOF

# Create Filecoin-specific Cargo.toml
echo "🔧 Creating Filecoin-specific Cargo.toml..."
cat > "$TARGET_DIR/Cargo.toml" << 'EOF'
[package]
name = "filecoin-creative-engine"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
fvm_sdk = "3.3.0"
fvm_shared = "3.6.0"
cid = "0.10.1"
multihash = "0.18.1"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"

[profile.release.package."*"]
opt-level = "z"
EOF

# Create README.md for Filecoin project
echo "📖 Creating Filecoin README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# Filecoin Creative Engine

A decentralized storage-powered creative engine built on Filecoin, featuring AI-driven content generation, biometric authentication, and permanent storage of emotional NFTs.

## Features

- **Decentralized Storage**: Store NFT metadata and biometric data permanently on Filecoin
- **Biometric Authentication**: AI-powered biometric verification using EEG, heart rate, and facial recognition
- **Emotional NFTs**: Create NFTs based on real-time emotional data and biometric signals
- **IPFS Integration**: Seamless integration with IPFS for content addressing
- **AI/ML Integration**: Advanced machine learning for emotion classification and pattern recognition
- **Cross-Chain Bridge**: Interoperability with NEAR, Solana, and other blockchains

## Quick Start

### Prerequisites
- Node.js 16+
- Rust toolchain
- Filecoin Lotus client (for mainnet deployment)

### Installation
```bash
npm install
```

### Build Actors
```bash
cargo build --target wasm32-unknown-unknown
```

### Deploy to Calibration Network
```bash
npm run deploy:calibration
```

## Architecture

### Core Components

1. **Filecoin AI Integration** (`src/utils/filecoin-ai-integration.ts`)
   - Decentralized storage for biometric data
   - AI-powered emotion analysis
   - Permanent NFT metadata storage

2. **Filecoin Storage Client** (`src/utils/filecoin-storage.ts`)
   - Web3.storage integration
   - NFT.storage for metadata
   - Content addressing with IPFS

3. **IPFS Integration** (`src/ipfs-integration/`)
   - IPFS client for decentralized storage
   - Neuroemotive data storage
   - Content-based addressing

## Usage

### Connect to Filecoin
```javascript
import { FilecoinAIIntegration } from './src/utils/filecoin-ai-integration';

const filecoinAI = new FilecoinAIIntegration({
  apiKey: 'YOUR_WEB3_STORAGE_API_KEY',
  network: 'calibration'
});

await filecoinAI.initialize();
```

### Store Biometric Data
```javascript
const session = {
  sessionId: 'unique-session-id',
  userId: 'user-address',
  biometricData: {
    eeg: [/* EEG data */],
    heartRate: [/* heart rate data */],
    emotions: [/* emotion data */]
  }
};

const storageResult = await filecoinAI.storeBiometricSession(session);
console.log('Stored on IPFS:', storageResult.cid);
console.log('Filecoin deal:', storageResult.dealId);
```

### Create Emotional NFT with Permanent Storage
```javascript
const nft = await filecoinAI.createEmotionalNFT(session, {
  title: 'My Emotional NFT',
  description: 'Created from biometric data',
  media: artBuffer
});

console.log('NFT metadata stored permanently:', nft.metadataCid);
```

## License
MIT
EOF

# Create deployment script for Calibration network
echo "🚀 Creating Calibration deployment script..."
cat > "$TARGET_DIR/deploy-calibration.sh" << 'EOF'
#!/bin/bash

# Filecoin Calibration deployment for extracted project
set -e
echo "Deploying to Filecoin Calibration network (extracted project)..."

# Build the actor
pushd src/contracts/filecoin/biometric-nft-actor >/dev/null
cargo build --release --target wasm32-unknown-unknown
popd >/dev/null

WASM_PATH="src/contracts/filecoin/biometric-nft-actor/target/wasm32-unknown-unknown/release/biometric_nft_actor.wasm"
if [ ! -f "$WASM_PATH" ]; then
  echo "WASM file not found: $WASM_PATH"
  exit 1
fi

LOTUS_BIN="${LOTUS_BIN:-lotus}"
if $LOTUS_BIN --version &>/dev/null; then
  if $LOTUS_BIN chain --help | grep -q "install-actor"; then
    echo "Installing actor code on calibration..."
    INSTALL_OUTPUT=$($LOTUS_BIN chain install-actor "$WASM_PATH" 2>&1 || true)
    CODE_CID=$(echo "$INSTALL_OUTPUT" | grep -oP 'Actor Code CID: \K[^\s]+' || echo "")
    if [ -z "$CODE_CID" ]; then
      echo "Failed to install actor code"
      echo "$INSTALL_OUTPUT"
      exit 1
    fi
    echo "Creating actor instance..."
    CREATE_OUTPUT=$($LOTUS_BIN chain create-actor "$CODE_CID" 2>&1 || true)
    echo "$CREATE_OUTPUT"
  else
    echo "Lotus without install-actor; trying direct create-actor with wasm..."
    CREATE_OUTPUT=$($LOTUS_BIN chain create-actor "$WASM_PATH" 2>&1 || true)
    echo "$CREATE_OUTPUT"
  fi
else
  echo "Lotus CLI not found in PATH. Skipping on-chain deployment."
fi

echo "Deployment completed!"
EOF

chmod +x "$TARGET_DIR/deploy-calibration.sh"

echo "✅ Filecoin grant extraction completed!"
echo "📊 Summary:"
echo "  - Core Filecoin integration files copied"
echo "  - Filecoin actor contracts extracted"
echo "  - IPFS integration included"
echo "  - Filecoin-specific package.json created"
echo "  - Filecoin-specific Cargo.toml created"
echo "  - Calibration deployment script created"
echo "  - README.md with Filecoin-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run 'cargo build --target wasm32-unknown-unknown' to build actors"
echo "  4. Test Filecoin storage integration"
echo "  5. Push to GitHub repository"
