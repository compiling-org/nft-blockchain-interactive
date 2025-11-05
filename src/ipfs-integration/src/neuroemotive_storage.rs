//! Neuroemotive AI Storage - IPFS integration for emotional data and AI outputs
//! 
//! Handles storage of emotional vectors, AI model outputs, and Stream Diffusion results

use crate::ipfs_client::IpfsClient;
use serde::{Deserialize, Serialize};
use std::error::Error;

/// Neuroemotive session data
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NeuroemotiveSession {
    pub session_id: String,
    pub participant_id: String,
    pub start_time: u64,
    pub end_time: Option<u64>,
    pub emotional_trajectory: Vec<EmotionalDataPoint>,
    pub ai_generations: Vec<AIGenerationRecord>,
    pub session_metadata: SessionMetadata,
}

/// Single emotional data point
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalDataPoint {
    pub timestamp: u64,
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
    pub confidence: f32,
    pub source: String,
    pub raw_data: Option<Vec<f32>>,
}

/// AI generation record
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AIGenerationRecord {
    pub generation_id: String,
    pub timestamp: u64,
    pub model_name: String,
    pub model_type: AIModelType,
    pub emotional_conditioning: EmotionalVector,
    pub prompt: String,
    pub result_cid: String,
    pub generation_params: GenerationParams,
}

/// Type of AI model
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum AIModelType {
    StreamDiffusion,
    StableDiffusion,
    MusicGeneration,
    TextGeneration,
    EmotionalClassifier,
    Custom(String),
}

/// Emotional vector (compressed)
#[derive(Serialize, Deserialize, Clone, Debug, Copy)]
pub struct EmotionalVector {
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
}

/// Generation parameters
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GenerationParams {
    pub seed: Option<u64>,
    pub steps: u32,
    pub guidance_scale: f32,
    pub negative_prompt: Option<String>,
    pub custom_params: std::collections::HashMap<String, String>,
}

/// Session metadata
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SessionMetadata {
    pub session_type: String,
    pub environment: String,
    pub sensors_used: Vec<String>,
    pub participants: u32,
    pub tags: Vec<String>,
}

/// Stream Diffusion output bundle
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StreamDiffusionBundle {
    pub session_id: String,
    pub frames: Vec<DiffusionFrame>,
    pub config: StreamConfig,
    pub performance_data: StreamPerformance,
}

/// Single diffusion frame
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DiffusionFrame {
    pub frame_number: u64,
    pub timestamp: u64,
    pub image_cid: String,
    pub emotional_state: EmotionalVector,
    pub prompt: String,
    pub inference_time_ms: u32,
}

/// Stream configuration
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StreamConfig {
    pub model: String,
    pub target_fps: u8,
    pub resolution: (u32, u32),
    pub quality_preset: String,
}

/// Stream performance metrics
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StreamPerformance {
    pub avg_fps: f32,
    pub avg_inference_ms: f32,
    pub total_frames: u64,
    pub dropped_frames: u32,
    pub session_duration_seconds: f32,
}

impl NeuroemotiveSession {
    /// Create new session
    pub fn new(session_id: String, participant_id: String) -> Self {
        Self {
            session_id,
            participant_id,
            start_time: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            end_time: None,
            emotional_trajectory: Vec::new(),
            ai_generations: Vec::new(),
            session_metadata: SessionMetadata {
                session_type: String::new(),
                environment: String::new(),
                sensors_used: Vec::new(),
                participants: 1,
                tags: Vec::new(),
            },
        }
    }

    /// Add emotional data point
    pub fn add_emotional_data(&mut self, data: EmotionalDataPoint) {
        self.emotional_trajectory.push(data);
    }

    /// Add AI generation record
    pub fn add_generation(&mut self, generation: AIGenerationRecord) {
        self.ai_generations.push(generation);
    }

    /// Finalize session
    pub fn finalize(&mut self) {
        self.end_time = Some(
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        );
    }

    /// Calculate average emotional state
    pub fn average_emotion(&self) -> Option<EmotionalVector> {
        if self.emotional_trajectory.is_empty() {
            return None;
        }

        let sum: (f32, f32, f32) = self.emotional_trajectory.iter()
            .fold((0.0, 0.0, 0.0), |(v, a, d), point| {
                (v + point.valence, a + point.arousal, d + point.dominance)
            });

        let count = self.emotional_trajectory.len() as f32;
        Some(EmotionalVector {
            valence: sum.0 / count,
            arousal: sum.1 / count,
            dominance: sum.2 / count,
        })
    }

    /// Store session to IPFS
    pub async fn store_to_ipfs(&self, client: &IpfsClient) -> Result<String, Box<dyn Error>> {
        let json = serde_json::to_string_pretty(self)?;
        client.add_json(&json).await
    }
}

impl StreamDiffusionBundle {
    /// Create new bundle
    pub fn new(session_id: String, config: StreamConfig) -> Self {
        Self {
            session_id,
            frames: Vec::new(),
            config,
            performance_data: StreamPerformance {
                avg_fps: 0.0,
                avg_inference_ms: 0.0,
                total_frames: 0,
                dropped_frames: 0,
                session_duration_seconds: 0.0,
            },
        }
    }

    /// Add frame to bundle
    pub fn add_frame(&mut self, frame: DiffusionFrame) {
        self.frames.push(frame);
        self.performance_data.total_frames = self.frames.len() as u64;
    }

    /// Store bundle to IPFS
    pub async fn store_to_ipfs(&self, client: &IpfsClient) -> Result<String, Box<dyn Error>> {
        let json = serde_json::to_string_pretty(self)?;
        client.add_json(&json).await
    }

    /// Estimate storage size
    pub fn estimated_size_mb(&self) -> f64 {
        // Estimate based on frame count and resolution
        let pixels_per_frame = (self.config.resolution.0 * self.config.resolution.1) as f64;
        let bytes_per_pixel = 3.0; // Assuming RGB
        let compression_ratio = 0.1; // Assuming 10:1 compression
        
        let frame_size_mb = (pixels_per_frame * bytes_per_pixel * compression_ratio) / (1024.0 * 1024.0);
        frame_size_mb * self.frames.len() as f64
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_neuroemotive_session_creation() {
        let session = NeuroemotiveSession::new(
            "session_001".to_string(),
            "participant_001".to_string(),
        );

        assert_eq!(session.session_id, "session_001");
        assert!(session.emotional_trajectory.is_empty());
    }

    #[test]
    fn test_add_emotional_data() {
        let mut session = NeuroemotiveSession::new(
            "test".to_string(),
            "participant".to_string(),
        );

        session.add_emotional_data(EmotionalDataPoint {
            timestamp: 12345,
            valence: 0.5,
            arousal: 0.7,
            dominance: 0.3,
            confidence: 0.9,
            source: "EEG".to_string(),
            raw_data: None,
        });

        assert_eq!(session.emotional_trajectory.len(), 1);
    }

    #[test]
    fn test_stream_bundle_size_estimation() {
        let config = StreamConfig {
            model: "sdxl-turbo".to_string(),
            target_fps: 30,
            resolution: (512, 512),
            quality_preset: "balanced".to_string(),
        };

        let mut bundle = StreamDiffusionBundle::new("session".to_string(), config);

        for i in 0..10 {
            bundle.add_frame(DiffusionFrame {
                frame_number: i,
                timestamp: 12345 + i * 33,
                image_cid: format!("Qm{}", i),
                emotional_state: EmotionalVector {
                    valence: 0.5,
                    arousal: 0.5,
                    dominance: 0.5,
                },
                prompt: "test".to_string(),
                inference_time_ms: 33,
            });
        }

        let size = bundle.estimated_size_mb();
        assert!(size > 0.0);
    }
}
