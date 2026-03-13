//! Rust Foundation Audiovisual Creative System
//! WASM-compiled audiovisual system using real extracted code from reference projects

use wasm_bindgen::prelude::*;
use web_sys::WebGlRenderingContext;
use serde::Serialize;

// Re-export the substantial extracted components
mod audio;
mod shader_renderer;

pub use audio::*;
pub use shader_renderer::*;

/// Main audiovisual engine combining extracted components
#[wasm_bindgen]
pub struct AudiovisualEngine {
    music_engine: MusicEngine,
    shader_renderer: ShaderRenderer,
    audio_analyzer: AudioAnalyzer,
    time: f32,
}

#[wasm_bindgen]
impl AudiovisualEngine {
    /// Create new audiovisual engine
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str) -> Result<AudiovisualEngine, JsValue> {
        let document = web_sys::window()
            .ok_or("No window")?
            .document()
            .ok_or("No document")?;

        let canvas = document
            .get_element_by_id(canvas_id)
            .ok_or("Canvas not found")?
            .dyn_into::<web_sys::HtmlCanvasElement>()?;

        let gl = canvas
            .get_context("webgl")?
            .ok_or("WebGL not supported")?
            .dyn_into::<WebGlRenderingContext>()?;

        // Initialize music engine with extracted Modurust code
        let music_engine = MusicEngine::new()?;

        // Initialize shader renderer with extracted Shader Studio code
        let shader_renderer = ShaderRenderer::new(gl)?;

        // Initialize audio analyzer with extracted code
        let audio_analyzer = AudioAnalyzer::new(2048);

        Ok(AudiovisualEngine {
            music_engine,
            shader_renderer,
            audio_analyzer,
            time: 0.0,
        })
    }

    /// Load fractal shader from extracted code
    #[wasm_bindgen]
    pub fn load_fractal_shader(&mut self, shader_type: &str) -> Result<(), JsValue> {
        self.shader_renderer.load_preset(shader_type)
    }

    /// Generate music from emotional parameters (extracted from Modurust)
    #[wasm_bindgen]
    pub fn generate_music_from_emotion(&mut self, valence: f32, arousal: f32, dominance: f32) -> Result<(), JsValue> {
        self.music_engine.generate_music_from_emotion(valence, arousal, dominance)
    }

    /// Analyze audio data (extracted from Modurust)
    #[wasm_bindgen]
    pub fn analyze_audio(&mut self, audio_data: Vec<f32>) -> Result<(), JsValue> {
        self.audio_analyzer.analyze(&audio_data);
        
        // Update shader with audio data
        let bands = self.audio_analyzer.get_frequency_bands();
        self.shader_renderer.update_audio_bands(bands);
        
        Ok(())
    }

    /// Render frame with extracted shader system
    #[wasm_bindgen]
    pub fn update_audio_bands(&mut self, bands: Vec<f32>) {
        self.shader_renderer.update_audio_bands(bands);
    }

    #[wasm_bindgen]
    pub fn render(&mut self, delta_time: f32) -> Result<(), JsValue> {
        self.time += delta_time;
        
        // Update shader renderer time
        self.shader_renderer.update_time(delta_time);
        
        // Render with extracted shader renderer
        self.shader_renderer.render()?;
        
        Ok(())
    }

    /// Get current audio metrics
    #[wasm_bindgen]
    pub fn get_audio_metrics(&self) -> Result<JsValue, JsValue> {
        self.music_engine.get_audio_metrics()
    }

    /// Update resolution
    #[wasm_bindgen]
    pub fn update_resolution(&mut self, width: f32, height: f32) {
        self.shader_renderer.update_resolution(width, height);
    }

    /// Update mouse position
    #[wasm_bindgen]
    pub fn update_mouse(&mut self, x: f32, y: f32) {
        self.shader_renderer.update_mouse(x, y);
    }

    /// Stop all audio
    #[wasm_bindgen]
    pub fn stop_audio(&mut self) {
        self.music_engine.stop();
    }

    /// Get available shader presets
    #[wasm_bindgen]
    pub fn get_shader_presets() -> Vec<String> {
        ShaderRenderer::get_presets()
    }

    /// Generate waveform (extracted from Modurust)
    #[wasm_bindgen]
    pub fn generate_waveform(wave_type: &str, frequency: f32, sample_rate: f32, duration: f32) -> Vec<f32> {
        generate_waveform(wave_type, frequency, sample_rate, duration)
    }

    /// Convert MIDI note to frequency (extracted from Modurust)
    #[wasm_bindgen]
    pub fn note_to_frequency(note: u8) -> f32 {
        note_to_frequency(note)
    }

    /// Convert frequency to MIDI note (extracted from Modurust)
    #[wasm_bindgen]
    pub fn frequency_to_note(frequency: f32) -> u8 {
        frequency_to_note(frequency)
    }
    
    #[wasm_bindgen]
    pub fn update_emotion(&mut self, valence: f32, arousal: f32, dominance: f32) {
        self.shader_renderer.set_emotion(valence, arousal, dominance);
    }
    
    #[wasm_bindgen]
    pub fn get_current_preset(&self) -> String {
        self.shader_renderer.get_current_preset()
    }
    
    #[wasm_bindgen]
    pub fn generate_nft_metadata(&self, name: &str, description: &str) -> String {
        #[derive(Serialize)]
        struct Metadata {
            name: String,
            description: String,
            preset: String,
            time: f32,
            audio_bands: Vec<f32>,
            metrics: Vec<f32>,
            emotion: Vec<f32>,
            attributes: Vec<Attribute>,
        }
        
        #[derive(Serialize)]
        struct Attribute {
            trait_type: String,
            value: String,
        }
        
        let preset = self.shader_renderer.get_current_preset();
        let bands = self.audio_analyzer.get_frequency_bands();
        let metrics = self.audio_analyzer.get_metrics();
        let emotion = self.shader_renderer.get_emotion();
        
        let m = Metadata {
            name: name.to_string(),
            description: description.to_string(),
            preset: preset.clone(),
            time: self.time,
            audio_bands: bands,
            metrics,
            emotion: emotion.clone(),
            attributes: vec![
                Attribute { trait_type: "preset".to_string(), value: preset.clone() },
                Attribute { trait_type: "emotion_valence".to_string(), value: format!("{:.3}", emotion.get(0).cloned().unwrap_or(0.0)) },
                Attribute { trait_type: "emotion_arousal".to_string(), value: format!("{:.3}", emotion.get(1).cloned().unwrap_or(0.0)) },
                Attribute { trait_type: "emotion_dominance".to_string(), value: format!("{:.3}", emotion.get(2).cloned().unwrap_or(0.0)) },
            ],
        };
        serde_json::to_string(&m).unwrap_or_else(|_| "{}".to_string())
    }
    
    #[wasm_bindgen]
    pub fn generate_nft_metadata_with(&self, name: &str, description: &str, image_url: &str, animation_url: &str) -> String {
        #[derive(Serialize)]
        struct Metadata {
            name: String,
            description: String,
            preset: String,
            time: f32,
            audio_bands: Vec<f32>,
            metrics: Vec<f32>,
            emotion: Vec<f32>,
            image: String,
            animation_url: String,
            attributes: Vec<Attribute>,
        }
        
        #[derive(Serialize)]
        struct Attribute {
            trait_type: String,
            value: String,
        }
        
        let preset = self.shader_renderer.get_current_preset();
        let bands = self.audio_analyzer.get_frequency_bands();
        let metrics = self.audio_analyzer.get_metrics();
        let emotion = self.shader_renderer.get_emotion();
        
        let m = Metadata {
            name: name.to_string(),
            description: description.to_string(),
            preset,
            time: self.time,
            audio_bands: bands,
            metrics,
            emotion: emotion.clone(),
            image: image_url.to_string(),
            animation_url: animation_url.to_string(),
            attributes: vec![
                Attribute { trait_type: "preset".to_string(), value: self.shader_renderer.get_current_preset() },
                Attribute { trait_type: "emotion_valence".to_string(), value: format!("{:.3}", emotion.get(0).cloned().unwrap_or(0.0)) },
                Attribute { trait_type: "emotion_arousal".to_string(), value: format!("{:.3}", emotion.get(1).cloned().unwrap_or(0.0)) },
                Attribute { trait_type: "emotion_dominance".to_string(), value: format!("{:.3}", emotion.get(2).cloned().unwrap_or(0.0)) },
            ],
        };
        serde_json::to_string(&m).unwrap_or_else(|_| "{}".to_string())
    }
}

/// Initialize the audiovisual system
#[wasm_bindgen]
pub fn init_audiovisual(canvas_id: &str) -> Result<AudiovisualEngine, JsValue> {
    AudiovisualEngine::new(canvas_id)
}

/// Generate random value for testing (real implementation)
#[wasm_bindgen]
pub fn generate_random() -> f32 {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let mut hasher = DefaultHasher::new();
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos().hash(&mut hasher);
    hasher.finish() as f32 / u64::MAX as f32
}

/// Generate random gesture parameters for testing
#[wasm_bindgen]
pub fn generate_gesture_params() -> Vec<f32> {
    vec![
        generate_random(), // x
        generate_random(), // y  
        generate_random(), // pressure
        generate_random(), // velocity
    ]
}

/// Get version information
#[wasm_bindgen]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Get build information
#[wasm_bindgen]
pub fn get_build_info() -> String {
    format!("Rust Foundation Audiovisual System v{}", get_version())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn presets_available() {
        let presets = ShaderRenderer::get_presets();
        assert!(!presets.is_empty());
    }
    #[test]
    fn midi_conversion_roundtrip() {
        let note = 69u8;
        let freq = note_to_frequency(note);
        let back = frequency_to_note(freq);
        assert_eq!(back, note);
    }
    #[test]
    fn waveform_length() {
        let samples = generate_waveform("sine", 440.0, 48000.0, 0.5);
        assert_eq!(samples.len(), (48000.0 * 0.5) as usize);
    }
}
