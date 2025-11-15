# Separate Repository Setup Plan

This document outlines the strategy for creating separate repositories for each grant while maintaining the main project repository.

## Current Structure

The project is already well-organized with separate directories for each grant:
- `src/near-wasm/` - NEAR Grant components
- `src/marketplace/` - Mintbase Grant components
- `src/solana-client/` - Solana Grant components
- `src/ipfs-integration/` - Filecoin Grant components
- `src/rust-client/` - Rust Foundation Grant components
- `src/polkadot-client/` - Web3 Foundation Grant components

## Repository Separation Strategy

### 1. Main Repository (Remains Unchanged)
- **Repository**: https://github.com/compiling-org/nft-blockchain-interactive
- **Purpose**: Complete unified platform with all grants
- **Branches**: 
  - `main` - Full platform
  - `development` - Active development
  - `grant-near`, `grant-mintbase`, etc. - Individual grant branches

### 2. Individual Grant Repositories
Each grant will have its own repository with only the relevant code:

1. **NEAR Grant Repository**
   - **Name**: `near-creative-engine`
   - **URL**: https://github.com/compiling-org/near-creative-engine
   - **Contents**: 
     - `src/near-wasm/` directory
     - `src/rust-client/` directory (core dependency)
     - `test-website/` with only Fractal Studio tab
     - Relevant build scripts
     - Grant-specific documentation

2. **Mintbase Grant Repository**
   - **Name**: `mintbase-creative-marketplace`
   - **URL**: https://github.com/compiling-org/mintbase-creative-marketplace
   - **Contents**:
     - `src/marketplace/` directory
     - `marketplace-frontend/` directory
     - `test-website/` with marketplace components
     - Relevant build scripts
     - Grant-specific documentation

3. **Solana Grant Repository**
   - **Name**: `solana-emotional-metadata`
   - **URL**: https://github.com/compiling-org/solana-emotional-metadata
   - **Contents**:
     - `src/solana-client/` directory
     - `test-website/` with Neuroemotive AI tab
     - Relevant build scripts
     - Grant-specific documentation

4. **Filecoin Grant Repository**
   - **Name**: `filecoin-creative-storage`
   - **URL**: https://github.com/compiling-org/filecoin-creative-storage
   - **Contents**:
     - `src/ipfs-integration/` directory
     - `test-website/` with storage components
     - Relevant build scripts
     - Grant-specific documentation

5. **Rust Foundation Grant Repository**
   - **Name**: `rust-emotional-engine`
   - **URL**: https://github.com/compiling-org/rust-emotional-engine
   - **Contents**:
     - `src/rust-client/` directory
     - Core engine components
     - WASM build tools
     - Grant-specific documentation

6. **Web3 Foundation Grant Repository**
   - **Name**: `polkadot-creative-identity`
   - **URL**: https://github.com/compiling-org/polkadot-creative-identity
   - **Contents**:
     - `src/polkadot-client/` directory
     - `test-website/` with identity components
     - Relevant build scripts
     - Grant-specific documentation

## Implementation Steps

### Step 1: Create Repository Structure Scripts

Create scripts in each grant repository that can:
1. Extract only the relevant files from the main project
2. Set up proper directory structure
3. Configure build and deployment processes

### Step 2: Set Up Git Subtree or Submodule Strategy

Two approaches for keeping repositories synchronized:

#### Approach A: Git Subtree (Recommended)
- Each grant repository is independent
- Main repository uses git subtree to pull/push changes
- Clean separation with ability to merge changes

#### Approach B: Git Submodule
- Main repository references individual grant repositories as submodules
- Changes made directly in grant repositories
- More complex but keeps everything perfectly synchronized

### Step 3: Automated Synchronization

Create automation scripts that:
1. Push changes from main repository to individual grant repositories
2. Pull updates from grant repositories to main repository
3. Handle merge conflicts automatically when possible

## Repository Creation Process

### For Each Grant Repository:

1. **Initialize new repository**
   ```bash
   mkdir grant-name
   cd grant-name
   git init
   ```

2. **Extract relevant files from main project**
   ```bash
   # Example for NEAR grant
   cp -r ../nft-blockchain-interactive/src/near-wasm ./src/
   cp -r ../nft-blockchain-interactive/src/rust-client ./src/
   cp ../nft-blockchain-interactive/test-website/index.html ./test-website/
   # Extract only the Fractal Studio tab content
   ```

3. **Create grant-specific build scripts**
   ```bash
   cp ../nft-blockchain-interactive/build-near-grant.sh ./build.sh
   ```

4. **Set up proper directory structure**
   - Maintain same relative paths as in main project
   - Update import paths if necessary
   - Create README with grant-specific information

5. **Add grant-specific documentation**
   - Copy relevant sections from grant proposal
   - Add usage instructions
   - Include deployment guides

## Synchronization Strategy

### Pushing Changes from Main to Grant Repositories:
1. Extract changes using git diff or subtree split
2. Apply changes to corresponding grant repository
3. Commit and push to grant repository

### Pulling Changes from Grant Repositories to Main:
1. Pull latest changes from grant repository
2. Merge changes into appropriate directories in main repository
3. Resolve any conflicts
4. Commit to main repository

## Benefits of This Approach

1. **Independent Development**: Each grant can be developed and deployed separately
2. **Focused Repositories**: Users only need to clone relevant code
3. **Easier Maintenance**: Smaller, focused repositories are easier to manage
4. **Grant-Specific Documentation**: Each repository has tailored information
5. **Maintained Integration**: Main repository keeps all grants integrated
6. **Flexible Deployment**: Users can choose individual grants or full platform

## Challenges and Solutions

### Challenge 1: Shared Dependencies
**Solution**: 
- Include core dependencies in each relevant grant repository
- Use versioning to track compatibility
- Document dependency relationships clearly

### Challenge 2: Keeping Repositories Synchronized
**Solution**:
- Create automation scripts for synchronization
- Use git subtree for clean extraction/merging
- Establish clear contribution guidelines

### Challenge 3: Path References
**Solution**:
- Maintain consistent directory structure
- Update import paths as needed
- Use relative paths where possible

## Next Steps

1. Create individual grant repositories on GitHub
2. Set up repository structure for each grant
3. Create synchronization automation scripts
4. Test the process with one grant first
5. Roll out to all grants
6. Update documentation and README files
7. Set up CI/CD pipelines for each repository