# Bitte AI Marketplace — Technical Architecture

## Overview
- Purpose: Real Bitte AI marketplace on NEAR with biometric NFTs and AI agents
- Scope: Wallet connect, listings, bids, minting, agent deployment, chat integration
- Reality: Uses `myNearWalletService` for transactions; demo flows via `bitteService`
- UI: `RealBitteMarketplace`, `EnhancedBitteMarketplace`, `BitteAIMarketplace`, `BitteAIChatIntegration`

## Architecture Overview

```mermaid
graph TB
    subgraph Frontend
        REAL_UI[RealBitteMarketplace]
        ENH_UI[EnhancedBitteMarketplace]
        AIMKT_UI[BitteAIMarketplace]
        CHAT[BitteAIChatIntegration]
    end

    subgraph Services
        MARKET_SVC[realMarketplaceService]
        BITTE_SVC[bitteService]
    end

    subgraph Wallet
        BITTE_WALLET[bitteWalletService]
        MYNEAR_WALLET[myNearWalletService]
    end

    subgraph Protocol_Data
        NEAR[NEAR Contracts]
        IPFS[IPFS/Filecoin]
    end

    REAL_UI --> MARKET_SVC
    ENH_UI --> MARKET_SVC
    AIMKT_UI --> BITTE_SVC
    REAL_UI --> CHAT
    CHAT --> BITTE_SVC
    MARKET_SVC --> MYNEAR_WALLET
    BITTE_SVC --> BITTE_WALLET
    MYNEAR_WALLET --> NEAR
    BITTE_WALLET --> NEAR
    MARKET_SVC --> IPFS
```

## Wallet Connect Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Marketplace UI
    participant WS as Wallet Service
    participant NEAR as NEAR RPC

    U->>UI: Click Connect
    UI->>WS: initialize() + signIn()
    WS->>NEAR: requestSignIn
    NEAR-->>WS: accountId
    WS-->>UI: connected state
```

## Agent Deployment Flow

```mermaid
sequenceDiagram
    participant UI as Marketplace UI
    participant SVC as Marketplace Service
    participant WALLET as Wallet Service
    participant NEAR as NEAR Contract

    UI->>SVC: deployAgent(params)
    SVC->>WALLET: callMethod("deploy_agent", args)
    WALLET->>NEAR: functionCall
    NEAR-->>WALLET: tx result
    WALLET-->>SVC: transactionHash
    SVC-->>UI: success + id
```

## Data & Storage

```mermaid
graph LR
    EMO[Emotion Data] --> META[On-chain Metadata]
    META --> NEAR
    EMO --> IPFS
    UI[Marketplace UI] --> EMO
```

## Components
- Marketplace UI: `apps/web/src/pages/RealBitteMarketplace.tsx`, `apps/web/src/pages/EnhancedBitteMarketplace.tsx`
- Wallet: `apps/web/src/services/myNearWalletService.ts`, `apps/web/src/services/bitteService.ts` (API service, replaces bitteWalletService)
- Marketplace service: `apps/web/src/services/realMarketplaceService.ts`
- Bitte service: `apps/web/src/services/bitteService.ts`
- NEAR Visualizer: `apps/web/src/components/NEARVisualizer.tsx`

## Flows
- Wallet connect: `myNearWalletService.signIn()` at `apps/web/src/services/myNearWalletService.ts`
- Buy listing: `realMarketplaceService.buyListing()` at `apps/web/src/services/realMarketplaceService.ts`
- Place bid: `realMarketplaceService.placeBid()` at `apps/web/src/services/realMarketplaceService.ts`
- Mint biometric NFT: `realMarketplaceService.mintBiometricNFT()` at `src/services/realMarketplaceService.ts:362`
- Demo wallet connect: `bitteService.connectWallet()` at `src/services/bitteService.ts:95`
- AI marketplace demo connect: `src/pages/BitteAIMarketplace.tsx:70`

## Transaction Flow

```mermaid
graph TB
    UI[Buy Button] --> SVC[realMarketplaceService.buyListing]
    SVC --> WALLET[myNearWalletService.callMethod]
    WALLET --> NEAR[Contract FunctionCall]
    NEAR --> RESULT[Transaction Hash]
    RESULT --> UI[Success/Failure]
```

## Data Schema
- Emotion vector: `{ valence, arousal, dominance }` used in NFT metadata
- Attached deposit: yoctoNEAR strings via `near-api-js` format utilities
- Example mint: see `src/services/realMarketplaceService.ts:362`

## Notes
- All diagrams use simple Mermaid syntax compatible with IDE renderers
- Labels avoid special characters; code references are listed outside diagrams
