#!/usr/bin/env node

/**
 * Cross-Chain Bridge Deployment and Testing Script
 * This script deploys and tests the real cross-chain bridge between Filecoin and Solana biometric NFTs
 */

const CrossChainBridge = require('../src/utils/cross-chain-bridge');
const { config, validateConfig } = require('../src/config/cross-chain-bridge-config');
const fs = require('fs');
const path = require('path');

class CrossChainBridgeDeployment {
    constructor() {
        this.bridge = null;
        this.deploymentResults = {
            success: false,
            bridgeInitialized: false,
            testTransfers: [],
            errors: []
        };
    }

    async deploy() {
        console.log('🌉 Starting Cross-Chain Bridge Deployment...');
        
        try {
            // Step 1: Validate configuration
            console.log('📋 Validating bridge configuration...');
            validateConfig(config);
            console.log('✅ Configuration validated successfully');

            // Step 2: Initialize bridge
            console.log('🔧 Initializing cross-chain bridge...');
            this.bridge = new CrossChainBridge(config);
            
            const initSuccess = await this.bridge.initialize();
            if (!initSuccess) {
                throw new Error('Failed to initialize bridge');
            }
            
            this.deploymentResults.bridgeInitialized = true;
            console.log('✅ Bridge initialized successfully');

            // Step 3: Create test wallets if they don't exist
            console.log('💳 Setting up test wallets...');
            await this.setupTestWallets();
            console.log('✅ Test wallets setup complete');

            // Step 4: Test Filecoin to Solana transfer
            console.log('🔄 Testing Filecoin to Solana transfer...');
            const filecoinToSolanaResult = await this.testFilecoinToSolanaTransfer();
            this.deploymentResults.testTransfers.push(filecoinToSolanaResult);
            
            if (filecoinToSolanaResult.success) {
                console.log('✅ Filecoin to Solana transfer test passed');
            } else {
                console.log('❌ Filecoin to Solana transfer test failed:', filecoinToSolanaResult.error);
            }

            // Step 5: Test Solana to Filecoin transfer
            console.log('🔄 Testing Solana to Filecoin transfer...');
            const solanaToFilecoinResult = await this.testSolanaToFilecoinTransfer();
            this.deploymentResults.testTransfers.push(solanaToFilecoinResult);
            
            if (solanaToFilecoinResult.success) {
                console.log('✅ Solana to Filecoin transfer test passed');
            } else {
                console.log('❌ Solana to Filecoin transfer test failed:', solanaToFilecoinResult.error);
            }

            // Step 6: Generate deployment summary
            console.log('📊 Generating deployment summary...');
            await this.generateDeploymentSummary();

            // Step 7: Save deployment results
            this.deploymentResults.success = true;
            await this.saveDeploymentResults();

            console.log('🎉 Cross-chain bridge deployment completed successfully!');
            return this.deploymentResults;

        } catch (error) {
            console.error('❌ Cross-chain bridge deployment failed:', error);
            this.deploymentResults.errors.push({
                step: 'deployment',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            await this.saveDeploymentResults();
            throw error;
        }
    }

    async setupTestWallets() {
        const walletsDir = path.join(__dirname, '../wallets');
        
        // Create wallets directory if it doesn't exist
        if (!fs.existsSync(walletsDir)) {
            fs.mkdirSync(walletsDir, { recursive: true });
        }

        // Setup Solana wallet
        const solanaKeypairPath = config.solana.keypairPath;
        if (!fs.existsSync(solanaKeypairPath)) {
            console.log('Creating new Solana keypair...');
            
            // Generate a new Solana keypair
            const { Keypair } = require('@solana/web3.js');
            const keypair = Keypair.generate();
            
            const keypairData = Array.from(keypair.secretKey);
            fs.writeFileSync(solanaKeypairPath, JSON.stringify(keypairData));
            
            console.log(`New Solana keypair created: ${keypair.publicKey.toString()}`);
            console.log(`Keypair saved to: ${solanaKeypairPath}`);
        }

        // Setup Filecoin wallet (using existing address for now)
        // In a real deployment, you'd generate a Filecoin wallet
        console.log(`Using Filecoin address: ${config.filecoin.defaultAddress}`);
    }

    async testFilecoinToSolanaTransfer() {
        try {
            // Create test biometric data
            const testBiometricData = {
                emotion_score: 0.85,
                biometric_hash: 'a1b2c3d4e5f678901234567890123456789012345678901234567890123456789',
                timestamp: Math.floor(Date.now() / 1000),
                quality_score: 0.95
            };

            // First, we need to mint a test NFT on Filecoin
            console.log('Minting test biometric NFT on Filecoin...');
            const filecoinTokenId = await this.mintTestFilecoinNFT(testBiometricData);
            
            if (!filecoinTokenId) {
                throw new Error('Failed to mint test Filecoin NFT');
            }

            console.log(`Test Filecoin NFT minted with ID: ${filecoinTokenId}`);

            // Get Solana wallet for recipient
            const solanaKeypairPath = config.solana.keypairPath;
            const keypairData = JSON.parse(fs.readFileSync(solanaKeypairPath, 'utf8'));
            const { Keypair } = require('@solana/web3.js');
            const solanaWallet = Keypair.fromSecretKey(Uint8Array.from(keypairData));
            const solanaRecipient = solanaWallet.publicKey.toString();

            // Perform the cross-chain transfer
            console.log(`Transferring Filecoin NFT ${filecoinTokenId} to Solana recipient ${solanaRecipient}...`);
            
            const result = await this.bridge.transferFromFilecoinToSolana(
                filecoinTokenId,
                solanaRecipient
            );

            return {
                direction: 'filecoin-to-solana',
                ...result,
                testData: testBiometricData
            };

        } catch (error) {
            console.error('Filecoin to Solana test failed:', error);
            return {
                direction: 'filecoin-to-solana',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async testSolanaToFilecoinTransfer() {
        try {
            // Create test emotion data
            const testEmotionData = {
                happiness: 0.8,
                sadness: 0.2,
                anger: 0.1,
                fear: 0.3,
                surprise: 0.7,
                neutral: 0.4
            };

            // Get Solana wallet
            const solanaKeypairPath = config.solana.keypairPath;
            const keypairData = JSON.parse(fs.readFileSync(solanaKeypairPath, 'utf8'));
            const { Keypair, PublicKey } = require('@solana/web3.js');
            const solanaWallet = Keypair.fromSecretKey(Uint8Array.from(keypairData));

            // Create a new token account for the test NFT
            const tokenAccount = Keypair.generate();
            console.log(`Created test Solana token account: ${tokenAccount.publicKey.toString()}`);

            // First, we need to mint a test NFT on Solana
            console.log('Minting test biometric NFT on Solana...');
            const solanaTokenId = await this.mintTestSolanaNFT({
                tokenAccount: tokenAccount.publicKey,
                owner: solanaWallet.publicKey,
                biometricHash: 'b2c3d4e5f678901234567890123456789012345678901234567890123456789a',
                emotionData: testEmotionData,
                qualityScore: 0.9,
                crossChainId: 'test_cross_chain_id'
            });

            if (!solanaTokenId) {
                throw new Error('Failed to mint test Solana NFT');
            }

            console.log(`Test Solana NFT minted with ID: ${solanaTokenId}`);

            // Use Filecoin recipient address
            const filecoinRecipient = config.filecoin.defaultAddress;

            // Perform the cross-chain transfer
            console.log(`Transferring Solana NFT ${solanaTokenId} to Filecoin recipient ${filecoinRecipient}...`);
            
            const result = await this.bridge.transferFromSolanaToFilecoin(
                tokenAccount.publicKey,
                filecoinRecipient
            );

            return {
                direction: 'solana-to-filecoin',
                ...result,
                testData: testEmotionData
            };

        } catch (error) {
            console.error('Solana to Filecoin test failed:', error);
            return {
                direction: 'solana-to-filecoin',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async mintTestFilecoinNFT(biometricData) {
        try {
            // This would call the actual Filecoin actor to mint an NFT
            // For testing purposes, we'll simulate a successful mint
            const mockTokenId = `filecoin_test_nft_${Date.now()}`;
            console.log(`Simulated Filecoin NFT mint: ${mockTokenId}`);
            return mockTokenId;
        } catch (error) {
            console.error('Failed to mint test Filecoin NFT:', error);
            return null;
        }
    }

    async mintTestSolanaNFT({ tokenAccount, owner, biometricHash, emotionData, qualityScore, crossChainId }) {
        try {
            // This would call the actual Solana program to mint an NFT
            // For testing purposes, we'll simulate a successful mint
            const mockTokenId = `solana_test_nft_${Date.now()}`;
            console.log(`Simulated Solana NFT mint: ${mockTokenId}`);
            return mockTokenId;
        } catch (error) {
            console.error('Failed to mint test Solana NFT:', error);
            return null;
        }
    }

    async generateDeploymentSummary() {
        const summary = {
            timestamp: new Date().toISOString(),
            bridgeInitialized: this.deploymentResults.bridgeInitialized,
            testTransfers: this.deploymentResults.testTransfers,
            statistics: this.bridge ? this.bridge.getBridgeStatistics() : null,
            transferHistory: this.bridge ? this.bridge.getTransferHistory() : [],
            errors: this.deploymentResults.errors
        };

        const summaryPath = path.join(__dirname, '../reports/cross-chain-bridge-deployment.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        
        console.log(`Deployment summary saved to: ${summaryPath}`);
        
        // Also generate a human-readable summary
        const humanReadableSummary = this.generateHumanReadableSummary(summary);
        const humanSummaryPath = path.join(__dirname, '../reports/cross-chain-bridge-deployment-summary.md');
        fs.writeFileSync(humanSummaryPath, humanReadableSummary);
        
        console.log(`Human-readable summary saved to: ${humanSummaryPath}`);
    }

    generateHumanReadableSummary(summary) {
        let md = `# Cross-Chain Bridge Deployment Summary\n\n`;
        md += `**Deployment Date:** ${summary.timestamp}\n\n`;
        
        md += `## Bridge Status\n`;
        md += `- **Initialized:** ${summary.bridgeInitialized ? '✅' : '❌'}\n`;
        md += `- **Total Transfers:** ${summary.statistics?.totalTransfers || 0}\n`;
        md += `- **Completed Transfers:** ${summary.statistics?.completedTransfers || 0}\n`;
        md += `- **Failed Transfers:** ${summary.statistics?.failedTransfers || 0}\n\n`;
        
        md += `## Test Results\n`;
        summary.testTransfers.forEach((test, index) => {
            md += `### Test ${index + 1}: ${test.direction}\n`;
            md += `- **Status:** ${test.success ? '✅ Success' : '❌ Failed'}\n`;
            md += `- **Transfer ID:** ${test.transferId || 'N/A'}\n`;
            if (test.error) {
                md += `- **Error:** ${test.error}\n`;
            }
            md += `\n`;
        });
        
        md += `## Recent Transfer History\n`;
        if (summary.transferHistory.length > 0) {
            summary.transferHistory.slice(0, 5).forEach((transfer, index) => {
                md += `### Transfer ${index + 1}\n`;
                md += `- **ID:** ${transfer.transferId}\n`;
                md += `- **Status:** ${transfer.status}\n`;
                md += `- **Timestamp:** ${new Date(transfer.timestamp).toISOString()}\n\n`;
            });
        } else {
            md += `No transfers completed yet.\n\n`;
        }
        
        if (summary.errors.length > 0) {
            md += `## Errors\n`;
            summary.errors.forEach((error, index) => {
                md += `### Error ${index + 1}\n`;
                md += `- **Step:** ${error.step}\n`;
                md += `- **Error:** ${error.error}\n`;
                md += `- **Timestamp:** ${error.timestamp}\n\n`;
            });
        }
        
        return md;
    }

    async saveDeploymentResults() {
        const resultsPath = path.join(__dirname, '../reports/cross-chain-bridge-deployment-results.json');
        
        // Ensure reports directory exists
        const reportsDir = path.dirname(resultsPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        fs.writeFileSync(resultsPath, JSON.stringify(this.deploymentResults, null, 2));
        console.log(`Deployment results saved to: ${resultsPath}`);
    }
}

// Main execution
if (require.main === module) {
    const deployment = new CrossChainBridgeDeployment();
    
    deployment.deploy()
        .then((results) => {
            console.log('\n🎉 Cross-chain bridge deployment completed!');
            console.log('Results:', JSON.stringify(results, null, 2));
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Cross-chain bridge deployment failed:', error);
            process.exit(1);
        });
}

module.exports = CrossChainBridgeDeployment;