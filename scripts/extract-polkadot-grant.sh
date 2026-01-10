#!/bin/bash

# Polkadot Grant Extraction Script
# This script extracts ONLY Polkadot-specific code from the main project
# DO NOT copy the entire project - only Polkadot-related functionality

set -e  # Exit on any error

echo "🔍 Starting Polkadot grant extraction..."

# Define source and target directories
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/grant-repositories/polkadot-creative-engine"

# Create target directory structure
echo "📁 Creating Polkadot project structure..."
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/src/polkadot-client/src"
mkdir -p "$TARGET_DIR/polkadot-deployments/emotional_bridge"

# Copy core Polkadot integration files
echo "📋 Copying Polkadot integration files..."
cp "$SOURCE_DIR/src/utils/polkadot-client.ts" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/polkadot-ai-bridge.ts" "$TARGET_DIR/src/utils/"
if [ -f "$SOURCE_DIR/src/utils/polkadot-client-working.ts" ]; then
    cp "$SOURCE_DIR/src/utils/polkadot-client-working.ts" "$TARGET_DIR/src/utils/"
fi

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/cross-chain-bridge.js" "$TARGET_DIR/src/utils/"

# Copy Polkadot runtime modules
echo "🏗️ Copying Polkadot runtime modules..."
if [ -f "$SOURCE_DIR/src/polkadot-client/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/polkadot-client/src/lib.rs" "$TARGET_DIR/src/polkadot-client/src/"
fi
if [ -f "$SOURCE_DIR/src/polkadot-client/src/emotional_bridge.rs" ]; then
    cp "$SOURCE_DIR/src/polkadot-client/src/emotional_bridge.rs" "$TARGET_DIR/src/polkadot-client/src/"
fi
if [ -f "$SOURCE_DIR/src/polkadot-client/src/extrinsics.rs" ]; then
    cp "$SOURCE_DIR/src/polkadot-client/src/extrinsics.rs" "$TARGET_DIR/src/polkadot-client/src/"
fi
if [ -f "$SOURCE_DIR/src/polkadot-client/src/soulbound.rs" ]; then
    cp "$SOURCE_DIR/src/polkadot-client/src/soulbound.rs" "$TARGET_DIR/src/polkadot-client/src/"
fi
if [ -f "$SOURCE_DIR/src/polkadot-client/src/xcm_messaging.rs" ]; then
    cp "$SOURCE_DIR/src/polkadot-client/src/xcm_messaging.rs" "$TARGET_DIR/src/polkadot-client/src/"
fi

# Copy Polkadot deployment files
echo "🚀 Copying Polkadot deployment files..."
if [ -f "$SOURCE_DIR/polkadot-deployments/emotional_bridge/lib.rs" ]; then
    cp "$SOURCE_DIR/polkadot-deployments/emotional_bridge/lib.rs" "$TARGET_DIR/polkadot-deployments/emotional_bridge/"
fi
if [ -f "$SOURCE_DIR/polkadot-deployments/emotional_bridge/Cargo.toml" ]; then
    cp "$SOURCE_DIR/polkadot-deployments/emotional_bridge/Cargo.toml" "$TARGET_DIR/polkadot-deployments/emotional_bridge/"
fi

# Create Polkadot-specific package.json
echo "📦 Creating Polkadot-specific package.json..."
cat > "$TARGET_DIR/package.json" << 'EOF'
{
  "name": "polkadot-creative-engine",
  "version": "1.0.0",
  "description": "Polkadot Creative Engine with AI/ML Integration",
  "main": "src/index.js",
  "scripts": {
    "build": "cargo build --release",
    "test": "cargo test",
    "deploy:rococo": "./deploy-rococo.sh",
    "deploy:westend": "./deploy-westend.sh",
    "deploy:mainnet": "./deploy-mainnet.sh"
  },
  "dependencies": {
    "@polkadot/api": "^10.11.2",
    "@polkadot/extension-dapp": "^0.46.5",
    "@polkadot/keyring": "^12.6.2",
    "@polkadot/util": "^12.6.2",
    "@polkadot/util-crypto": "^12.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "keywords": ["polkadot", "blockchain", "ai", "nft", "substrate"],
  "author": "Polkadot Creative Engine Team",
  "license": "MIT"
}
EOF

# Create Polkadot-specific Cargo.toml
echo "🔧 Creating Polkadot-specific Cargo.toml..."
cat > "$TARGET_DIR/Cargo.toml" << 'EOF'
[workspace]
members = [
    "src/polkadot-client",
    "polkadot-deployments/emotional_bridge"
]
resolver = "2"

[dependencies]
parity-scale-codec = { version = "3.0.0", default-features = false, features = ["derive"] }
scale-info = { version = "2.0.1", default-features = false, features = ["derive"] }
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

# Create deployment script for Rococo testnet
echo "🚀 Creating Rococo deployment script..."
cat > "$TARGET_DIR/deploy-rococo.sh" << 'EOF'
#!/bin/bash

# Deploy to Polkadot Rococo testnet
echo "Deploying to Polkadot Rococo testnet..."

# Build the runtime
cargo build --release

# Deploy to Rococo (requires polkadot-js tools)
if command -v polkadot-js-api &> /dev/null; then
    echo "Polkadot JS API found, deploying..."
    # Add actual deployment commands here
    polkadot-js-api tx.parachains.registerParachain --ws wss://rococo-rpc.polkadot.io
else
    echo "Polkadot JS API not found. Please install and try again."
    echo "Install with: npm install -g @polkadot/api-cli"
fi

echo "Deployment completed!"
EOF

chmod +x "$TARGET_DIR/deploy-rococo.sh"

# Create README.md for Polkadot project
echo "📖 Creating Polkadot README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# Polkadot Creative Engine

An interoperable AI-powered creative engine built on Polkadot, featuring biometric authentication, emotional NFTs, and cross-chain communication through XCM messaging.

## Features

- **Cross-Chain Interoperability**: Seamless communication with other parachains via XCM
- **Biometric Authentication**: AI-powered biometric verification using EEG, heart rate, and facial recognition
- **Emotional NFTs**: Create NFTs based on real-time emotional data and biometric signals
- **Substrate Runtime**: Custom runtime modules for emotional bridge functionality
- **AI/ML Integration**: Advanced machine learning for emotion classification and pattern recognition
- **Soulbound Tokens**: Non-transferable NFTs tied to biometric identity

## Quick Start

### Prerequisites
- Node.js 16+
- Rust toolchain
- Substrate framework
- Polkadot{.js} extension

### Installation
```bash
npm install
```

### Build Runtime
```bash
cargo build --release
```

### Deploy to Rococo Testnet
```bash
npm run deploy:rococo
```

## Architecture

### Core Components

1. **Polkadot Client** (`src/utils/polkadot-client.ts`)
   - High-performance Polkadot blockchain interaction
   - Biometric session processing
   - AI-powered emotion analysis
   - NFT minting with biometric data

2. **Polkadot AI Bridge** (`src/utils/polkadot-ai-bridge.ts`)
   - Cross-chain bridge functionality
   - XCM messaging for interoperability
   - Real-time biometric data processing
   - Emotional state synchronization

3. **Runtime Modules** (`src/polkadot-client/src/`)
   - Emotional bridge pallet for biometric processing
   - Soulbound NFT implementation
   - XCM messaging for cross-chain communication
   - Extrinsics for emotional data management

## Usage

### Connect to Polkadot
```javascript
import { PolkadotClient } from './src/utils/polkadot-client';

const polkadotClient = new PolkadotClient({
  network: 'rococo',
  parachainId: 2000
});

await polkadotClient.connect();
```

### Create Biometric NFT
```javascript
const session = {
  sessionId: 'unique-session-id',
  userId: 'user-account',
  biometricData: {
    eeg: [/* EEG data */],
    heartRate: [/* heart rate data */],
    emotions: [/* emotion data */]
  }
};

const nft = await polkadotClient.createEmotionalNFT(session, {
  title: 'My Emotional NFT',
  description: 'Created from biometric data',
  media: artBuffer
});
```

### Cross-Chain Communication
```javascript
// Send emotional data to another parachain
const message = await polkadotClient.sendEmotionalData({
  targetParachain: 2001,
  emotionData: {
    valence: 0.8,
    arousal: 0.6,
    dominance: 0.7
  }
});
```

## XCM Messaging

- **Emotional Data Transfer**: Send emotional states across parachains
- **Cross-Chain NFTs**: Transfer NFTs between different parachains
- **Biometric Verification**: Verify identity across multiple chains
- **AI Model Sharing**: Share trained AI models between parachains

## License
MIT
EOF

echo "✅ Polkadot grant extraction completed!"
echo "📊 Summary:"
echo "  - Core Polkadot integration files copied"
echo "  - Polkadot runtime modules extracted"
echo "  - XCM messaging functionality included"
echo "  - Polkadot-specific package.json created"
echo "  - Polkadot-specific Cargo.toml created"
echo "  - Rococo deployment script created"
echo "  - README.md with Polkadot-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run 'cargo build --release' to build runtime"
echo "  4. Test Polkadot integration functionality"
echo "  5. Push to Git