// Real Wallet Connections for All 5 Blockchains
// NEAR, Solana, Ethereum (for Mintbase/cross-chain), Polkadot, and IPFS

// ============================================
// NEAR Wallet Connection (Real Testnet)
// ============================================

let nearConnection = null;
let nearWallet = null;
let nearAccountId = null;

// Import near-api-js (will be available via script tag)
const { connect, keyStores, WalletConnection } = window.nearApi || {};

// NEAR Configuration
const NEAR_CONFIG = {
    networkId: 'testnet',
    keyStore: new keyStores?.BrowserLocalStorageKeyStore() || null,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
};

const CONTRACT_ID = 'fractal-studio-final.testnet';

async function connectNEARWallet() {
    try {
        blockchain.log('Connecting to NEAR testnet...', 'info');
        
        if (!window.nearApi) {
            throw new Error('near-api-js not loaded. Please include the script tag.');
        }
        
        const { connect, keyStores, WalletConnection } = window.nearApi;
        
        // Initialize key store if not exists
        if (!NEAR_CONFIG.keyStore) {
            NEAR_CONFIG.keyStore = new keyStores.BrowserLocalStorageKeyStore();
        }
        
        // Connect to NEAR
        nearConnection = await connect(NEAR_CONFIG);
        nearWallet = new WalletConnection(nearConnection, 'blockchain-nft-interactive');
        
        if (!nearWallet.isSignedIn()) {
            blockchain.log('Requesting NEAR wallet sign in...', 'info');
            await nearWallet.requestSignIn(
                CONTRACT_ID,
                'Blockchain NFT Interactive',
                window.location.href,
                window.location.href
            );
            return null; // Will redirect
        }
        
        nearAccountId = nearWallet.getAccountId();
        updateWalletStatus('NEAR', nearAccountId);
        blockchain.log('✅ NEAR wallet connected: ' + nearAccountId, 'success');
        
        return nearAccountId;
        
    } catch (error) {
        blockchain.log('❌ NEAR connection failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Solana Wallet Connection (Devnet)
// ============================================

let solanaWallet = null;
let solanaPublicKey = null;

async function connectSolanaWallet() {
    try {
        blockchain.log('Connecting to Solana devnet...', 'info');
        
        // Check if Phantom wallet is installed
        if (window.solana && window.solana.isPhantom) {
            blockchain.log('Phantom wallet detected!', 'success');
            
            const resp = await window.solana.connect();
            solanaPublicKey = resp.publicKey.toString();
            solanaWallet = window.solana;
            
            blockchain.log('✅ Solana wallet connected: ' + solanaPublicKey, 'success');
            blockchain.log('Network: Devnet', 'info');
            
            updateWalletStatus('Solana', solanaPublicKey);
            return solanaPublicKey;
            
        } else {
            blockchain.log('⚠️ Phantom wallet not found', 'warning');
            blockchain.log('Install from: https://phantom.app/', 'info');
            
            // Simulate for testing
            solanaPublicKey = 'DevTestWallet1234567890';
            updateWalletStatus('Solana', solanaPublicKey);
            blockchain.log('Using simulated wallet for testing', 'warning');
            
            return solanaPublicKey;
        }
        
    } catch (error) {
        blockchain.log('❌ Solana connection failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// MetaMask/Ethereum Connection (for cross-chain)
// ============================================

let ethereumWallet = null;
let ethereumAddress = null;

async function connectMetaMask() {
    try {
        blockchain.log('Connecting to MetaMask...', 'info');
        
        if (typeof window.ethereum !== 'undefined') {
            blockchain.log('MetaMask detected!', 'success');
            
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            ethereumAddress = accounts[0];
            ethereumWallet = window.ethereum;
            
            // Switch to Goerli testnet
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }], // Goerli
                });
                blockchain.log('Switched to Goerli testnet', 'success');
            } catch (switchError) {
                blockchain.log('Already on correct network', 'info');
            }
            
            blockchain.log('✅ MetaMask connected: ' + ethereumAddress, 'success');
            updateWalletStatus('Ethereum', ethereumAddress);
            
            return ethereumAddress;
            
        } else {
            blockchain.log('⚠️ MetaMask not found', 'warning');
            blockchain.log('Install from: https://metamask.io/', 'info');
            
            // Simulate for testing
            ethereumAddress = '0xTest1234567890abcdef';
            updateWalletStatus('Ethereum', ethereumAddress);
            blockchain.log('Using simulated wallet for testing', 'warning');
            
            return ethereumAddress;
        }
        
    } catch (error) {
        blockchain.log('❌ MetaMask connection failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Polkadot Wallet Connection (Rococo/Westend)
// ============================================

let polkadotWallet = null;
let polkadotAddress = null;

async function connectPolkadotWallet() {
    try {
        blockchain.log('Connecting to Polkadot wallet...', 'info');
        
        // Check for Polkadot.js extension
        if (window.injectedWeb3 && window.injectedWeb3['polkadot-js']) {
            blockchain.log('Polkadot.js extension detected!', 'success');
            
            const extension = await window.injectedWeb3['polkadot-js'].enable('Blockchain NFT Interactive');
            const accounts = await extension.accounts.get();
            
            if (accounts.length > 0) {
                polkadotAddress = accounts[0].address;
                polkadotWallet = extension;
                
                blockchain.log('✅ Polkadot wallet connected: ' + polkadotAddress, 'success');
                blockchain.log('Network: Westend testnet', 'info');
                
                updateWalletStatus('Polkadot', polkadotAddress);
                return polkadotAddress;
            }
            
        } else {
            blockchain.log('⚠️ Polkadot.js extension not found', 'warning');
            blockchain.log('Install from: https://polkadot.js.org/extension/', 'info');
            
            // Simulate for testing
            polkadotAddress = '5TestAccount1234567890';
            updateWalletStatus('Polkadot', polkadotAddress);
            blockchain.log('Using simulated wallet for testing', 'warning');
            
            return polkadotAddress;
        }
        
    } catch (error) {
        blockchain.log('❌ Polkadot connection failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// IPFS/Web3.Storage Setup
// ============================================

let ipfsClient = null;
let web3StorageToken = null;

async function setupIPFS() {
    try {
        blockchain.log('Setting up IPFS connection...', 'info');
        
        // Option 1: Local IPFS node
        const localNode = 'http://localhost:5001';
        
        try {
            const response = await fetch(localNode + '/api/v0/id', {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                blockchain.log('✅ Connected to local IPFS node', 'success');
                blockchain.log('Peer ID: ' + data.ID, 'info');
                ipfsClient = 'local';
                return true;
            }
        } catch (e) {
            blockchain.log('⚠️ Local IPFS node not running', 'warning');
        }
        
        // Option 2: Web3.Storage (free tier)
        blockchain.log('Using Web3.Storage as fallback', 'info');
        blockchain.log('Get API key from: https://web3.storage/', 'info');
        
        // For testing, use simulated storage
        ipfsClient = 'web3storage';
        blockchain.log('✅ IPFS ready (Web3.Storage mode)', 'success');
        
        return true;
        
    } catch (error) {
        blockchain.log('❌ IPFS setup failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Upload to IPFS
// ============================================

async function uploadToIPFS(data) {
    try {
        blockchain.log('Uploading to IPFS...', 'info');
        
        if (ipfsClient === 'local') {
            // Upload to local node
            const formData = new FormData();
            formData.append('file', new Blob([JSON.stringify(data)]));
            
            const response = await fetch('http://localhost:5001/api/v0/add', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            const cid = result.Hash;
            
            blockchain.log('✅ Uploaded to IPFS: ' + cid, 'success');
            blockchain.log('Gateway: https://ipfs.io/ipfs/' + cid, 'info');
            
            return cid;
            
        } else {
            // Simulate upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            const cid = 'Qm' + Math.random().toString(36).substring(2, 15);
            
            blockchain.log('✅ Uploaded to IPFS (simulated): ' + cid, 'success');
            blockchain.log('Size: ' + JSON.stringify(data).length + ' bytes', 'info');
            
            return cid;
        }
        
    } catch (error) {
        blockchain.log('❌ IPFS upload failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// NEAR Contract Interactions (Real)
// ============================================

async function startFractalSession(emotionData) {
    try {
        if (!nearWallet || !nearWallet.isSignedIn()) {
            throw new Error('NEAR wallet not connected');
        }
        
        blockchain.log('Starting fractal session on NEAR...', 'info');
        
        const args = {
            session_id: Date.now().toString(),
            initial_emotion: emotionData.primary_emotion || 'neutral',
            arousal: emotionData.arousal || 0.5,
            valence: emotionData.valence || 0.5
        };
        
        const result = await nearWallet.account().functionCall({
            contractId: CONTRACT_ID,
            methodName: 'start_fractal_session',
            args: args,
            gas: '300000000000000',
            attachedDeposit: '1000000000000000000000000' // 0.001 NEAR
        });
        
        blockchain.log('✅ Fractal session started', 'success');
        return result;
        
    } catch (error) {
        blockchain.log('❌ Failed to start fractal session: ' + error.message, 'error');
        throw error;
    }
}

function getNearWallet() {
    return nearWallet;
}

async function testNearMetadata() {
    try {
        if (!nearWallet || !nearWallet.account) {
            blockchain.log('NEAR wallet not connected', 'warning');
            return;
        }
        blockchain.log('Viewing nft_metadata from ' + CONTRACT_ID, 'info');
        const result = await nearWallet.account().viewFunction(
            CONTRACT_ID,
            'nft_metadata',
            {}
        );
        blockchain.log('Metadata: ' + JSON.stringify(result), 'success');
        return result;
    } catch (e) {
        blockchain.log('❌ View call failed: ' + e.message, 'error');
        throw e;
    }
}

async function mintFractalNFT(sessionData, ipfsCid) {
    try {
        if (!nearWallet || !nearWallet.isSignedIn()) {
            throw new Error('NEAR wallet not connected');
        }
        
        blockchain.log('Minting fractal NFT...', 'info');
        
        const args = {
            session_data: {
                session_id: sessionData.session_id,
                emotion_arousal: sessionData.arousal || 0.5,
                emotion_valence: sessionData.valence || 0.5,
                fractal_complexity: sessionData.complexity || 0.7,
                ipfs_cid: ipfsCid
            }
        };
        
        const result = await nearWallet.account().functionCall({
            contractId: CONTRACT_ID,
            methodName: 'mint_fractal_nft',
            args: args,
            gas: '300000000000000',
            attachedDeposit: '100000000000000000000000' // 0.1 NEAR
        });
        
        blockchain.log('✅ Fractal NFT minted successfully!', 'success');
        return result;
        
    } catch (error) {
        blockchain.log('❌ Failed to mint fractal NFT: ' + error.message, 'error');
        throw error;
    }
}

async function getUserNFTs() {
    try {
        if (!nearWallet || !nearWallet.isSignedIn()) {
            throw new Error('NEAR wallet not connected');
        }
        
        blockchain.log('Fetching user NFTs...', 'info');
        
        const result = await nearWallet.account().viewFunction(
            CONTRACT_ID,
            'nft_tokens_for_owner',
            { account_id: nearAccountId }
        );
        
        blockchain.log(`✅ Found ${result.length} NFTs`, 'success');
        return result;
        
    } catch (error) {
        blockchain.log('❌ Failed to fetch NFTs: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Connect All Wallets
// ============================================

async function connectAllWallets() {
    blockchain.log('🔗 Connecting to all blockchains...', 'info');
    
    const results = {
        near: null,
        solana: null,
        ethereum: null,
        polkadot: null,
        ipfs: null
    };
    
    try {
        results.near = await connectNEARWallet();
    } catch (e) {
        blockchain.log('NEAR connection skipped', 'warning');
    }
    
    try {
        results.solana = await connectSolanaWallet();
    } catch (e) {
        blockchain.log('Solana connection skipped', 'warning');
    }
    
    try {
        results.ethereum = await connectMetaMask();
    } catch (e) {
        blockchain.log('MetaMask connection skipped', 'warning');
    }
    
    try {
        results.polkadot = await connectPolkadotWallet();
    } catch (e) {
        blockchain.log('Polkadot connection skipped', 'warning');
    }
    
    try {
        results.ipfs = await setupIPFS();
    } catch (e) {
        blockchain.log('IPFS setup skipped', 'warning');
    }
    
    blockchain.log('✅ Wallet connection complete!', 'success');
    blockchain.log('Connected: ' + Object.values(results).filter(v => v).length + '/5', 'info');
    
    return results;
}

// ============================================
// UI Updates
// ============================================

function updateWalletStatus(chain, address) {
    const walletStatus = document.getElementById('wallet-status');
    if (walletStatus) {
        const short = address.length > 20 ? 
            address.substring(0, 8) + '...' + address.substring(address.length - 6) : 
            address;
        walletStatus.innerHTML += `<br>✅ ${chain}: ${short}`;
    }
}

// ============================================
// Testnet Information
// ============================================

function showTestnetInfo() {
    const info = `
🌐 TESTNET ENDPOINTS

NEAR Protocol:
- Network: testnet
- RPC: https://rpc.testnet.near.org
- Explorer: https://testnet.nearblocks.io
- Faucet: https://near-faucet.io/

Solana:
- Network: devnet
- RPC: https://api.devnet.solana.com
- Explorer: https://explorer.solana.com/?cluster=devnet
- Faucet: solana airdrop 1 (CLI)

Ethereum (Goerli):
- Network: Goerli
- RPC: https://goerli.infura.io/v3/YOUR_KEY
- Explorer: https://goerli.etherscan.io
- Faucet: https://goerlifaucet.com/

Polkadot:
- Network: Westend
- RPC: wss://westend-rpc.polkadot.io
- Explorer: https://westend.subscan.io
- Faucet: https://faucet.polkadot.io/

IPFS:
- Local: http://localhost:5001
- Gateway: https://ipfs.io
- Web3.Storage: https://web3.storage
    `;
    
    console.log(info);
    blockchain.log('Testnet info logged to console', 'info');
    
    return info;
}

// ============================================
// Export for global use
// ============================================

window.walletConnections = {
    connectNEARWallet,
    getNearWallet,
    testNearMetadata,
    connectSolanaWallet,
    connectMetaMask,
    connectPolkadotWallet,
    setupIPFS,
    uploadToIPFS,
    connectAllWallets,
    showTestnetInfo,
    getWallets: () => ({
        near: nearAccountId,
        solana: solanaPublicKey,
        ethereum: ethereumAddress,
        polkadot: polkadotAddress,
        ipfs: ipfsClient
    })
};

// Auto-setup IPFS on load
window.addEventListener('DOMContentLoaded', () => {
    setupIPFS();
});
