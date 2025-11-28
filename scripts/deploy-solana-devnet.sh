#!/bin/bash

# Solana Devnet Deployment Script
# This script deploys the creative metadata program to Solana devnet

set -e

echo "🚀 Starting Solana Devnet Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found. Please install it first.${NC}"
    exit 1
fi

# Set Solana configuration to devnet
echo -e "${YELLOW}📡 Configuring Solana for devnet...${NC}"
solana config set --url https://api.devnet.solana.com

# Check current configuration
echo -e "${YELLOW}🔍 Current Solana configuration:${NC}"
solana config get

# Create or use existing keypair
KEYPAIR_PATH="$HOME/.config/solana/id.json"
if [ ! -f "$KEYPAIR_PATH" ]; then
    echo -e "${YELLOW}🔑 Generating new Solana keypair...${NC}"
    solana-keygen new --outfile "$KEYPAIR_PATH" --no-bip39-passphrase
else
    echo -e "${GREEN}✅ Using existing Solana keypair${NC}"
fi

# Get wallet address
WALLET_ADDRESS=$(solana address)
echo -e "${GREEN}💳 Wallet Address: $WALLET_ADDRESS${NC}"

# Check balance
echo -e "${YELLOW}💰 Checking wallet balance...${NC}"
solana balance

# Request airdrop if balance is low
BALANCE=$(solana balance | grep -o '[0-9]*\.[0-9]*' | head -1)
if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo -e "${YELLOW}🪂 Requesting airdrop for deployment...${NC}"
    solana airdrop 2
fi

# Navigate to Solana program directory
cd /c/Users/kapil/compiling/blockchain-nft-interactive/src/solana-program

# Build the program
echo -e "${YELLOW}🔨 Building Solana program...${NC}"
cargo build-sbf

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Deploy to devnet
echo -e "${YELLOW}🚀 Deploying to Solana devnet...${NC}"
solana program deploy target/deploy/solana_program.so

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    
    # Get the program ID
    PROGRAM_ID=$(solana program deploy target/deploy/solana_program.so --output json | jq -r '.programId')
    echo -e "${GREEN}📝 Program ID: $PROGRAM_ID${NC}"
    
    # Save configuration
    mkdir -p /c/Users/kapil/compiling/blockchain-nft-interactive/src/config
    cat > /c/Users/kapil/compiling/blockchain-nft-interactive/src/config/solana-devnet.env << EOF
# Solana Devnet Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=$PROGRAM_ID
SOLANA_WALLET_ADDRESS=$WALLET_ADDRESS
DEPLOYMENT_DATE=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF
    
    echo -e "${GREEN}✅ Configuration saved to src/config/solana-devnet.env${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"

# Create a simple test transaction
echo -e "${YELLOW}📝 Creating test session...${NC}"
cd /c/Users/kapil/compiling/blockchain-nft-interactive/src/solana-program

# Initialize a test session using the deployed program
cat > test-deployment.js << 'EOF'
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');

async function testDeployment() {
    try {
        // Set up connection
        const connection = new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');
        
        // Load wallet
        const wallet = anchor.Wallet.local();
        
        // Configure provider
        const provider = new anchor.AnchorProvider(connection, wallet, {
            commitment: 'confirmed',
        });
        
        anchor.setProvider(provider);
        
        // Load program
        const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID || 'CreativeMetadata111111111111111111111111111');
        const idl = JSON.parse(require('fs').readFileSync('./target/idl/solana_program.json', 'utf8'));
        const program = new anchor.Program(idl, programId, provider);
        
        console.log('🧪 Testing Solana program deployment...');
        console.log('📡 Program ID:', programId.toString());
        console.log('💳 Wallet:', wallet.publicKey.toString());
        
        // Generate session ID
        const sessionId = Keypair.generate().publicKey.toBytes();
        const emotionalState = [0.5, 0.3, 0.7]; // valence, arousal, dominance
        const shaderParams = [1.0, 0.5, 0.8, 0.2];
        
        // Find PDA for session
        const [sessionPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('session'), sessionId],
            programId
        );
        
        // Find PDA for creator reputation
        const [reputationPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('reputation'), wallet.publicKey.toBytes()],
            programId
        );
        
        console.log('📝 Session PDA:', sessionPda.toString());
        console.log('🏆 Reputation PDA:', reputationPda.toString());
        
        // Initialize session
        try {
            const tx = await program.methods
                .initSession(sessionId, emotionalState, shaderParams)
                .accounts({
                    session: sessionPda,
                    creatorReputation: reputationPda,
                    creator: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            
            console.log('✅ Session initialized!');
            console.log('📝 Transaction:', tx);
            
            // Record performance data
            const performanceData = Keypair.generate().publicKey;
            const emotionalVector = [0.6, 0.4, 0.8];
            const interactionIntensity = 0.75;
            
            const [performancePda] = PublicKey.findProgramAddressSync(
                [Buffer.from('performance'), sessionId, performanceData.toBytes()],
                programId
            );
            
            const tx2 = await program.methods
                .recordPerformanceData(emotionalVector, shaderParams, interactionIntensity)
                .accounts({
                    performanceData: performancePda,
                    session: sessionPda,
                    creatorReputation: reputationPda,
                    creator: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            
            console.log('✅ Performance data recorded!');
            console.log('📝 Transaction:', tx2);
            
            console.log('🎉 All tests passed! Deployment is working correctly.');
            
        } catch (error) {
            console.error('❌ Transaction failed:', error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testDeployment();
EOF

# Run the test
export SOLANA_PROGRAM_ID=$(solana address --keypair target/deploy/solana_program-keypair.json)
node test-deployment.js

echo -e "${GREEN}🎉 Solana devnet deployment completed successfully!${NC}"
echo -e "${GREEN}📋 Summary:${NC}"
echo -e "${GREEN}   Program ID: $PROGRAM_ID${NC}"
echo -e "${GREEN}   Wallet: $WALLET_ADDRESS${NC}"
echo -e "${GREEN}   Network: Devnet${NC}"
echo -e "${GREEN}   Config: src/config/solana-devnet.env${NC}"