// NEAR Wallet Integration for Bitte AI Marketplace
// This provides real blockchain functionality for buying/selling NFTs

class NearWalletIntegration {
    constructor() {
        this.network = 'testnet'; // Use testnet for development
        this.connected = false;
        this.accountId = null;
        this.walletConnection = null;
        this.nearConnection = null;
        this.contract = null;
        
        // Contract configuration
        this.contractId = 'bitte-marketplace.testnet'; // Replace with actual contract
        this.contractMethods = {
            viewMethods: ['get_listing', 'get_listings', 'get_auction', 'get_auctions'],
            changeMethods: ['buy_nft', 'create_listing', 'place_bid', 'deploy_agent']
        };
    }

    // Initialize NEAR connection
    async initialize() {
        try {
            // Load NEAR API
            await this.loadNearAPI();
            
            // Configure NEAR connection
            const config = {
                networkId: this.network,
                keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
                nodeUrl: `https://rpc.${this.network}.near.org`,
                walletUrl: `https://wallet.${this.network}.near.org`,
                helperUrl: `https://helper.${this.network}.near.org`,
                explorerUrl: `https://explorer.${this.network}.near.org`,
            };

            // Connect to NEAR
            this.nearConnection = await nearApi.connect(config);
            
            // Create wallet connection
            this.walletConnection = new nearApi.WalletConnection(this.nearConnection, 'bitte-marketplace');
            
            // Check if user is signed in
            if (this.walletConnection.isSignedIn()) {
                this.connected = true;
                this.accountId = this.walletConnection.getAccountId();
                await this.initializeContract();
            }
            
            console.log('✅ NEAR wallet integration initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize NEAR wallet:', error);
            return false;
        }
    }

    // Load NEAR API script
    async loadNearAPI() {
        return new Promise((resolve, reject) => {
            if (window.nearApi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/near-api-js@0.44.2/dist/near-api-js.min.js';
            script.onload = () => {
                console.log('✅ NEAR API loaded');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load NEAR API'));
            document.head.appendChild(script);
        });
    }

    // Initialize contract connection
    async initializeContract() {
        try {
            this.contract = await new nearApi.Contract(
                this.walletConnection.account(),
                this.contractId,
                this.contractMethods
            );
            console.log('✅ Contract initialized:', this.contractId);
        } catch (error) {
            console.warn('⚠️ Contract initialization failed (using simulated mode):', error);
            // Continue in simulated mode
        }
    }

    // Connect wallet
    async connectWallet() {
        try {
            if (!this.walletConnection) {
                await this.initialize();
            }

            if (!this.walletConnection.isSignedIn()) {
                await this.walletConnection.requestSignIn(
                    this.contractId,
                    'Bitte AI Marketplace',
                    null, // success URL
                    null  // failure URL
                );
            } else {
                this.connected = true;
                this.accountId = this.walletConnection.getAccountId();
                await this.initializeContract();
            }
            
            console.log('✅ Wallet connected:', this.accountId);
            return { success: true, accountId: this.accountId };
        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Disconnect wallet
    disconnectWallet() {
        if (this.walletConnection) {
            this.walletConnection.signOut();
        }
        this.connected = false;
        this.accountId = null;
        this.contract = null;
        console.log('✅ Wallet disconnected');
    }

    // Get account balance
    async getAccountBalance() {
        if (!this.connected) {
            return { error: 'Wallet not connected' };
        }

        try {
            const account = this.walletConnection.account();
            const balance = await account.getAccountBalance();
            
            return {
                total: nearApi.utils.format.formatNearAmount(balance.total, 2),
                available: nearApi.utils.format.formatNearAmount(balance.available, 2),
                staked: nearApi.utils.format.formatNearAmount(balance.staked, 2)
            };
        } catch (error) {
            console.error('❌ Failed to get balance:', error);
            return { error: error.message };
        }
    }

    // Buy NFT with real NEAR transaction
    async buyNFT(listingId, price) {
        if (!this.connected) {
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            console.log(`💰 Buying NFT ${listingId} for ${price} NEAR`);
            
            // Convert price to yoctoNEAR
            const amount = nearApi.utils.format.parseNearAmount(price.toString());
            
            if (this.contract && this.contract.buy_nft) {
                // Real blockchain transaction
                const result = await this.contract.buy_nft({
                    listing_id: listingId
                }, undefined, amount);
                
                console.log('✅ NFT purchase successful:', result);
                return { success: true, transaction: result };
            } else {
                // Simulated transaction for demo
                console.log('🎭 Simulating NFT purchase (no contract deployed)');
                await this.simulateTransaction();
                return { 
                    success: true, 
                    simulated: true, 
                    message: 'Purchase simulated - contract not deployed' 
                };
            }
        } catch (error) {
            console.error('❌ NFT purchase failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Create listing with real blockchain transaction
    async createListing(listingData) {
        if (!this.connected) {
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            console.log('📝 Creating listing:', listingData);
            
            if (this.contract && this.contract.create_listing) {
                // Real blockchain transaction
                const result = await this.contract.create_listing(listingData);
                
                console.log('✅ Listing created successfully:', result);
                return { success: true, transaction: result };
            } else {
                // Simulated transaction for demo
                console.log('🎭 Simulating listing creation (no contract deployed)');
                await this.simulateTransaction();
                return { 
                    success: true, 
                    simulated: true, 
                    message: 'Listing creation simulated - contract not deployed' 
                };
            }
        } catch (error) {
            console.error('❌ Listing creation failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Place bid on auction
    async placeBid(auctionId, bidAmount) {
        if (!this.connected) {
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            console.log(`💸 Placing bid of ${bidAmount} NEAR on auction ${auctionId}`);
            
            const amount = nearApi.utils.format.parseNearAmount(bidAmount.toString());
            
            if (this.contract && this.contract.place_bid) {
                const result = await this.contract.place_bid({
                    auction_id: auctionId
                }, undefined, amount);
                
                console.log('✅ Bid placed successfully:', result);
                return { success: true, transaction: result };
            } else {
                console.log('🎭 Simulating bid placement (no contract deployed)');
                await this.simulateTransaction();
                return { 
                    success: true, 
                    simulated: true, 
                    message: 'Bid placement simulated - contract not deployed' 
                };
            }
        } catch (error) {
            console.error('❌ Bid placement failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Deploy AI agent
    async deployAgent(agentData) {
        if (!this.connected) {
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            console.log('🤖 Deploying AI agent:', agentData);
            
            if (this.contract && this.contract.deploy_agent) {
                const result = await this.contract.deploy_agent(agentData);
                
                console.log('✅ AI agent deployed successfully:', result);
                return { success: true, transaction: result };
            } else {
                console.log('🎭 Simulating AI agent deployment (no contract deployed)');
                await this.simulateTransaction();
                return { 
                    success: true, 
                    simulated: true, 
                    message: 'Agent deployment simulated - contract not deployed' 
                };
            }
        } catch (error) {
            console.error('❌ AI agent deployment failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Simulate transaction (for demo when contract is not deployed)
    async simulateTransaction() {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('⏱️ Transaction simulation completed');
                resolve();
            }, 2000); // Simulate 2 second transaction time
        });
    }

    // Get transaction status
    async getTransactionStatus(transactionHash) {
        if (!this.connected) {
            return { error: 'Wallet not connected' };
        }

        try {
            const provider = this.nearConnection.connection.provider;
            const status = await provider.txStatus(transactionHash, this.accountId);
            
            return {
                success: status.status.SuccessValue !== undefined,
                status: status.status,
                transaction: status
            };
        } catch (error) {
            console.error('❌ Failed to get transaction status:', error);
            return { error: error.message };
        }
    }

    // Format NEAR amount for display
    formatNearAmount(amount) {
        if (window.nearApi && window.nearApi.utils) {
            return window.nearApi.utils.format.formatNearAmount(amount, 2);
        }
        return amount; // Fallback if NEAR API not loaded
    }

    // Parse NEAR amount for transactions
    parseNearAmount(amount) {
        if (window.nearApi && window.nearApi.utils) {
            return window.nearApi.utils.format.parseNearAmount(amount.toString());
        }
        return amount; // Fallback if NEAR API not loaded
    }

    // Check if wallet is connected
    isConnected() {
        return this.connected && this.accountId !== null;
    }

    // Get current account ID
    getAccountId() {
        return this.accountId;
    }
}

// Create global instance
window.nearWallet = new NearWalletIntegration();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NearWalletIntegration;
}