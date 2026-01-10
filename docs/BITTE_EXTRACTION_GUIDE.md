# Bitte Protocol Creative Engine - Code Extraction Guide

## Overview
This document provides precise instructions for extracting ONLY the Bitte Protocol (formerly Mintbase)-specific code from the main blockchain-nft-interactive project for the Bitte Protocol grant repository.

## Critical Extraction Rules
1. **ONLY copy Bitte Protocol-specific files** - DO NOT copy the entire main project
2. **Maintain proper directory structure** - Follow Bitte Protocol project conventions
3. **Include all dependencies** - Ensure package.json includes Bitte Protocol-specific packages
4. **Test functionality** - Verify all copied code works correctly

## Files to Extract

### Core Bitte Protocol Integration Files
```
src/utils/mintbase-ai-integration.js          # Main Mintbase AI integration
src/utils/bitte-protocol-ai-enhanced-v2.ts  # Enhanced Bitte Protocol features
src/utils/bitte-protocol-integration.js     # Bitte Protocol integration
```

### Mintbase Integration Files
```
src/mintbase/nuwe-ai-ml-integration.js      # Nuwe AI/ML integration
src/utils/mintbase-ai                        # Mintbase AI utilities
```

### Supporting Files
```
src/utils/unified-ai-ml-integration.js      # AI/ML bridge (shared dependency)
src/utils/cross-chain-bridge.js            # Cross-chain bridge functionality
```

### Configuration Files
```
package.json                                 # Bitte Protocol-specific dependencies
```

## Bitte Protocol-Specific Dependencies
The package.json must include these Bitte Protocol-specific packages:
```json
{
  "dependencies": {
    "@mintbase-js/sdk": "^0.9.0",
    "@mintbase-js/data": "^0.9.0",
    "@mintbase-js/react": "^0.9.0",
    "@mintbase-js/storage": "^0.9.0",
    "near-api-js": "^2.1.4"
  }
}
```

## Directory Structure for Bitte Protocol Grant Repository
```
bitte-creative-engine/
├── src/
│   ├── utils/
│   │   ├── mintbase-ai-integration.js
│   │   ├── bitte-protocol-ai-enhanced-v2.ts
│   │   ├── bitte-protocol-integration.js
│   │   ├── unified-ai-ml-integration.js
│   │   └── cross-chain-bridge.js
│   └── mintbase/
│       └── nuwe-ai-ml-integration.js
├── package.json
└── README.md
```

## Testing Instructions
1. Test Bitte Protocol SDK integration: Check wallet connection and NFT operations
2. Validate AI/ML integration: Ensure biometric processing works
3. Test marketplace functionality: Verify NFT minting and trading
4. Test cross-chain bridge: Verify interoperability with other chains

## Deployment Checklist
- [ ] Bitte Protocol SDK integration works
- [ ] AI/ML biometric processing functions correctly
- [ ] Marketplace functionality operates properly
- [ ] Cross-chain bridge functionality tested
- [ ] All dependencies properly installed

## Critical Reminders
- **DO NOT** copy non-Bitte Protocol files (Solana, Polkadot, etc.)
- **DO NOT** copy the entire main project structure
- **ONLY** extract Bitte Protocol-specific functionality
- **VERIFY** all copied code is Bitte Protocol-related
- **TEST** functionality after extraction