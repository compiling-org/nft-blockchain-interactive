//! Emotional data structures for interactive NFTs

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    pub fn new(raw_vector: Vec<f32>) -> Self {
        // Simple emotion detection from raw vector
        // In practice, this would use ML models
        let valence = raw_vector.get(0).copied().unwrap_or(0.0).clamp(-1.0, 1.0);
        let arousal = raw_vector.get(1).copied().unwrap_or(0.0).clamp(0.0, 1.0);
        let dominance = raw_vector.get(2).copied().unwrap_or(0.0).clamp(0.0, 1.0);

        Self {
            timestamp: near_sdk::env::block_timestamp(),
            valence,
            arousal,
            dominance,
            confidence: 0.8, // Default confidence
            raw_vector: raw_vector.clone(),
            emotional_vector: EmotionalVector {
                valence,
                arousal,
                dominance,
            },
        }
    }

    pub fn update_from_interaction(&mut self, interaction_type: &str, intensity: f32) {
        match interaction_type {
            "love" | "favorite" => {
                self.valence += intensity * 0.1;
                self.arousal += intensity * 0.05;
            }
            "anger" | "dislike" => {
                self.valence -= intensity * 0.1;
                self.arousal += intensity * 0.08;
            }
            "calm" | "soothe" => {
                self.arousal -= intensity * 0.05;
                self.dominance += intensity * 0.03;
            }
            "excite" | "energize" => {
                self.arousal += intensity * 0.1;
                self.dominance += intensity * 0.05;
            }
            _ => {}
        }

        // Clamp values
        self.valence = self.valence.clamp(-1.0, 1.0);
        self.arousal = self.arousal.clamp(0.0, 1.0);
        self.dominance = self.dominance.clamp(0.0, 1.0);
        self.emotional_vector = EmotionalVector {
            valence: self.valence,
            arousal: self.arousal,
            dominance: self.dominance,
        };
    }

    pub fn get_mood_description(&self) -> String {
        match (self.valence, self.arousal, self.dominance) {
            (v, a, d) if v > 0.5 && a > 0.7 => "ecstatic",
            (v, a, d) if v > 0.3 && a > 0.5 => "happy",
            (v, a, d) if v < -0.3 && a > 0.5 => "angry",
            (v, a, d) if v < -0.5 && a < 0.3 => "sad",
            (v, a, d) if a < 0.3 => "calm",
            _ => "neutral",
        }.to_string()
    }

    pub fn get_creativity_index(&self) -> f32 {
        // Creativity correlates with moderate arousal and positive valence
        let arousal_factor = if self.arousal > 0.3 && self.arousal < 0.8 { 1.0 } else { 0.5 };
        let valence_factor = (self.valence + 1.0) / 2.0; // Convert to 0-1 range
        let dominance_factor = self.dominance;

        (arousal_factor * valence_factor * dominance_factor).clamp(0.0, 1.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_emotional_data_creation() {
        let raw_vector = vec![0.5, 0.7, 0.3];
        let emotion = EmotionalData::new(raw_vector.clone());

        assert_eq!(emotion.valence, 0.5);
        assert_eq!(emotion.arousal, 0.7);
        assert_eq!(emotion.dominance, 0.3);
        assert_eq!(emotion.raw_vector, raw_vector);
    }

    #[test]
    fn test_emotion_update() {
        let mut emotion = EmotionalData::new(vec![0.0, 0.5, 0.5]);

        emotion.update_from_interaction("love", 1.0);

        assert!(emotion.valence > 0.0);
        assert!(emotion.arousal > 0.5);
    }

    #[test]
    fn test_mood_description() {
        let happy_emotion = EmotionalData::new(vec![0.8, 0.9, 0.5]);
        let mood = happy_emotion.get_mood_description();
        assert_eq!(mood, "ecstatic");

        let calm_emotion = EmotionalData::new(vec![0.0, 0.1, 0.5]);
        let mood = calm_emotion.get_mood_description();
        assert_eq!(mood, "calm");
    }

    #[test]
    fn test_creativity_index() {
        let creative_emotion = EmotionalData::new(vec![0.5, 0.6, 0.7]);
        let creativity = creative_emotion.get_creativity_index();
        assert!(creativity > 0.0 && creativity <= 1.0);
    }
}