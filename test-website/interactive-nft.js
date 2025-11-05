// Interactive NFT System with Emotional Modulation
// Mintbase Grant - DAO Governance + Interactive Features

// ============================================
// Interactive NFT Manager
// ============================================

class InteractiveNFT {
    constructor(tokenId, metadata) {
        this.tokenId = tokenId;
        this.metadata = metadata;
        this.visualState = {
            colorIntensity: 0.5,
            animationSpeed: 1.0,
            morphingRate: 0.5,
            currentHue: 180
        };
        this.emotionalHistory = [];
        this.biometricData = null;
        this.lastUpdate = Date.now();
    }
    
    // Apply emotional state to visual parameters
    applyEmotionalState(emotionalState) {
        const { valence, arousal, dominance } = emotionalState;
        
        // Valence affects color warmth/intensity
        this.visualState.colorIntensity = ((valence + 1.0) / 2.0) * 0.8 + 0.2;
        
        // Arousal affects animation speed
        this.visualState.animationSpeed = arousal * 2.0;
        
        // Dominance affects morphing rate
        this.visualState.morphingRate = dominance;
        
        // Calculate hue from emotional state
        this.visualState.currentHue = this.calculateEmotionalHue(valence, arousal);
        
        this.emotionalHistory.push({
            timestamp: Date.now(),
            ...emotionalState
        });
        
        // Keep last 100 emotional states
        if (this.emotionalHistory.length > 100) {
            this.emotionalHistory.shift();
        }
        
        this.lastUpdate = Date.now();
        
        blockchain.log(`🎨 NFT #${this.tokenId} updated with emotional state`, 'success');
        blockchain.log(`  Intensity: ${(this.visualState.colorIntensity * 100).toFixed(0)}%`, 'info');
        blockchain.log(`  Speed: ${this.visualState.animationSpeed.toFixed(1)}x`, 'info');
    }
    
    // Calculate color hue from emotions
    calculateEmotionalHue(valence, arousal) {
        // Positive valence = warm colors (red/orange)
        // Negative valence = cool colors (blue/purple)
        // High arousal = vibrant
        // Low arousal = muted
        
        if (valence > 0) {
            // Positive: 0-60 (red to yellow)
            return valence * 60;
        } else {
            // Negative: 180-270 (blue to purple)
            return 180 + (Math.abs(valence) * 90);
        }
    }
    
    // Apply biometric data (EEG, heart rate, etc)
    applyBiometricData(biometricData) {
        this.biometricData = biometricData;
        
        // Use WASM EEG processor if available
        if (window.EEGProcessor && biometricData.eeg) {
            const processor = new window.EEGProcessor(256);
            
            const attention = processor.calculate_attention(
                biometricData.eeg.beta,
                biometricData.eeg.theta
            );
            
            const meditation = processor.calculate_meditation(
                biometricData.eeg.alpha,
                biometricData.eeg.beta
            );
            
            // Attention affects detail level
            this.visualState.detailLevel = attention;
            
            // Meditation affects smoothness
            this.visualState.smoothness = meditation;
            
            blockchain.log(`🧠 NFT updated with EEG data`, 'success');
            blockchain.log(`  Attention: ${(attention * 100).toFixed(0)}%`, 'info');
            blockchain.log(`  Meditation: ${(meditation * 100).toFixed(0)}%`, 'info');
        }
        
        // Heart rate affects pulse effect
        if (biometricData.heartRate) {
            this.visualState.pulseRate = biometricData.heartRate / 60.0;
            blockchain.log(`💓 Heart rate: ${biometricData.heartRate} BPM`, 'info');
        }
    }
    
    // Render the NFT to canvas
    render(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Apply emotional visual state
        const time = Date.now() / 1000;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw particles based on emotional state
        const particleCount = 50;
        const radius = 100 * (1 + this.visualState.morphingRate);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time * this.visualState.animationSpeed;
            const r = radius + Math.sin(time * 2 + i) * 20 * this.visualState.morphingRate;
            
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            // Color based on emotional hue
            const hue = this.visualState.currentHue;
            const saturation = this.visualState.colorIntensity * 100;
            const lightness = 50 + Math.sin(time + i) * 20;
            
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.beginPath();
            ctx.arc(x, y, 3 + this.visualState.colorIntensity * 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Pulse effect from heart rate
        if (this.visualState.pulseRate) {
            const pulseSize = 50 + Math.sin(time * this.visualState.pulseRate * Math.PI * 2) * 30;
            ctx.strokeStyle = `hsla(${this.visualState.currentHue}, 80%, 60%, 0.3)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Export metadata for blockchain storage
    exportMetadata() {
        return {
            tokenId: this.tokenId,
            metadata: this.metadata,
            visualState: this.visualState,
            emotionalHistory: this.emotionalHistory.slice(-10), // Last 10 states
            lastUpdate: this.lastUpdate,
            interactive: true,
            version: '1.0'
        };
    }
}

// ============================================
// DAO Governance with Emotional Consensus
// ============================================

class EmotionalDAO {
    constructor() {
        this.proposals = [];
        this.members = new Map();
        this.votingHistory = [];
    }
    
    // Create proposal with emotional validation
    createProposal(title, description, requiredAlignment = 0.5) {
        const proposal = {
            id: Date.now(),
            title,
            description,
            requiredAlignment,
            votesFor: [],
            votesAgainst: [],
            emotionalConsensus: 0,
            status: 'active',
            createdAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        
        this.proposals.push(proposal);
        
        blockchain.log(`📋 Proposal created: ${title}`, 'success');
        blockchain.log(`  Required alignment: ${(requiredAlignment * 100)}%`, 'info');
        
        return proposal.id;
    }
    
    // Vote with emotional state
    async voteOnProposal(proposalId, voteChoice, emotionalState) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            blockchain.log('❌ Proposal not found', 'error');
            return false;
        }
        
        const vote = {
            voter: window.walletConnections?.getWallets()?.near || 'anonymous',
            choice: voteChoice,
            emotionalState,
            timestamp: Date.now(),
            votingPower: 1.0
        };
        
        if (voteChoice === 'for') {
            proposal.votesFor.push(vote);
        } else {
            proposal.votesAgainst.push(vote);
        }
        
        // Calculate emotional consensus
        this.calculateEmotionalConsensus(proposal);
        
        // Store vote on blockchain if wallet connected
        if (window.blockchain) {
            await blockchain.voteOnProposal(proposalId, voteChoice, emotionalState);
        }
        
        blockchain.log(`✅ Vote recorded on proposal #${proposalId}`, 'success');
        blockchain.log(`  Emotional consensus: ${(proposal.emotionalConsensus * 100).toFixed(0)}%`, 'info');
        
        return true;
    }
    
    // Calculate emotional consensus among voters
    calculateEmotionalConsensus(proposal) {
        const allVotes = [...proposal.votesFor, ...proposal.votesAgainst];
        if (allVotes.length === 0) {
            proposal.emotionalConsensus = 0;
            return;
        }
        
        // Calculate average emotional alignment
        let totalAlignment = 0;
        
        for (let i = 0; i < allVotes.length; i++) {
            for (let j = i + 1; j < allVotes.length; j++) {
                const vote1 = allVotes[i].emotionalState;
                const vote2 = allVotes[j].emotionalState;
                
                // Calculate emotional distance
                const valenceDiff = Math.abs(vote1.valence - vote2.valence);
                const arousalDiff = Math.abs(vote1.arousal - vote2.arousal);
                const dominanceDiff = Math.abs(vote1.dominance - vote2.dominance);
                
                const distance = Math.sqrt(
                    valenceDiff * valenceDiff +
                    arousalDiff * arousalDiff +
                    dominanceDiff * dominanceDiff
                );
                
                // Alignment is inverse of distance (0-1)
                const alignment = 1 - (distance / Math.sqrt(3));
                totalAlignment += alignment;
            }
        }
        
        const numPairs = (allVotes.length * (allVotes.length - 1)) / 2;
        proposal.emotionalConsensus = numPairs > 0 ? totalAlignment / numPairs : 0;
    }
    
    // Check if proposal passes
    checkProposalStatus(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) return null;
        
        const totalVotes = proposal.votesFor.length + proposal.votesAgainst.length;
        const forPercentage = totalVotes > 0 ? proposal.votesFor.length / totalVotes : 0;
        
        const passed = forPercentage > 0.5 && proposal.emotionalConsensus >= proposal.requiredAlignment;
        
        if (passed && proposal.status === 'active') {
            proposal.status = 'passed';
            blockchain.log(`✅ Proposal #${proposalId} passed!`, 'success');
        }
        
        return {
            status: proposal.status,
            forVotes: proposal.votesFor.length,
            againstVotes: proposal.votesAgainst.length,
            emotionalConsensus: proposal.emotionalConsensus,
            passed
        };
    }
}

// ============================================
// Global Instances
// ============================================

const interactiveNFTs = new Map();
const dao = new EmotionalDAO();

// ============================================
// Helper Functions
// ============================================

function createInteractiveNFT(metadata) {
    const tokenId = 'nft_' + Date.now();
    const nft = new InteractiveNFT(tokenId, metadata);
    interactiveNFTs.set(tokenId, nft);
    
    blockchain.log(`🎨 Created interactive NFT: ${tokenId}`, 'success');
    
    return tokenId;
}

function updateNFTWithEmotion(tokenId, emotionalState) {
    const nft = interactiveNFTs.get(tokenId);
    if (nft) {
        nft.applyEmotionalState(emotionalState);
        return true;
    }
    return false;
}

function renderInteractiveNFT(tokenId, canvasId) {
    const nft = interactiveNFTs.get(tokenId);
    const canvas = document.getElementById(canvasId);
    
    if (nft && canvas) {
        nft.render(canvas);
        requestAnimationFrame(() => renderInteractiveNFT(tokenId, canvasId));
    }
}

// ============================================
// Export for global use
// ============================================

window.interactiveNFT = {
    InteractiveNFT,
    EmotionalDAO,
    dao,
    createInteractiveNFT,
    updateNFTWithEmotion,
    renderInteractiveNFT,
    getNFT: (tokenId) => interactiveNFTs.get(tokenId),
    getAllNFTs: () => Array.from(interactiveNFTs.values())
};

blockchain.log('🎨 Interactive NFT system loaded', 'success');
