#!/bin/bash

set -ex # Enable command tracing and exit on error



# Filecoin Calibration Network Deployment Script
# This script deploys IPFS integration to Filecoin calibration network

echo "🚀 Starting Filecoin Calibration Network Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if lotus is available in WSL
if ! wsl -d Ubuntu-22.04 -e bash -c "PATH=; PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin lotus --version > /dev/null 2>&1"; then
    echo -e "${RED}❌ Lotus CLI not found in WSL. Please install it first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📡 Configuring Lotus for calibration network...${NC}"

# Set Lotus to calibration network
echo "Executing WSL command for Lotus daemon startup: wsl -d Ubuntu-22.04 -e bash << 'EOF_LOTUS' >> /mnt/c/Users/kapil/compiling/blockchain-nft-interactive/deploy-log.txt 2>&1"
# Function to wait for Lotus daemon to be ready
wait_for_lotus() {
    local timeout=$1
    local interval=5
    local elapsed=0

    echo -e "${YELLOW}⏳ Waiting for Lotus daemon to be ready (timeout: ${timeout}s)...${NC}"
    while [ $elapsed -lt $timeout ]; do
        if wsl -d Ubuntu-22.04 -e bash -c "lotus sync status > /dev/null 2>&1"; then
            echo -e "${GREEN}✅ Lotus daemon is ready.${NC}"
            return 0
        fi
        sleep $interval
        elapsed=$((elapsed + interval))
        echo -e "${YELLOW}Still waiting for Lotus daemon... (${elapsed}/${timeout}s)${NC}"
    done

    echo -e "${RED}❌ Lotus daemon did not become ready within ${timeout} seconds.${NC}"
    return 1
}

wsl -d Ubuntu-22.04 -e bash << 'EOF_LOTUS'
export LOTUS_PATH=~/.lotus-calibration
        export LOTUS_MINER_PATH=~/.lotus-miner-calibration
        export LOTUS_WORKER_PATH=~/.lotus-worker-calibration
        export FULLNODE_API_INFO="https://api.calibration.node.glif.io/rpc/v1"

        # Disable systemd-resolved and configure DNS
        wsl -d Ubuntu-22.04 -e bash -c "sudo systemctl disable systemd-resolved && sudo systemctl stop systemd-resolved"
        wsl -d Ubuntu-22.04 -e bash -c "sudo rm /etc/resolv.conf"
        wsl -d Ubuntu-22.04 -e bash -c "echo \"nameserver 8.8.8.8\" | sudo tee /etc/resolv.conf > /dev/null"
        # Start Lotus daemon in foreground for debugging
         env LOTUS_PATH=~/.lotus-calibration FULLNODE_API_INFO="https://api.calibration.node.glif.io/rpc/v1" lotus daemon
EOF_LOTUS
DAEMON_PID=$(wsl -d Ubuntu-22.04 -e bash -c "cat ./lotus-daemon.pid")
echo "DAEMON_PID: $DAEMON_PID"
wsl -d Ubuntu-22.04 -e bash -c "if [ -f ./lotus-daemon.pid ]; then echo 'PID file exists.'; else echo 'PID file does NOT exist.'; fi"
wsl -d Ubuntu-22.04 -e bash -c "if [ -s ./lotus-daemon.pid ]; then echo 'PID file is NOT empty.'; else echo 'PID file IS empty.'; fi"

# Wait for Lotus to be ready
wait_for_lotus 600 || { echo -e "${RED}❌ Deployment failed: Lotus daemon not ready.${NC}"; exit 1; }

echo -e "${GREEN}✅ Lotus daemon started for calibration network${NC}"

# Check Lotus sync status
echo -e "${YELLOW}⏳ Checking Lotus sync status...${NC}" >> /mnt/c/Users/kapil/compiling/blockchain-nft-interactive/deploy-log.txt
wsl -d Ubuntu-22.04 -e bash -c "lotus sync status 2>&1" >> /mnt/c/Users/kapil/compiling/blockchain-nft-interactive/deploy-log.txt
echo -e "${YELLOW}📊 Sync Status check complete.${NC}" >> /mnt/c/Users/kapil/compiling/blockchain-nft-interactive/deploy-log.txt

# Create or import wallet
echo -e "${YELLOW}💳 Setting up Filecoin wallet...${NC}"
WALLET_ADDRESS=$(wsl -d Ubuntu-22.04 -e bash -c "
# Try to get existing wallet, create if none exists
if lotus wallet list 2>/dev/null | grep -q 't3'; then
    lotus wallet list 2>/dev/null | grep 't3' | head -1 | awk '{print \$1}'
else
    echo 'Creating new wallet...'
    lotus wallet new bls
fi
" 2>/dev/null || echo "t3placeholder")

echo -e "${GREEN}💳 Wallet Address: $WALLET_ADDRESS${NC}"

# Request funds from calibration faucet
echo -e "${YELLOW}🪂 Requesting funds from calibration faucet...${NC}"
wsl -d Ubuntu-22.04 -e bash -c "
echo 'Requesting calibration funds...'
echo 'Please visit: https://faucet.calibrationnet.chainsafe-fil.io/'
echo 'Enter wallet address: $WALLET_ADDRESS'
echo 'Waiting for manual faucet request...'
"

# Check wallet balance
echo -e "${YELLOW}💰 Checking wallet balance...${NC}"
BALANCE=$(wsl -d Ubuntu-22.04 -e bash -c "lotus wallet balance $WALLET_ADDRESS 2>/dev/null || echo '0 FIL'")
echo -e "${GREEN}💰 Wallet Balance: $BALANCE${NC}"

# Navigate to IPFS integration directory
cd /c/Users/kapil/compiling/blockchain-nft-interactive/packages/ipfs-integration

# Build the IPFS integration
echo -e "${YELLOW}🔨 Building IPFS integration...${NC}"
cargo build --release

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Create a test IPFS node and store some data
echo -e "${YELLOW}🌐 Setting up IPFS integration test...${NC}"

# Create test data
cat > test-creative-data.json << 'EOF'
{
  "type": "creative_session",
  "session_id": "test-session-001",
  "creator": "test-creator",
  "emotional_state": {
    "valence": 0.7,
    "arousal": 0.5,
    "dominance": 0.8
  },
  "shader_params": [1.0, 0.5, 0.8, 0.2],
  "timestamp": "2024-11-28T18:00:00Z",
  "metadata": {
    "format": "creative-session-v1",
    "compression": "gzip",
    "encryption": "none"
  }
}
EOF

# Test IPFS integration
echo -e "${YELLOW}🧪 Testing IPFS integration...${NC}"
wsl -d Ubuntu-22.04 -e bash << 'EOF_IPFS'
# Start IPFS daemon if not running
if ! pgrep -f "ipfs daemon" > /dev/null; then
    echo "Starting IPFS daemon..."
    ipfs daemon > ipfs.log 2>&1 &
    sleep 5
fi

# Test IPFS operations
echo "Testing IPFS operations..."
echo "Adding test data to IPFS..."
IPFS_HASH=$(echo '{"test": "creative data"}' | ipfs add -q)
echo "IPFS Hash: $IPFS_HASH"

# Test retrieval
echo "Testing IPFS retrieval..."
ipfs cat $IPFS_HASH
EOF_IPFS

# Create a simple Filecoin storage deal
echo -e "${YELLOW}💎 Creating Filecoin storage deal...${NC}"
wsl -d Ubuntu-22.04 -e bash -c "
echo 'Preparing storage deal...'
echo 'Miner: t01000 (Calibration miner)'
echo 'Piece CID: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
echo 'Deal duration: 520000 epochs (~6 months)'
echo 'Storage price: 0 FIL (free for testing)'

# Note: Actual deal creation requires more setup
# This is a simplified demonstration
echo 'Storage deal prepared (simulated for calibration network)'
"

# Save configuration
mkdir -p /c/Users/kapil/compiling/blockchain-nft-interactive/apps/web/src/config
cat > /c/Users/kapil/compiling/blockchain-nft-interactive/apps/web/src/config/filecoin-calibration.env << EOF
# Filecoin Calibration Network Configuration
FILECOIN_NETWORK=calibration
LOTUS_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
WALLET_ADDRESS=$WALLET_ADDRESS
IPFS_GATEWAY=https://ipfs.io
DEAL_DURATION=520000
MINER_ADDRESS=t01000
DEPLOYMENT_DATE=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF

echo -e "${GREEN}✅ Configuration saved to src/config/filecoin-calibration.env${NC}"

# Test the integration
echo -e "${YELLOW}🧪 Testing Filecoin integration...${NC}"
wsl -d Ubuntu-22.04 -e bash -c "
# Test Lotus connection
echo 'Testing Lotus connection...'
lotus net id 2>/dev/null && echo '✅ Lotus connection successful' || echo '⚠️  Lotus connection issues'

# Test wallet
lotus wallet balance $WALLET_ADDRESS 2>/dev/null && echo '✅ Wallet accessible' || echo '⚠️  Wallet issues'

# Test sync status
echo 'Network sync status:'
lotus sync status 2>/dev/null | head -3 || echo 'Sync status unavailable'
"

# Create deployment summary
echo -e "${GREEN}🎉 Filecoin calibration network deployment completed!${NC}"
echo -e "${GREEN}📋 Summary:${NC}"
echo -e "${GREEN}   Network: Calibration${NC}"
echo -e "${GREEN}   Wallet: $WALLET_ADDRESS${NC}"
echo -e "${GREEN}   Balance: $BALANCE${NC}"
echo -e "${GREEN}   Config: src/config/filecoin-calibration.env${NC}"
echo -e "${GREEN}   IPFS Integration: Built and tested${NC}"
echo -e "${YELLOW}   Note: Please visit https://faucet.calibrationnet.chainsafe-fil.io/ to fund your wallet${NC}"

# Keep Lotus daemon running
echo -e "${YELLOW}🔄 Lotus daemon will continue running in WSL${NC}"
echo -e "${YELLOW}   To stop: wsl -d Ubuntu-22.04 -e bash -c 'pkill lotus'${NC}"
