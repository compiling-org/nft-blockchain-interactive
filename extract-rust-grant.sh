#!/bin/bash

# Rust Foundation Grant Extraction Script
# This script extracts ONLY Rust-specific code from the main project
# DO NOT copy the entire project - only Rust-related functionality

set -e  # Exit on any error

echo "🔍 Starting Rust Foundation grant extraction..."

# Define source and target directories
SOURCE_DIR="c:/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="c:/Users/kapil/compiling/grant-repositories/rust-creative-engine"

# Create target directory structure
echo "📁 Creating Rust project structure..."
mkdir -p "$TARGET_DIR/src/rust-client/src"
mkdir -p "$TARGET_DIR/src/rust-client-wasm/src"
mkdir -p "$TARGET_DIR/src/utils"
mkdir -p "$TARGET_DIR/rust-foundation-audiovisual/src"

# Copy core Rust integration files
echo "📋 Copying Rust integration files..."
if [ -f "$SOURCE_DIR/src/rust-client/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/rust-client/src/lib.rs" "$TARGET_DIR/src/rust-client/src/"
fi
if [ -f "$SOURCE_DIR/src/rust-client/src/ai_blockchain_integration.rs" ]; then
    cp "$SOURCE_DIR/src/rust-client/src/ai_blockchain_integration.rs" "$TARGET_DIR/src/rust-client/src/"
fi
if [ -f "$SOURCE_DIR/src/rust-client/src/ai_fractal_integration.rs" ]; then
    cp "$SOURCE_DIR/src/rust-client/src/ai_fractal_integration.rs" "$TARGET_DIR/src/rust-client/src/"
fi
if [ -f "$SOURCE_DIR/src/rust-client/src/comprehensive_integration.rs" ]; then
    cp "$SOURCE_DIR/src/rust-client/src/comprehensive_integration.rs" "$TARGET_DIR/src/rust-client/src/"
fi

# Copy additional Rust client files
cp "$SOURCE_DIR/src/rust-client/src/"*.rs "$TARGET_DIR/src/rust-client/src/" 2>/dev/null || true

# Copy WASM integration files
echo "⚙️ Copying WASM integration files..."
if [ -f "$SOURCE_DIR/src/rust-client-wasm/src/lib.rs" ]; then
    cp "$SOURCE_DIR/src/rust-client-wasm/src/lib.rs" "$TARGET_DIR/src/rust-client-wasm/src/"
fi

# Copy supporting files (shared dependencies)
cp "$SOURCE_DIR/src/utils/unified-ai-ml-integration.js" "$TARGET_DIR/src/utils/"
cp "$SOURCE_DIR/src/utils/hybrid-ai-architecture.js" "$TARGET_DIR/src/utils/"

# Copy Rust audiovisual engine files
echo "🎵 Copying Rust audiovisual engine files..."
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/lib.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/lib.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/audio.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/audio.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/audio_analysis.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/audio_analysis.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/audio_system.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/audio_system.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/fractal_engine.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/fractal_engine.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/fractal_types.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/fractal_types.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/gesture_midi_integration.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/gesture_midi_integration.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/glicol_integration.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/glicol_integration.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/real_audiovisual_engine.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/real_audiovisual_engine.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/real_audiovisual_system.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/real_audiovisual_system.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/shader_renderer.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/shader_renderer.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/synthesis.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/synthesis.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/ui.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/ui.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/src/wgpu_compute.rs" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/src/wgpu_compute.rs" "$TARGET_DIR/rust-foundation-audiovisual/src/"
fi

# Copy additional audiovisual files
cp "$SOURCE_DIR/rust-foundation-audiovisual/src/"*.rs "$TARGET_DIR/rust-foundation-audiovisual/src/" 2>/dev/null || true

# Copy audiovisual demo files
echo "📺 Copying demo files..."
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/demo-extracted.html" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/demo-extracted.html" "$TARGET_DIR/rust-foundation-audiovisual/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/test-complete-system.html" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/test-complete-system.html" "$TARGET_DIR/rust-foundation-audiovisual/"
fi
if [ -f "$SOURCE_DIR/rust-foundation-audiovisual/test-gesture-midi-simple.html" ]; then
    cp "$SOURCE_DIR/rust-foundation-audiovisual/test-gesture-midi-simple.html" "$TARGET_DIR/rust-foundation-audiovisual/"
fi

# Create Rust-specific Cargo.toml
echo "🔧 Creating Rust-specific Cargo.toml..."
cat > "$TARGET_DIR/Cargo.toml" << 'EOF'
[workspace]
members = [
    "src/rust-client",
    "src/rust-client-wasm",
    "rust-foundation-audiovisual"
]
resolver = "2"

[workspace.dependencies]
nannou = "0.18.1"
wgpu = "0.18.0"
cpal = "0.15.2"
rustfft = "6.1.0"
glicol = "0.10.0"
iron-learn = "0.7.0"
lancedb = "0.4.0"
tch = "0.13.0"
wasm-bindgen = "0.2.88"
web-sys = "0.3.65"
js-sys = "0.3.65"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"

[profile.release.package."*"]
opt-level = "z"
EOF

# Create individual Cargo.toml files for each component
echo "📦 Creating Cargo.toml for rust-client..."
cat > "$TARGET_DIR/src/rust-client/Cargo.toml" << 'EOF'
[package]
name = "rust-client"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
serde = { workspace = true }
serde_json = { workspace = true }
tokio = { workspace = true }
iron-learn = { workspace = true }
lancedb = { workspace = true }
tch = { workspace = true }
wasm-bindgen = { workspace = true }
web-sys = { workspace = true }
js-sys = { workspace = true }

[dependencies.getrandom]
version = "0.2"
features = ["js"]
EOF

echo "📦 Creating Cargo.toml for rust-client-wasm..."
cat > "$TARGET_DIR/src/rust-client-wasm/Cargo.toml" << 'EOF'
[package]
name = "rust-client-wasm"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = { workspace = true }
web-sys = { workspace = true }
js-sys = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }

[dependencies.getrandom]
version = "0.2"
features = ["js"]
EOF

echo "📦 Creating Cargo.toml for audiovisual engine..."
cat > "$TARGET_DIR/rust-foundation-audiovisual/Cargo.toml" << 'EOF'
[package]
name = "rust-foundation-audiovisual"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
nannou = { workspace = true }
wgpu = { workspace = true }
cpal = { workspace = true }
rustfft = { workspace = true }
glicol = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }

[target.'cfg(target_arch = "wasm32")'.dependencies]
wasm-bindgen = { workspace = true }
web-sys = { workspace = true }
js-sys = { workspace = true }
EOF

# Create README.md for Rust Foundation project
echo "📖 Creating Rust Foundation README..."
cat > "$TARGET_DIR/README.md" << 'EOF'
# Rust Foundation Creative Engine

A high-performance systems programming creative engine built with Rust, featuring advanced audio-visual synthesis, AI-powered biometric processing, and WebGPU-accelerated fractal generation.

## Features

- **Audio-Visual Synthesis**: Real-time audio processing and visual generation
- **WebGPU Acceleration**: Hardware-accelerated fractal and neural network computation
- **Biometric Integration**: AI-powered biometric signal processing
- **WASM Compatibility**: Browser-native execution with WebAssembly
- **Real-time Processing**: Low-latency audio and video processing
- **Advanced AI/ML**: Integration with Iron Learn and LanceDB for machine learning
- **Cross-Platform**: Native and web deployment capabilities

## Quick Start

### Prerequisites
- Rust 1.70+
- Node.js 16+ (for web deployment)
- WebGPU-compatible browser (Chrome/Edge 113+, Firefox Nightly)

### Installation
```bash
# Build all components
cargo build --release

# Build WASM for web
cargo build --target wasm32-unknown-unknown --release

# Run audio-visual demo
cd rust-foundation-audiovisual && cargo run --release
```

## Architecture

### Core Components

1. **Rust Client** (`src/rust-client/`)
   - AI blockchain integration
   - Biometric signal processing
   - Fractal pattern generation
   - Machine learning with Iron Learn
   - Vector database integration with LanceDB
   - WASM bindings for web deployment

2. **Audio-Visual Engine** (`rust-foundation-audiovisual/`)
   - Real-time audio synthesis with Glicol
   - WebGPU-accelerated fractal generation
   - Gesture and MIDI integration
   - Neural audio processing
   - Shader-based visual effects
   - Multi-modal biometric processing

3. **WASM Integration** (`src/rust-client-wasm/`)
   - Browser-native execution
   - JavaScript interoperability
   - WebGPU compute shaders
   - Real-time performance optimization

## Usage

### Basic Audio-Visual Engine
```rust
use rust_foundation_audiovisual::RealAudiovisualEngine;

let mut engine = RealAudiovisualEngine::new();
engine.initialize_audio()?;
engine.initialize_graphics()?;

// Process biometric data
let biometric_data = vec![0.5, 0.3, 0.8];
let fractal_params = engine.process_biometrics(biometric_data)?;

// Generate fractal visuals
let fractal_image = engine.generate_fractal(fractal_params)?;
```

### WASM Integration
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_biometric_web(data: &[f32]) -> Vec<f32> {
    let engine = rust_client::BiometricEngine::new();
    engine.process(data)
}
```

### WebGPU Compute
```rust
use wgpu::ComputePipeline;

let compute_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
    label: Some("Fractal Compute"),
    layout: Some(&pipeline_layout),
    module: &shader_module,
    entry_point: "main",
});
```

## Performance Features

- **Zero-copy processing**: Efficient memory management
- **SIMD optimization**: Vectorized computations
- **WebGPU compute**: GPU-accelerated fractals
- **Real-time audio**: Low-latency audio processing
- **WASM optimization**: Browser-native performance

## License
MIT
EOF

echo "✅ Rust Foundation grant extraction completed!"
echo "📊 Summary:"
echo "  - Core Rust integration files copied"
echo "  - Audio-visual engine extracted"
echo "  - WASM integration included"
echo "  - WebGPU compute functionality"
echo "  - Rust-specific Cargo.toml created"
echo "  - README.md with Rust-specific documentation"
echo ""
echo "🔍 Next steps:"
echo "  1. Navigate to $TARGET_DIR"
echo "  2. Run 'cargo build --release' to build all components"
echo "  3. Run 'cargo build --target wasm32-unknown-unknown' for web"
echo "  4. Test Rust integration functionality"
echo "  5. Push to GitHub repository"