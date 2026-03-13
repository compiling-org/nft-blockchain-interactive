//! Simple NEAR NFT Contract - Actually Works
//! Basic NEP-171 compliant NFT contract for testing real functionality

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::json_types::U128;
use near_sdk::{env, near, AccountId, Promise, Timestamp, NearToken};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_contract_standards::non_fungible_token::core::NonFungibleTokenCore;
use near_contract_standards::non_fungible_token::enumeration::NonFungibleTokenEnumeration;
use near_contract_standards::non_fungible_token::approval::NonFungibleTokenApproval;
use near_sdk::PromiseOrValue;

// Expose emotional module
mod emotional;
mod interactive_advanced;

use emotional::CompactEmotionalState;
use interactive_advanced::{BiometricNFT, InteractiveMetadata, InteractionRules, DetailedEmotionalState, BiometricSnapshot, InteractionType};

/// Simple NFT contract that actually works
#[near(contract_state)]
pub struct SimpleNftContract {
    tokens: NonFungibleToken,
    owner_id: AccountId,
    token_metadata: UnorderedMap<TokenId, TokenMetadata>,
    interaction_history: LookupMap<TokenId, Vec<String>>,
    // Added emotional history for space-efficient storage
    emotional_history: LookupMap<TokenId, Vec<CompactEmotionalState>>,
    // Advanced Interactive State
    biometric_nfts: LookupMap<TokenId, BiometricNFT>,
    // Configurable minimum mint deposit (None = use default 0.01 NEAR)
    min_mint_deposit: Option<NearToken>,
}

#[near]
impl SimpleNftContract {
    /// Initialize the contract with an owner
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            tokens: NonFungibleToken::new(
                b"t".to_vec(),
                owner_id.clone(),
                Some(b"o".to_vec()),
                Some(b"e".to_vec()),
                Some(b"s".to_vec()),
            ),
            owner_id,
            token_metadata: UnorderedMap::new(b"m".to_vec()),
            interaction_history: LookupMap::new(b"h".to_vec()),
            emotional_history: LookupMap::new(b"e".to_vec()),
            biometric_nfts: LookupMap::new(b"b".to_vec()),
            min_mint_deposit: None, // Use default 0.01 NEAR
        }
    }

    /// Set minimum mint deposit (only owner can call)
    pub fn set_min_mint_deposit(&mut self, deposit: NearToken) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can set min deposit");
        self.min_mint_deposit = Some(deposit);
    }

    /// Get current minimum mint deposit
    pub fn get_min_mint_deposit(&self) -> NearToken {
        self.min_mint_deposit.unwrap_or_else(|| NearToken::from_yoctonear(10_000_000_000_000_000_000_000))
    }

    /// Mint a new NFT - actually works!
    #[payable]
    pub fn mint_nft(
        &mut self,
        token_id: TokenId,
        metadata: TokenMetadata,
    ) -> Token {
        // Mint the NFT using standard NFT functionality
        let token = self.tokens.internal_mint(
            token_id.clone(), 
            env::predecessor_account_id(), 
            Some(metadata.clone())
        );
        
        // Store the metadata
        self.token_metadata.insert(&token_id, &metadata);
        
        // Initialize interaction history
        self.interaction_history.insert(&token_id, &vec![]);
        self.emotional_history.insert(&token_id, &vec![]);
        
        token
    }

    /// Mint an interactive biometric NFT
    #[payable]
    pub fn mint_interactive_nft(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        metadata: TokenMetadata,
        initial_emotional_state: DetailedEmotionalState,
    ) -> Token {
        // Validate attached deposit - configurable minimum (default 0.01 NEAR)
        let deposit = env::attached_deposit();
        let min_deposit = self.min_mint_deposit.unwrap_or_else(|| NearToken::from_yoctonear(10_000_000_000_000_000_000_000));
        assert!(deposit >= min_deposit, "Insufficient deposit: minimum {} required", min_deposit);
        // 1. Mint standard NFT
        let token = self.tokens.internal_mint(
            token_id.clone(),
            receiver_id.clone(),
            Some(metadata.clone()),
        );

        // 2. Initialize interactive metadata
        let interactive_metadata = InteractiveMetadata {
            title: metadata.title.clone().unwrap_or_else(|| "Untitled Biometric NFT".to_string()),
            description: metadata.description.clone().unwrap_or_else(|| "Interactive Biometric NFT".to_string()),
            artist: env::predecessor_account_id(),
            created_at: env::block_timestamp(),
            base_ipfs_cid: metadata.media.clone().unwrap_or_default(),
            interaction_rules: InteractionRules {
                valence_affects_color: true,
                arousal_affects_speed: true,
                dominance_affects_detail: true,
                meditation_affects_morphing: true,
                stress_affects_complexity: true,
                sensitivity: 1.0,
            },
        };

        // 3. Create BiometricNFT state
        let mut biometric_nft = BiometricNFT::new(
            token_id.clone(),
            receiver_id.clone(),
            interactive_metadata,
        );

        // 4. Record initial interaction (minting event)
        // Create a dummy biometric snapshot for minting
        let initial_biometric = BiometricSnapshot {
            eeg_data: None,
            heart_rate: None,
            gsr: None,
            facial_data: None,
            quality_score: 1.0,
            data_cid: "minting_event".to_string(),
        };

        biometric_nft.interact_with_biometrics(
            initial_emotional_state,
            initial_biometric,
            InteractionType::CreativeSession,
        );

        // 5. Store advanced state
        self.biometric_nfts.insert(&token_id, &biometric_nft);

        // 6. Update standard metadata and history
        self.token_metadata.insert(&token_id, &metadata);
        self.interaction_history.insert(&token_id, &vec![format!("Minted interactive NFT at {}", env::block_timestamp())]);
        
        token
    }

    /// Record a simple interaction - actually works!
    pub fn record_interaction(
        &mut self,
        token_id: TokenId,
        interaction: String,
    ) {
        // Get current history
        let mut history = self.interaction_history.get(&token_id).unwrap_or_else(|| vec![]);
        
        // Add new interaction with timestamp
        let interaction_with_timestamp = format!(
            "[{}] {}: {}", 
            env::block_timestamp(), 
            env::predecessor_account_id(), 
            interaction
        );
        history.push(interaction_with_timestamp);
        
        // Store updated history
        self.interaction_history.insert(&token_id, &history);
    }

    /// Record an emotional interaction using compact 10-bit packing
    /// This is gas-efficient and stores rich biometric data
    pub fn record_emotional_interaction(
        &mut self,
        token_id: TokenId,
        packed_emotion: CompactEmotionalState,
    ) {
        // Get current emotional history
        let mut history = self.emotional_history.get(&token_id).unwrap_or_else(|| vec![]);
        
        // Add new packed interaction
        history.push(packed_emotion);
        
        // Store updated history
        self.emotional_history.insert(&token_id, &history);
        
        // Also record a string summary in the main history for compatibility
        let vector = packed_emotion.unpack_to_vector();
        let summary = format!(
            "Emotional State: Val={:.2}, Aro={:.2}, Dom={:.2}, Conf={:.2}", 
            vector.valence, vector.arousal, vector.dominance, packed_emotion.get_confidence()
        );
        self.record_interaction(token_id, summary);
    }

    /// Get NFT metadata
    pub fn get_metadata(&self, token_id: TokenId) -> Option<TokenMetadata> {
        self.token_metadata.get(&token_id)
    }

    /// Get interaction history
    pub fn get_interaction_history(&self, token_id: TokenId) -> Vec<String> {
        self.interaction_history.get(&token_id).unwrap_or_else(|| vec![])
    }
    
    /// Get emotional history as packed states
    pub fn get_emotional_history(&self, token_id: TokenId) -> Vec<CompactEmotionalState> {
        self.emotional_history.get(&token_id).unwrap_or_else(|| vec![])
    }

    /// Get total number of NFTs minted
    pub fn total_supply(&self) -> U128 {
        self.tokens.nft_total_supply()
    }

    /// Get all NFTs for an account
    pub fn tokens_for_owner(&self, account_id: AccountId) -> Vec<Token> {
        self.tokens.nft_tokens_for_owner(account_id, None, None)
    }

    /// Get specific NFT
    pub fn get_nft(&self, token_id: TokenId) -> Option<Token> {
        self.tokens.nft_token(token_id)
    }
}

// Implement NEAR NFT standard methods
impl NonFungibleTokenCore for SimpleNftContract {
    fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        self.tokens.nft_transfer(receiver_id, token_id, approval_id, memo)
    }

    fn nft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<bool> {
        self.tokens.nft_transfer_call(receiver_id, token_id, approval_id, memo, msg).into()
    }

    fn nft_token(&self, token_id: TokenId) -> Option<Token> {
        self.tokens.nft_token(token_id)
    }
}

impl NonFungibleTokenEnumeration for SimpleNftContract {
    fn nft_total_supply(&self) -> U128 {
        self.tokens.nft_total_supply()
    }

    fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<Token> {
        self.tokens.nft_tokens(from_index, limit)
    }

    fn nft_supply_for_owner(&self, account_id: AccountId) -> U128 {
        self.tokens.nft_supply_for_owner(account_id)
    }

    fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Token> {
        self.tokens.nft_tokens_for_owner(account_id, from_index, limit)
    }
}

impl NonFungibleTokenApproval for SimpleNftContract {
    fn nft_approve(
        &mut self,
        token_id: TokenId,
        account_id: AccountId,
        msg: Option<String>,
    ) -> Option<Promise> {
        self.tokens.nft_approve(token_id, account_id, msg)
    }

    fn nft_revoke(&mut self, token_id: TokenId, account_id: AccountId) {
        self.tokens.nft_revoke(token_id, account_id)
    }

    fn nft_revoke_all(&mut self, token_id: TokenId) {
        self.tokens.nft_revoke_all(token_id)
    }

    fn nft_is_approved(
        &self,
        token_id: TokenId,
        approved_account_id: AccountId,
        approval_id: Option<u64>,
    ) -> bool {
        self.tokens.nft_is_approved(token_id, approved_account_id, approval_id)
    }
}

// Default implementation for contract initialization
impl Default for SimpleNftContract {
    fn default() -> Self {
        Self::new(env::current_account_id())
    }
}

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
        builder.account_balance(NearToken::from_yoctonear(10_000_000_000_000_000_000_000_000)); // 10 NEAR
        builder
    }

    #[test]
    fn test_new_contract() {
        let context = get_context().build();
        testing_env!(context);
        
        let contract = SimpleNftContract::new("owner.testnet".parse().unwrap());
        assert_eq!(contract.total_supply(), U128(0));
    }

    #[test]
    fn test_mint_nft() {
        let mut context = get_context();
        context.predecessor_account_id("user.testnet".parse().unwrap());
        context.attached_deposit(NearToken::from_yoctonear(10_000_000_000_000_000_000_000)); // 0.01 NEAR
        testing_env!(context.build());
        
        let mut contract = SimpleNftContract::new("owner.testnet".parse().unwrap());
        
        let metadata = TokenMetadata {
            title: Some("Test NFT".to_string()),
            description: Some("A test NFT that actually works".to_string()),
            media: Some("https://example.com/image.png".to_string()),
            media_hash: None,
            copies: Some(1),
            issued_at: Some(env::block_timestamp().to_string()),
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        };
        
        let token = contract.mint_nft("token1".to_string(), metadata.clone());
        
        assert_eq!(token.token_id, "token1");
        assert_eq!(token.owner_id, "user.testnet".parse::<AccountId>().unwrap());
        
        // Check metadata
        let stored_metadata = contract.get_metadata("token1".to_string()).unwrap();
        assert_eq!(stored_metadata.title, Some("Test NFT".to_string()));
        
        // Check total supply
        assert_eq!(contract.total_supply(), U128(1));
    }

    #[test]
    fn test_record_interaction() {
        let mut context = get_context();
        context.predecessor_account_id("user.testnet".parse().unwrap());
        context.attached_deposit(NearToken::from_yoctonear(10_000_000_000_000_000_000_000)); // 0.01 NEAR for minting
        testing_env!(context.build());
        
        let mut contract = SimpleNftContract::new("owner.testnet".parse().unwrap());
        
        let metadata = TokenMetadata {
            title: Some("Test NFT".to_string()),
            description: Some("A test NFT".to_string()),
            media: None,
            media_hash: None,
            copies: None,
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        };
        
        contract.mint_nft("token1".to_string(), metadata);
        
        // Record an interaction
        contract.record_interaction("token1".to_string(), "viewed".to_string());
        
        // Check interaction history
        let history = contract.get_interaction_history("token1".to_string());
        assert_eq!(history.len(), 1);
        assert!(history[0].contains("viewed"));
    }
}