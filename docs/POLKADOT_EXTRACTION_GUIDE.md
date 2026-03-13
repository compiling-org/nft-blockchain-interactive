# Polkadot Creative Engine - Code Extraction Guide

## Overview
This document provides precise instructions for extracting ONLY the Polkadot-specific code from the main blockchain-nft-interactive project for the Web3 Foundation grant repository.

## Critical Extraction Rules
1. **ONLY copy Polkadot-specific files** - DO NOT copy the entire main project
2. **Maintain proper directory structure** - Follow Polkadot project conventions
3. **Include all dependencies** - Ensure package.json includes Polkadot-specific packages
4. **Test functionality** - Verify all copied code works correctly

## Files to Extract

### Core Polkadot Integration Files
```
apps/web/src/utils/polkadot-bridge-client.ts    # Main Polkadot bridge client (new)
apps/web/src/components/PolkadotInfo.tsx         # Polkadot info component
```

### Polkadot Runtime Modules
```
packages/polkadot-client/src/lib.rs               # Polkadot client library
packages/polkadot-client/src/emotional_bridge.rs   # Emotional bridge module
packages/polkadot-client/src/extrinsics.rs         # Extrinsics handling
packages/polkadot-client/src/soulbound.rs          # Soulbound NFT implementation
```

### Supporting Files
```
apps/web/src/config/cross-chain-bridge-config.ts  # Cross-chain configuration
```

### Configuration Files
```
package.json                                 # Polkadot-specific dependencies
Cargo.toml                                   # Rust workspace configuration
```

## Polkadot-Specific Dependencies
The package.json must include these Polkadot-specific packages:
```json
{
  "dependencies": {
    "@polkadot/api": "^10.11.2",
    "@polkadot/extension-dapp": "^0.46.5",
    "@polkadot/keyring": "^12.6.2",
    "@polkadot/util": "^12.6.2",
    "@polkadot/util-crypto": "^12.6.2"
  }
}
```

## Directory Structure for Polkadot Grant Repository
```
polkadot-creative-engine/
├── apps/
│   └── web/
│       └── src/
│           ├── utils/
│           │   └── polkadot-bridge-client.ts
│           ├── components/
│           │   └── PolkadotInfo.tsx
│           └── config/
│               └── cross-chain-bridge-config.ts
├── packages/
│   └── polkadot-client/
│       └── src/
│           ├── lib.rs
│           ├── emotional_bridge.rs
│           ├── extrinsics.rs
│           └── soulbound.rs
├── package.json
├── Cargo.toml
└── README.md
```

## Testing Instructions
1. Verify Polkadot runtime compilation: `cargo build --release`
2. Test Polkadot client integration: Check wallet connection and extrinsics
3. Validate AI/ML integration: Ensure biometric processing works
4. Test XCM messaging: Verify cross-chain communication

## Deployment Checklist
- [ ] All Polkadot runtimes compile successfully
- [ ] Polkadot wallet integration works
- [ ] AI/ML biometric processing functions correctly
- [ ] XCM cross-chain messaging operates properly
- [ ] All dependencies properly installed

## Critical Reminders
- **DO NOT** copy non-Polkadot files (NEAR, Solana, etc.)
- **DO NOT** copy the entire main project structure
- **ONLY** extract Polkadot-specific functionality
- **VERIFY** all copied code is Polkadot-related
- **TEST** functionality after extraction