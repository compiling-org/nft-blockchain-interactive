# NFT Blockchain Interactive

Interactive NFT system with Filecoin and NEAR blockchain integration. Smart contracts for connecting Nuwe system to Filecoin and NEAR blockchains.

## Features

- Filecoin/IPFS integration for NFT metadata storage
- NEAR blockchain smart contracts for NFT minting
- Interactive NFT collections
- Testnet deployment tools
- Cross-chain NFT operations

## Project Structure

```
blockchain-nft-interactive/
├── src/
│   └── lib.rs                 # Main library with blockchain interfaces
├── contracts/
│   ├── near/                  # NEAR smart contracts
│   │   ├── nft-contract/      # NFT contract for NEAR
│   │   └── marketplace/       # Marketplace contract
│   └── filecoin/              # Filecoin smart contracts (if applicable)
├── scripts/
│   ├── deploy-near.sh         # NEAR deployment script
│   ├── deploy-filecoin.sh     # Filecoin deployment script
│   └── test-nft.js            # NFT testing utilities
├── tests/                     # Integration tests
└── examples/                  # Usage examples
```

## Building

```bash
cargo build --release
```

## Usage

This library provides interfaces for creating and managing interactive NFTs across Filecoin and NEAR blockchains. It includes tools for deploying smart contracts to testnets and managing NFT collections.

## License

MIT