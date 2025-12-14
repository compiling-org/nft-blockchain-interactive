#!/bin/bash
# Solana Devnet Deployment Script
# Deploys biometric NFT and emotional metadata programs to Solana devnet

set -e

echo "============================================"
echo "🚀 Solana Devnet Deployment"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
log "Checking prerequisites..."

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    error "Solana CLI not installed. Install from: https://docs.solana.com/cli/install-solana-cli-tools"
fi

# Check Anchor
if ! command -v anchor &> /dev/null; then
    error "Anchor not installed. Install with: cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js not installed"
fi

# Check keypair
if [ ! -f ~/.config/solana/id.json ]; then
    warn "No Solana keypair found. Creating one..."
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase
fi

log "✅ Prerequisites check passed"

# Configure for devnet
log "Configuring for Solana devnet..."
solana config set --url https://api.devnet.solana.com

# Check balance
BALANCE=$(solana balance | grep -o '[0-9.]*' | head -1)
log "Current balance: $BALANCE SOL"

if [ "$(echo "$BALANCE < 0.1" | bc -l)" -eq 1 ]; then
    warn "Low balance. Requesting airdrop..."
    solana airdrop 2
fi

# Navigate to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

log "📍 Working in: $(pwd)"

# Install dependencies
log "Installing dependencies..."
npm install

# Build programs
log "Building Solana programs..."
anchor build

if [ $? -ne 0 ]; then
    error "Anchor build failed"
fi

log "✅ Build successful"

# Deploy Biometric NFT program
log "Deploying Biometric NFT program..."
anchor deploy --program-name biometric-nft --provider.cluster devnet

if [ $? -ne 0 ]; then
    error "Biometric NFT deployment failed"
fi

# Get program ID
BIOMETRIC_PROGRAM_ID=$(solana program show --programs | grep biometric-nft | awk '{print $1}' | tail -1)
if [ -z "$BIOMETRIC_PROGRAM_ID" ]; then
    error "Could not get Biometric NFT program ID"
fi

log "✅ Biometric NFT deployed: $BIOMETRIC_PROGRAM_ID"

# Deploy Emotional Metadata program
log "Deploying Emotional Metadata program..."
anchor deploy --program-name emotional-metadata --provider.cluster devnet

if [ $? -ne 0 ]; then
    error "Emotional Metadata deployment failed"
fi

# Get program ID
EMOTIONAL_PROGRAM_ID=$(solana program show --programs | grep emotional-metadata | awk '{print $1}' | tail -1)
if [ -z "$EMOTIONAL_PROGRAM_ID" ]; then
    error "Could not get Emotional Metadata program ID"
fi

log "✅ Emotional Metadata deployed: $EMOTIONAL_PROGRAM_ID"

# Update program IDs in configuration
log "Updating program IDs..."
cat > src/config/solana-programs.ts << EOF
// Auto-generated Solana program IDs
export const SOLANA_PROGRAMS = {
  biometricNft: "$BIOMETRIC_PROGRAM_ID",
  emotionalMetadata: "$EMOTIONAL_PROGRAM_ID",
  cluster: "devnet",
} as const;
EOF

# Run tests
log "Running tests..."
npm test

if [ $? -ne 0 ]; then
    warn "Some tests failed - check output above"
else
    log "✅ All tests passed"
fi

# Create deployment summary
cat > deployment-summary.md << EOF
# Solana Devnet Deployment Summary

**Date**: $(date)
**Network**: Devnet
**Deployer**: $(solana address)

## Deployed Programs

### Biometric NFT Program
- **Program ID**: $BIOMETRIC_PROGRAM_ID
- **Description**: NFTs with biometric data and emotional states
- **Features**: Mint, update emotion, transfer with validation

### Emotional Metadata Program  
- **Program ID**: $EMOTIONAL_PROGRAM_ID
- **Description**: Emotional metadata storage and analysis
- **Features**: Store metadata, analyze patterns, query states

## Next Steps

1. Update frontend configuration with new program IDs
2. Test integration with existing NEAR and Polkadot components
3. Implement cross-chain bridge functionality
4. Add monitoring and alerting
5. Prepare for mainnet deployment after grant approval

## Verification

Run these commands to verify deployment:
\`\`\`bash
# Check program details
solana program show $BIOMETRIC_PROGRAM_ID
solana program show $EMOTIONAL_PROGRAM_ID

# Check transactions
solana transaction-history $(solana address) --limit 10

# Run tests
anchor test --provider.cluster devnet
\`\`\`
EOF

log "🎉 Solana devnet deployment completed successfully!"
log "📋 Deployment summary saved to: deployment-summary.md"
log "🔗 Program IDs updated in: src/config/solana-programs.ts"

# Display final summary
echo ""
echo "============================================"
echo "DEPLOYMENT COMPLETE"
echo "============================================"
echo "Biometric NFT: $BIOMETRIC_PROGRAM_ID"
echo "Emotional Metadata: $EMOTIONAL_PROGRAM_ID"
echo ""
echo "Check deployment-summary.md for details"
echo "Run 'solana program show <PROGRAM_ID>' for more info"
echo "============================================"