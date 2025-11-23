//! # LanceDB Integration Module
//!
//! This module integrates LanceDB for vector search and AI-powered blockchain data management
//! within the NFT blockchain interactive framework.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Configuration for LanceDB integration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanceDBConfig {
    pub database_path: String,
    pub vector_dimension: usize,
    pub index_type: String,
    pub distance_metric: String,
}

impl Default for LanceDBConfig {
    fn default() -> Self {
        Self {
            database_path: "./lancedb_data".to_string(),
            vector_dimension: 512,
            index_type: "ivf_pq".to_string(),
            distance_metric: "cosine".to_string(),
        }
    }
}

/// Vector data for blockchain assets
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockchainVector {
    pub id: String,
    pub asset_type: String, // "nft", "token", "contract", etc.
    pub blockchain: String, // "near", "solana", "polkadot", etc.
    pub contract_address: String,
    pub token_id: Option<String>,
    pub owner_address: String,
    pub vector: Vec<f32>,
    pub metadata: HashMap<String, serde_json::Value>,
    pub timestamp: DateTime<Utc>,
}

/// Emotional vector data for creative assets
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionalVectorData {
    pub id: String,
    pub session_id: String,
    pub creative_asset_id: String,
    pub emotional_vector: Vec<f32>, // [valence, arousal, dominance, ...]
    pub creative_context: CreativeContext,
    pub blockchain_refs: Vec<BlockchainReference>,
    pub timestamp: DateTime<Utc>,
}

/// Creative context for emotional vectors
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreativeContext {
    pub creative_type: String, // "fractal", "music", "shader", etc.
    pub parameters: HashMap<String, serde_json::Value>,
    pub performance_metrics: PerformanceMetrics,
}

/// Performance metrics for creative work
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceMetrics {
    pub complexity_score: f32,
    creativity_index: f32,
    pub engagement_score: f32,
    pub technical_quality: f32,
}

/// Blockchain reference for cross-chain integration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockchainReference {
    pub blockchain: String,
    pub contract_address: String,
    pub token_id: Option<String>,
    pub transaction_hash: Option<String>,
    pub metadata_uri: Option<String>,
}

/// Search results from vector database
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VectorSearchResult {
    pub id: String,
    pub score: f32,
    pub data: SearchData,
    pub metadata: HashMap<String, serde_json::Value>,
}

/// Search data types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SearchData {
    BlockchainAsset(BlockchainVector),
    EmotionalVector(EmotionalVectorData),
}

/// LanceDB integration engine
pub struct LanceDBEngine {
    config: LanceDBConfig,
    // Note: Actual LanceDB connection would go here
    // For now, we'll use in-memory storage for demonstration
    blockchain_vectors: Arc<std::sync::Mutex<Vec<BlockchainVector>>>,
    emotional_vectors: Arc<std::sync::Mutex<Vec<EmotionalVectorData>>>,
}

impl LanceDBEngine {
    /// Create a new LanceDB engine
    pub fn new() -> Self {
        Self::with_config(LanceDBConfig::default())
    }

    /// Create a new LanceDB engine with custom configuration
    pub fn with_config(config: LanceDBConfig) -> Self {
        Self {
            config,
            blockchain_vectors: Arc::new(std::sync::Mutex::new(Vec::new())),
            emotional_vectors: Arc::new(std::sync::Mutex::new(Vec::new())),
        }
    }

    /// Initialize the database connection
    pub async fn initialize(&self) -> Result<(), Box<dyn std::error::Error>> {
        // In a real implementation, this would connect to LanceDB
        // For now, we'll use the in-memory storage
        Ok(())
    }

    /// Insert blockchain vector data
    pub async fn insert_blockchain_vector(&self, vector: BlockchainVector) -> Result<String, Box<dyn std::error::Error>> {
        let mut vectors = self.blockchain_vectors.lock().unwrap();
        let id = vector.id.clone();
        vectors.push(vector);
        Ok(id)
    }

    /// Insert emotional vector data
    pub async fn insert_emotional_vector(&self, vector: EmotionalVectorData) -> Result<String, Box<dyn std::error::Error>> {
        let mut vectors = self.emotional_vectors.lock().unwrap();
        let id = vector.id.clone();
        vectors.push(vector);
        Ok(id)
    }

    /// Search for similar blockchain assets
    pub async fn search_blockchain_assets(
        &self,
        query_vector: Vec<f32>,
        limit: usize,
        filter: Option<HashMap<String, String>>,
    ) -> Result<Vec<VectorSearchResult>, Box<dyn std::error::Error>> {
        let vectors = self.blockchain_vectors.lock().unwrap();
        let mut results = Vec::new();

        for vector in vectors.iter() {
            if let Some(filter_map) = &filter {
                let mut matches = true;
                for (key, value) in filter_map {
                    match key.as_str() {
                        "blockchain" => if vector.blockchain != *value { matches = false; },
                        "asset_type" => if vector.asset_type != *value { matches = false; },
                        _ => {}
                    }
                }
                if !matches { continue; }
            }

            let score = self.cosine_similarity(&query_vector, &vector.vector);
            if score > 0.7 { // Threshold for similarity
                results.push(VectorSearchResult {
                    id: vector.id.clone(),
                    score,
                    data: SearchData::BlockchainAsset(vector.clone()),
                    metadata: vector.metadata.clone(),
                });
            }
        }

        // Sort by score and limit results
        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
        results.truncate(limit);

        Ok(results)
    }

    /// Search for similar emotional vectors
    pub async fn search_emotional_vectors(
        &self,
        query_vector: Vec<f32>,
        limit: usize,
        session_filter: Option<String>,
    ) -> Result<Vec<VectorSearchResult>, Box<dyn std::error::Error>> {
        let vectors = self.emotional_vectors.lock().unwrap();
        let mut results = Vec::new();

        for vector in vectors.iter() {
            if let Some(session_id) = &session_filter {
                if vector.session_id != *session_id { continue; }
            }

            let score = self.cosine_similarity(&query_vector, &vector.emotional_vector);
            if score > 0.6 { // Lower threshold for emotional similarity
                results.push(VectorSearchResult {
                    id: vector.id.clone(),
                    score,
                    data: SearchData::EmotionalVector(vector.clone()),
                    metadata: {
                        let mut meta = HashMap::new();
                        meta.insert("session_id".to_string(), serde_json::json!(vector.session_id));
                        meta.insert("creative_type".to_string(), serde_json::json!(&vector.creative_context.creative_type));
                        meta
                    },
                });
            }
        }

        // Sort by score and limit results
        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
        results.truncate(limit);

        Ok(results)
    }

    /// Create vector from emotional data
    pub fn create_emotional_vector(&self, emotional_data: &crate::EmotionalData, session_id: &str, creative_asset_id: &str) -> EmotionalVectorData {
        // Create emotional vector from VAD values and additional features
        let mut emotional_vector = vec![
            emotional_data.valence,
            emotional_data.arousal,
            emotional_data.dominance,
            emotional_data.confidence,
        ];

        // Add complexity and other features
        emotional_vector.push(emotional_data.emotional_complexity);
        emotional_vector.push(emotional_data.raw_vector.len() as f32 / 100.0); // Normalized vector length

        // Pad or truncate to match expected dimension
        while emotional_vector.len() < self.config.vector_dimension {
            emotional_vector.push(0.0);
        }
        emotional_vector.truncate(self.config.vector_dimension);

        EmotionalVectorData {
            id: Uuid::new_v4().to_string(),
            session_id: session_id.to_string(),
            creative_asset_id: creative_asset_id.to_string(),
            emotional_vector,
            creative_context: CreativeContext {
                creative_type: "emotional".to_string(),
                parameters: {
                    let mut params = HashMap::new();
                    params.insert("valence".to_string(), serde_json::json!(emotional_data.valence));
                    params.insert("arousal".to_string(), serde_json::json!(emotional_data.arousal));
                    params.insert("dominance".to_string(), serde_json::json!(emotional_data.dominance));
                    params
                },
                performance_metrics: PerformanceMetrics {
                    complexity_score: emotional_data.emotional_complexity,
                    creativity_index: 0.5, // Default value
                    engagement_score: emotional_data.confidence,
                    technical_quality: 0.7, // Default value
                },
            },
            blockchain_refs: Vec::new(),
            timestamp: Utc::now(),
        }
    }

    /// Create vector from blockchain asset data
    pub fn create_blockchain_vector(&self, asset_type: &str, blockchain: &str, contract_address: &str, token_id: Option<&str>, owner_address: &str, metadata: HashMap<String, serde_json::Value>) -> BlockchainVector {
        // Create vector from asset characteristics
        let mut vector = vec![
            self.hash_to_float(contract_address),
            self.hash_to_float(owner_address),
        ];

        if let Some(token_id) = token_id {
            vector.push(self.hash_to_float(token_id));
        } else {
            vector.push(0.0);
        }

        // Add blockchain-specific features
        let blockchain_feature = match blockchain {
            "near" => 0.1,
            "solana" => 0.2,
            "polkadot" => 0.3,
            "ethereum" => 0.4,
            _ => 0.0,
        };
        vector.push(blockchain_feature);

        // Add asset type features
        let asset_type_feature = match asset_type {
            "nft" => 0.1,
            "token" => 0.2,
            "contract" => 0.3,
            _ => 0.0,
        };
        vector.push(asset_type_feature);

        // Pad to expected dimension
        while vector.len() < self.config.vector_dimension {
            vector.push(rand::random::<f32>() * 0.1); // Small random values
        }
        vector.truncate(self.config.vector_dimension);

        BlockchainVector {
            id: Uuid::new_v4().to_string(),
            asset_type: asset_type.to_string(),
            blockchain: blockchain.to_string(),
            contract_address: contract_address.to_string(),
            token_id: token_id.map(|s| s.to_string()),
            owner_address: owner_address.to_string(),
            vector,
            metadata,
            timestamp: Utc::now(),
        }
    }

    /// Simple hash-to-float conversion for vector creation
    fn hash_to_float(&self, input: &str) -> f32 {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};

        let mut hasher = DefaultHasher::new();
        input.hash(&mut hasher);
        let hash = hasher.finish();
        
        // Convert hash to float between 0 and 1
        (hash as f32) / (u64::MAX as f32)
    }

    /// Calculate cosine similarity between two vectors
    fn cosine_similarity(&self, vec1: &[f32], vec2: &[f32]) -> f32 {
        if vec1.len() != vec2.len() {
            return 0.0;
        }

        let dot_product: f32 = vec1.iter().zip(vec2.iter()).map(|(a, b)| a * b).sum();
        let norm1: f32 = vec1.iter().map(|x| x * x).sum::<f32>().sqrt();
        let norm2: f32 = vec2.iter().map(|x| x * x).sum::<f32>().sqrt();

        if norm1 == 0.0 || norm2 == 0.0 {
            0.0
        } else {
            dot_product / (norm1 * norm2)
        }
    }

    /// Get database statistics
    pub fn get_stats(&self) -> HashMap<String, serde_json::Value> {
        let blockchain_count = self.blockchain_vectors.lock().unwrap().len();
        let emotional_count = self.emotional_vectors.lock().unwrap().len();

        let mut stats = HashMap::new();
        stats.insert("blockchain_vectors".to_string(), serde_json::json!(blockchain_count));
        stats.insert("emotional_vectors".to_string(), serde_json::json!(emotional_count));
        stats.insert("vector_dimension".to_string(), serde_json::json!(self.config.vector_dimension));
        stats.insert("index_type".to_string(), serde_json::json!(&self.config.index_type));
        stats
    }
}

impl Default for LanceDBEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Integration function for creative sessions
pub async fn integrate_emotional_with_lancedb(
    emotional_data: &crate::EmotionalData,
    session_id: &str,
    creative_asset_id: &str,
    engine: &LanceDBEngine,
) -> Result<String, Box<dyn std::error::Error>> {
    let vector_data = engine.create_emotional_vector(emotional_data, session_id, creative_asset_id);
    let id = vector_data.id.clone();
    engine.insert_emotional_vector(vector_data).await?;
    Ok(id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lancedb_engine_creation() {
        let engine = LanceDBEngine::new();
        let stats = engine.get_stats();
        assert_eq!(stats.get("blockchain_vectors").unwrap(), &serde_json::json!(0));
        assert_eq!(stats.get("emotional_vectors").unwrap(), &serde_json::json!(0));
    }

    #[tokio::test]
    async fn test_emotional_vector_creation() {
        let engine = LanceDBEngine::new();
        
        // Create mock emotional data
        let emotional_data = crate::EmotionalData {
            timestamp: Utc::now(),
            valence: 0.8,
            arousal: 0.6,
            dominance: 0.7,
            confidence: 0.9,
            raw_vector: vec![0.1, 0.2, 0.3],
            emotional_category: "happy".to_string(),
            emotional_trajectory: vec![],
            predicted_emotion: None,
            emotional_complexity: 0.5,
        };

        let vector_data = engine.create_emotional_vector(&emotional_data, "session_123", "asset_456");
        assert_eq!(vector_data.session_id, "session_123");
        assert_eq!(vector_data.creative_asset_id, "asset_456");
        assert_eq!(vector_data.emotional_vector.len(), engine.config.vector_dimension);
    }

    #[tokio::test]
    async fn test_vector_search() {
        let engine = LanceDBEngine::new();
        
        // Insert test data
        let blockchain_vector = engine.create_blockchain_vector(
            "nft",
            "near",
            "contract.near",
            Some("token_123"),
            "user.near",
            HashMap::new(),
        );
        
        engine.insert_blockchain_vector(blockchain_vector).await.unwrap();
        
        // Search for similar vectors
        let query_vector = vec![0.5; 512]; // Test query vector
        let results = engine.search_blockchain_assets(query_vector, 10, None).await.unwrap();
        
        assert!(!results.is_empty());
    }
}