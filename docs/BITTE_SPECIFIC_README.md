# Bitte Protocol AI Marketplace — README

## Executive Summary
- Real NEAR wallet flows, AI agent listings, biometric/emotion-aware NFTs, and WebGPU rendering integrated.
- Marketplace UI supports wallet-authenticated actions and agent deployment.
- Documentation and diagrams fixed with compatible Mermaid syntax.

## What Works
- Wallet connect and authenticated transactions
  - `apps/web/src/pages/RealBitteMarketplace.tsx:1-12`, `:150-190`
  - `apps/web/src/pages/EnhancedBitteMarketplace.tsx:58-76`
  - `apps/web/src/services/myNearWalletService.ts` - Main wallet service
- Bitte service and marketplace service
  - `apps/web/src/services/bitteService.ts` - Main API service (replaces bitteWalletService)
  - `apps/web/src/services/realMarketplaceService.ts:1-16`, `:515-531`
- AI chat and agent integration
  - `apps/web/src/components/BitteAIChatIntegration.tsx` - Chat component (if present)
- Working marketplace demo
  - `apps/marketplace-frontend/working-bitte-marketplace.html`

## Features
- AI agents browsing and deployment
- Emotion-aware NFT listings with biometric data
- WebGPU/Canvas creative rendering pipeline
- Basic API-backed listing retrieval and display

## Architecture Overview
```mermaid
flowchart LR
    UI[Client UI] --> Wallet[NEAR Wallet]
    UI --> Service[Bitte Service]
    Service --> API[Marketplace API]
    UI --> Chat[AI Chat]
    API --> Listings[NFT Listings]
    API --> Agents[AI Agents]
    UI --> Renderer[WebGPU/Canvas]
```

## Listing Flow
```mermaid
sequenceDiagram
    participant U as User
    participant UI as Marketplace UI
    participant S as Bitte Service
    participant W as NEAR Wallet
    participant A as API
    participant G as IPFS Gateway

    U->>UI: Create listing
    UI->>S: Prepare metadata
    S->>W: Sign transaction
    W-->>S: Tx hash
    S->>A: Submit listing
    A-->>UI: Listing ID + CID
    UI->>G: Verify CID
```

## Components
- `apps/web/src/pages/BitteAIMarketplace.tsx:70-102` wallet connect and load agents/NFTs
- `apps/web/src/pages/RealBitteMarketplace.tsx:150-190` NEAR wallet connection UI
- `apps/web/src/pages/EnhancedBitteMarketplace.tsx:58-76` NEAR wallet connect flow
- `apps/web/src/services/bitteService.ts:95-138` API wallet connect
- `apps/web/src/services/realMarketplaceService.ts:515-531` AI agents data
- `apps/web/src/services/myNearWalletService.ts` Main NEAR wallet implementation
- `apps/web/src/components/NEARVisualizer.tsx` NEAR blockchain visualizer

## Setup
- Install: `npm install`
- Dev server: `npm run dev`
- Connect NEAR wallet in UI, then list or deploy agents

## Verification
- Connect wallet and perform a listing action
- Verify CID via IPFS gateway
- Browse agents and confirm data loads

## Roadmap
- Extend listing creation with royalty and store management
- Integrate DAO voting and proposals
- Add cross-chain bridge interactions
