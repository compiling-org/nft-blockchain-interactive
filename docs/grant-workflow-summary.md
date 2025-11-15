# Grant Workflow Summary

## Current Structure

We have 6 separate grant repositories organized as follows:

```
compiling/
├── blockchain-nft-interactive/          # Main integrated project (primary development)
└── grant-repositories/
    ├── near-creative-engine/            # NEAR Foundation Grant
    ├── solana-emotional-metadata/       # Solana Foundation Grant
    ├── filecoin-creative-storage/       # Filecoin Foundation Grant
    ├── mintbase-creative-marketplace/   # Mintbase Foundation Grant
    ├── rust-emotional-engine/           # Rust Foundation Grant
    └── polkadot-creative-identity/      # Web3 Foundation Grant
```

## Development Workflow

### 1. Primary Development
- **All development happens in the main `blockchain-nft-interactive` project**
- This repository contains the complete integrated solution with all grants
- Shared components and cross-grant integration are maintained here

### 2. Grant-Specific Work
- When working on grant-specific deliverables, we extract relevant code to individual grant repositories
- Each grant repository contains only the code needed for that specific grant
- This keeps grant submissions clean and focused

### 3. Synchronization Process
```
Main Project → Extract → Grant Repositories (for submission)
Main Project ← Backport ← Grant Repositories (for improvements)
```

### 4. Git Strategy
- **Main Repository**: Contains complete project history
- **Grant Repositories**: Contain focused implementations for specific deliverables
- **Version Control**: Each repository maintains independent git history

## Repository Details

### 1. NEAR Creative Engine (`near-creative-engine`)
- **Focus**: Fractal Studio & WGSL Studio
- **Key Components**: NEAR WASM contracts, Rust client
- **Status**: ✅ Initialized with git

### 2. Solana Emotional Metadata (`solana-emotional-metadata`)
- **Focus**: Neuroemotive AI & Stream Diffusion
- **Key Components**: Solana programs, Rust client
- **Status**: ✅ Initialized with git

### 3. Filecoin Creative Storage (`filecoin-creative-storage`)
- **Focus**: Universal IPFS/Filecoin Storage
- **Key Components**: IPFS integration, storage layer
- **Status**: ✅ Initialized with git

### 4. Mintbase Creative Marketplace (`mintbase-creative-marketplace`)
- **Focus**: Marketplace & DAO Governance
- **Key Components**: Marketplace contracts, DAO system
- **Status**: ✅ Initialized with git

### 5. Rust Emotional Engine (`rust-emotional-engine`)
- **Focus**: NUWE Stripped - Core Creative Engine
- **Key Components**: Core Rust library, WebGPU engine
- **Status**: ✅ Initialized with git

### 6. Polkadot Creative Identity (`polkadot-creative-identity`)
- **Focus**: Cross-Chain Bridge & Soulbound Tokens
- **Key Components**: Polkadot client, identity system
- **Status**: ✅ Initialized with git

## Next Steps

1. **Create GitHub repositories** for each grant under the compiling-org organization
2. **Add remotes** to each local repository and push initial commits
3. **Continue development** in the main `blockchain-nft-interactive` project
4. **Extract and commit** to individual repositories when preparing grant submissions
5. **Backport improvements** from grant work to the main project as needed

## Commands

### Extract remaining grants (if needed):
```bash
./scripts/setup-remaining-grant-repos.sh
```

### Initialize git in a grant repository:
```bash
cd ../grant-repositories/[grant-name]
git init
git add .
git commit -m "Initial commit: [Grant Title]"
```

### Work on main project:
```bash
cd ../../blockchain-nft-interactive
# Do all development work here
```

This workflow ensures we maintain a clean separation between our integrated development environment and the focused grant deliverables while keeping all code synchronized.