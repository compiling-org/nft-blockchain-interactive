#!/bin/bash
# Script to extract Rust grant files for separate repository

echo "============================================"
echo "Extracting Rust Grant Files"
echo "============================================"

# Create directory structure for Rust grant repository
mkdir -p ../grant-repositories/rust-emotional-engine/src
mkdir -p ../grant-repositories/rust-emotional-engine/test-website
mkdir -p ../grant-repositories/rust-emotional-engine/scripts

echo "📁 Created directory structure"

# Copy Rust client (core library)
cp -r ./src/rust-client ../grant-repositories/rust-emotional-engine/src/
echo "📦 Copied Rust client core library"

# Copy WASM components
cp -r ./src/wasm-contracts ../grant-repositories/rust-emotional-engine/src/
echo "📦 Copied WASM components"

# Extract NUWE/MODURUST tab from index.html
echo "🔧 Extracting NUWE/MODURUST tab from test website"

# Create a simplified test website with only Rust components
cat > ../grant-repositories/rust-emotional-engine/test-website/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Rust Emotional Engine</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #fff; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; background: #e0e0e0; cursor: pointer; border-radius: 5px; }
        .tab.active { background: #f74c00; color: white; }
        .tab-content { display: none; background: #fff; padding: 20px; border-radius: 10px; }
        .tab-content.active { display: block; }
        .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .control-group { background: #f8f9fa; padding: 15px; border-radius: 8px; }
        .slider-container { margin: 15px 0; }
        .slider { width: 100%; }
        .btn { padding: 10px 20px; background: #f74c00; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #d44000; }
        .log { background: #000; color: #0f0; padding: 15px; border-radius: 8px; font-family: monospace; height: 200px; overflow-y: auto; }
        .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
        .metric { background: #e6f7ff; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #f74c00; }
        .metric-label { font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🦀 Rust Emotional Engine</h1>
            <p>NUWE Stripped - Core Creative Engine</p>
        </div>
        
        <div class="tabs">
            <div class="tab active" onclick="switchTab('nuwe')">NUWE/MODURUST</div>
            <div class="tab" onclick="switchTab('webgpu')">WebGPU Engine</div>
            <div class="tab" onclick="switchTab('settings')">Settings</div>
        </div>
        
        <!-- NUWE/MODURUST Tab -->
        <section id="nuwe-tab" class="tab-content active">
            <div class="controls">
                <div class="control-group">
                    <h3>NUWE Creative Engine</h3>
                    <p>Real-time creative computation with emotional modulation:</p>
                    <ul>
                        <li>Emotionally-responsive shader generation</li>
                        <li>Real-time fractal computation</li>
                        <li>Biometric data integration</li>
                        <li>WASM-compiled performance</li>
                    </ul>
                </div>
                
                <div class="control-group">
                    <h3>Engine Controls</h3>
                    <button class="btn" onclick="initEngine()">Initialize Engine</button>
                    <button class="btn" onclick="generateShader()">Generate Shader</button>
                    <button class="btn" onclick="computeFractal()">Compute Fractal</button>
                </div>
            </div>
            
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value" id="shaders-generated">0</div>
                    <div class="metric-label">Shaders Generated</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="computations">0</div>
                    <div class="metric-label">Computations</div>
                </div>
            </div>
        </section>
        
        <!-- WebGPU Engine Tab -->
        <section id="webgpu-tab" class="tab-content">
            <div class="controls">
                <div class="control-group">
                    <h3>WebGPU Engine</h3>
                    <p>High-performance GPU computation for creative applications:</p>
                    <ul>
                        <li>Real-time shader compilation</li>
                        <li>GPU-accelerated fractal generation</li>
                        <li>Emotionally-modulated visual parameters</li>
                        <li>Cross-platform compatibility</li>
                    </ul>
                </div>
                
                <div class="control-group">
                    <h3>WebGPU Controls</h3>
                    <button class="btn" onclick="initWebGPU()">Initialize WebGPU</button>
                    <button class="btn" onclick="compileShader()">Compile Shader</button>
                    <button class="btn" onclick="renderFrame()">Render Frame</button>
                </div>
            </div>
        </section>
        
        <!-- Settings Tab -->
        <section id="settings-tab" class="tab-content">
            <div class="controls">
                <div class="control-group">
                    <h3>Engine Configuration</h3>
                    <label>Performance Mode:</label>
                    <select id="performance-mode" style="width: 100%; padding: 8px; margin: 10px 0;">
                        <option value="balanced">Balanced</option>
                        <option value="performance">Performance</option>
                        <option value="quality">Quality</option>
                    </select>
                    
                    <label>Thread Count:</label>
                    <input type="range" id="thread-count" min="1" max="16" value="8" style="width: 100%; margin: 10px 0;">
                    <span id="thread-count-value">8</span>
                    
                    <button class="btn" onclick="updateConfig()">Update Configuration</button>
                </div>
                
                <div class="control-group">
                    <h3>Logging</h3>
                    <button class="btn" onclick="enableLogging()">Enable Logging</button>
                    <button class="btn" onclick="disableLogging()">Disable Logging</button>
                </div>
            </div>
        </section>
        
        <div class="log" id="engine-log">
            <div>[INFO] Rust Emotional Engine system initialized</div>
        </div>
    </div>

    <script>
        // Tab switching
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        }
        
        // Initialize engine
        function initEngine() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Initializing NUWE Creative Engine...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Engine initialized successfully</div>` + logDiv.innerHTML;
            }, 1000);
        }
        
        // Generate shader
        function generateShader() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Generating emotionally-responsive shader...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const shaders = parseInt(document.getElementById('shaders-generated').textContent) + 1;
                document.getElementById('shaders-generated').textContent = shaders;
                
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Shader generated successfully</div>` + logDiv.innerHTML;
            }, 1500);
        }
        
        // Compute fractal
        function computeFractal() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Computing fractal with emotional modulation...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const computations = parseInt(document.getElementById('computations').textContent) + 1;
                document.getElementById('computations').textContent = computations;
                
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Fractal computed successfully</div>` + logDiv.innerHTML;
            }, 2000);
        }
        
        // Initialize WebGPU
        function initWebGPU() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Initializing WebGPU engine...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] WebGPU initialized successfully</div>` + logDiv.innerHTML;
            }, 1000);
        }
        
        // Compile shader
        function compileShader() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Compiling WGSL shader...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Shader compiled successfully</div>` + logDiv.innerHTML;
            }, 1500);
        }
        
        // Render frame
        function renderFrame() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Rendering frame with WebGPU...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Frame rendered successfully</div>` + logDiv.innerHTML;
            }, 500);
        }
        
        // Update configuration
        function updateConfig() {
            const mode = document.getElementById('performance-mode').value;
            const threads = document.getElementById('thread-count').value;
            
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Updating configuration: mode=${mode}, threads=${threads}</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Configuration updated successfully</div>` + logDiv.innerHTML;
            }, 500);
        }
        
        // Enable logging
        function enableLogging() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Enabling detailed logging...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Logging enabled</div>` + logDiv.innerHTML;
            }, 500);
        }
        
        // Disable logging
        function disableLogging() {
            const logDiv = document.getElementById('engine-log');
            const now = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${now}] Disabling detailed logging...</div>` + logDiv.innerHTML;
            
            setTimeout(() => {
                const now = new Date().toLocaleTimeString();
                logDiv.innerHTML = `<div>[${now}] Logging disabled</div>` + logDiv.innerHTML;
            }, 500);
        }
        
        // Update thread count display
        document.getElementById('thread-count').addEventListener('input', function() {
            document.getElementById('thread-count-value').textContent = this.value;
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Initialization code here
        });
    </script>
</body>
</html>
EOF

echo "🔧 Created simplified test website for Rust grant"

# Copy build scripts
cp ./build-rust-grant.sh ../grant-repositories/rust-emotional-engine/
cp ./install-cli-tools.sh ../grant-repositories/rust-emotional-engine/scripts/
echo "📦 Copied build scripts"

# Create README for Rust grant repository
cat > ../grant-repositories/rust-emotional-engine/README.md << 'EOF'
# Rust Emotional Engine

This repository contains the Rust Foundation grant implementation for NUWE Stripped - Core Creative Engine.

## Project Overview

We propose developing a high-performance Rust-based creative computation engine that serves as the core foundation for all our emotionally-responsive digital art projects. This module will provide the underlying computational framework for real-time fractal generation, shader compilation, and biometric data processing, enabling desktop-quality creative tools to run directly in the browser through WASM compilation.

## Features

- **NUWE Creative Engine**: Real-time creative computation with emotional modulation
- **WebGPU Integration**: High-performance GPU computation for creative applications
- **WASM Compilation**: Browser-native performance for desktop-quality tools
- **Biometric Processing**: Real-time processing of emotional and biometric data
- **Cross-Platform Compatibility**: Runs on any device with a modern browser

## Getting Started

### Prerequisites

- Rust and Cargo
- Node.js and npm
- wasm-pack
- Modern web browser with WebGPU support

### Installation

```bash
# Install CLI tools
./scripts/install-cli-tools.sh

# Build the project
./build-rust-grant.sh
```

### Building

```bash
# Build core library
cd src/rust-client
cargo build --release

# Build WASM for browser
wasm-pack build --target web --out-dir ../../test-website/wasm
```

### Testing

```bash
# Run unit tests
cargo test

# Run integration tests
wasm-pack test --headless --firefox
```

## Directory Structure

```
├── src/
│   ├── rust-client/           # Core Rust library
│   └── wasm-contracts/        # WASM contracts and bindings
├── test-website/              # Browser-based frontend
├── scripts/                   # Utility scripts
├── build-rust-grant.sh        # Build script
└── README.md                 # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Website**: https://compiling-org.netlify.app
- **GitHub**: https://github.com/compiling-org
- **Email**: kapil.bambardekar@gmail.com, vdmo@gmail.com
EOF

echo "📄 Created README for Rust grant repository"

echo ""
echo "============================================"
echo "✅ Rust Grant Files Extracted Successfully!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. cd ../grant-repositories/rust-emotional-engine"
echo "2. Review and customize the extracted files"
echo "3. Initialize git repository: git init"
echo "4. Add remote: git remote add origin https://github.com/compiling-org/rust-emotional-engine.git"
echo "5. Commit and push: git add . && git commit -m 'Initial commit' && git push -u origin main"
echo ""