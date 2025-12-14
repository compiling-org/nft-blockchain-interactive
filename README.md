# Blockchain NFT Interactive — Unified Multi-Chain Creative Platform

## Overview
Blockchain NFT Interactive is a unified workspace that implements AI/ML-driven creative NFTs across six grants: NEAR, Solana, Filecoin, Mintbase/Bitte, Rust Foundation, and Web3/Polkadot. Development happens in this main repository, with surgical extraction to individual grant repositories for submissions.

## Update Summary (December 2025)
- Refreshed grant-specific docs in `docs/` (Filecoin updated; others queued)
- Confirmed push hygiene and `.gitignore` for heavy/nested directories
- Synchronized Filecoin grant repo with updated README/architecture
- Next focus: comprehensive Solana client/wallet integration

## Repository Structure
- `src/` — Frontend, clients, and integrations
- `contracts/` — On-chain programs (NEAR, Solana, Filecoin actor, cross-chain bridge)
- `docs/` — Grant-specific docs and technical reports
- `scripts/` — Extraction, deployment, and repo management
- `marketplace-frontend/` — Test marketplace UI
- `reports/` — Project status and verification summaries

## Quick Start
- Prerequisites: Node 18+, Rust toolchain, Git, Anchor (for Solana), NEAR CLI (optional)
- Install: `npm install`
- Dev: `npm run dev` or `vite` from the project root
- Build: `npm run build`
- Preview: `npm run preview`

## Grant Repositories (External)
- External location: keep grant repositories outside this project (e.g., `<GRANTS_ROOT>/grant-repositories`)
- Extraction scripts: `extract-*-grant.sh`
- Push scripts: `scripts/push-updated-grants.sh`, `scripts/push-all-grants-github.sh`
- Workflow: Develop here → extract → commit/push in each grant repo

## Filecoin Constraints
- Public Calibration network does not accept custom Rust/WASM actors via `lotus`
- Use local Lotus devnet or FVM harness for install/create calls
- Actor simulation and WASM build exist in `contracts/filecoin/biometric-nft-actor/`

## What’s Working
- NEAR: wallet integration, WASM contracts, testnet flows
- Solana: program builds; client integration in progress
- Filecoin: IPFS architecture, compression pipeline; provider integration pending
- Cross-chain bridge and analytics: core scaffolding implemented

## What’s Next
- Finish Solana wallet adapter and end-to-end client flows
- Stand up devnet/FVM harness for Filecoin actor invocation
- Replace mocked IPFS with Web3.Storage/NFT.Storage providers
- Finalize grant extractions and push with updated docs

## Push Hygiene
- Heavy/nested directories are ignored by `.gitignore`
- Do not commit large binaries (`*.wasm`, `*.zip`, `target/`, `node_modules/`)
- Nested repos like `external-grants/` and `src/solana-program/` are ignored

## Scripts
- `extract-all-grants.sh` — Extracts code by grant
- `push-updated-grants.sh` — Adds/commits/pushes each grant repo
- `verify-completion.sh` — Summarizes module presence and status

## Status Dashboards
- `docs/CURRENT_IMPLEMENTATION_STATUS.md` — live implementation status
- `reports/PROJECT_STATUS_SUMMARY.md` — summary across grants
- `docs/*_SPECIFIC_*` — grant-specific technical architecture and reports

## License
MIT
