//! Emotional Bridge for Polkadot
//!
//! Bridge creative emotional metadata between NEAR and Polkadot ecosystems.

use serde::{Deserialize, Serialize};
use subxt::utils::AccountId32;

/// Emotional vector representation
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EmotionalVector {
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
}

/// Emotional metadata for creative works
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EmotionalMetadata {
    pub creator: AccountId32,
    pub emotional_vector: EmotionalVector,
    pub timestamp: u64,
    pub content_hash: String,
}

/// Bridge record for cross-chain emotional metadata
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EmotionalBridgeRecord {
    pub source_chain: String,
    pub target_chain: String,
    pub metadata: EmotionalMetadata,
    pub bridge_fee: u128,
    pub created_at: u64,
}

impl EmotionalVector {
    /// Create a new emotional vector
    pub fn new(valence: f32, arousal: f32, dominance: f32) -> Self {
        Self {
            valence,
            arousal,
            dominance,
        }
    }

    /// Apply emotional modulation to creative parameters
    pub fn apply_modulation(&self, base_params: Vec<f32>) -> Vec<f32> {
        base_params
            .iter()
            .enumerate()
            .map(|(i, &param)| {
                let modulation = match i % 3 {
                    0 => self.valence,
                    1 => self.arousal,
                    2 => self.dominance,
                    _ => 0.0,
                };
                param * (1.0 + modulation * 0.1)
            })
            .collect()
    }
}

impl EmotionalMetadata {
    /// Create new emotional metadata
    pub fn new(
        creator: AccountId32,
        emotional_vector: EmotionalVector,
        content_hash: String,
    ) -> Self {
        Self {
            creator,
            emotional_vector,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            content_hash,
        }
    }
}

impl EmotionalBridgeRecord {
    /// Create a new bridge record
    pub fn new(
        source_chain: String,
        target_chain: String,
        metadata: EmotionalMetadata,
        bridge_fee: u128,
    ) -> Self {
        Self {
            source_chain,
            target_chain,
            metadata,
            bridge_fee,
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }
}