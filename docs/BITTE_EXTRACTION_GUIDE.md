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
apps/web/src/services/bitteService.ts              # Main Bitte service (replaces bitteWalletService)
apps/web/src/services/myNearWalletService.ts     # NEAR wallet service
apps/web/src/services/nearCreativeEngineService.ts # NEAR creative engine
```

### Marketplace Files
```
apps/web/src/pages/BitteAIMarketplace.tsx       # Bitte AI marketplace UI
apps/web/src/pages/RealBitteMarketplace.tsx     # Real marketplace UI
apps/web/src/pages/EnhancedBitteMarketplace.tsx # Enhanced marketplace
apps/web/src/pages/ComprehensiveBitteMarketplace.tsx # Comprehensive marketplace
```

### Supporting Files
```
apps/web/src/services/realMarketplaceService.ts    # Marketplace service
apps/web/src/components/NEARVisualizer.tsx          # NEAR visualizer
```

### Configuration Files
```
apps/web/package.json                           # Frontend dependencies
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
│   ├── services/
│   │   ├── bitteService.ts
│   │   ├── myNearWalletService.ts
│   │   ├── nearCreativeEngineService.ts
│   │   └── realMarketplaceService.ts
│   └── pages/
│       ├── BitteAIMarketplace.tsx
│       ├── RealBitteMarketplace.tsx
│       └── EnhancedBitteMarketplace.tsx
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