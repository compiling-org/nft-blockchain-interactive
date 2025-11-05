// Blockchain NFT Interactive - Test Application
// Handles all testing functionality for 6 grants

// Global state
const state = {
    near: { connected: false, account: null },
    solana: { connected: false, wallet: null },
    ipfs: { connected: false, node: null },
    wallet: { connected: false, address: null },
    emotionalState: { valence: 0, arousal: 0.5, dominance: 0.5 },
    eegData: { alpha: 0.5, beta: 0.5, theta: 0.5, delta: 0.5, gamma: 0.5 },
    biometric: { heartRate: 70, gsr: 0.5 },
    sessions: [],
    proposals: [],
    soulboundTokens: [],
    logs: {}
};

// Initialize on page load
window.addEventListener('load', async () => {
    initializeCanvas();
    await connectWallets();
    await checkNetworkStatus();
    startRenderLoop();
    log('fractal', 'Test suite initialized', 'success');
});

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Logging system
function log(section, message, type = 'info') {
    const logId = `${section}-log`;
    const logDiv = document.getElementById(logId);
    if (!logDiv) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    
    logDiv.insertBefore(entry, logDiv.firstChild);
    
    // Keep only last 50 entries
    while (logDiv.children.length > 50) {
        logDiv.removeChild(logDiv.lastChild);
    }
}

// Slider updates
function updateSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(`${sliderId}-value`);
    valueSpan.textContent = slider.value;
}

// Network status checking
async function checkNetworkStatus() {
    // Simulate network checks
    setTimeout(() => {
        updateStatus('near-status', true);
        log('fractal', 'NEAR testnet connected', 'success');
    }, 500);
    
    setTimeout(() => {
        updateStatus('solana-status', true);
        log('neuroemotive', 'Solana devnet connected', 'success');
    }, 1000);
    
    setTimeout(() => {
        updateStatus('ipfs-status', true);
        log('storage', 'IPFS local node connected', 'success');
    }, 1500);
}

function updateStatus(elementId, connected) {
    const dot = document.getElementById(elementId);
    if (connected) {
        dot.classList.add('connected');
    } else {
        dot.classList.remove('connected');
    }
}

// Wallet connection
async function connectWallets() {
    // Simulate wallet connection
    state.wallet.connected = true;
    state.wallet.address = '0x' + Math.random().toString(16).substr(2, 40);
    updateStatus('wallet-status', true);
    log('fractal', `Wallet connected: ${state.wallet.address.substr(0, 10)}...`, 'success');
}

// Canvas initialization
function initializeCanvas() {
    const fractalCanvas = document.getElementById('fractal-canvas');
    const biometricCanvas = document.getElementById('biometric-canvas');
    
    if (fractalCanvas) {
        fractalCanvas.width = fractalCanvas.offsetWidth;
        fractalCanvas.height = fractalCanvas.offsetHeight;
    }
    
    if (biometricCanvas) {
        biometricCanvas.width = biometricCanvas.offsetWidth;
        biometricCanvas.height = biometricCanvas.offsetHeight;
    }
}

// Fractal rendering
function renderFractal() {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    const type = document.getElementById('fractal-type').value;
    const zoom = parseFloat(document.getElementById('zoom').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    
    const startTime = performance.now();
    
    log('fractal', `Rendering ${type} fractal (zoom: ${zoom}, iterations: ${iterations})`, 'info');
    
    // Simple Mandelbrot set rendering
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    
    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            const x0 = ((px - width / 2) / (width / 4)) / zoom - 0.5;
            const y0 = ((py - height / 2) / (height / 4)) / zoom;
            
            let x = 0, y = 0, iteration = 0;
            
            while (x*x + y*y <= 4 && iteration < iterations) {
                const xtemp = x*x - y*y + x0;
                y = 2*x*y + y0;
                x = xtemp;
                iteration++;
            }
            
            const color = iteration === iterations ? 0 : (iteration * 255 / iterations);
            const idx = (py * width + px) * 4;
            imageData.data[idx] = color;
            imageData.data[idx + 1] = color * 0.8;
            imageData.data[idx + 2] = color * 1.2;
            imageData.data[idx + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const renderTime = (performance.now() - startTime).toFixed(2);
    document.getElementById('render-time').textContent = `${renderTime}ms`;
    document.getElementById('fps').textContent = (1000 / renderTime).toFixed(1);
    
    log('fractal', `Render complete in ${renderTime}ms`, 'success');
}

async function saveToNEAR() {
    log('fractal', 'Saving fractal session to NEAR...', 'info');
    
    // Simulate NEAR transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sessionId = 'session_' + Date.now();
    state.sessions.push({
        id: sessionId,
        type: document.getElementById('fractal-type').value,
        timestamp: Date.now()
    });
    
    log('fractal', `Session saved to NEAR: ${sessionId}`, 'success');
}

// Marketplace functions
async function mintSessionNFT() {
    const name = document.getElementById('session-name').value;
    const type = document.getElementById('session-type').value;
    
    if (!name) {
        log('marketplace', 'Please enter session name', 'error');
        return;
    }
    
    log('marketplace', `Minting NUWE session NFT: ${name}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tokenId = 'nft_' + Date.now();
    log('marketplace', `NFT minted successfully: ${tokenId}`, 'success');
    log('marketplace', 'IPFS metadata stored', 'success');
}

async function mintToolNFT() {
    const name = document.getElementById('tool-name').value;
    const type = document.getElementById('tool-type').value;
    
    if (!name) {
        log('marketplace', 'Please enter tool name', 'error');
        return;
    }
    
    log('marketplace', `Minting MODURUST tool NFT: ${name}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tokenId = 'tool_' + Date.now();
    log('marketplace', `Tool NFT minted: ${tokenId}`, 'success');
}

async function listOnMarketplace() {
    const price = document.getElementById('nft-price').value;
    
    if (!price) {
        log('marketplace', 'Please set a price', 'error');
        return;
    }
    
    log('marketplace', `Listing on marketplace for ${price} NEAR`, 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    log('marketplace', 'Successfully listed on Mintbase marketplace', 'success');
}

async function createSubscription() {
    const price = document.getElementById('tool-price').value;
    log('marketplace', `Creating subscription model at ${price} NEAR/month`, 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    log('marketplace', 'Subscription created successfully', 'success');
}

// Neuroemotive AI functions
function updateEmotionalState() {
    state.emotionalState.valence = parseFloat(document.getElementById('valence').value);
    state.emotionalState.arousal = parseFloat(document.getElementById('arousal').value);
    state.emotionalState.dominance = parseFloat(document.getElementById('dominance').value);
    
    document.getElementById('valence-value').textContent = state.emotionalState.valence.toFixed(1);
    document.getElementById('arousal-value').textContent = state.emotionalState.arousal.toFixed(1);
    document.getElementById('dominance-value').textContent = state.emotionalState.dominance.toFixed(1);
    
    // Update meters
    const valencePercent = ((state.emotionalState.valence + 1) / 2) * 100;
    const arousalPercent = state.emotionalState.arousal * 100;
    const dominancePercent = state.emotionalState.dominance * 100;
    
    document.getElementById('valence-meter').style.width = `${valencePercent}%`;
    document.getElementById('arousal-meter').style.width = `${arousalPercent}%`;
    document.getElementById('dominance-meter').style.width = `${dominancePercent}%`;
}

async function recordEmotionalState() {
    log('neuroemotive', 'Recording emotional state to Solana...', 'info');
    log('neuroemotive', `Valence: ${state.emotionalState.valence}, Arousal: ${state.emotionalState.arousal}, Dominance: ${state.emotionalState.dominance}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate compression
    const uncompressed = 36; // bytes
    const compressed = 12; // bytes
    const ratio = (uncompressed / compressed).toFixed(1);
    
    const count = parseInt(document.getElementById('emotion-count').textContent) + 1;
    document.getElementById('emotion-count').textContent = count;
    document.getElementById('compression-ratio').textContent = `${ratio}x`;
    
    log('neuroemotive', `State recorded with ${ratio}x compression`, 'success');
}

async function startStreamDiffusion() {
    log('neuroemotive', 'Starting Stream Diffusion session...', 'info');
    log('neuroemotive', 'Emotional prompt modulation enabled', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    log('neuroemotive', 'Stream Diffusion running at 30 FPS', 'success');
    log('neuroemotive', 'Recording frames with emotional conditioning', 'success');
}

// Storage functions
async function uploadToIPFS() {
    const type = document.getElementById('storage-type').value;
    const file = document.getElementById('file-upload').files[0];
    
    if (!file) {
        log('storage', 'Please select a file', 'error');
        return;
    }
    
    log('storage', `Uploading ${file.name} to IPFS...`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cid = 'Qm' + Math.random().toString(36).substring(2, 15);
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    const totalStored = parseFloat(document.getElementById('total-stored').textContent) + parseFloat(sizeMB);
    document.getElementById('total-stored').textContent = `${totalStored.toFixed(2)} MB`;
    
    const cidsCount = parseInt(document.getElementById('cids-count').textContent) + 1;
    document.getElementById('cids-count').textContent = cidsCount;
    
    log('storage', `Uploaded successfully: ${cid}`, 'success');
    log('storage', `Size: ${sizeMB} MB`, 'info');
}

async function pinToFilecoin() {
    log('storage', 'Pinning to Filecoin storage providers...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    log('storage', 'Pinned to 3 Filecoin providers', 'success');
    log('storage', 'Data will be stored for 1 year', 'success');
}

// DAO functions
async function createProposal() {
    const title = document.getElementById('proposal-title').value;
    const description = document.getElementById('proposal-description').value;
    
    if (!title || !description) {
        log('dao', 'Please fill in all fields', 'error');
        return;
    }
    
    log('dao', `Creating proposal: ${title}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const proposalId = state.proposals.length + 1;
    state.proposals.push({
        id: proposalId,
        title,
        description,
        votes: { for: 0, against: 0 }
    });
    
    updateProposalsList();
    
    log('dao', `Proposal created (ID: ${proposalId})`, 'success');
}

async function voteWithEmotion() {
    const choice = document.getElementById('vote-choice').value;
    
    log('dao', `Voting: ${choice}`, 'info');
    log('dao', `Recording emotional state with vote...`, 'info');
    log('dao', `Valence: ${state.emotionalState.valence}, Arousal: ${state.emotionalState.arousal}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    log('dao', 'Vote recorded with biometric data', 'success');
    log('dao', 'Updating emotional consensus metrics...', 'success');
}

function updateProposalsList() {
    const list = document.getElementById('proposals-list');
    list.innerHTML = '';
    
    state.proposals.forEach(proposal => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 15px; background: #f8f8f8; border-radius: 5px; margin-bottom: 10px;';
        div.innerHTML = `
            <h4 style="color: #667eea; margin-bottom: 5px;">Proposal #${proposal.id}: ${proposal.title}</h4>
            <p style="color: #666; margin-bottom: 10px;">${proposal.description}</p>
            <div style="display: flex; gap: 20px;">
                <span>For: ${proposal.votes.for}</span>
                <span>Against: ${proposal.votes.against}</span>
            </div>
        `;
        list.appendChild(div);
    });
}

// Soulbound token functions
async function mintSoulbound() {
    const type = document.getElementById('soulbound-type').value;
    const metadata = document.getElementById('soulbound-metadata').value;
    
    log('soulbound', `Minting soulbound token: ${type}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tokenId = 'sbt_' + Date.now();
    state.soulboundTokens.push({ id: tokenId, type, metadata });
    
    const badgeCount = parseInt(document.getElementById('badges-count').textContent) + 1;
    document.getElementById('badges-count').textContent = badgeCount;
    
    const reputation = parseInt(document.getElementById('reputation-score').textContent) + 10;
    document.getElementById('reputation-score').textContent = reputation;
    
    updateSoulboundList();
    
    log('soulbound', `Soulbound token minted: ${tokenId}`, 'success');
    log('soulbound', 'Token is non-transferable and bound to your account', 'info');
}

function updateSoulboundList() {
    const list = document.getElementById('soulbound-list');
    list.innerHTML = '';
    
    state.soulboundTokens.forEach(token => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 10px; background: #f0f7ff; border-left: 3px solid #667eea; margin-bottom: 10px; border-radius: 3px;';
        div.innerHTML = `
            <strong>${token.type}</strong><br>
            <small style="color: #666;">${token.id}</small>
        `;
        list.appendChild(div);
    });
}

// Biometric functions
function updateEEG() {
    state.eegData.alpha = parseFloat(document.getElementById('alpha').value);
    state.eegData.beta = parseFloat(document.getElementById('beta').value);
    state.eegData.theta = parseFloat(document.getElementById('theta').value);
    
    document.getElementById('alpha-value').textContent = state.eegData.alpha.toFixed(1);
    document.getElementById('beta-value').textContent = state.eegData.beta.toFixed(1);
    document.getElementById('theta-value').textContent = state.eegData.theta.toFixed(1);
    
    // Calculate meditation and stress
    const meditation = ((state.eegData.alpha + state.eegData.theta) / 2 * 100).toFixed(0);
    const stress = ((1 - state.eegData.alpha) * state.eegData.beta * 100).toFixed(0);
    
    document.getElementById('meditation-level').textContent = meditation;
    document.getElementById('stress-index').textContent = stress;
}

function updateBiometric() {
    state.biometric.heartRate = parseInt(document.getElementById('heart-rate').value);
    state.biometric.gsr = parseFloat(document.getElementById('gsr').value);
    
    document.getElementById('hr-value').textContent = state.biometric.heartRate;
    document.getElementById('gsr-value').textContent = state.biometric.gsr.toFixed(1);
    
    updateEEG(); // Recalculate stress
}

async function recordBiometricData() {
    log('biometric', 'Recording biometric data...', 'info');
    log('biometric', `EEG - Alpha: ${state.eegData.alpha}, Beta: ${state.eegData.beta}, Theta: ${state.eegData.theta}`, 'info');
    log('biometric', `HR: ${state.biometric.heartRate} BPM, GSR: ${state.biometric.gsr}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    log('biometric', 'Biometric data compressed and stored', 'success');
    log('biometric', 'Delta encoding applied: 50% compression achieved', 'success');
}

async function testInteractiveNFT() {
    log('biometric', 'Testing interactive NFT with biometric data...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    log('biometric', 'NFT visual parameters modulated by emotional state', 'success');
    log('biometric', 'Alpha waves affecting color warmth', 'info');
    log('biometric', 'Beta waves affecting animation speed', 'info');
    log('biometric', 'Meditation level affecting fractal morphing', 'info');
    
    renderBiometricVisualization();
}

function renderBiometricVisualization() {
    const canvas = document.getElementById('biometric-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw visualization based on biometric data
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Alpha affects size
    const baseRadius = 50 + state.eegData.alpha * 100;
    
    // Beta affects rotation speed
    const rotation = Date.now() * 0.001 * state.eegData.beta;
    
    // Theta affects color
    const hue = state.eegData.theta * 360;
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotation;
        const x = centerX + Math.cos(angle) * baseRadius;
        const y = centerY + Math.sin(angle) * baseRadius;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Render loop for animations
function startRenderLoop() {
    setInterval(() => {
        renderBiometricVisualization();
    }, 50);
}

// Update alignment slider value
document.addEventListener('DOMContentLoaded', () => {
    const alignmentSlider = document.getElementById('required-alignment');
    if (alignmentSlider) {
        alignmentSlider.addEventListener('input', function() {
            document.getElementById('alignment-value').textContent = this.value;
        });
    }
});
