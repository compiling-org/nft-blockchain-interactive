/**
 * NEAR Soulbound NFT Contract for Biometric Authentication
 * Based on NEP-171 (NFT) with soulbound (non-transferable) functionality
 * Integrates with AI/ML emotion detection and biometric verification
 */

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, AccountId, PromiseOrValue, near};
use near_contract_standards::non_fungible_token::metadata::NFTContractMetadata;
mod metadata;


/// This is the name of the NFT standard we're using
pub const NFT_STANDARD_NAME: &str = "nep171";

#[near(contract_state)]

pub struct BiometricSoulboundNFT {
    pub owner_id: AccountId,
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    pub tokens_by_id: LookupMap<TokenId, Token>,
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
    pub metadata: NFTContractMetadata,
}

/// Note that token IDs for NFTs are strings on NEAR
pub type TokenId = String;
/// Timestamp in nanoseconds
pub type Timestamp = u64;



/// Standard Token structure for NEP-171
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Token {
    pub owner_id: AccountId,
}

/// Structure for token metadata
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenMetadata {
    pub title: Option<String>, // ex. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
    pub description: Option<String>, // free-form description
    pub media: Option<String>, // URL to associated media, preferably to decentralized, content-addressed storage
    pub media_hash: Option<Base64VecU8>, // base64-encoded sha256 hash of content referenced by the `media` field
    pub copies: Option<u64>, // number of copies of this set of metadata in existence when token was minted.
    pub issued_at: Option<u64>, // When token was issued or minted, Unix epoch in milliseconds
    pub expires_at: Option<u64>, // When token expires, Unix epoch in milliseconds
    pub starts_at: Option<u64>, // When token starts being valid, Unix epoch in milliseconds
    pub updated_at: Option<u64>, // When token was last updated, Unix epoch in milliseconds
    pub extra: Option<String>, // anything extra the NFT wants to store on-chain
    pub reference: Option<String>, // URL to an off-chain JSON file with more info
    pub reference_hash: Option<Base64VecU8>, // base64-encoded sha256 hash of JSON from reference field
}

/// Implementation of Token struct
impl Token {
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
        }
    }
}

#[near]
impl BiometricSoulboundNFT {
    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        
        Self {
            owner_id: owner_id.clone(),
            tokens_per_owner: LookupMap::new(b"o".to_vec()),
            tokens_by_id: LookupMap::new(b"t".to_vec()),
            token_metadata_by_id: UnorderedMap::new(b"m".to_vec()),
            metadata,
        }
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
    ) -> Token {
        self.internal_mint(token_id, receiver_id, None)
    }



    /// Override transfer to make tokens soulbound (non-transferable)
    #[payable]
    pub fn nft_transfer(
        &mut self,
        _receiver_id: AccountId,
        _token_id: TokenId,
        _approval_id: Option<u64>,
        _memo: Option<String>,
    ) {
        env::panic_str("Soulbound tokens are non-transferable");
    }

    /// Override transfer call to make tokens soulbound (non-transferable)
    #[payable]
    pub fn nft_transfer_call(
        &mut self,
        _receiver_id: AccountId,
        _token_id: TokenId,
        _approval_id: Option<u64>,
        _memo: Option<String>,
        _msg: String,
    ) -> PromiseOrValue<bool> {
        env::panic_str("Soulbound tokens are non-transferable");
    }

    // Helper methods for internal minting
    fn internal_mint(
        &mut self,
        token_id: TokenId,
        owner_id: AccountId,
        metadata: Option<TokenMetadata>,
    ) -> Token {
        // Check if token already exists
        assert!(!self.tokens_by_id.contains_key(&token_id), "Token already exists");
        
        // Create token
        let token = Token::new(owner_id.clone());
        
        // Insert token
        self.tokens_by_id.insert(&token_id, &token);
        
        // Add token to owner's set
        self.internal_add_token_to_owner(&owner_id, &token_id);
        
        // Add metadata if provided
        if let Some(metadata) = metadata {
            self.token_metadata_by_id.insert(&token_id, &metadata);
        }
        
        token
    }

    fn internal_add_token_to_owner(&mut self, owner_id: &AccountId, token_id: &TokenId) {
        let mut tokens_set = self.tokens_per_owner.get(owner_id).unwrap_or_else(|| {
            UnorderedSet::new(
                format!("o{}", owner_id).as_bytes().to_vec()
            )
        });
        
        tokens_set.insert(token_id);
        self.tokens_per_owner.insert(owner_id, &tokens_set);
    }



    pub fn nft_token(&self, token_id: TokenId) -> Option<JsonToken> {
        let token = self.tokens_by_id.get(&token_id)?;
        let metadata = self.token_metadata_by_id.get(&token_id)?;
        
        Some(JsonToken {
            token_id,
            owner_id: token.owner_id,
            metadata,
        })
    }

    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_set = self.tokens_per_owner.get(&account_id).unwrap_or_else(|| {
            UnorderedSet::new(
                format!("o{}", account_id).as_bytes().to_vec()
            )
        });
        
        let limit = limit.unwrap_or(100);
        let from_index = from_index.map(|u| u.0).unwrap_or(0);
        
        tokens_set.iter()
            .skip(from_index as usize)
            .take(limit as usize)
            .filter_map(|token_id| self.nft_token(token_id))
            .collect()
    }

    pub fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.clone()
    }
}

impl Default for BiometricSoulboundNFT {
    fn default() -> Self {
        env::panic_str("Contract is not initialized. Call the `new` method to initialize it.");
    }
}

/// Helper structure for JSON serialization
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonToken {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: TokenMetadata,
}
