//! # Music Integration Module
//!
//! This module integrates audio processing and music generation capabilities
//! using rodio for audio handling within the NFT blockchain interactive framework.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};

/// Configuration for music generation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MusicConfig {
    pub tempo: f32,
    pub key: String,
    pub scale: String,
    pub complexity: f32,
    pub emotional_mapping: EmotionalMusicMapping,
}

impl Default for MusicConfig {
    fn default() -> Self {
        Self {
            tempo: 120.0,
            key: "C".to_string(),
            scale: "major".to_string(),
            complexity: 0.5,
            emotional_mapping: EmotionalMusicMapping::default(),
        }
    }
}

/// Mapping of emotions to musical parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionalMusicMapping {
    pub valence_to_key: HashMap<String, String>,
    pub arousal_to_tempo: HashMap<String, f32>,
    pub dominance_to_complexity: HashMap<String, f32>,
}

impl Default for EmotionalMusicMapping {
    fn default() -> Self {
        let mut valence_to_key = HashMap::new();
        valence_to_key.insert("happy".to_string(), "C".to_string());
        valence_to_key.insert("sad".to_string(), "A".to_string());
        valence_to_key.insert("excited".to_string(), "G".to_string());
        valence_to_key.insert("calm".to_string(), "F".to_string());

        let mut arousal_to_tempo = HashMap::new();
        arousal_to_tempo.insert("low".to_string(), 60.0);
        arousal_to_tempo.insert("medium".to_string(), 120.0);
        arousal_to_tempo.insert("high".to_string(), 180.0);

        let mut dominance_to_complexity = HashMap::new();
        dominance_to_complexity.insert("simple".to_string(), 0.3);
        dominance_to_complexity.insert("moderate".to_string(), 0.6);
        dominance_to_complexity.insert("complex".to_string(), 0.9);

        Self {
            valence_to_key,
            arousal_to_tempo,
            dominance_to_complexity,
        }
    }
}

/// Generated music data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneratedMusic {
    pub id: String,
    pub timestamp: DateTime<Utc>,
    pub config: MusicConfig,
    pub emotional_input: EmotionalInput,
    pub audio_data: Vec<u8>,
    pub metadata: HashMap<String, serde_json::Value>,
}

/// Emotional input for music generation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionalInput {
    pub valence: f32,    // -1.0 to 1.0 (negative to positive)
    pub arousal: f32,    // 0.0 to 1.0 (calm to excited)
    pub dominance: f32,  // 0.0 to 1.0 (submissive to dominant)
}

/// Music generation engine
pub struct MusicEngine {
    config: MusicConfig,
}

impl MusicEngine {
    /// Create a new music engine with default configuration
    pub fn new() -> Self {
        Self {
            config: MusicConfig::default(),
        }
    }

    /// Create a new music engine with custom configuration
    pub fn with_config(config: MusicConfig) -> Self {
        Self { config }
    }

    /// Generate music based on emotional input
    pub fn generate_music_from_emotion(&self, emotional_input: EmotionalInput) -> Result<GeneratedMusic, Box<dyn std::error::Error>> {
        // Map emotions to musical parameters
        let tempo = self.map_arousal_to_tempo(emotional_input.arousal);
        let key = self.map_valence_to_key(emotional_input.valence);
        let complexity = self.map_dominance_to_complexity(emotional_input.dominance);

        // Create music configuration based on emotional input
        let mut config = self.config.clone();
        config.tempo = tempo;
        config.key = key;
        config.complexity = complexity;

        // Generate audio data (placeholder - would use tunes crate in real implementation)
        let audio_data = self.generate_audio_data(&config)?;

        let generated_music = GeneratedMusic {
            id: uuid::Uuid::new_v4().to_string(),
            timestamp: Utc::now(),
            config,
            emotional_input,
            audio_data,
            metadata: self.create_metadata(&emotional_input),
        };

        Ok(generated_music)
    }

    /// Map emotional valence to musical key
    fn map_valence_to_key(&self, valence: f32) -> String {
        let valence_clamped = valence.clamp(-1.0, 1.0);
        
        if valence_clamped > 0.5 {
            "C".to_string() // Happy, positive
        } else if valence_clamped > 0.0 {
            "G".to_string() // Mildly positive
        } else if valence_clamped > -0.5 {
            "A".to_string() // Mildly negative
        } else {
            "D".to_string() // Sad, negative
        }
    }

    /// Map emotional arousal to tempo
    fn map_arousal_to_tempo(&self, arousal: f32) -> f32 {
        let arousal_clamped = arousal.clamp(0.0, 1.0);
        // Map arousal to tempo range (60-180 BPM)
        60.0 + (arousal_clamped * 120.0)
    }

    /// Map emotional dominance to complexity
    fn map_dominance_to_complexity(&self, dominance: f32) -> f32 {
        let dominance_clamped = dominance.clamp(0.0, 1.0);
        dominance_clamped // Direct mapping for now
    }

    /// Generate audio data (placeholder implementation)
    fn generate_audio_data(&self, config: &MusicConfig) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        // This would integrate with the actual tunes crate
        // For now, generate placeholder audio data
        let sample_rate = 44100;
        let duration_seconds = 30; // 30 seconds of audio
        let total_samples = sample_rate * duration_seconds;
        
        // Generate simple sine wave based on tempo and key
        let frequency = self.key_to_frequency(&config.key);
        let mut audio_data = Vec::with_capacity(total_samples * 2); // 16-bit audio

        for i in 0..total_samples {
            let t = i as f32 / sample_rate as f32;
            let sample = (t * frequency * 2.0 * std::f32::consts::PI).sin();
            let sample_i16 = (sample * 32767.0) as i16;
            audio_data.extend_from_slice(&sample_i16.to_le_bytes());
        }

        Ok(audio_data)
    }

    /// Convert musical key to frequency (simplified)
    fn key_to_frequency(&self, key: &str) -> f32 {
        match key {
            "C" => 261.63, // Middle C
            "G" => 392.00, // G4
            "A" => 440.00, // A4
            "D" => 293.66, // D4
            _ => 440.00,   // Default to A4
        }
    }

    /// Create metadata for the generated music
    fn create_metadata(&self, emotional_input: &EmotionalInput) -> HashMap<String, serde_json::Value> {
        let mut metadata = HashMap::new();
        metadata.insert("emotional_category".to_string(), serde_json::json!(self.categorize_emotion(emotional_input)));
        metadata.insert("generation_method".to_string(), serde_json::json!("emotion_based"));
        metadata.insert("audio_format".to_string(), serde_json::json!("raw_16bit_pcm"));
        metadata.insert("sample_rate".to_string(), serde_json::json!(44100));
        metadata
    }

    /// Categorize emotional input
    fn categorize_emotion(&self, emotional_input: &EmotionalInput) -> String {
        let valence = emotional_input.valence;
        let arousal = emotional_input.arousal;

        match (valence > 0.0, arousal > 0.5) {
            (true, true) => "excited".to_string(),
            (true, false) => "happy".to_string(),
            (false, true) => "anxious".to_string(),
            (false, false) => "calm".to_string(),
        }
    }

    /// Generate music for a creative session
    pub fn generate_session_music(&self, session_emotions: &[EmotionalInput]) -> Result<Vec<GeneratedMusic>, Box<dyn std::error::Error>> {
        let mut generated_tracks = Vec::new();

        for emotion in session_emotions {
            let track = self.generate_music_from_emotion(emotion.clone())?;
            generated_tracks.push(track);
        }

        Ok(generated_tracks)
    }
}

impl Default for MusicEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Integration function for the main creative session
pub fn integrate_music_with_emotions(emotional_data: &crate::EmotionalData) -> Result<GeneratedMusic, Box<dyn std::error::Error>> {
    let engine = MusicEngine::new();
    
    let emotional_input = EmotionalInput {
        valence: emotional_data.valence,
        arousal: emotional_data.arousal,
        dominance: emotional_data.dominance,
    };

    engine.generate_music_from_emotion(emotional_input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_music_engine_creation() {
        let engine = MusicEngine::new();
        assert_eq!(engine.config.tempo, 120.0);
    }

    #[test]
    fn test_emotion_mapping() {
        let engine = MusicEngine::new();
        
        let emotional_input = EmotionalInput {
            valence: 0.8,
            arousal: 0.9,
            dominance: 0.7,
        };

        let result = engine.generate_music_from_emotion(emotional_input);
        assert!(result.is_ok());
        
        let music = result.unwrap();
        assert_eq!(music.config.tempo > 150.0, true); // High arousal = high tempo
        assert_eq!(music.config.key, "C"); // High valence = C key
    }

    #[test]
    fn test_emotion_categorization() {
        let engine = MusicEngine::new();
        
        let excited = EmotionalInput { valence: 0.8, arousal: 0.9, dominance: 0.7 };
        let happy = EmotionalInput { valence: 0.7, arousal: 0.3, dominance: 0.6 };
        let anxious = EmotionalInput { valence: -0.6, arousal: 0.8, dominance: 0.4 };
        let calm = EmotionalInput { valence: 0.1, arousal: 0.2, dominance: 0.5 };

        assert_eq!(engine.categorize_emotion(&excited), "excited");
        assert_eq!(engine.categorize_emotion(&happy), "happy");
        assert_eq!(engine.categorize_emotion(&anxious), "anxious");
        assert_eq!(engine.categorize_emotion(&calm), "calm");
    }
}