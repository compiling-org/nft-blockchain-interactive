# NFT Blockchain Interactive

Multi-chain framework for generating real-time creative data and persisting/tokenizing on decentralized networks.

## 🎯 Modular Architecture - 6 Independent Grants

This project is designed as **ONE unified platform** that can be deployed **either together or as separate modules**. Each of the 6 foundation grants can be built and deployed independently.

### Quick Start - Individual Grants

```bash
# Build only NEAR grant (Fractal Studio)
./build-near-grant.sh

# Build only Mintbase grant (Marketplace)
./build-mintbase-grant.sh

# Build only Solana grant (Neuroemotive AI)
./build-solana-grant.sh

# Build only Filecoin grant (Storage)
./build-filecoin-grant.sh

# Build only Rust grant (Core Engine)
./build-rust-grant.sh

# Build only Polkadot grant (Cross-Chain)
./build-polkadot-grant.sh

# Build ALL grants together
./BUILD_AND_TEST_ALL.sh
```

### 🧪 Test Environment

**Live Testing Site with Real Wallet Connections:**

```bash
cd test-website
node server.js
# Open http://localhost:8080/
```

**Features:**
- ✅ Rust WASM engine (enhanced with EEG processing, emotional filters)
- ✅ Real wallet connections (NEAR, Solana, MetaMask, Polkadot)
- ✅ Testnet integration for all 5 blockchains
- ✅ IPFS/Filecoin storage testing
- ✅ Live fractal rendering in browser (Mandelbrot, Julia, Burning Ship)
- ✅ Blockchain activity logging
- ✅ Contract verification tools
- ✅ 9 interactive testing modules

### 🚀 Production-Ready Smart Contracts

**Based on Real-World Research & Standards:**

1. **Dynamic NFT Contract** (`src/near-wasm/src/dynamic_nft.rs` - 335 lines)
   - ✅ NEP-171/NEP-177 fully compliant
   - ✅ IPFS CIDv1 integration (best practices)
   - ✅ Emotional state tracking (VAD model)
   - ✅ Dynamic metadata updates
   - ✅ Visual parameter calculation from emotions
   - 📚 Based on: NEAR Protocol Standards

2. **Emotional DAO** (`src/marketplace/src/emotional_dao_prod.rs` - 411 lines)
   - ✅ Sputnik DAO V2 architecture
   - ✅ Emotional consensus calculation
   - ✅ Multiple proposal types (Transfer, Poll, FunctionCall, etc.)
   - ✅ Quorum and threshold voting
   - ✅ EEG/BMI/Facial data sources
   - 📚 Based on: https://github.com/near-daos/sputnik-dao-contract

3. **IPFS Storage Contract** (`src/ipfs-integration/src/production_storage.rs` - 356 lines)
   - ✅ CIDv1 validation and URI generation
   - ✅ Pin status management (Queued, Pinning, Pinned, Failed)
   - ✅ ERC-721 compatible metadata
   - ✅ Multi-provider support (Web3.Storage, Pinata, NFT.Storage)
   - ✅ Gateway URL generation
   - 📚 Based on: https://docs.ipfs.tech/how-to/best-practices-for-nft-data/

4. **Contract Verification Tools** (`test-website/contract-verification.js` - 233 lines)
   - ✅ Standards compliance checker
   - ✅ Security audit automation
   - ✅ Gas estimation
   - ✅ Unit test generation
   - ✅ Deployment simulation

### Deployment to Testnets

```bash
# Install CLI tools
./install-cli-tools.sh

# Deploy to testnets
./deploy-to-testnets.sh

# Package for production
./package-for-deployment.sh
```

### Module Independence

✅ **Each grant is standalone** - Can be deployed without others
✅ **Shared dependencies** - Core libraries used across grants (optional)
✅ **Integration points** - Grants work better together but aren't required
✅ **Separate contracts** - Each grant has its own smart contracts
✅ **Independent frontends** - Each grant has dedicated UI components

See `GRANT_MODULES.json` for complete module mapping and dependencies.

## Overview

This project implements a comprehensive ecosystem for interactive creative NFTs across multiple blockchain platforms. The system enables real-time creative expression, emotional AI integration, and cross-chain interoperability for digital art and creative works.

## Grant Modules

### 1. NEAR Foundation Grant - Fractal Studio + WGSL Studio (NUWE/IVJ System)
**Directory**: `src/near-wasm`

Browser-based versions of Fractal Studio and WGSL Studio from the NUWE/Immersive VJ System ecosystem. WASM-compiled for NEAR BOS deployment with real-time fractal generation and WebGPU shader editing.

**Key Features**:
- 5 fractal types: Mandelbrot, Julia, Burning Ship, Newton, Phoenix
- Emotional modulation of fractal parameters (valence/arousal/dominance)
- VJ performance session tracking with keyframes
- WebGL/WebGPU shader code generation
- Audio-reactive shader templates
- Live coding session management

**Implemented Files**:
- `fractal_studio.rs` - Fractal generation engine (362 lines)
- `wgsl_studio.rs` - WebGPU shader studio (263 lines)
- `dynamic_nft.rs` - Production NEP-171/177 NFT contract (335 lines) ✨NEW

### 2. Mintbase Foundation Grant - NUWE + MODURUST Marketplace & DAO
**Directory**: `src/marketplace`

Marketplace for NUWE creative sessions, MODURUST modular tools, with DAO governance for the creative community. Enables trading of VJ performances, fractal artworks, and modular tool ownership.

**Key Features**:
- NUWE session NFTs with performance metrics and emotional summaries
- VJ collection management and curation
- MODURUST tool ownership NFTs with usage statistics
- Tool subscription model for recurring revenue
- Patch NFTs with complexity scoring
- Rating and reputation system for tools and creators
- DAO governance for platform decisions
- Soulbound tokens for creator identity

**Implemented Files**:
- `nuwe_marketplace.rs` - NUWE session marketplace (201 lines)
- `modurust_marketplace.rs` - MODURUST tool marketplace (263 lines)
- `emotional_dao_prod.rs` - Production DAO with emotional voting (411 lines) ✨NEW

### 3. Solana Foundation Grant - Neuroemotive AI + Stream Diffusion
**Directory**: `src/solana-client`

High-performance emotional data tracking and Stream Diffusion generation recording on Solana. Optimized for 1000+ TPS with state compression for efficient storage.

**Key Features**:
- Emotional state vectors using VAD (Valence-Arousal-Dominance) model
- Emotional trajectory compression (90% space saving)
- Stream Diffusion session management with real-time frame tracking
- Performance metrics (FPS, inference time, quality scores)
- Emotional prompt modulation for AI generation
- EEG and BMI sensor data integration

**Implemented Files**:
- `neuroemotive.rs` - Emotional state tracking (253 lines)
- `stream_diffusion.rs` - Real-time AI generation tracking (290 lines)

### 4. Filecoin Foundation Grant - Universal Creative Asset Storage
**Directory**: `src/ipfs-integration`

IPFS/Filecoin storage layer for ALL three project ecosystems: NUWE/IVJ, Neuroemotive AI, and MODURUST. Content-addressed storage with metadata schemas for each project type.

**Key Features**:
- NUWE VJ performance and fractal session storage
- Frame-by-frame rendering output management
- MODURUST tool asset bundles with dependencies
- Patch configuration and version control
- Neuroemotive AI session and trajectory storage
- Stream Diffusion generation bundle management
- Storage size estimation and optimization

**Implemented Files**:
- `ipfs_client.rs` - IPFS wrapper (43 lines)
- `nuwe_storage.rs` - NUWE session storage (275 lines)
- `modurust_storage.rs` - MODURUST tool storage (315 lines)
- `neuroemotive_storage.rs` - AI data storage (299 lines)
- `production_storage.rs` - Production IPFS/CID contract (356 lines) ✨NEW

### 5. Rust Foundation Grant - NUWE Stripped (Core Creative Engine)
**Directory**: `src/rust-client`

NUWE Stripped: Lightweight, open-source version of NUWE/Immersive VJ System. Core fractal and shader engine without full IVJ features, designed for extensibility and community contribution.

**Key Features**:
- Core NUWE fractal generation algorithms
- GPU acceleration with wgpu
- Modular shader composition system
- Cross-platform compatibility (Linux, Windows, macOS)
- Emotional parameter mapping
- Performance monitoring and optimization

**Enhanced Files**:
- `webgpu_engine.rs` - Added Newton + Phoenix fractals
- `lib.rs` - Enhanced WASM with EEG processing, emotional filters, complexity scoring (217 lines)

### 6. Web3 Foundation Grant (Polkadot) - Cross-Chain Neuroemotive Bridge
**Directory**: `src/polkadot-client`

Cross-chain bridge connecting ALL grants, specifically for Neuroemotive AI emotional data and soulbound tokens for creator identity across NEAR, Solana, and Polkadot.

**Key Features**:
- Soulbound token pallet for non-transferable creator identity
- Creator reputation system with badges
- Cross-chain emotional state proofs with ZK privacy
- Multi-chain session tracking and synchronization
- Emotional state distance calculations
- Bridge between NEAR (NUWE), Solana (AI), and Filecoin

**Implemented Files**:
- `soulbound.rs` - Soulbound token pallet (201 lines)
- `emotional_bridge.rs` - Cross-chain emotional bridge (207 lines)

## Test Marketplace

**Directory**: `src/marketplace` and `marketplace-frontend`

A comprehensive test marketplace that demonstrates all features working together:
- Cross-chain NFT trading
- DAO governance for platform decisions
- Soulbound tokens for creative identity
- Interactive NFT features
- Bridge functionality between chains

## Getting Started

### Prerequisites

- Rust and Cargo
- Node.js and npm
- NEAR CLI
- Solana CLI
- IPFS daemon

### Building the Project

```bash
# Build all modules
cargo build --release

# Build specific module (example for NEAR WASM)
cd src/near-wasm
./build.sh

# Build marketplace
cd src/marketplace
./build.sh
```

### Running Tests

```bash
# Run tests for all modules
cargo test

# Run tests for specific module
cd src/near-wasm
cargo test
```

## Development Status

### Month 1 Implementation Complete ✅

**Total New Code**: ~2,900 lines across 11 new files

- ✅ NEAR: Fractal Studio + WGSL Studio (625 lines)
- ✅ Mintbase: NUWE + MODURUST Marketplace (464 lines)
- ✅ Solana: Neuroemotive AI + Stream Diffusion (543 lines)
- ✅ Filecoin: Universal storage for all 3 projects (932 lines)
- ✅ Rust: NUWE Stripped enhancements
- ✅ Polkadot: Soulbound tokens + Emotional bridge (408 lines)

### Revolutionary Smart Contract Features

#### 1. Emotional State Integration
- EEG and BMI sensor data on-chain
- Valence-Arousal-Dominance (VAD) emotional model
- ZK proofs for emotional privacy
- Cross-chain emotional state synchronization

#### 2. Soulbound Token System
- Non-transferable creator identity
- Reputation scoring across chains
- Achievement and certification badges
- DAO membership tokens

#### 3. Interactive NFT Framework
- Dynamic metadata updates based on interactions
- Emotional modulation of visual parameters
- Session replay and keyframe animation
- Performance metrics tracking

#### 4. Decentralized Storage
- Content-addressed IPFS/Filecoin integration
- Compression algorithms (90% space saving)
- Multi-project metadata schemas
- Size estimation and optimization

#### 5. DAO Governance
- Proposal and voting system
- Quorum-based decision making
- Member reputation weighting
- Platform fee and policy management

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Marketplace                         │
├─────────────────────────────────────────────────────────────┤
│  DAO Governance  │  Cross-Chain Bridge  │  Soulbound Tokens │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Multi-Chain Integration                     │
├─────────────────────────────────────────────────────────────┤
│  NEAR (WASM)  │  Solana  │  Polkadot  │  Filecoin/IPFS     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Core Creative Engine                      │
├─────────────────────────────────────────────────────────────┤
│              Rust Client (NUWE Engine)                      │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Real-Time Creative Tools
- Browser-native creative tools with WASM performance
- Real-time parameter manipulation
- Live collaboration primitives
- Modular tool architecture

### Emotional AI Integration
- Emotional state tracking for NFTs
- Real-time emotional data processing
- Affective computing integration
- Emotional metadata persistence

### Cross-Chain Interoperability
- Multi-chain NFT tokenization
- Cross-chain bridge protocols
- Unified API for multi-chain operations
- Parachain for global scalability

### Decentralized Governance
- DAO implementation for platform governance
- Community-driven feature development
- Proposal and voting system
- Reputation-based participation

## Development Roadmap

### Phase 1: Foundation (Months 1-3)
- Core WASM engine implementation
- NEAR BOS integration
- Basic collaboration contracts
- Marketplace foundation

### Phase 2: Collaboration Features (Months 4-6)
- Real-time state synchronization
- Multi-user live editing sessions
- Patch ecosystem with version control
- Enhanced marketplace features

### Phase 3: Ecosystem Expansion (Months 7-9)
- Cross-chain integration
- DAO governance implementation
- Advanced creative features
- Performance optimization

### Phase 4: Scale & Sustainability (Months 10-12)
- Enterprise integration
- Global expansion
- Community building
- Long-term sustainability

## Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Website**: https://compiling-org.netlify.app
- **GitHub**: https://github.com/compiling-org
- **Email**: kapil.bambardekar@gmail.com, vdmo@gmail.com