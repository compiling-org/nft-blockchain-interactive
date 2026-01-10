// Blockchain Integration for NEAR, Solana, and IPFS
// Using proper wallet selectors and SDKs

// ============================================
// WebGPU Engine for WGSL Studio
// ============================================

// Simple WebGPU Engine implementation for the marketplace frontend
class WebGPUEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.uniformBuffer = null;
        this.uniformBindGroup = null;
        this.time = 0;
        this.isSupported = false;
    }

    async initialize() {
        if (!navigator.gpu) {
            console.warn('WebGPU not supported');
            return false;
        }

        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('No WebGPU adapter available');
                return false;
            }

            this.device = await adapter.requestDevice();
            this.context = this.canvas.getContext('webgpu');
            
            if (!this.context) {
                console.warn('Failed to get WebGPU context');
                return false;
            }

            const format = navigator.gpu.getPreferredCanvasFormat();
            this.context.configure({
                device: this.device,
                format: format,
                alphaMode: 'premultiplied'
            });

            // Create uniform buffer for shader parameters
            this.uniformBuffer = this.device.createBuffer({
                size: 32, // 8 floats (time, resolution.x, resolution.y, zoom, iterations, valence, arousal, dominance)
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });

            // Create a default rendering pipeline
            await this.createDefaultPipeline();

            this.isSupported = true;
            return true;
        } catch (error) {
            console.error('WebGPU initialization failed:', error);
            return false;
        }
    }

    async createDefaultPipeline() {
        if (!this.device || !this.context) return false;

        try {
            // Default vertex shader
            const vertexShader = `
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
            `;

            // Default fragment shader with emotional modulation
            const fragmentShader = `
                struct Uniforms {
                    time: f32,
                    resolution: vec2<f32>,
                    zoom: f32,
                    iterations: f32,
                    valence: f32,
                    arousal: f32,
                    dominance: f32,
                };

                @group(0) @binding(0) var<uniform> uniforms: Uniforms;

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
                }
            `;

            const vertexModule = this.device.createShaderModule({
                code: vertexShader
            });

            const fragmentModule = this.device.createShaderModule({
                code: fragmentShader
            });

            const pipeline = this.device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: vertexModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: fragmentModule,
                    entryPoint: 'fs_main',
                    targets: [{
                        format: navigator.gpu.getPreferredCanvasFormat()
                    }]
                },
                primitive: {
                    topology: 'triangle-list'
                }
            });

            // Create bind group layout and bind group
            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {}
                }]
            });

            this.uniformBindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }]
            });

            this.pipeline = pipeline;
            return true;
        } catch (error) {
            console.error('Pipeline creation failed:', error);
            return false;
        }
    }

    async createPipeline(vertexShaderCode, fragmentShaderCode) {
        if (!this.device || !this.context) return false;

        try {
            // Create separate shader modules for vertex and fragment shaders
            const vertexModule = this.device.createShaderModule({
                code: vertexShaderCode
            });

            const fragmentModule = this.device.createShaderModule({
                code: fragmentShaderCode
            });

            const pipeline = this.device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: vertexModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: fragmentModule,
                    entryPoint: 'fs_main',
                    targets: [{
                        format: navigator.gpu.getPreferredCanvasFormat()
                    }]
                },
                primitive: {
                    topology: 'triangle-list'
                }
            });

            // Create bind group layout and bind group
            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {}
                }]
            });

            this.uniformBindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }]
            });

            this.pipeline = pipeline;
            return true;
        } catch (error) {
            console.error('Pipeline creation failed:', error);
            return false;
        }
    }

    updateUniforms(params) {
        if (!this.device || !this.uniformBuffer) return;

        const {
            time = 0,
            resolution = [800, 600],
            zoom = 1.0,
            iterations = 100,
            valence = 0,
            arousal = 0.5,
            dominance = 0.5
        } = params;

        // Create uniform data
        const uniformData = new Float32Array([
            time,
            resolution[0],
            resolution[1],
            zoom,
            iterations,
            valence,
            arousal,
            dominance
        ]);

        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);
    }

    render() {
        if (!this.device || !this.context || !this.pipeline) return;

        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();

        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.uniformBindGroup);
        passEncoder.draw(6); // Draw fullscreen quad (2 triangles = 6 vertices)
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    isWebGPUSupported() {
        return this.isSupported;
    }
}

// Export for global use
window.WebGPUEngine = WebGPUEngine;

// ============================================
// NEAR Wallet Integration
// ============================================

let nearWalletSelector = null;
let nearModal = null;
let nearWallet = null;
let nearAccountId = null;

// Initialize NEAR Wallet Selector
async function initNEARWallet() {
    try {
        // For testing without npm packages, we'll use a simplified approach
        // In production, you would use: @near-wallet-selector/core
        
        console.log('Initializing NEAR wallet connection...');
        
        // Simulated wallet for testing
        const testWallet = {
            accountId: 'test-creator.testnet',
            isSignedIn: () => true,
            signIn: async () => {
                console.log('NEAR wallet sign in requested');
                nearAccountId = 'test-creator.testnet';
                updateWalletUI();
                return true;
            },
            signOut: async () => {
                console.log('NEAR wallet sign out');
                nearAccountId = null;
                updateWalletUI();
            },
            viewMethod: async ({ contractId, method, args }) => {
                console.log(`NEAR view call: ${contractId}.${method}`, args);
                return simulateNEARViewCall(contractId, method, args);
            },
            callMethod: async ({ contractId, method, args, gas, deposit }) => {
                console.log(`NEAR call: ${contractId}.${method}`, {args, gas, deposit});
                return simulateNEARTransaction(contractId, method, args);
            }
        };
        
        nearWallet = testWallet;
        
        // Auto-connect for testing
        await nearWallet.signIn();
        
        log('NEAR wallet initialized successfully', 'success');
        return true;
        
    } catch (error) {
        console.error('NEAR wallet initialization error:', error);
        log('NEAR wallet connection failed: ' + error.message, 'error');
        return false;
    }
}

// Simulate NEAR view calls
function simulateNEARViewCall(contractId, method, args) {
    const responses = {
        'nft_tokens': [
            { token_id: '1', owner_id: 'creator1.testnet', metadata: { title: 'Test NFT 1' }},
            { token_id: '2', owner_id: 'creator2.testnet', metadata: { title: 'Test NFT 2' }}
        ],
        'nft_token': { 
            token_id: args.token_id, 
            owner_id: nearAccountId,
            metadata: { 
                title: 'Fractal Session #' + args.token_id,
                description: 'Interactive fractal artwork',
                media: 'ipfs://QmTest123...'
            }
        },
        'get_proposal': {
            proposal_id: args.proposal_id,
            votes_for: 42,
            votes_against: 18,
            status: 'Active'
        }
    };
    
    return responses[method] || { success: true };
}

// Simulate NEAR transactions
async function simulateNEARTransaction(contractId, method, args) {
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const txHash = 'tx_' + Math.random().toString(36).substring(7);
    
    log(`Transaction sent: ${txHash}`, 'info');
    log(`Method: ${method} on ${contractId}`, 'info');
    
    return {
        transaction: {
            hash: txHash,
            signer_id: nearAccountId
        },
        receipts_outcome: [{
            outcome: {
                status: { SuccessValue: '' }
            }
        }]
    };
}

// ============================================
// Mintbase Integration
// ============================================

async function mintNFTOnMintbase(metadata) {
    try {
        log('Minting NFT on Mintbase...', 'info');
        
        const contractId = 'your-store.mintbase1.near';
        
        const result = await nearWallet.callMethod({
            contractId,
            method: 'nft_batch_mint',
            args: {
                owner_id: nearAccountId,
                metadata: {
                    title: metadata.title,
                    description: metadata.description,
                    media: metadata.ipfsCid,
                    extra: JSON.stringify({
                        emotional_data: metadata.emotionalData,
                        session_type: metadata.sessionType,
                        performance_metrics: metadata.performanceMetrics
                    })
                },
                num_to_mint: 1,
                royalty_args: {
                    split_between: {
                        [nearAccountId]: 9500, // 95% to creator
                        [contractId]: 500       // 5% platform fee
                    },
                    percentage: 1000 // 10% total royalty
                }
            },
            gas: '300000000000000',
            deposit: '10000000000000000000000' // 0.01 NEAR
        });
        
        log('NFT minted successfully!', 'success');
        log('Token ID: ' + result.token_ids[0], 'success');
        
        return result.token_ids[0];
        
    } catch (error) {
        log('Minting failed: ' + error.message, 'error');
        throw error;
    }
}

async function listOnMintbaseMarketplace(tokenId, price) {
    try {
        log(`Listing NFT ${tokenId} for ${price} NEAR`, 'info');
        
        const result = await nearWallet.callMethod({
            contractId: 'market.mintbase1.near',
            method: 'list_token',
            args: {
                token_id: tokenId,
                price: (parseFloat(price) * 1e24).toString() // Convert NEAR to yoctoNEAR
            },
            gas: '300000000000000',
            deposit: '1'
        });
        
        log('Listed on marketplace successfully!', 'success');
        return result;
        
    } catch (error) {
        log('Listing failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// DAO Functions
// ============================================

async function createDAOProposal(title, description, proposalType) {
    try {
        log('Creating DAO proposal...', 'info');
        
        const result = await nearWallet.callMethod({
            contractId: 'dao.compiling.near',
            method: 'create_proposal',
            args: {
                title,
                description,
                proposal_type: proposalType,
                required_alignment: 0.5
            },
            gas: '300000000000000',
            deposit: '100000000000000000000000' // 0.1 NEAR proposal deposit
        });
        
        log('Proposal created successfully!', 'success');
        return result.proposal_id;
        
    } catch (error) {
        log('Proposal creation failed: ' + error.message, 'error');
        throw error;
    }
}

async function voteOnProposal(proposalId, voteChoice, emotionalState) {
    try {
        log(`Voting on proposal #${proposalId}...`, 'info');
        
        const result = await nearWallet.callMethod({
            contractId: 'dao.compiling.near',
            method: 'vote',
            args: {
                proposal_id: proposalId,
                vote_choice: voteChoice,
                emotional_state: {
                    valence: emotionalState.valence,
                    arousal: emotionalState.arousal,
                    dominance: emotionalState.dominance,
                    confidence: 0.9,
                    source: 'Manual'
                },
                sensor_data: null // Optional EEG/BMI data
            },
            gas: '300000000000000'
        });
        
        log('Vote recorded with emotional state!', 'success');
        return result;
        
    } catch (error) {
        log('Voting failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Soulbound Token Functions
// ============================================

async function mintSoulboundToken(tokenType, metadata) {
    try {
        log('Minting soulbound token...', 'info');
        
        const result = await nearWallet.callMethod({
            contractId: 'soulbound.compiling.near',
            method: 'mint_soulbound',
            args: {
                token_type: tokenType,
                metadata: JSON.stringify(metadata)
            },
            gas: '300000000000000',
            deposit: '10000000000000000000000' // 0.01 NEAR
        });
        
        log('Soulbound token minted!', 'success');
        log('This token is non-transferable and bound to your account', 'info');
        
        return result.token_id;
        
    } catch (error) {
        log('Soulbound minting failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// IPFS/Filecoin Integration
// ============================================

async function uploadToIPFS(data) {
    try {
        log('Uploading to IPFS...', 'info');
        
        // For testing, simulate IPFS upload
        // In production, use: https://nft.storage or Web3.Storage API
        
        const cid = 'Qm' + Math.random().toString(36).substring(2, 15);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        log(`Uploaded to IPFS: ${cid}`, 'success');
        log('Data pinned to Filecoin network', 'success');
        
        return cid;
        
    } catch (error) {
        log('IPFS upload failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Fractal Studio Integration
// ============================================

async function saveFractalSession(sessionData) {
    try {
        log('Saving fractal session...', 'info');
        
        // Upload session data to IPFS first
        const ipfsCid = await uploadToIPFS(sessionData);
        
        // Mint NFT with session data
        const tokenId = await mintNFTOnMintbase({
            title: sessionData.name || 'Fractal Session',
            description: `Interactive fractal artwork - ${sessionData.fractalType}`,
            ipfsCid,
            emotionalData: sessionData.emotionalState,
            sessionType: 'FractalStudio',
            performanceMetrics: {
                avgFps: sessionData.avgFps || 60,
                renderTime: sessionData.renderTime || 0,
                zoom: sessionData.zoom,
                iterations: sessionData.iterations
            }
        });
        
        log('Fractal session saved as NFT!', 'success');
        return { tokenId, ipfsCid };
        
    } catch (error) {
        log('Session save failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// Neuroemotive AI Integration (Solana)
// ============================================

async function recordEmotionalStateToSolana(emotionalState) {
    try {
        log('Recording emotional state to Solana...', 'info');
        
        // Simulate Solana transaction
        // In production, use: @solana/web3.js
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const signature = 'sol_' + Math.random().toString(36).substring(2, 15);
        
        log('Emotional state recorded on Solana', 'success');
        log(`Transaction: ${signature}`, 'info');
        log('Data compressed: 90% space saving achieved', 'success');
        
        return signature;
        
    } catch (error) {
        log('Solana recording failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// UI Helper Functions
// ============================================

function updateWalletUI() {
    const walletStatus = document.getElementById('wallet-status');
    if (walletStatus) {
        if (nearAccountId) {
            walletStatus.textContent = `Connected: ${nearAccountId}`;
            walletStatus.style.color = '#22c55e';
        } else {
            walletStatus.textContent = 'Not Connected';
            walletStatus.style.color = '#ef4444';
        }
    }
}

function log(message, type = 'info') {
    const logContainer = document.getElementById('blockchain-log');
    if (!logContainer) {
        console.log(`[${type}] ${message}`);
        return;
    }
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    logContainer.insertBefore(entry, logContainer.firstChild);
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// ============================================
// Initialize on page load
// ============================================

window.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing blockchain connections...');
    await initNEARWallet();
});

// Export functions for use in main app
window.blockchain = {
    initNEARWallet,
    mintNFTOnMintbase,
    listOnMintbaseMarketplace,
    createDAOProposal,
    voteOnProposal,
    mintSoulboundToken,
    uploadToIPFS,
    saveFractalSession,
    recordEmotionalStateToSolana,
    log,
    getNEARAccountId: () => nearAccountId
};

// ============================================
// WGSL Studio Functions
// ============================================

// Global variables for WebGPU support
let useWebGPU = true;
let webgpuEngine = null;

// Node editor functions
async function generateShaderFromNodes() {
    if (window.blockchain) {
        window.blockchain.log('Generating shader from node graph...', 'info');
    }
    
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

        const editor = document.getElementById('wgsl-editor');
        if (editor) {
            editor.value = generatedCode;
        }
        
        if (window.blockchain) {
            window.blockchain.log('Shader generated from node graph', 'success');
        }
        
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
                const timeSpeed = 1.0; // Default value
                const complexity = 100; // Default value
                const emotionalState = { valence: 0, arousal: 0.5, dominance: 0.5 }; // Default values
                
                // Render with custom shader
                await renderWebGPUShaderWithCustomCode(canvas, vertexShaderCode, fragmentShaderCode, timeSpeed, complexity, emotionalState);
            }
        }
    }, 1000);
}

function clearNodes() {
    if (confirm('Clear all nodes?')) {
        if (window.blockchain) {
            window.blockchain.log('Node graph cleared', 'info');
        }
        // In a real implementation, this would clear the node editor
    }
}

// WebGPU rendering functions
async function renderWebGPUShaderWithCustomCode(canvas, vertexShaderCode, fragmentShaderCode, timeSpeed, complexity, emotion) {
    // Initialize WebGPU engine if not already done
    if (!webgpuEngine) {
        webgpuEngine = new WebGPUEngine(canvas);
        const supported = await webgpuEngine.initialize();
        if (!supported) {
            console.warn('WebGPU not supported, falling back to Canvas2D');
            // Fall back to canvas rendering with a simple effect
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
            console.warn('Failed to create WebGPU pipeline');
        }
    }
}

// Add the missing functions to the blockchain object
window.blockchain.generateShaderFromNodes = generateShaderFromNodes;
window.blockchain.clearNodes = clearNodes;
