# NEAR Creative Engine - Code Extraction Guide

## Overview
This document provides precise instructions for extracting ONLY the NEAR-specific code from the main blockchain-nft-interactive project for the NEAR Foundation grant repository.

## Critical Extraction Rules
1. **ONLY copy NEAR-specific files** - DO NOT copy the entire main project
2. **Maintain proper directory structure** - Follow NEAR project conventions
3. **Include all dependencies** - Ensure package.json includes NEAR-specific packages
4. **Test functionality** - Verify all copied code works correctly

## Files to Extract

### Core NEAR Integration Files
```
src/utils/near-ai-integration.ts              # Main NEAR AI integration
src/utils/near-fractal-ai-integration.ts     # NEAR fractal AI integration
```

### NEAR Smart Contracts
```
contracts/near/soulbound-nft/src/lib.rs      # Soulbound NFT contract
contracts/near/soulbound-nft/src/metadata.rs # NFT metadata structures
contracts/near/cross-chain-ai/src/lib.rs     # Cross-chain AI contract
contracts/near/cross-chain-ai/src/metadata.rs
```

### NEAR WASM Integration
```
src/near-wasm/src/lib.rs                     # NEAR WASM bindings
src/near-wasm/src/simple_nft.rs            # Simple NFT implementation
src/near-wasm/src/collaboration.rs          # Collaboration features
src/near-wasm/src/dynamic_nft.rs            # Dynamic NFT functionality
```

### Supporting Files
```
src/utils/unified-ai-ml-integration.js      # AI/ML bridge (shared dependency)
src/utils/filecoin-storage.ts                # Filecoin storage (for NFT metadata)
```

### Configuration Files
```
package.json                                 # NEAR-specific dependencies
Cargo.toml                                   # Rust workspace configuration
```

## NEAR-Specific Dependencies
The package.json must include these NEAR-specific packages:
```json
{
  "dependencies": {
    "near-api-js": "^2.1.4",
    "@near-wallet-selector/core": "^8.9.3",
    "@near-wallet-selector/near-wallet": "^8.9.3",
    "@near-wallet-selector/meteor-wallet": "^8.9.3",
    "@near-wallet-selector/sender": "^8.9.3"
  }
}
```

## Directory Structure for NEAR Grant Repository
```
near-creative-engine/
├── src/
│   ├── utils/
│   │   ├── near-ai-integration.ts
│   │   ├── near-fractal-ai-integration.ts
│   │   ├── unified-ai-ml-integration.js
│   │   └── filecoin-storage.ts
│   ├── contracts/
│   │   └── near/
│   │       ├── soulbound-nft/
│   │       │   └── src/
│   │       │       ├── lib.rs
│   │       │       └── metadata.rs
│   │       └── cross-chain-ai/
│   │           └── src/
│   │               ├── lib.rs
│   │               └── metadata.rs
│   └── near-wasm/
│       └── src/
│           ├── lib.rs
│           ├── simple_nft.rs
│           ├── collaboration.rs
│           └── dynamic_nft.rs
├── package.json
├── Cargo.toml
└── README.md
```

## Testing Instructions
1. Verify NEAR contract compilation: `cargo build --target wasm32-unknown-unknown`
2. Test NEAR API integration: Check wallet connection and contract calls
3. Validate AI/ML integration: Ensure biometric processing works
4. Test file upload to Filecoin: Verify NFT metadata storage

## Deployment Checklist
- [ ] All NEAR contracts compile successfully
- [ ] NEAR wallet integration works
- [ ] AI/ML biometric processing functions correctly
- [ ] Filecoin storage integration operates properly
- [ ] Cross-chain bridge functionality tested
- [ ] All dependencies properly installed

## Critical Reminders
- **DO NOT** copy non-NEAR files (Solana, Polkadot, etc.)
- **DO NOT** copy the entire main project structure
- **ONLY** extract NEAR-specific functionality
- **VERIFY** all copied code is NEAR-related
- **TEST** functionality after extraction