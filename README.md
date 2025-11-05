# NFT Blockchain Interactive

A minimal, multi-chain/IPFS-ready framework for generating real-time creative data (from NUWE/shaders/audio) and persisting/tokenizing that data on decentralized networks.

## Overview

This repository serves as the single source of truth for our grant work, containing modules essential to our flagship tools (Neuro-Emotive AI, NUWE, Fractal Modular Shader System). The framework demonstrates how to:

1. **Generate real-time creative data** from NUWE/shaders/audio systems
2. **Persist/Tokenize data** on decentralized networks (Filecoin/IPFS, NEAR, Solana, Polkadot)

## 🏗️ Core Architecture

### **Multi-Chain Framework**
- **IPFS Integration**: Content-addressed storage for high-fidelity audiovisual assets
- **NEAR WASM**: Browser-native deployment of creative engines as public goods
- **Solana Programs**: High-throughput real-time metadata logging
- **Substrate Pallets**: Decentralized emotional state proof-of-concept

### **Creative Data Pipeline**
```
NUWE/Shader Engine → Emotional Metadata → IPFS CID → Blockchain Tokenization
```

## 📁 Repository Structure

```
nft-blockchain-interactive/
├── src/
│   ├── rust-client/           # Core Rust library for audiovisual/emotional metadata
│   ├── ipfs-integration/      # CID generation and IPFS pinning/retrieval
│   ├── near-wasm/            # WASM/TypeScript bindings for NEAR/BOS
│   └── solana-client/         # Anchor programs for Solana metadata validation
├── docs/                     # Technical whitepapers and tutorials
├── examples/                 # Working demos (Mintbase-style UI)
└── README.md                 # This file (generic grant proposal)
```

## 🚀 Grant Deliverables

This repository will produce tailored deliverables for each grant application:

| Grant Body | Deliverable Module | Key Focus |
|------------|-------------------|-----------|
| **Filecoin Foundation** | IPFS Persistence Layer | Decentralized storage of affective media |
| **NEAR Foundation** | Real-Time WASM Creative Engine | Browser-native creative sessions |
| **Rust Foundation** | Open-Source Crate Ecosystem | Quality Rust tooling for creative systems |
| **Solana Foundation** | High-Performance On-Chain Metadata | Real-time performance logging |
| **Web3 Foundation** | Substrate Pallet PoC | Decentralized emotional state proof |

## 🛠️ Building & Development

```bash
# Clone the repository
git clone https://github.com/compiling-org/nft-blockchain-interactive.git
cd nft-blockchain-interactive

# Build all modules
cargo build --release

# Run tests
cargo test

# Build WASM for NEAR
cd src/near-wasm && wasm-pack build --target web
```

## 📚 Documentation

- **[Technical Whitepaper](docs/whitepaper.md)**: Architecture and performance benchmarks
- **[API Documentation](docs/api.md)**: Module integration guides
- **[Grant Proposals](docs/grants/)**: Tailored applications for each foundation

## 🎯 Use Cases

### **Real-Time Creative Sessions**
- Live shader performance with emotional state tracking
- Audiovisual data generation from biofeedback inputs
- Decentralized persistence of ephemeral creative moments

### **Decentralized Creative Economy**
- Tokenization of live performances and installations
- Cross-chain interoperability for global creative markets
- Public goods infrastructure for artistic expression

## 🤝 Contributing

This project welcomes contributions from the creative coding, blockchain, and decentralized storage communities. See our [Contributing Guide](docs/contributing.md) for details.

## 📄 License

Licensed under MIT/Apache 2.0 Dual License - see [LICENSE](LICENSE) for details.

## 🌐 Links

- **Website**: [compiling-org.netlify.app](https://compiling-org.netlify.app)
- **GitHub**: [github.com/compiling-org](https://github.com/compiling-org)
- **Documentation**: [docs/](docs/)

## 🔄 Project Automation

This repository includes automated project management features:

- **Task Sync**: Automatically creates GitHub Issues from [PROJECT_TASKS.csv](PROJECT_TASKS.csv)
- **Project Board Integration**: Syncs tasks with GitHub Project boards
- **Label Management**: Automatically applies category, phase, and module labels

To manually trigger the sync process:
```bash
# Run the sync script
node .github/scripts/sync-tasks.js
```

The automation workflow runs automatically when [PROJECT_TASKS.csv](PROJECT_TASKS.csv) is updated.

---
*This repository contains the core framework for our $10K micro-grant applications to Filecoin, NEAR, Rust, Solana, and Web3 Foundations.*