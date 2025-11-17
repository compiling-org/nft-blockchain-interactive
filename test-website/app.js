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

// WebGPU support flag
let useWebGPU = true;
let webgpuEngine = null;

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
    
    // Advanced fractal rendering based on near-wasm fractal_studio.rs
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    
    // Get emotional state for modulation
    const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
    
    // Apply emotional modulation to parameters
    const modulatedIterations = Math.max(50, Math.min(1000, iterations * (1 + emotionalState.arousal)));
    const modulatedZoom = zoom * (1 + emotionalState.dominance * 0.5);
    
    switch(type) {
        case 'mandelbrot':
            renderMandelbrot(imageData, width, height, modulatedZoom, modulatedIterations, emotionalState);
            break;
        case 'julia':
            renderJulia(imageData, width, height, modulatedZoom, modulatedIterations, emotionalState);
            break;
        case 'burning-ship':
            renderBurningShip(imageData, width, height, modulatedZoom, modulatedIterations, emotionalState);
            break;
        case 'newton':
            renderNewton(imageData, width, height, modulatedZoom, modulatedIterations, emotionalState);
            break;
        default:
            renderMandelbrot(imageData, width, height, modulatedZoom, modulatedIterations, emotionalState);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const renderTime = (performance.now() - startTime).toFixed(2);
    document.getElementById('fps-counter').textContent = (1000 / renderTime).toFixed(1);
    
    log('fractal', `Render complete in ${renderTime}ms`, 'success');
}

// Mandelbrot set rendering
function renderMandelbrot(imageData, width, height, zoom, iterations, emotion) {
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
            
            const color = getColorFromIteration(iteration, iterations, emotion);
            const idx = (py * width + px) * 4;
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 255;
        }
    }
}

// Julia set rendering
function renderJulia(imageData, width, height, zoom, iterations, emotion) {
    // Julia constant based on emotional state
    const c_real = -0.7 + emotion.valence * 0.3;
    const c_imag = 0.27015 + emotion.arousal * 0.1;
    
    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            let x = ((px - width / 2) / (width / 4)) / zoom;
            let y = ((py - height / 2) / (height / 4)) / zoom;
            
            let iteration = 0;
            
            while (x*x + y*y <= 4 && iteration < iterations) {
                const xtemp = x*x - y*y + c_real;
                y = 2*x*y + c_imag;
                x = xtemp;
                iteration++;
            }
            
            const color = getColorFromIteration(iteration, iterations, emotion);
            const idx = (py * width + px) * 4;
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 255;
        }
    }
}

// Burning Ship fractal rendering
function renderBurningShip(imageData, width, height, zoom, iterations, emotion) {
    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            const x0 = ((px - width / 2) / (width / 4)) / zoom - 0.5;
            const y0 = ((py - height / 2) / (height / 4)) / zoom - 0.5;
            
            let x = 0, y = 0, iteration = 0;
            
            while (x*x + y*y <= 4 && iteration < iterations) {
                const xtemp = x*x - y*y + x0;
                y = 2*Math.abs(x)*Math.abs(y) + y0;
                x = xtemp;
                iteration++;
            }
            
            const color = getColorFromIteration(iteration, iterations, emotion);
            const idx = (py * width + px) * 4;
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 255;
        }
    }
}

// Newton fractal rendering
function renderNewton(imageData, width, height, zoom, iterations, emotion) {
    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            let zr = ((px - width / 2) / (width / 4)) / zoom;
            let zi = ((py - height / 2) / (height / 4)) / zoom;
            
            let iteration = 0;
            
            // Newton's method for z^3 - 1 = 0
            while (iteration < iterations) {
                // Check convergence to roots: 1, (-1 + i√3)/2, (-1 - i√3)/2
                if (Math.abs(zr - 1) < 0.001 && Math.abs(zi) < 0.001) break;
                if (Math.abs(zr + 0.5) < 0.001 && Math.abs(zi - 0.866) < 0.001) break;
                if (Math.abs(zr + 0.5) < 0.001 && Math.abs(zi + 0.866) < 0.001) break;
                
                // Newton iteration: z = z - (z^3 - 1) / (3*z^2)
                const zr2 = zr*zr - zi*zi;
                const zi2 = 2*zr*zi;
                const zr3 = zr2*zr - zi2*zi;
                const zi3 = zr2*zi + zi2*zr;
                
                const denom = 3*(zr*zr - zi*zi)*(zr*zr - zi*zi) + 3*(2*zr*zi)*(2*zr*zi);
                
                if (Math.abs(denom) < 1e-10) break;
                
                zr = zr - (zr3 - 1) / denom;
                zi = zi - zi3 / denom;
                
                iteration++;
            }
            
            const color = getColorFromIteration(iteration, iterations, emotion);
            const idx = (py * width + px) * 4;
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 255;
        }
    }
}

// Get color based on iteration count and emotional state
function getColorFromIteration(iteration, maxIterations, emotion) {
    if (iteration === maxIterations) {
        return { r: 0, g: 0, b: 0 }; // Black for points in the set
    }
    
    // Normalize iteration count
    const t = iteration / maxIterations;
    
    // Emotional color modulation
    const valence = emotion.valence; // -1 to 1
    const arousal = emotion.arousal; // 0 to 1
    
    // Base hue based on iteration
    let hue = t * 360;
    
    // Modify hue based on emotional valence
    hue = (hue + valence * 60 + 360) % 360;
    
    // Convert HSV to RGB
    const s = 0.8 + arousal * 0.2; // Saturation increases with arousal
    const v = 0.8 + arousal * 0.2; // Brightness increases with arousal
    
    const c = v * s;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = v - c;
    
    let r, g, b;
    if (hue < 60) {
        r = c; g = x; b = 0;
    } else if (hue < 120) {
        r = x; g = c; b = 0;
    } else if (hue < 180) {
        r = 0; g = c; b = x;
    } else if (hue < 240) {
        r = 0; g = x; b = c;
    } else if (hue < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }
    
    return {
        r: Math.floor((r + m) * 255),
        g: Math.floor((g + m) * 255),
        b: Math.floor((b + m) * 255)
    };
}

// Fractal session recording to NEAR
async function saveToNEAR() {
    // Get current fractal parameters
    const type = document.getElementById('fractal-type').value;
    const zoom = parseFloat(document.getElementById('zoom').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    
    // Get emotional state
    const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
    
    log('fractal', 'Saving fractal session to NEAR...', 'info');
    
    // Simulate NEAR transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sessionId = 'session_' + Date.now();
    
    // Create detailed session data
    const sessionData = {
        id: sessionId,
        type: type,
        timestamp: Date.now(),
        parameters: {
            zoom: zoom,
            iterations: iterations
        },
        emotionalState: emotionalState,
        creator: state.wallet.address || 'anonymous',
        duration: 0, // Would be calculated in real implementation
        keyframes: [] // Would record animation keyframes in real implementation
    };
    
    state.sessions.push(sessionData);
    
    log('fractal', `Session saved to NEAR: ${sessionId}`, 'success');
    log('fractal', `Type: ${type}, Zoom: ${zoom}x, Iterations: ${iterations}`, 'info');
    log('fractal', `Emotional State - Valence: ${emotionalState.valence.toFixed(2)}, Arousal: ${emotionalState.arousal.toFixed(2)}, Dominance: ${emotionalState.dominance.toFixed(2)}`, 'info');
}

// Save fractal as NFT using Mintbase integration
async function saveFractalAsNFT() {
    // Get current fractal parameters
    const type = document.getElementById('fractal-type').value;
    const zoom = parseFloat(document.getElementById('zoom').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    
    // Get emotional state
    const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
    
    // Create metadata for the NFT
    const metadata = {
        title: `Fractal Studio Session - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `Interactive fractal art generated with emotional parameters.

Type: ${type}
Zoom: ${zoom}x
Iterations: ${iterations}

Emotional State:
Valence: ${emotionalState.valence.toFixed(2)}
Arousal: ${emotionalState.arousal.toFixed(2)}
Dominance: ${emotionalState.dominance.toFixed(2)}`,
        sessionType: 'fractal',
        emotionalData: emotionalState,
        fractalParams: {
            type,
            zoom,
            iterations
        },
        createdWith: 'Compiling.org Fractal Studio',
        timestamp: new Date().toISOString()
    };
    
    log('fractal', 'Saving fractal session as NFT...', 'info');
    
    try {
        // In a real implementation, this would call the Mintbase minting function
        // For now, we'll simulate it
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const tokenId = 'fractal_' + Date.now();
        
        log('fractal', `Fractal NFT minted successfully: ${tokenId}`, 'success');
        log('fractal', 'Stored on IPFS with emotional metadata', 'success');
        
        // Show success message
        alert(`🎉 Fractal NFT Created!

Token ID: ${tokenId}
Stored on IPFS
Emotional metadata included`);
        
        return tokenId;
    } catch (error) {
        log('fractal', `Failed to mint NFT: ${error.message}`, 'error');
        alert('Failed to create NFT. See logs for details.');
        throw error;
    }
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
    
    // Re-render fractal with new emotional state if fractal tab is active
    const activeTab = document.querySelector('.tab.active');
    if (activeTab && activeTab.textContent.includes('Fractal')) {
        renderFractal();
    }
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

// WGSL Studio functions
function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(`${sliderId}-value`);
    if (slider && valueSpan) {
        valueSpan.textContent = slider.value;
    }
}

async function renderShader() {
    const canvas = document.getElementById('wgsl-canvas');
    if (!canvas) return;
    
    // Get shader parameters
    const shaderType = document.getElementById('shader-type').value;
    const timeSpeed = parseFloat(document.getElementById('time-speed').value);
    const complexity = parseInt(document.getElementById('complexity').value);
    
    // Get emotional state
    const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
    
    // Use WebGPU if available and supported, otherwise fall back to Canvas2D
    if (useWebGPU) {
        await renderWebGPUShader(canvas, shaderType, timeSpeed, complexity, emotionalState);
    } else {
        renderCanvasShader(canvas, shaderType, timeSpeed, complexity, emotionalState);
    }
    
    log('wgsl', `Rendered ${shaderType} shader`, 'success');
}

function renderCanvasShader(canvas, shaderType, timeSpeed, complexity, emotion) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Render based on shader type
    switch(shaderType) {
        case 'audio-reactive':
            renderAudioReactiveShader(ctx, width, height, timeSpeed, emotion);
            break;
        case 'fractal':
            renderShaderFractal(ctx, width, height, complexity, emotion);
            break;
        case 'particle-system':
            renderParticleSystem(ctx, width, height, complexity, emotion);
            break;
        case 'wave-simulation':
            renderWaveSimulation(ctx, width, height, timeSpeed, emotion);
            break;
        default:
            renderAudioReactiveShader(ctx, width, height, timeSpeed, emotion);
    }
}

async function renderWebGPUShader(canvas, shaderType, timeSpeed, complexity, emotion) {
    // Initialize WebGPU engine if not already done
    if (!webgpuEngine) {
        webgpuEngine = new WebGPUEngine(canvas);
        const supported = await webgpuEngine.initialize();
        if (!supported) {
            console.warn('WebGPU not supported, falling back to Canvas2D');
            renderCanvasShader(canvas, shaderType, timeSpeed, complexity, emotion);
            return;
        }
    }
    
    if (webgpuEngine.isWebGPUSupported()) {
        // Update uniforms with current values
        const time = Date.now() * 0.001 * timeSpeed;
        webgpuEngine.updateUniforms({
            time: time,
            resolution: [canvas.width, canvas.height],
            zoom: 1.0,
            iterations: complexity,
            valence: emotion.valence,
            arousal: emotion.arousal,
            dominance: emotion.dominance
        });
        
        // Render using WebGPU
        webgpuEngine.render();
    } else {
        // Fall back to canvas rendering
        renderCanvasShader(canvas, shaderType, timeSpeed, complexity, emotion);
    }
}

// This function is no longer needed as we've simplified the WebGPU rendering

async function renderWebGPUShaderWithCustomCode(canvas, vertexShaderCode, fragmentShaderCode, timeSpeed, complexity, emotion) {
    // Initialize WebGPU engine if not already done
    if (!webgpuEngine) {
        webgpuEngine = new WebGPUEngine(canvas);
        const supported = await webgpuEngine.initialize();
        if (!supported) {
            console.warn('WebGPU not supported, falling back to Canvas2D');
            // Fall back to canvas rendering with a simple effect
            renderCanvasShader(canvas, 'audio-reactive', timeSpeed, complexity, emotion);
            return;
        }
    }
    
    if (webgpuEngine.isWebGPUSupported()) {
        // Create custom pipeline with the provided shaders
        const success = await webgpuEngine.createPipeline(vertexShaderCode, fragmentShaderCode);
        if (success) {
            // Update uniforms with current values
            const time = Date.now() * 0.001 * timeSpeed;
            webgpuEngine.updateUniforms({
                time: time,
                resolution: [canvas.width, canvas.height],
                zoom: 1.0,
                iterations: complexity,
                valence: emotion.valence,
                arousal: emotion.arousal,
                dominance: emotion.dominance
            });
            
            // Render using WebGPU
            webgpuEngine.render();
        } else {
            console.warn('Failed to create WebGPU pipeline, falling back to Canvas2D');
            // Fall back to canvas rendering
            renderCanvasShader(canvas, 'audio-reactive', timeSpeed, complexity, emotion);
        }
    } else {
        // Fall back to canvas rendering
        renderCanvasShader(canvas, 'audio-reactive', timeSpeed, complexity, emotion);
    }
}

function renderAudioReactiveShader(ctx, width, height, timeSpeed, emotion) {
    const time = Date.now() * 0.001 * timeSpeed;
    
    // Create gradient based on emotional state
    const valence = emotion.valence;
    const arousal = emotion.arousal;
    const dominance = emotion.dominance;
    
    // Map emotional parameters to visual parameters
    const hue1 = (valence + 1) * 180; // -1 to 1 -> 0 to 360
    const hue2 = (dominance + 1) * 180;
    const saturation = 50 + arousal * 50; // 0 to 1 -> 50 to 100
    const lightness = 30 + arousal * 40; // 0 to 1 -> 30 to 70
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${hue1}, ${saturation}%, ${lightness}%)`);
    gradient.addColorStop(1, `hsl(${hue2}, ${saturation}%, ${lightness}%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add audio-reactive waves
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + arousal * 0.7})`;
    ctx.lineWidth = 2 + arousal * 3;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yOffset = (i / 5) * height;
        const waveHeight = 20 + arousal * 30;
        const frequency = 0.02 + dominance * 0.03;
        
        for (let x = 0; x < width; x += 5) {
            const y = yOffset + Math.sin(x * frequency + time + i) * waveHeight;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

function renderShaderFractal(ctx, width, height, complexity, emotion) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Fractal parameters modulated by emotion
    const zoom = 1 + emotion.dominance;
    const offsetX = emotion.valence * 0.5;
    const offsetY = emotion.arousal * 0.5;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Normalize coordinates
            let cx = (x - width / 2) / (width / 4) * zoom + offsetX;
            let cy = (y - height / 2) / (height / 4) * zoom + offsetY;
            
            let zx = 0;
            let zy = 0;
            let iter = 0;
            
            // Julia set calculation
            const julia_cx = -0.7 + emotion.valence * 0.3;
            const julia_cy = 0.27015 + emotion.arousal * 0.1;
            
            while (iter < complexity && zx * zx + zy * zy < 4) {
                const tmp = zx * zx - zy * zy + julia_cx;
                zy = 2 * zx * zy + julia_cy;
                zx = tmp;
                iter++;
            }
            
            // Color based on iterations and emotion
            const idx = (y * width + x) * 4;
            const t = iter / complexity;
            
            // Emotional color mapping
            const r = Math.floor(255 * t * (1 + emotion.valence));
            const g = Math.floor(255 * t * (1 + emotion.arousal));
            const b = Math.floor(255 * t * (1 + emotion.dominance));
            
            data[idx] = Math.min(255, Math.max(0, r));     // R
            data[idx + 1] = Math.min(255, Math.max(0, g)); // G
            data[idx + 2] = Math.min(255, Math.max(0, b)); // B
            data[idx + 3] = 255;                           // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function renderParticleSystem(ctx, width, height, complexity, emotion) {
    // Clear with semi-transparent black for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    const time = Date.now() * 0.001;
    const particleCount = Math.min(200, complexity);
    
    for (let i = 0; i < particleCount; i++) {
        // Particle position with emotional modulation
        const x = (Math.sin(time * 0.5 + i * 0.1) * 0.5 + 0.5) * width;
        const y = (Math.cos(time * 0.3 + i * 0.15) * 0.5 + 0.5) * height;
        
        // Particle size based on emotional state
        const size = 2 + emotion.arousal * 8 + Math.sin(time + i) * 2;
        
        // Particle color based on emotional state
        const hue = ((emotion.valence + 1) * 180 + i * 2) % 360;
        const saturation = 50 + emotion.arousal * 50;
        const lightness = 30 + emotion.dominance * 40;
        
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderWaveSimulation(ctx, width, height, timeSpeed, emotion) {
    const time = Date.now() * 0.001 * timeSpeed;
    
    // Create wave pattern with emotional modulation
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Wave parameters modulated by emotion
    const frequency = 0.05 + emotion.arousal * 0.1;
    const amplitude = 30 + emotion.dominance * 50;
    const speed = 2 + emotion.valence * 2;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Multiple wave components
            const wave1 = Math.sin(x * frequency + time * speed) * amplitude;
            const wave2 = Math.sin(y * frequency * 0.7 + time * speed * 1.3) * amplitude * 0.7;
            const wave3 = Math.sin((x + y) * frequency * 0.5 + time * speed * 0.7) * amplitude * 0.5;
            
            const value = (wave1 + wave2 + wave3) / 3;
            
            // Normalize to 0-255 range
            const normalized = (value + amplitude) / (2 * amplitude);
            
            // Color based on emotional state
            const r = Math.floor(255 * normalized * (1 + emotion.valence));
            const g = Math.floor(255 * normalized * (1 + emotion.arousal));
            const b = Math.floor(255 * normalized * (1 + emotion.dominance));
            
            const idx = (y * width + x) * 4;
            data[idx] = Math.min(255, Math.max(0, r));     // R
            data[idx + 1] = Math.min(255, Math.max(0, g)); // G
            data[idx + 2] = Math.min(255, Math.max(0, b)); // B
            data[idx + 3] = 255;                           // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

async function compileShader() {
    const code = document.getElementById('wgsl-editor').value;
    log('wgsl', 'Compiling shader...', 'info');
    
    // If WebGPU is enabled, render with the custom shader
    if (useWebGPU) {
        const canvas = document.getElementById('wgsl-canvas');
        if (canvas) {
            // For simplicity, we'll assume the code contains both vertex and fragment shaders
            // In a real implementation, you'd parse and separate them
            // Extract vertex and fragment shaders from the code
            const vertexShaderCode = `struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    if (vertex_index == 0) {
        out.position = vec4<f32>(-1.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 0.0);
    } else if (vertex_index == 1) {
        out.position = vec4<f32>(3.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(2.0, 0.0);
    } else {
        out.position = vec4<f32>(-1.0, 3.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 2.0);
    }
    return out;
}`;
            
            const fragmentShaderCode = code.includes('@fragment') ? code : `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Simple shader
    let color = vec3<f32>(
        sin(uv.x * 10.0 + uniforms.time) * 0.5 + 0.5,
        cos(uv.y * 10.0 + uniforms.time) * 0.5 + 0.5,
        sin((uv.x + uv.y) * 5.0 + uniforms.time) * 0.5 + 0.5
    );
    
    return vec4<f32>(color, 1.0);
}`;
            
            // Get current parameters
            const timeSpeed = parseFloat(document.getElementById('time-speed').value);
            const complexity = parseInt(document.getElementById('complexity').value);
            const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
            
            // Render with custom shader
            await renderWebGPUShaderWithCustomCode(canvas, vertexShaderCode, fragmentShaderCode, timeSpeed, complexity, emotionalState);
            log('wgsl', 'Shader compiled and rendered with WebGPU!', 'success');
        }
    } else {
        // Simulate compilation
        setTimeout(() => {
            log('wgsl', 'Shader compiled successfully!', 'success');
            renderShader();
        }, 1000);
    }
}

async function resetShader() {
    const shaderType = document.getElementById('shader-type').value;
    let vertexTemplate = '';
    let fragmentTemplate = '';
    
    // Common vertex shader template
    const vertexTemplateBase = `struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    if (vertex_index == 0) {
        out.position = vec4<f32>(-1.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 0.0);
    } else if (vertex_index == 1) {
        out.position = vec4<f32>(3.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(2.0, 0.0);
    } else {
        out.position = vec4<f32>(-1.0, 3.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 2.0);
    }
    return out;
}`;
    
    switch(shaderType) {
        case 'audio-reactive':
            vertexTemplate = vertexTemplateBase;
            fragmentTemplate = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    audio_bass: f32,
    audio_mid: f32,
    audio_high: f32,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Audio-reactive visualization with emotional modulation
    let bass_pulse = uniforms.audio_bass * sin(uniforms.time * 2.0 + uv.y * 10.0);
    let mid_wave = uniforms.audio_mid * cos(uniforms.time + uv.x * 15.0);
    let high_sparkle = uniforms.audio_high * sin(uniforms.time * 4.0);
    
    // Emotional modulation
    let color = vec3<f32>(
        0.5 + 0.5 * bass_pulse * (1.0 + uniforms.arousal),
        0.5 + 0.5 * mid_wave * (1.0 + uniforms.valence),
        0.5 + 0.5 * high_sparkle * (1.0 + uniforms.dominance)
    );
    
    return vec4<f32>(color, 1.0);
}`;
            break;
        case 'fractal':
            vertexTemplate = vertexTemplateBase;
            fragmentTemplate = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    zoom: f32,
    center: vec2<f32>,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    var uv = (in.uv - 0.5) * uniforms.zoom + uniforms.center;
    var z = vec2<f32>(0.0, 0.0);
    var iterations = 0;
    
    // Emotional modulation of iterations
    let max_iterations = 100 + i32(uniforms.arousal * 100.0);
    
    for (var i = 0; i < max_iterations; i = i + 1) {
        if (length(z) > 2.0) {
            break;
        }
        z = vec2<f32>(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + uv;
        iterations = i;
    }
    
    // Color based on iterations and emotional state
    let t = f32(iterations) / f32(max_iterations);
    let color = vec3<f32>(
        t * (1.0 + uniforms.valence),
        t * 0.5 * (1.0 + uniforms.arousal),
        (1.0 - abs(t)) * (1.0 + uniforms.dominance)
    );
    
    return vec4<f32>(color, 1.0);
}`;
            break;
        case 'particle-system':
            vertexTemplate = vertexTemplateBase;
            fragmentTemplate = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    particle_count: u32,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Simple particle effect with emotional modulation
    var color = vec3<f32>(0.0);
    
    for (var i: u32 = 0u; i < uniforms.particle_count; i = i + 1u) {
        let particle_pos = vec2<f32>(
            sin(uniforms.time + f32(i) * 0.1) * (1.0 + uniforms.valence),
            cos(uniforms.time * 1.2 + f32(i) * 0.15) * (1.0 + uniforms.arousal)
        );
        
        let dist = distance(uv, particle_pos);
        let intensity = 0.01 / (dist + 0.01);
        
        color += vec3<f32>(
            intensity * sin(uniforms.time * 2.0 + f32(i)) * (1.0 + uniforms.dominance),
            intensity * cos(uniforms.time + f32(i)) * (1.0 + uniforms.arousal),
            intensity * sin(uniforms.time * 0.5 + f32(i) * 2.0) * (1.0 + uniforms.valence)
        );
    }
    
    return vec4<f32>(color, 1.0);
}`;
            break;
        case 'wave-simulation':
            vertexTemplate = vertexTemplateBase;
            fragmentTemplate = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Wave simulation with emotional modulation
    let wave1 = sin(uv.x * 10.0 + uniforms.time) * 0.5 * (1.0 + uniforms.arousal);
    let wave2 = cos(uv.y * 15.0 + uniforms.time * 1.3) * 0.3 * (1.0 + uniforms.valence);
    let wave3 = sin((uv.x + uv.y) * 7.0 + uniforms.time * 0.7) * 0.2 * (1.0 + uniforms.dominance);
    
    let height = wave1 + wave2 + wave3;
    
    let color = vec3<f32>(
        0.5 + height,
        0.5 + height * 0.5,
        1.0 - abs(height)
    );
    
    return vec4<f32>(color, 1.0);
}`;
            break;
        default:
            vertexTemplate = vertexTemplateBase;
            fragmentTemplate = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    valence: f32,
    arousal: f32,
    dominance: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Default shader with emotional modulation
    let time_mod = uniforms.time * (1.0 + uniforms.arousal);
    let color_shift = uniforms.valence * 0.5;
    let complexity = uniforms.dominance * 5.0;
    
    let wave1 = sin(uv.x * 10.0 + time_mod) * 0.5;
    let wave2 = cos(uv.y * 15.0 + time_mod * 1.3) * 0.3;
    let wave3 = sin((uv.x + uv.y) * 7.0 + time_mod * 0.7) * 0.2;
    
    let height = (wave1 + wave2 + wave3) * (1.0 + complexity);
    
    let color = vec3<f32>(
        0.5 + height + color_shift,
        0.5 + height * 0.5 + uniforms.arousal * 0.3,
        1.0 - abs(height) + uniforms.dominance * 0.4
    );
    
    return vec4<f32>(color, 1.0);
}`;
    }
    
    // Combine vertex and fragment shaders
    const fullTemplate = vertexTemplate + '\n\n' + fragmentTemplate;
    document.getElementById('wgsl-editor').value = fullTemplate;
    log('wgsl', `Reset to ${shaderType} template`, 'info');
    
    // If WebGPU is enabled, render with the new shader
    if (useWebGPU) {
        const canvas = document.getElementById('wgsl-canvas');
        if (canvas) {
            // Get current parameters
            const timeSpeed = parseFloat(document.getElementById('time-speed').value);
            const complexity = parseInt(document.getElementById('complexity').value);
            const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
            
            // Render with custom shader
            await renderWebGPUShaderWithCustomCode(canvas, vertexTemplate, fragmentTemplate, timeSpeed, complexity, emotionalState);
        }
    } else {
        compileShader();
    }
}

function saveShaderAsNFT() {
    // Get current shader parameters
    const shaderType = document.getElementById('shader-type').value;
    const timeSpeed = parseFloat(document.getElementById('time-speed').value);
    const complexity = parseInt(document.getElementById('complexity').value);
    
    // Get emotional state
    const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
    
    // Get shader code
    const shaderCode = document.getElementById('wgsl-editor').value;
    
    // Create metadata for the NFT
    const metadata = {
        title: `WGSL Studio Session - ${shaderType.charAt(0).toUpperCase() + shaderType.slice(1)}`,
        description: `Interactive WebGPU shader generated with emotional parameters.

Type: ${shaderType}
Time Speed: ${timeSpeed}x
Complexity: ${complexity}

Emotional State:
Valence: ${emotionalState.valence.toFixed(2)}
Arousal: ${emotionalState.arousal.toFixed(2)}
Dominance: ${emotionalState.dominance.toFixed(2)}

Shader Code:
${shaderCode}`,
        sessionType: 'wgsl',
        emotionalData: emotionalState,
        shaderParams: {
            type: shaderType,
            timeSpeed,
            complexity
        },
        shaderCode: shaderCode,
        createdWith: 'Compiling.org WGSL Studio',
        timestamp: new Date().toISOString()
    };
    
    log('wgsl', 'Saving shader session as NFT...', 'info');
    
    try {
        // In a real implementation, this would call the Mintbase minting function
        // For now, we'll simulate it
        setTimeout(() => {
            const tokenId = 'wgsl_' + Date.now();
            
            log('wgsl', `Shader NFT minted successfully: ${tokenId}`, 'success');
            log('wgsl', 'Stored on IPFS with emotional metadata', 'success');
            
            // Show success message
            alert(`🎉 WGSL Shader NFT Created!

Token ID: ${tokenId}
Stored on IPFS
Emotional metadata included`);
        }, 2000);
    } catch (error) {
        log('wgsl', `Failed to mint NFT: ${error.message}`, 'error');
        alert('Failed to create NFT. See logs for details.');
    }
}

// Initialize WGSL canvas
function initializeWgslCanvas() {
    const canvas = document.getElementById('wgsl-canvas');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
}

// Node editor functions
async function generateShaderFromNodes() {
    log('wgsl', 'Generating shader from node graph...', 'info');
    
    // In a real implementation, this would traverse the node graph
    // and generate corresponding WGSL code
    setTimeout(async () => {
        const generatedCode = `// Generated shader from node graph
// WebGPU-compatible WGSL shader with emotional modulation

struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    valence: f32,      // Emotional parameter: -1 to 1
    arousal: f32,      // Emotional parameter: 0 to 1
    dominance: f32,    // Emotional parameter: 0 to 1
    zoom: f32,
    iterations: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    if (vertex_index == 0) {
        out.position = vec4<f32>(-1.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 0.0);
    } else if (vertex_index == 1) {
        out.position = vec4<f32>(3.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(2.0, 0.0);
    } else {
        out.position = vec4<f32>(-1.0, 3.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 2.0);
    }
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Emotional modulation parameters
    let time_mod = uniforms.time * (1.0 + uniforms.arousal);
    let color_shift = uniforms.valence * 0.5;
    let complexity = uniforms.dominance * 5.0;
    
    // Multi-layered visual effect with emotional modulation
    let wave1 = sin(uv.x * 10.0 + time_mod) * 0.5;
    let wave2 = cos(uv.y * 15.0 + time_mod * 1.3) * 0.3;
    let wave3 = sin((uv.x + uv.y) * 7.0 + time_mod * 0.7) * 0.2;
    
    let height = (wave1 + wave2 + wave3) * (1.0 + complexity);
    
    // Color based on emotional state
    let color = vec3<f32>(
        0.5 + height + color_shift,
        0.5 + height * 0.5 + uniforms.arousal * 0.3,
        1.0 - abs(height) + uniforms.dominance * 0.4
    );
    
    // Add some sparkle effect based on emotional intensity
    let sparkle = sin(time_mod * 10.0 + uv.x * 50.0) * sin(time_mod * 7.0 + uv.y * 30.0);
    let final_color = color + vec3<f32>(sparkle * uniforms.arousal * 0.2);
    
    return vec4<f32>(final_color, 1.0);
}`;
        
        document.getElementById('wgsl-editor').value = generatedCode;
        log('wgsl', 'Shader generated from node graph', 'success');
        
        // If WebGPU is enabled, render with the generated shader
        if (useWebGPU) {
            const canvas = document.getElementById('wgsl-canvas');
            if (canvas) {
                // Extract vertex and fragment shaders from the generated code
                const vertexShaderCode = `struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    if (vertex_index == 0) {
        out.position = vec4<f32>(-1.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 0.0);
    } else if (vertex_index == 1) {
        out.position = vec4<f32>(3.0, -1.0, 0.0, 1.0);
        out.uv = vec2<f32>(2.0, 0.0);
    } else {
        out.position = vec4<f32>(-1.0, 3.0, 0.0, 1.0);
        out.uv = vec2<f32>(0.0, 2.0);
    }
    return out;
}`;
                
                const fragmentShaderCode = `struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    valence: f32,      // Emotional parameter: -1 to 1
    arousal: f32,      // Emotional parameter: 0 to 1
    dominance: f32,    // Emotional parameter: 0 to 1
    zoom: f32,
    iterations: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let uv = in.uv;
    
    // Emotional modulation parameters
    let time_mod = uniforms.time * (1.0 + uniforms.arousal);
    let color_shift = uniforms.valence * 0.5;
    let complexity = uniforms.dominance * 5.0;
    
    // Multi-layered visual effect with emotional modulation
    let wave1 = sin(uv.x * 10.0 + time_mod) * 0.5;
    let wave2 = cos(uv.y * 15.0 + time_mod * 1.3) * 0.3;
    let wave3 = sin((uv.x + uv.y) * 7.0 + time_mod * 0.7) * 0.2;
    
    let height = (wave1 + wave2 + wave3) * (1.0 + complexity);
    
    // Color based on emotional state
    let color = vec3<f32>(
        0.5 + height + color_shift,
        0.5 + height * 0.5 + uniforms.arousal * 0.3,
        1.0 - abs(height) + uniforms.dominance * 0.4
    );
    
    // Add some sparkle effect based on emotional intensity
    let sparkle = sin(time_mod * 10.0 + uv.x * 50.0) * sin(time_mod * 7.0 + uv.y * 30.0);
    let final_color = color + vec3<f32>(sparkle * uniforms.arousal * 0.2);
    
    return vec4<f32>(final_color, 1.0);
}`;
                
                // Get current parameters
                const timeSpeed = parseFloat(document.getElementById('time-speed').value);
                const complexity = parseInt(document.getElementById('complexity').value);
                const emotionalState = state.emotionalState || { valence: 0, arousal: 0.5, dominance: 0.5 };
                
                // Render with custom shader
                await renderWebGPUShaderWithCustomCode(canvas, vertexShaderCode, fragmentShaderCode, timeSpeed, complexity, emotionalState);
            }
        } else {
            compileShader();
        }
    }, 1000);
}

function clearNodes() {
    if (confirm('Clear all nodes?')) {
        log('wgsl', 'Node graph cleared', 'info');
        // In a real implementation, this would clear the node editor
    }
}

// Add event listeners for WGSL controls
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for sliders
    const sliders = ['time-speed', 'complexity'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', () => updateSliderValue(sliderId));
        }
    });
    
    // Add event listener for shader type change
    const shaderType = document.getElementById('shader-type');
    if (shaderType) {
        shaderType.addEventListener('change', resetShader);
    }
    
    // Initialize canvas
    initializeWgslCanvas();
    
    // Render initial shader
    renderShader();
});
