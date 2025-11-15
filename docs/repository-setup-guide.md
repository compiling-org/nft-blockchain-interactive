# Repository Setup Guide

This guide explains how to set up separate repositories for each grant while maintaining the main project repository.

## Overview

The project is organized to support both a unified platform (main repository) and individual grant repositories. This allows for:

1. **Independent Development**: Each grant can be developed and deployed separately
2. **Focused Repositories**: Users only need to clone relevant code
3. **Easier Maintenance**: Smaller, focused repositories are easier to manage
4. **Grant-Specific Documentation**: Each repository has tailored information

## Directory Structure

```
nft-blockchain-interactive/          # Main repository (complete platform)
├── src/
│   ├── near-wasm/                   # NEAR Grant components
│   ├── marketplace/                 # Mintbase Grant components
│   ├── solana-client/               # Solana Grant components
│   ├── ipfs-integration/            # Filecoin Grant components
│   ├── rust-client/                 # Rust Foundation Grant components
│   └── polkadot-client/             # Web3 Foundation Grant components
├── scripts/                         # Repository extraction scripts
└── docs/                            # Documentation

../grant-repositories/               # Parent directory for individual grant repos
├── near-creative-engine/            # NEAR Grant repository
├── mintbase-creative-marketplace/   # Mintbase Grant repository
├── solana-emotional-metadata/       # Solana Grant repository
├── filecoin-creative-storage/       # Filecoin Grant repository
├── rust-emotional-engine/           # Rust Foundation Grant repository
└── polkadot-creative-identity/      # Web3 Foundation Grant repository
```

## Setting Up Grant Repositories

### Step 1: Run the Setup Script

From the main project directory, run the master setup script:

```bash
cd scripts
./setup-all-grant-repos.sh
```

This script will:
1. Create a parent directory for all grant repositories
2. Run extraction scripts for each grant
3. Set up the basic structure for each repository

### Step 2: Create GitHub Repositories

Create empty repositories on GitHub for each grant:

1. Log into GitHub
2. Create new repositories with the following names:
   - `near-creative-engine`
   - `mintbase-creative-marketplace`
   - `solana-emotional-metadata`
   - `filecoin-creative-storage`
   - `rust-emotional-engine`
   - `polkadot-creative-identity`

### Step 3: Initialize and Push Each Repository

For each grant repository, initialize git and push to GitHub:

```bash
# Example for NEAR grant
cd ../grant-repositories/near-creative-engine
git init
git add .
git commit -m "Initial commit - NEAR Creative Engine"
git branch -M main
git remote add origin https://github.com/compiling-org/near-creative-engine.git
git push -u origin main
```

Repeat this process for each grant repository.

## Repository-Specific Setup

### NEAR Creative Engine (`near-creative-engine`)

**Contents:**
- `src/near-wasm/` - Smart contracts and WASM engine
- `src/rust-client/` - Core Rust library dependency
- `test-website/` - Simplified frontend with Fractal Studio
- Build scripts and documentation

**Setup:**
```bash
cd near-creative-engine
# Install dependencies
npm install
# Build contracts
./build.sh
```

### Solana Emotional Metadata (`solana-emotional-metadata`)

**Contents:**
- `src/solana-client/` - Solana program and client code
- `src/rust-client/` - Core Rust library dependency
- `test-website/` - Simplified frontend with Neuroemotive AI
- Build scripts and documentation

**Setup:**
```bash
cd solana-emotional-metadata
# Install Anchor framework
npm install -g @project-serum/anchor-cli
# Build program
./build.sh
```

### Filecoin Creative Storage (`filecoin-creative-storage`)

**Contents:**
- `src/ipfs-integration/` - IPFS/Filecoin integration code
- `test-website/` - Simplified frontend with Storage interface
- Build scripts and documentation

**Setup:**
```bash
cd filecoin-creative-storage
# Install IPFS
npm install ipfs-http-client
# Build
./build.sh
```

## Synchronization Between Repositories

### Pushing Changes from Main to Grant Repositories

When making changes to the main repository that affect individual grants:

1. Identify which grant(s) the changes affect
2. Extract the changes using git diff or manual copying
3. Apply changes to the corresponding grant repository
4. Commit and push to the grant repository

### Pulling Changes from Grant Repositories to Main

When making improvements in individual grant repositories:

1. Pull the latest changes from the grant repository
2. Merge changes into the appropriate directory in the main repository
3. Resolve any conflicts
4. Commit to the main repository

## Automation Scripts

The following scripts help with repository management:

### `extract-near-grant.sh`
Extracts NEAR grant files and creates a standalone repository structure.

### `extract-solana-grant.sh`
Extracts Solana grant files and creates a standalone repository structure.

### `extract-filecoin-grant.sh`
Extracts Filecoin grant files and creates a standalone repository structure.

### `setup-all-grant-repos.sh`
Master script that runs all extraction scripts to set up all grant repositories.

## Best Practices

### 1. Version Management
- Use semantic versioning for each repository
- Keep a changelog for each grant
- Tag releases appropriately

### 2. Documentation
- Maintain grant-specific README files
- Include usage instructions for each repository
- Document API changes and breaking updates

### 3. Dependencies
- Clearly document shared dependencies
- Use version pinning for external dependencies
- Update dependency documentation when changes occur

### 4. Testing
- Include grant-specific test suites
- Maintain CI/CD pipelines for each repository
- Test integration points between grants

## Troubleshooting

### Common Issues

1. **Path References**
   - Ensure relative paths are correct in each repository
   - Update import statements as needed
   - Test build processes after extraction

2. **Dependency Conflicts**
   - Check for version mismatches in shared dependencies
   - Use dependency lock files to maintain consistency
   - Document dependency relationships clearly

3. **Build Failures**
   - Verify all required tools are installed
   - Check environment variables and configuration
   - Ensure build scripts have proper permissions

### Getting Help

If you encounter issues:
1. Check the documentation in each repository
2. Review the main project documentation
3. Open an issue on the relevant GitHub repository
4. Contact the development team

## Next Steps

1. Complete the remaining grant extraction scripts:
   - `extract-mintbase-grant.sh`
   - `extract-rust-grant.sh`
   - `extract-polkadot-grant.sh`

2. Set up CI/CD pipelines for each repository:
   - GitHub Actions for automated testing
   - Deployment scripts for each platform
   - Notification systems for build failures

3. Create detailed documentation for each repository:
   - Installation guides
   - Usage examples
   - API documentation
   - Troubleshooting guides

4. Set up monitoring and analytics:
   - Track repository usage and contributions
   - Monitor build success rates
   - Gather user feedback