# Deployment Guide

This guide explains how to deploy and test each of the 6 grant modules independently, as well as how to run the integrated test marketplace.

## Overview

Due to dependency conflicts between different blockchain SDKs, each module must be built and deployed independently rather than as a single workspace. This guide provides step-by-step instructions for each module.

## Prerequisites

Before deploying any modules, ensure you have the following installed:

1. **Rust and Cargo**: [Installation Guide](https://www.rust-lang.org/tools/install)
2. **Node.js and npm**: [Installation Guide](https://nodejs.org/)
3. **Git**: [Installation Guide](https://git-scm.com/)

For blockchain-specific deployments, you'll also need:

4. **NEAR CLI**: `npm install -g near-cli`
5. **Solana CLI**: [Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
6. **IPFS**: [Installation Guide](https://docs.ipfs.io/install/)
7. **Polkadot/Substrate**: [Installation Guide](https://substrate.io/)

## Module Deployment Instructions

### 1. NEAR Foundation Grant - Real-Time WASM Creative Engine

**Directory**: `src/near-wasm/`

**Deployment Steps**:

1. Navigate to the module directory:
   ```bash
   cd src/near-wasm
   ```

2. Build the contract:
   ```bash
   ./build.sh
   ```

3. Deploy to NEAR testnet:
   ```bash
   near dev-deploy res/contract.wasm
   ```

4. Initialize the contract:
   ```bash
   near call <contract-account> new '{"owner_id": "<your-account>"}' --accountId <your-account>
   ```

**Testing**:
- Run unit tests: `cargo test`
- Test contract functions using NEAR CLI commands

### 2. Mintbase Foundation Grant - Interactive Creative NFTs

**Directory**: `src/near-wasm/` (extension of NEAR module)

**Deployment Steps**:
Since this is an extension of the NEAR module, it's deployed as part of the same contract.

**Testing**:
- Test Mintbase-specific functions using the deployed contract
- Verify integration with Mintbase marketplace using their test environment

### 3. Solana Foundation Grant - High-Performance Metadata

**Directory**: `src/solana-client/`

**Deployment Steps**:

1. Navigate to the module directory:
   ```bash
   cd src/solana-client
   ```

2. Build the program:
   ```bash
   cargo build-bpf
   ```

3. Deploy to Solana devnet:
   ```bash
   solana program deploy target/deploy/solana_client.so
   ```

**Testing**:
- Run unit tests: `cargo test`
- Test program functions using Solana CLI commands
- Use Solana explorer to verify program deployment

### 4. Filecoin Foundation Grant - IPFS Persistence Layer

**Directory**: `src/ipfs-integration/`

**Deployment Steps**:

1. Navigate to the module directory:
   ```bash
   cd src/ipfs-integration
   ```

2. Build the library:
   ```bash
   cargo build --release
   ```

3. Start IPFS daemon:
   ```bash
   ipfs daemon
   ```

4. Test the integration:
   ```bash
   cargo run --example ipfs_test
   ```

**Testing**:
- Run unit tests: `cargo test`
- Test IPFS integration with local IPFS node
- Verify Filecoin storage provider integration

### 5. Rust Foundation Grant - Core Creative Engine

**Directory**: `src/rust-client/`

**Deployment Steps**:

1. Navigate to the module directory:
   ```bash
   cd src/rust-client
   ```

2. Build the library:
   ```bash
   cargo build --release
   ```

3. Test the crate:
   ```bash
   cargo test
   ```

4. Publish to crates.io (optional):
   ```bash
   cargo publish
   ```

**Testing**:
- Run unit tests: `cargo test`
- Test GPU acceleration with example applications
- Verify emotional computing integration

### 6. Web3 Foundation Grant - Polkadot Cross-Chain Bridge

**Directory**: `src/polkadot-client/`

**Deployment Steps**:

1. Navigate to the module directory:
   ```bash
   cd src/polkadot-client
   ```

2. Build the library:
   ```bash
   cargo build --release
   ```

3. Test Substrate pallet integration:
   ```bash
   cargo test
   ```

**Testing**:
- Run unit tests: `cargo test`
- Test with local Substrate node
- Verify cross-parachain messaging

### Test Marketplace

**Directory**: `src/marketplace/` and `marketplace-frontend/`

**Deployment Steps**:

1. Build the marketplace contract:
   ```bash
   cd src/marketplace
   ./build.sh
   ```

2. Deploy to NEAR testnet:
   ```bash
   near dev-deploy res/contract.wasm
   ```

3. Initialize the marketplace:
   ```bash
   near call <contract-account> new '{"owner_id": "<your-account>"}' --accountId <your-account>
   ```

4. Deploy the frontend:
   ```bash
   # Serve the frontend files using any web server
   # For example, using Python:
   cd marketplace-frontend
   python -m http.server 8000
   ```

**Testing**:
- Test all marketplace features through the web interface
- Verify DAO governance functionality
- Test cross-chain bridge simulation
- Verify soulbound token management

## Parallel Development Workflow

To work on all modules simultaneously:

1. **Separate Development Environments**: Use separate terminals or IDE instances for each module
2. **Version Control**: Use Git branches for each module's development
3. **Integration Testing**: Regularly test module interactions using the test marketplace
4. **Documentation**: Keep documentation updated as each module evolves

## Continuous Integration

For automated testing and deployment:

1. **GitHub Actions**: Set up workflows for each module
2. **Test Matrix**: Run tests on multiple platforms and configurations
3. **Deployment Automation**: Automate deployment to testnets
4. **Monitoring**: Set up monitoring for deployed contracts

## Troubleshooting

### Common Issues

1. **Dependency Conflicts**: Build each module in isolation
2. **Toolchain Versions**: Ensure compatible versions of blockchain CLIs
3. **Network Issues**: Check connectivity to testnets and IPFS
4. **Account Funding**: Ensure test accounts have sufficient funds

### Debugging Tips

1. **Verbose Logging**: Use `--verbose` flags with CLI commands
2. **Unit Tests**: Run specific test cases to isolate issues
3. **Local Networks**: Use local testnets for faster iteration
4. **Debug Builds**: Use debug builds for better error messages

## Monitoring and Maintenance

### Performance Monitoring

1. **Transaction Throughput**: Monitor TPS for each blockchain
2. **Gas Usage**: Track gas consumption for contract calls
3. **Storage Costs**: Monitor IPFS/Filecoin storage usage
4. **Response Times**: Measure API response times

### Security Audits

1. **Static Analysis**: Use tools like `cargo-audit`
2. **Manual Review**: Regular code review sessions
3. **Penetration Testing**: Test with security tools
4. **Upgrade Planning**: Plan for security patches and upgrades

## Scaling Considerations

### Performance Optimization

1. **Caching**: Implement caching strategies for frequently accessed data
2. **Batching**: Batch operations to reduce transaction overhead
3. **Compression**: Use data compression for large metadata
4. **Load Balancing**: Distribute load across multiple instances

### Future Enhancements

1. **Additional Blockchains**: Extend to other blockchain platforms
2. **Advanced Features**: Add machine learning and AI capabilities
3. **Mobile Support**: Develop mobile applications
4. **Enterprise Features**: Add enterprise-grade security and compliance

## Conclusion

This deployment guide provides a comprehensive approach to deploying and testing all 6 grant modules. By following these instructions, you can successfully deploy each module independently and test them through the integrated marketplace environment.

Remember to:
- Build each module in isolation due to dependency conflicts
- Test thoroughly before deploying to mainnets
- Monitor performance and security continuously
- Plan for future scaling and enhancements

The modular architecture allows for flexible deployment and independent evolution of each component while maintaining interoperability through the test marketplace.