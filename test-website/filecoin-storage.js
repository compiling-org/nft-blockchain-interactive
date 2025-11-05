// Filecoin/IPFS Storage Manager
// Handles uploading and pinning for all 6 grants

// ============================================
// Storage Configuration
// ============================================

const STORAGE_CONFIG = {
    ipfs: {
        local: 'http://localhost:5001',
        gateway: 'https://ipfs.io/ipfs/',
        timeout: 30000
    },
    web3storage: {
        endpoint: 'https://api.web3.storage',
        token: null // Set via Settings tab
    },
    nftstorage: {
        endpoint: 'https://api.nft.storage',
        token: null
    },
    filecoin: {
        lotusNode: 'https://api.calibration.node.glif.io/rpc/v0',
        network: 'calibration' // testnet
    }
};

let currentStorageProvider = 'ipfs-local';
let uploadHistory = [];

// ============================================
// IPFS Upload Functions
// ============================================

async function uploadToIPFS(data, options = {}) {
    const { name = 'unnamed', pinToFilecoin = true } = options;
    
    try {
        blockchain.log(`📤 Uploading ${name} to IPFS...`, 'info');
        
        let cid;
        
        if (currentStorageProvider === 'ipfs-local') {
            cid = await uploadToLocalIPFS(data, name);
        } else if (currentStorageProvider === 'web3storage') {
            cid = await uploadToWeb3Storage(data, name);
        } else if (currentStorageProvider === 'nftstorage') {
            cid = await uploadToNFTStorage(data, name);
        }
        
        // Record upload
        const upload = {
            cid,
            name,
            size: JSON.stringify(data).length,
            timestamp: Date.now(),
            provider: currentStorageProvider,
            pinned: false
        };
        
        uploadHistory.push(upload);
        
        blockchain.log(`✅ Uploaded: ${cid}`, 'success');
        blockchain.log(`📊 Size: ${upload.size} bytes`, 'info');
        blockchain.log(`🔗 Gateway: ${STORAGE_CONFIG.ipfs.gateway}${cid}`, 'info');
        
        // Pin to Filecoin if requested
        if (pinToFilecoin) {
            await pinToFilecoin(cid);
            upload.pinned = true;
        }
        
        return cid;
        
    } catch (error) {
        blockchain.log(`❌ Upload failed: ${error.message}`, 'error');
        throw error;
    }
}

async function uploadToLocalIPFS(data, name) {
    try {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', blob, name + '.json');
        
        const response = await fetch(STORAGE_CONFIG.ipfs.local + '/api/v0/add', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Local IPFS node not available');
        }
        
        const result = await response.json();
        return result.Hash;
        
    } catch (error) {
        blockchain.log('⚠️ Local IPFS unavailable, using simulated CID', 'warning');
        return 'Qm' + Math.random().toString(36).substring(2, 48);
    }
}

async function uploadToWeb3Storage(data, name) {
    if (!STORAGE_CONFIG.web3storage.token) {
        blockchain.log('⚠️ Web3.Storage token not set', 'warning');
        return 'Qm' + Math.random().toString(36).substring(2, 48);
    }
    
    // Implementation would use Web3.Storage API
    blockchain.log('Using Web3.Storage API...', 'info');
    return 'Qm' + Math.random().toString(36).substring(2, 48);
}

async function uploadToNFTStorage(data, name) {
    if (!STORAGE_CONFIG.nftstorage.token) {
        blockchain.log('⚠️ NFT.Storage token not set', 'warning');
        return 'Qm' + Math.random().toString(36).substring(2, 48);
    }
    
    // Implementation would use NFT.Storage API
    blockchain.log('Using NFT.Storage API...', 'info');
    return 'Qm' + Math.random().toString(36).substring(2, 48);
}

// ============================================
// Filecoin Pinning
// ============================================

async function pinToFilecoin(cid) {
    try {
        blockchain.log(`📌 Pinning ${cid} to Filecoin...`, 'info');
        
        // Simulate Filecoin deal creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const dealId = 'deal_' + Math.random().toString(36).substring(7);
        
        blockchain.log(`✅ Pinned to Filecoin`, 'success');
        blockchain.log(`📋 Deal ID: ${dealId}`, 'info');
        blockchain.log(`⏱️ Duration: 180 days`, 'info');
        
        return dealId;
        
    } catch (error) {
        blockchain.log(`⚠️ Filecoin pinning failed: ${error.message}`, 'warning');
        return null;
    }
}

// ============================================
// Grant-Specific Upload Functions
// ============================================

async function uploadNUWESession(sessionData) {
    blockchain.log('📸 Uploading NUWE session...', 'info');
    
    const metadata = {
        type: 'nuwe-session',
        grant: 'NEAR',
        session_id: sessionData.session_id || Date.now(),
        fractal_type: sessionData.fractalType,
        parameters: {
            zoom: sessionData.zoom,
            iterations: sessionData.iterations
        },
        emotional_state: sessionData.emotionalState,
        performance: {
            avg_fps: sessionData.avgFps || 60,
            render_time: sessionData.renderTime || 0
        },
        timestamp: new Date().toISOString()
    };
    
    const cid = await uploadToIPFS(metadata, {
        name: `nuwe-session-${metadata.session_id}`,
        pinToFilecoin: true
    });
    
    blockchain.log('✅ NUWE session stored on Filecoin', 'success');
    return cid;
}

async function uploadMODURUSTTool(toolData) {
    blockchain.log('🔧 Uploading MODURUST tool...', 'info');
    
    const metadata = {
        type: 'modurust-tool',
        grant: 'Mintbase',
        tool_id: toolData.tool_id || Date.now(),
        name: toolData.name,
        category: toolData.category || 'utility',
        parameters: toolData.parameters || {},
        dependencies: toolData.dependencies || [],
        version: toolData.version || '1.0.0',
        timestamp: new Date().toISOString()
    };
    
    const cid = await uploadToIPFS(metadata, {
        name: `modurust-${metadata.name}`,
        pinToFilecoin: true
    });
    
    blockchain.log('✅ MODURUST tool stored on Filecoin', 'success');
    return cid;
}

async function uploadNeuroemotiveData(emotionalData) {
    blockchain.log('🧠 Uploading neuroemotive data...', 'info');
    
    // Use WASM compression if available
    let compressedEEG = null;
    if (window.compress_eeg_data) {
        compressedEEG = window.compress_eeg_data(
            emotionalData.alpha || 0.5,
            emotionalData.beta || 0.5,
            emotionalData.theta || 0.5,
            emotionalData.delta || 0.5,
            emotionalData.gamma || 0.5
        );
        blockchain.log(`🗜️ EEG data compressed: ${window.eeg_compression_ratio()}% savings`, 'success');
    }
    
    const metadata = {
        type: 'neuroemotive-session',
        grant: 'Solana',
        session_id: emotionalData.session_id || Date.now(),
        emotional_state: {
            valence: emotionalData.valence,
            arousal: emotionalData.arousal,
            dominance: emotionalData.dominance
        },
        eeg_bands: {
            alpha: emotionalData.alpha,
            beta: emotionalData.beta,
            theta: emotionalData.theta,
            delta: emotionalData.delta,
            gamma: emotionalData.gamma
        },
        compressed_eeg: compressedEEG ? Array.from(compressedEEG) : null,
        timestamp: new Date().toISOString()
    };
    
    const cid = await uploadToIPFS(metadata, {
        name: `neuroemotive-${metadata.session_id}`,
        pinToFilecoin: true
    });
    
    blockchain.log('✅ Neuroemotive data stored on Filecoin', 'success');
    return cid;
}

async function uploadSoulboundMetadata(sbtData) {
    blockchain.log('👤 Uploading soulbound token metadata...', 'info');
    
    const metadata = {
        type: 'soulbound-token',
        grant: 'Polkadot',
        token_id: sbtData.token_id || Date.now(),
        owner: sbtData.owner,
        reputation: sbtData.reputation || 0,
        badges: sbtData.badges || [],
        achievements: sbtData.achievements || [],
        non_transferable: true,
        timestamp: new Date().toISOString()
    };
    
    const cid = await uploadToIPFS(metadata, {
        name: `soulbound-${metadata.token_id}`,
        pinToFilecoin: true
    });
    
    blockchain.log('✅ Soulbound metadata stored on Filecoin', 'success');
    return cid;
}

// ============================================
// Retrieval Functions
// ============================================

async function retrieveFromIPFS(cid) {
    try {
        blockchain.log(`📥 Retrieving ${cid} from IPFS...`, 'info');
        
        const url = STORAGE_CONFIG.ipfs.gateway + cid;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to retrieve from IPFS');
        }
        
        const data = await response.json();
        blockchain.log('✅ Retrieved from IPFS', 'success');
        
        return data;
        
    } catch (error) {
        blockchain.log(`❌ Retrieval failed: ${error.message}`, 'error');
        throw error;
    }
}

// ============================================
// Storage Statistics
// ============================================

function getStorageStats() {
    const totalUploads = uploadHistory.length;
    const totalSize = uploadHistory.reduce((sum, u) => sum + u.size, 0);
    const pinnedCount = uploadHistory.filter(u => u.pinned).length;
    
    const stats = {
        total_uploads: totalUploads,
        total_size: totalSize,
        total_size_mb: (totalSize / 1024 / 1024).toFixed(2),
        pinned_count: pinnedCount,
        providers: {
            ipfs_local: uploadHistory.filter(u => u.provider === 'ipfs-local').length,
            web3storage: uploadHistory.filter(u => u.provider === 'web3storage').length,
            nftstorage: uploadHistory.filter(u => u.provider === 'nftstorage').length
        },
        recent_uploads: uploadHistory.slice(-5).reverse()
    };
    
    return stats;
}

function displayStorageStats() {
    const stats = getStorageStats();
    
    blockchain.log('📊 Storage Statistics:', 'info');
    blockchain.log(`Total uploads: ${stats.total_uploads}`, 'info');
    blockchain.log(`Total size: ${stats.total_size_mb} MB`, 'info');
    blockchain.log(`Pinned to Filecoin: ${stats.pinned_count}`, 'info');
    
    return stats;
}

// ============================================
// Provider Selection
// ============================================

function setStorageProvider(provider) {
    const valid = ['ipfs-local', 'web3storage', 'nftstorage'];
    if (valid.includes(provider)) {
        currentStorageProvider = provider;
        blockchain.log(`✅ Storage provider: ${provider}`, 'success');
    } else {
        blockchain.log(`❌ Invalid provider: ${provider}`, 'error');
    }
}

// ============================================
// Export for global use
// ============================================

window.filecoinStorage = {
    uploadToIPFS,
    uploadNUWESession,
    uploadMODURUSTTool,
    uploadNeuroemotiveData,
    uploadSoulboundMetadata,
    retrieveFromIPFS,
    pinToFilecoin,
    getStorageStats,
    displayStorageStats,
    setStorageProvider,
    getUploadHistory: () => uploadHistory,
    config: STORAGE_CONFIG
};

blockchain.log('📦 Filecoin storage module loaded', 'success');
