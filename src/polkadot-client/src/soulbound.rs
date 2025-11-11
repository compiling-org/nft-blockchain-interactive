//! Soulbound Token Client
//! 
//! Non-transferable tokens for creator identity and reputation across chains

use serde::{Deserialize, Serialize};
use subxt::utils::AccountId32;

/// Soulbound token structure
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SoulboundToken {
    pub owner: AccountId32,
    pub token_id: u64,
    pub token_type: TokenType,
    pub metadata: Vec<u8>,
    pub issued_at: u64,
    pub is_revoked: bool,
}

/// Type of soulbound token
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum TokenType {
    CreatorIdentity,
    ReputationBadge,
    Achievement,
    Membership,
    Certification,
}

/// Reputation data for creators
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct ReputationData {
    pub score: u32,
    pub total_interactions: u32,
    pub badges: u32,
}

/// Soulbound token client
pub struct SoulboundTokenClient {
    // Client implementation would go here
}

impl SoulboundTokenClient {
    /// Create a new soulbound token
    pub fn new_soulbound_token(
        owner: AccountId32,
        token_id: u64,
        token_type: TokenType,
        metadata: Vec<u8>,
    ) -> SoulboundToken {
        SoulboundToken {
            owner,
            token_id,
            token_type,
            metadata,
            issued_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            is_revoked: false,
        }
    }

    /// Update reputation score
    pub fn update_reputation(
        reputation: &mut ReputationData,
        score_delta: i32,
    ) -> Result<(), &'static str> {
        let new_score = if score_delta >= 0 {
            reputation.score.saturating_add(score_delta as u32)
        } else {
            reputation.score.saturating_sub((-score_delta) as u32)
        };
        
        if new_score > 10000 {
            return Err("Reputation score too high");
        }
        
        reputation.score = new_score;
        reputation.total_interactions += 1;
        Ok(())
    }
}