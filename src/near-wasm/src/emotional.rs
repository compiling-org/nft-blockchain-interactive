//! Emotional data structures for interactive NFTs

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::Timestamp;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct EmotionalData {
    pub timestamp: Timestamp,
    pub valence: f32,      // pleasure vs displeasure (-1.0 to 1.0)
    pub arousal: f32,      // calm vs excited (0.0 to 1.0)
    pub dominance: f32,    // controlled vs in-control (0.0 to 1.0)
    pub confidence: f32,   // certainty of emotional state (0.0 to 1.0)
    pub raw_vector: Vec<f32>,
    pub emotional_vector: EmotionalVector,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct EmotionalVector {
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
}

impl EmotionalData {
    pub fn new() -> Self {
        Self {
            timestamp: near_sdk::env::block_timestamp(),
            valence: 0.0,
            arousal: 0.5,
            dominance: 0.5,
            confidence: 0.8,
            raw_vector: vec![],
            emotional_vector: EmotionalVector {
                valence: 0.0,
                arousal: 0.5,
                dominance: 0.5,
            },
        }
    }
    
    pub fn from_vector(raw_vector: Vec<f32>) -> Self {
        // Simple emotion detection from raw vector
        // In practice, this would use a more sophisticated model
        let valence = if raw_vector.len() > 0 { raw_vector[0].clamp(-1.0, 1.0) } else { 0.0 };
        let arousal = if raw_vector.len() > 1 { raw_vector[1].clamp(0.0, 1.0) } else { 0.5 };
        let dominance = if raw_vector.len() > 2 { raw_vector[2].clamp(0.0, 1.0) } else { 0.5 };
        
        Self {
            timestamp: near_sdk::env::block_timestamp(),
            valence,
            arousal,
            dominance,
            confidence: 0.8,
            raw_vector,
            emotional_vector: EmotionalVector {
                valence,
                arousal,
                dominance,
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_emotional_data_creation() {
        let emotion = EmotionalData::new();
        assert_eq!(emotion.valence, 0.0);
        assert_eq!(emotion.arousal, 0.5);
        assert_eq!(emotion.dominance, 0.5);
    }

    #[test]
    fn test_emotional_data_from_vector() {
        let raw_vector = vec![0.8, 0.9, 0.5];
        let emotion = EmotionalData::from_vector(raw_vector.clone());
        assert_eq!(emotion.raw_vector, raw_vector);
        assert_eq!(emotion.valence, 0.8);
        assert_eq!(emotion.arousal, 0.9);
        assert_eq!(emotion.dominance, 0.5);
    }

    #[test]
    fn test_emotional_vector_creation() {
        let vector = EmotionalVector {
            valence: 0.5,
            arousal: 0.6,
            dominance: 0.7,
        };
        assert_eq!(vector.valence, 0.5);
        assert_eq!(vector.arousal, 0.6);
        assert_eq!(vector.dominance, 0.7);
    }
}