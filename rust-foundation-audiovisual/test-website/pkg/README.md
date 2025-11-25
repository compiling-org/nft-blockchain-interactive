# Rust Foundation: Web-Based Audiovisual Creative System

A simple web-based audiovisual creative system that combines core aspects of Shader Studio (visual tools) and Modurust (modular audio tools), compiled to WebAssembly for browser deployment.

## 🎯 Project Overview

This project implements the Rust Foundation grant for creating WASM-compiled creative tools that run natively in web browsers. It serves as the foundation for our NUWE and Modurust long-term ecosystem.

**Key Features:**
- WASM-compiled Rust audio synthesis engine
- WebGPU-based visual shader system with WebGL fallback  
- Gesture-driven creative controls
- Blockchain compatibility for tool publishing
- Cross-platform deployment (web/desktop/mobile)

## 🚀 Quick Start

### Prerequisites
- Rust 1.70+ 
- wasm-pack
- Node.js 16+

### Build & Run
```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build the project
wasm-pack build --target web --out-dir pkg

# Serve locally
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

### Development
```bash
# Build with debug symbols
wasm-pack build --dev --target web

# Run tests
cargo test

# Build for production
wasm-pack build --release --target web
```

## 🏗️ Architecture

### Core Components
- **Audio Engine**: Web Audio API integration with real-time synthesis
- **Graphics Engine**: WebGPU shader compilation with WebGL fallback
- **Gesture Handler**: Touch/mouse input mapping to creative parameters
- **WASM Bindings**: JavaScript integration for web deployment
- **Blockchain Bridge**: NEAR/Solana integration for tool publishing

### Project Structure
```
rust-foundation-audiovisual/
├── Cargo.toml          # Rust dependencies and WASM config
├── src/
│   ├── lib.rs         # Main WASM bindings
│   ├── audio.rs       # Audio synthesis engine
│   ├── graphics.rs    # WebGPU shader system
│   ├── gesture.rs     # Gesture control mapping
│   └── blockchain.rs  # Blockchain integration
├── pkg/               # Generated WASM package
├── examples/
│   └── index.html     # Simple web interface
└── tests/             # Unit and integration tests
```

## 🎨 Usage Examples

### Basic Audio Synthesis
```javascript
import init, { CreativeEngine } from './pkg/creative_engine.js';

async function run() {
    await init();
    const engine = new CreativeEngine();
    
    // Create simple oscillator
    engine.create_oscillator(440.0, 'sine');
}
```

### Visual Shader Compilation
```javascript
const shaderCode = `
@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    let x = f32(vertex_index) * 0.1;
    let y = sin(x * 10.0) * 0.5;
    return vec4<f32>(x - 0.5, y, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return vec4<f32>(0.5, 0.8, 1.0, 1.0);
}
`;

engine.register_shader('basic_pattern', shaderCode);
```

### Gesture Control
```javascript
// Map touch input to audio/visual parameters
function handleTouch(x, y, pressure, velocity) {
    engine.process_gesture(x, y, pressure, velocity);
}
```

## 🔧 Configuration

### WASM Build Options
```toml
[package.metadata.wasm-pack]
# Optimize for size
"wasm-opt": ["-Oz"]

# Enable WebGPU features
features = ["webgpu", "webgl"]
```

### Audio Configuration
- Max voices: 16 (web), 128 (native)
- Sample rate: 44.1kHz
- Buffer size: 256 samples

### Graphics Configuration  
- Max shader size: 1MB (web), 10MB (native)
- WebGPU with WebGL fallback
- 60fps target performance

## 🔗 Blockchain Integration

### NEAR Protocol
```javascript
// Publish creative tool to NEAR
const transactionHash = await engine.publish_tool_to_near({
    tool_id: 'my_audio_tool',
    metadata: { name: 'Simple Synthesizer', version: '1.0' },
    creator: 'user.near'
});
```

### Solana Integration
```javascript
// Similar integration for Solana blockchain
const signature = await engine.publish_tool_to_solana({
    tool_data: toolBuffer,
    metadata: metadataBuffer
});
```

## 🧪 Testing

### Unit Tests
```bash
cargo test
```

### WASM Tests
```bash
wasm-pack test --headless --firefox
```

### Integration Tests
```bash
npm test  # If you have JS integration tests
```

## 📊 Performance

### Target Metrics
- **WASM Load Time**: < 500ms
- **Audio Latency**: < 10ms  
- **Graphics FPS**: 60fps
- **Memory Usage**: < 50MB
- **Bundle Size**: < 1MB compressed

### Optimization Features
- Memory pool management
- Shader instruction limiting
- Audio voice limiting
- Automatic cleanup
- Security validation

## 🔒 Security

### WASM Sandboxing
- Instruction count limits
- Memory usage caps
- Audio frequency limits
- Input validation
- No unsafe operations

### Web Security
- Content Security Policy compatible
- No external dependencies
- Sandboxed execution
- Input sanitization

## 📚 Documentation

- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Examples](examples/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT/Apache 2.0 dual license - see LICENSE files for details.

## 🏛️ Grant Information

This project is funded by the Rust Foundation as part of the Web-Based Audiovisual Creative System grant. For more information, see the [grant documentation](../docs/rust-foundation-grant.md).

---

**Repository**: https://github.com/compiling-org/rust-foundation-audiovisual  
**Grant Timeline**: 2025-Q4 to 2026-Q1  
**License**: MIT/Apache 2.0 dual license