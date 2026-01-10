#!/bin/bash

# Parallel testing script for all 6 grant modules
echo "🧪 Testing All 6 Grant Modules in Parallel"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create logs directory
mkdir -p test-logs

echo -e "${BLUE}Starting parallel builds and tests...${NC}\n"

# Test each module independently
echo "1️⃣  Testing Rust Client (Rust Foundation Grant)..."
(cd src/rust-client && cargo test --release > ../../test-logs/rust-client.log 2>&1 && echo -e "${GREEN}✅ Rust Client: PASSED${NC}" || echo -e "${RED}❌ Rust Client: FAILED${NC}") &

echo "2️⃣  Testing IPFS Integration (Filecoin Grant)..."
(cd src/ipfs-integration && cargo test --release > ../../test-logs/ipfs-integration.log 2>&1 && echo -e "${GREEN}✅ IPFS Integration: PASSED${NC}" || echo -e "${RED}❌ IPFS Integration: FAILED${NC}") &

echo "3️⃣  Testing Polkadot Client (Web3 Foundation Grant)..."
(cd src/polkadot-client && cargo test --release > ../../test-logs/polkadot-client.log 2>&1 && echo -e "${GREEN}✅ Polkadot Client: PASSED${NC}" || echo -e "${RED}❌ Polkadot Client: FAILED${NC}") &

echo "4️⃣  Building NEAR WASM (NEAR & Mintbase Grants)..."
(cd src/near-wasm && cargo build --target wasm32-unknown-unknown --release > ../../test-logs/near-wasm.log 2>&1 && echo -e "${GREEN}✅ NEAR WASM: BUILD SUCCESS${NC}" || echo -e "${RED}❌ NEAR WASM: BUILD FAILED${NC}") &

echo "5️⃣  Building Solana Client (Solana Grant)..."
(cd src/solana-client && cargo build-bpf > ../../test-logs/solana-client.log 2>&1 && echo -e "${GREEN}✅ Solana Client: BUILD SUCCESS${NC}" || echo -e "${RED}❌ Solana Client: BUILD FAILED${NC}") &

echo "6️⃣  Building Marketplace..."
(cd src/marketplace && cargo build --target wasm32-unknown-unknown --release > ../../test-logs/marketplace.log 2>&1 && echo -e "${GREEN}✅ Marketplace: BUILD SUCCESS${NC}" || echo -e "${RED}❌ Marketplace: BUILD FAILED${NC}") &

# Wait for all background jobs
wait

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}All builds and tests complete!${NC}"
echo -e "${BLUE}Check test-logs/ directory for details${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Show summary
echo "📊 Test Summary:"
echo "----------------"
for log in test-logs/*.log; do
    module=$(basename $log .log)
    if grep -q "test result: ok" $log 2>/dev/null || grep -q "Finished release" $log 2>/dev/null; then
        echo -e "${GREEN}✅ $module${NC}"
    else
        echo -e "${RED}❌ $module (see test-logs/$module.log)${NC}"
    fi
done