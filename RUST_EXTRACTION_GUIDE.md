# Rust Foundation Creative Engine - Code Extraction Guide

## Overview
This document provides precise instructions for extracting ONLY the Rust-specific code from the main blockchain-nft-interactive project for the Rust Foundation grant repository.

## Critical Extraction Rules
1. **ONLY copy Rust-specific files** - DO NOT copy the entire main project
2. **Maintain proper directory structure** - Follow Rust project conventions
3. **Include all dependencies** - Ensure Cargo.toml includes necessary Rust crates
4. **Test functionality** - Verify all copied code works correctly

## Files to Extract

### Core Rust Integration Files
```
src/rust-client/src/lib.rs                      # Main Rust client library
src/rust-client/src/ai_blockchain_integration.rs # AI blockchain integration
src/rust-client/src/ai_fractal_integration.rs  # AI fractal integration
src/rust-client/src/comprehensive_integration.rs # Comprehensive integration
```

### Rust Audio-Visual Engine
```
rust-foundation-audiovisual/src/lib.rs                          # Main audiovisual engine
rust-foundation-audiovisual/src/audio.rs                        # Audio processing
rust-foundation-audiovisual/src/audio_analysis.rs              # Audio analysis
rust-foundation-audiovisual/src/audio_system.rs                 # Audio system
rust-foundation-audiovisual/src/fractal_engine.rs               # Fractal engine
rust-foundation-audiovisual/src/fractal_types.rs               # Fractal types
rust-foundation-audiovisual/src/gesture_midi_integration.rs    # Gesture MIDI integration
rust-foundation-audiovisual/src/glicol_integration.rs        # Glicol integration
rust-foundation-audiovisual/src/real_audiovisual_engine.rs    # Real audiovisual engine
rust-foundation-audiovisual/src/real_audiovisual_system.rs     # Real audiovisual system
rust-foundation-audiovisual/src/shader_renderer.rs            # Shader renderer
rust-foundation-audiovisual/src/synthesis.rs                   # Audio synthesis
rust-foundation-audiovisual/src/ui.rs                          # User interface
rust-foundation-audiovisual/src/wgpu_compute.rs               # WebGPU compute
```

### Rust WASM Integration
```
src/rust-client-wasm/src/lib.rs              # WASM bindings
```

### Supporting Files
```
src/utils/unified-ai-ml-integration.js      # AI/ML bridge (shared dependency)
src/utils/hybrid-ai-architecture.js        # Hybrid AI architecture
```

### Configuration Files
```
Cargo.toml                                   # Rust workspace configuration
```

## Rust-Specific Dependencies
The Cargo.toml must include these Rust-specific crates:
```toml
[dependencies]
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
```

## Directory Structure for Rust Foundation Grant Repository
```
rust-creative-engine/
├── src/
│   ├── rust-client/
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── ai_blockchain_integration.rs
│   │       ├── ai_fractal_integration.rs
│   │       ├── comprehensive_integration.rs
│   │       ├── enhanced_biometric_engine.rs
│   │       ├── enhanced_soulbound.rs
│   │       ├── enhanced_webgpu_engine.rs
│   │       ├── gpu_compute_engine.rs
│   │       ├── gpu_engine_v2.rs
│   │       ├── input_processor.rs
│   │       ├── iron_learn_integration.rs
│   │       ├── lancedb_integration.rs
│   │       ├── leap_motion_integration.rs
│   │       ├── lib.rs
│   │       ├── lib_simple.rs
│   │       ├── mediapipe_integration.rs
│   │       ├── multifusion_integration.rs
│   │       ├── music_integration.rs
│   │       ├── real_ai_inference.rs
│   │       ├── real_ai_integration.rs
│   │       ├── simple_blockchain.rs
│   │       ├── simple_webgpu.rs
│   │       ├── wasm_getrandom.rs
│   │       ├── wasm_rng.rs
│   │       ├── webgpu_engine.rs
n│   │       └── wgsl_studio.rs
│   ├── rust-client-wasm/
│   │   └── src/
│   │       └── lib.rs
│   └── utils/
│       ├── unified-ai-ml-integration.js
│       └── hybrid-ai-architecture.js
├── rust-foundation-audiovisual/
│   ├── src/
│   │   ├── audio.rs
│   │   ├── audio_analysis.rs
│   │   ├── audio_system.rs
│   │   ├── fractal_engine.rs
│   │   ├── fractal_types.rs
│   │   ├── gesture_midi_integration.rs
│   │   ├── glicol_integration.rs
│   │   ├── lib.rs
│   │   ├── midi_handler.rs
│   │   ├── real_audiovisual_engine.rs
│   │   ├── real_audiovisual_system.rs
│   │   ├── shader_renderer.rs
│   │   ├── synthesis.rs
│   │   ├── ui.rs
│   │   └── wgpu_compute.rs
│   ├── Cargo.toml
│   ├── demo-extracted.html
│   ├── test-complete-system.html
│   └── test-gesture-midi-simple.html
├── Cargo.toml
└── README.md
```

## Testing Instructions
1. Verify Rust compilation: `cargo build --release`
2. Test audio-visual engine: Run demo applications
3. Validate AI/ML integration: Ensure biometric processing works
4. Test WASM bindings: Verify browser compatibility
5. Test WebGPU compute: Ensure GPU acceleration works

## Deployment Checklist
- [ ] All Rust crates compile successfully
- [ ] Audio-visual engine functions correctly
- [ ] AI/ML biometric processing works
- [ ] WASM bindings operate properly in browser
- [ ] WebGPU compute acceleration functions
- [ ] All dependencies properly installed

## Critical Reminders
- **DO NOT** copy non-Rust files (JavaScript-only components)
- **DO NOT** copy the entire main project structure
- **ONLY** extract Rust-specific functionality
- **VERIFY** all copied code is Rust-related
- **TEST** functionality after extraction