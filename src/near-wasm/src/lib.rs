//! # NEAR WASM Creative Engine
//!
//! WASM-compiled creative engine for NEAR blockchain integration.
//! Provides interactive NFT functionality and Mintbase-compatible contracts.

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise, Timestamp};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use std::collections::HashMap;

pub use crate::emotional::*;
pub use crate::interactive::*;
pub use crate::mintbase::*;
pub use crate::soulbound::*;

mod emotional;
mod interactive;
mod mintbase;
mod soulbound;

/// Main interactive NFT contract
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct InteractiveNftContract {
    // NEAR NFT standard implementation
    tokens: NonFungibleToken,

    // Mintbase-compatible metadata
    token_metadata: LookupMap<TokenId, TokenMetadata>,

    // Interactive extensions
    interaction_history: LookupMap<TokenId, Vec<Interaction>>,
    emotional_state: LookupMap<TokenId, EmotionalData>,
    dynamic_metadata: LookupMap<TokenId, DynamicMetadata>,

    // Soulbound tokens for identity
    soulbound_tokens: UnorderedMap<TokenId, SoulboundToken>,

    // Contract configuration
    owner_id: AccountId,
    treasury_id: AccountId,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct DynamicMetadata {
    pub base_metadata: TokenMetadata,
    pub interaction_count: u64,
    pub last_interaction: Timestamp,
    pub emotional_evolution: EmotionalVector,
    pub current_state: near_sdk::serde_json::Value,
    pub ipfs_cid: Option<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Interaction {
    pub timestamp: Timestamp,
    pub interaction_type: String,
    pub user_id: AccountId,
    pub data: near_sdk::serde_json::Value,
}

impl Default for InteractiveNftContract {
    fn default() -> Self {
        Self {
            tokens: NonFungibleToken::default(),
            token_metadata: LookupMap::new(b"m"),
            interaction_history: LookupMap::new(b"i"),
            emotional_state: LookupMap::new(b"e"),
            dynamic_metadata: LookupMap::new(b"d"),
            soulbound_tokens: UnorderedMap::new(b"s"),
            owner_id: env::predecessor_account_id(),
            treasury_id: env::predecessor_account_id(),
        }
    }
}

#[near_bindgen]
impl InteractiveNftContract {
    #[init]
    pub fn new(owner_id: AccountId, treasury_id: AccountId) -> Self {
        Self {
            tokens: NonFungibleToken::new(
                b"t".to_vec(),
                owner_id.clone(),
                Some(TokenMetadata {
                    spec: "nft-1.0.0".to_string(),
                    name: "Interactive Creative NFTs".to_string(),
                    symbol: "ICNFT".to_string(),
                    icon: None,
                    base_uri: Some("https://ipfs.io/ipfs/".to_string()),
                    reference: None,
                    reference_hash: None,
                }),
            ),
            token_metadata: LookupMap::new(b"m"),
            interaction_history: LookupMap::new(b"i"),
            emotional_state: LookupMap::new(b"e"),
            dynamic_metadata: LookupMap::new(b"d"),
            soulbound_tokens: UnorderedMap::new(b"s"),
            owner_id,
            treasury_id,
        }
    }

    /// Mint an interactive NFT
    #[payable]
    pub fn mint_interactive_nft(
        &mut self,
        token_id: TokenId,
        metadata: TokenMetadata,
        initial_emotion: EmotionalData,
        ipfs_cid: Option<String>,
    ) -> Token {
        // Validate payment (minimum 1 NEAR for minting)
        let deposit = env::attached_deposit();
        assert!(deposit >= 1_000_000_000_000_000_000_000_000, "Minimum deposit: 1 NEAR");

        // Create dynamic metadata
        let dynamic_metadata = DynamicMetadata {
            base_metadata: metadata.clone(),
            interaction_count: 0,
            last_interaction: env::block_timestamp(),
            emotional_evolution: initial_emotion.emotional_vector.clone(),
            current_state: near_sdk::serde_json::json!({
                "mood": "creation",
                "energy": initial_emotion.emotional_vector.arousal,
                "creativity": initial_emotion.confidence
            }),
            ipfs_cid: ipfs_cid.clone(),
        };

        // Store metadata
        self.token_metadata.insert(&token_id, &metadata);
        self.emotional_state.insert(&token_id, &initial_emotion);
        self.dynamic_metadata.insert(&token_id, &dynamic_metadata);
        self.interaction_history.insert(&token_id, &Vec::new());

        // Mint the token
        self.tokens.internal_mint(token_id.clone(), env::predecessor_account_id(), Some(metadata.clone()));

        // Return the token
        Token {
            token_id,
            owner_id: env::predecessor_account_id(),
            metadata: Some(metadata),
            approved_account_ids: None,
        }
    }

    /// Record an interaction with an NFT
    pub fn record_interaction(
        &mut self,
        token_id: TokenId,
        interaction_type: String,
        interaction_data: near_sdk::serde_json::Value,
    ) {
        // Verify token ownership
        let token = self.tokens.nft_token(token_id.clone()).expect("Token not found");
        assert_eq!(token.owner_id, env::predecessor_account_id(), "Not token owner");

        // Create interaction record
        let interaction = Interaction {
            timestamp: env::block_timestamp(),
            interaction_type: interaction_type.clone(),
            user_id: env::predecessor_account_id(),
            data: interaction_data.clone(),
        };

        // Update interaction history
        let mut history = self.interaction_history.get(&token_id).unwrap_or_default();
        history.push(interaction);
        self.interaction_history.insert(&token_id, &history);

        // Update dynamic metadata based on interaction
        if let Some(mut dynamic_meta) = self.dynamic_metadata.get(&token_id) {
            dynamic_meta.interaction_count += 1;
            dynamic_meta.last_interaction = env::block_timestamp();

            // Update emotional state based on interaction type
            match interaction_type.as_str() {
                "love" => {
                    dynamic_meta.emotional_evolution.valence += 0.1;
                    dynamic_meta.current_state["mood"] = "loved".into();
                }
                "share" => {
                    dynamic_meta.emotional_evolution.arousal += 0.05;
                    dynamic_meta.current_state["mood"] = "shared".into();
                }
                "view" => {
                    dynamic_meta.emotional_evolution.dominance += 0.02;
                    dynamic_meta.current_state["energy"] = (dynamic_meta.emotional_evolution.arousal + 0.01).into();
                }
                _ => {}
            }

            // Clamp emotional values
            dynamic_meta.emotional_evolution.valence = dynamic_meta.emotional_evolution.valence.clamp(-1.0, 1.0);
            dynamic_meta.emotional_evolution.arousal = dynamic_meta.emotional_evolution.arousal.clamp(0.0, 1.0);
            dynamic_meta.emotional_evolution.dominance = dynamic_meta.emotional_evolution.dominance.clamp(0.0, 1.0);

            self.dynamic_metadata.insert(&token_id, &dynamic_meta);
        }
    }

    /// Get dynamic metadata for an NFT
    pub fn get_dynamic_metadata(&self, token_id: TokenId) -> Option<DynamicMetadata> {
        self.dynamic_metadata.get(&token_id)
    }

    /// Get interaction history for an NFT
    pub fn get_interaction_history(&self, token_id: TokenId) -> Vec<Interaction> {
        self.interaction_history.get(&token_id).unwrap_or_default()
    }

    /// Mint a soulbound token for creative identity
    #[payable]
    pub fn mint_soulbound_identity(
        &mut self,
        token_id: TokenId,
        metadata: TokenMetadata,
        identity_data: IdentityData,
    ) -> SoulboundToken {
        // Soulbound tokens are non-transferable
        let soulbound = SoulboundToken {
            token_id: token_id.clone(),
            owner_id: env::predecessor_account_id(),
            metadata: metadata.clone(),
            identity_data,
            minted_at: env::block_timestamp(),
            soulbound: true,
        };

        self.soulbound_tokens.insert(&token_id, &soulbound);

        // Also create as regular NFT (but mark as soulbound)
        self.tokens.internal_mint(token_id.clone(), env::predecessor_account_id(), Some(metadata));

        soulbound
    }

    /// Get soulbound token info
    pub fn get_soulbound_token(&self, token_id: TokenId) -> Option<SoulboundToken> {
        self.soulbound_tokens.get(&token_id)
    }

    /// Override transfer to prevent soulbound token transfers
    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        // Check if this is a soulbound token
        if self.soulbound_tokens.get(&token_id).is_some() {
            env::panic_str("Soulbound tokens cannot be transferred");
        }

        // Normal transfer for regular NFTs
        self.tokens.nft_transfer(receiver_id, token_id, approval_id, memo);
    }
}

// NFT Standard Implementation
near_contract_standards::impl_non_fungible_token_core!(InteractiveNftContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(InteractiveNftContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(InteractiveNftContract, tokens);

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context() -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.current_account_id("contract.testnet".parse().unwrap());
        builder.signer_account_id("user.testnet".parse().unwrap());
        builder.predecessor_account_id("user.testnet".parse().unwrap());
        builder
    }

    #[test]
    fn test_mint_interactive_nft() {
        let context = get_context().build();
        testing_env!(context);

        let mut contract = InteractiveNftContract::default();

        let metadata = TokenMetadata {
            title: Some("Test NFT".to_string()),
            description: Some("Interactive test NFT".to_string()),
            media: Some("ipfs://test".to_string()),
            media_hash: None,
            copies: Some(1),
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        };

        let emotion = EmotionalData {
            timestamp: 0,
            valence: 0.5,
            arousal: 0.7,
            dominance: 0.3,
            confidence: 0.8,
            raw_vector: vec![0.1, 0.2, 0.3],
            emotional_vector: EmotionalVector {
                valence: 0.5,
                arousal: 0.7,
                dominance: 0.3,
            },
        };

        let token = contract.mint_interactive_nft(
            "test_token".to_string(),
            metadata,
            emotion,
            Some("ipfs_cid".to_string()),
        );

        assert_eq!(token.token_id, "test_token");
    }
}