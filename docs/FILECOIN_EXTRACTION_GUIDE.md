# Filecoin Creative Engine - Code Extraction Guide

## Overview
This document provides precise instructions for extracting ONLY the Filecoin-specific code from the main blockchain-nft-interactive project for the Filecoin Foundation grant repository.

## Critical Extraction Rules
1. **ONLY copy Filecoin-specific files** - DO NOT copy the entire main project
2. **Maintain proper directory structure** - Follow Filecoin project conventions
3. **Include all dependencies** - Ensure package.json includes Filecoin-specific packages
4. **Test functionality** - Verify all copied code works correctly

## Files to Extract

### Core Filecoin Integration Files
```
apps/web/src/utils/filecoin-storage.ts              # Filecoin storage client
```

### Filecoin Actor Contracts
```
packages/contracts/filecoin/biometric-nft-actor/src/lib.rs      # Biometric NFT actor
packages/contracts/filecoin/biometric-nft-actor/Cargo.toml     # Actor dependencies
```

### Supporting Files
```
apps/web/src/utils/solana-client.ts              # Solana client (for cross-chain)
apps/web/src/config/cross-chain-bridge-config.ts  # Cross-chain configuration
```

### Configuration Files
```
package.json                                 # Filecoin-specific dependencies
Cargo.toml                                   # Rust workspace configuration
src/contracts/filecoin/biometric-nft-actor/src/sim.rs   # Local sim (no Lotus)
src/contracts/filecoin/biometric-nft-actor/tests/*      # Actor tests
```

## Filecoin-Specific Dependencies
The package.json must include these Filecoin-specific packages:
```json
{
  "dependencies": {
    "@web3-storage/w3up-client": "^11.2.0",
    "@web3-storage/filecoin-client": "^3.3.1",
    "nft.storage": "^7.1.1",
    "web3.storage": "^4.5.0"
  }
}
```

## Directory Structure for Filecoin Grant Repository
```
filecoin-creative-engine/
├── apps/
│   └── web/
│       └── src/
│           └── utils/
│               └── filecoin-storage.ts
├── packages/
│   └── contracts/
│       └── filecoin
│           └── biometric-nft-actor
│               └── src/
│                   └── lib.rs
├── package.json
├── Cargo.toml
└── README.md
```

## Testing Instructions
1. Build actor WASM: `cd src/contracts/filecoin/biometric-nft-actor && cargo build --release --target wasm32-unknown-unknown`
2. Run actor tests: `cargo test --release` (includes WASM artifact check and local sim flow)
3. Test Filecoin storage integration: Check file upload and retrieval
4. Validate AI/ML integration: Ensure biometric processing works
5. Test IPFS integration: Verify decentralized storage functionality

## Deployment Checklist
- [ ] Actor builds to `.wasm` successfully
- [ ] Actor tests pass (WASM and sim)
- [ ] Filecoin storage integration works
- [ ] AI/ML biometric processing functions correctly
- [ ] IPFS storage integration operates properly
- [ ] Cross-chain bridge functionality tested
- [ ] All dependencies properly installed

## Critical Reminders
- **DO NOT** copy non-Filecoin files (NEAR, Solana, etc.)
- **DO NOT** copy the entire main project structure
- **ONLY** extract Filecoin-specific functionality
- **VERIFY** all copied code is Filecoin-related
- **TEST** functionality after extraction
