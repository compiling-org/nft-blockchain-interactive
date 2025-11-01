//! Mintbase-compatible NFT functionality

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};

/// Mintbase-compatible NFT contract structure
#[derive(BorshDeserialize, BorshSerialize)]
pub struct MintbaseNftContract {
    pub tokens: NonFungibleToken,
    pub token_metadata: UnorderedMap<TokenId, TokenMetadata>,
    pub minters: UnorderedMap<AccountId, bool>,
    pub owner_id: AccountId,
    pub treasury_id: AccountId,
    pub minting_fee: Balance,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MintingData {
    pub token_id: TokenId,
    pub metadata: TokenMetadata,
    pub receiver_id: AccountId,
    pub perpetual_royalties: Option<near_sdk::serde_json::Value>,
}

impl Default for MintbaseNftContract {
    fn default() -> Self {
        Self {
            tokens: NonFungibleToken::default(),
            token_metadata: UnorderedMap::new(b"m"),
            minters: UnorderedMap::new(b"min"),
            owner_id: env::predecessor_account_id(),
            treasury_id: env::predecessor_account_id(),
            minting_fee: 0,
        }
    }
}

#[near_bindgen]
impl MintbaseNftContract {
    #[init]
    pub fn new(owner_id: AccountId, treasury_id: AccountId, minting_fee: Option<Balance>) -> Self {
        Self {
            tokens: NonFungibleToken::new(
                b"t".to_vec(),
                owner_id.clone(),
                Some(TokenMetadata {
                    spec: "nft-1.0.0".to_string(),
                    name: "Mintbase Compatible NFTs".to_string(),
                    symbol: "MBNFT".to_string(),
                    icon: None,
                    base_uri: Some("https://arweave.net/".to_string()),
                    reference: None,
                    reference_hash: None,
                }),
            ),
            token_metadata: UnorderedMap::new(b"m"),
            minters: UnorderedMap::new(b"min"),
            owner_id,
            treasury_id,
            minting_fee: minting_fee.unwrap_or(0),
        }
    }

    /// Add a minter (Mintbase-style permission system)
    pub fn add_minter(&mut self, account_id: AccountId) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can add minters");
        self.minters.insert(&account_id, &true);
    }

    /// Remove a minter
    pub fn remove_minter(&mut self, account_id: AccountId) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can remove minters");
        self.minters.remove(&account_id);
    }

    /// Check if account is a minter
    pub fn is_minter(&self, account_id: AccountId) -> bool {
        self.minters.get(&account_id).unwrap_or(false)
    }

    /// Mintbase-style batch minting
    #[payable]
    pub fn nft_batch_mint(&mut self, minting_data: Vec<MintingData>) -> Vec<Token> {
        let caller = env::predecessor_account_id();
        let deposit = env::attached_deposit();

        // Check if caller is authorized to mint
        assert!(caller == self.owner_id || self.is_minter(caller.clone()),
                "Unauthorized: caller is not a minter");

        // Calculate required fee
        let total_fee = (minting_data.len() as u128) * self.minting_fee;
        assert!(deposit >= total_fee, "Insufficient deposit for minting fee");

        let mut tokens = Vec::new();

        for data in minting_data {
            // Store metadata
            self.token_metadata.insert(&data.token_id, &data.metadata);

            // Mint token
            self.tokens.internal_mint(
                data.token_id.clone(),
                data.receiver_id.clone(),
                Some(data.metadata.clone())
            );

            // Handle royalties if provided
            if let Some(royalties) = data.perpetual_royalties {
                // In a full implementation, this would set up royalty splits
                // For now, just log the royalties
                env::log_str(&format!("Royalties set for token {}: {:?}", data.token_id, royalties));
            }

            tokens.push(Token {
                token_id: data.token_id,
                owner_id: data.receiver_id,
                metadata: Some(data.metadata),
                approved_account_ids: None,
            });
        }

        // Transfer fee to treasury if applicable
        if total_fee > 0 {
            Promise::new(self.treasury_id.clone()).transfer(total_fee);
        }

        tokens
    }

    /// Mintbase-style single mint
    #[payable]
    pub fn nft_mint(&mut self, token_id: TokenId, metadata: TokenMetadata, receiver_id: AccountId) -> Token {
        let caller = env::predecessor_account_id();
        let deposit = env::attached_deposit();

        // Check authorization
        assert!(caller == self.owner_id || self.is_minter(caller.clone()),
                "Unauthorized: caller is not a minter");

        // Check fee
        assert!(deposit >= self.minting_fee, "Insufficient deposit for minting fee");

        // Store metadata
        self.token_metadata.insert(&token_id, &metadata);

        // Mint token
        self.tokens.internal_mint(token_id.clone(), receiver_id.clone(), Some(metadata.clone()));

        // Transfer fee to treasury
        if self.minting_fee > 0 {
            Promise::new(self.treasury_id.clone()).transfer(self.minting_fee);
        }

        Token {
            token_id,
            owner_id: receiver_id,
            metadata: Some(metadata),
            approved_account_ids: None,
        }
    }

    /// Get token metadata (Mintbase-compatible)
    pub fn nft_metadata(&self, token_id: TokenId) -> Option<TokenMetadata> {
        self.token_metadata.get(&token_id)
    }

    /// Get all tokens owned by an account
    pub fn nft_tokens_for_owner(&self, account_id: AccountId) -> Vec<Token> {
        // This would need to be implemented with proper enumeration
        // For now, return empty vec
        Vec::new()
    }

    /// Mintbase-style token burning
    pub fn nft_burn(&mut self, token_id: TokenId) {
        // Verify ownership
        let token = self.tokens.nft_token(token_id.clone()).expect("Token not found");
        assert_eq!(token.owner_id, env::predecessor_account_id(), "Not token owner");

        // Remove from storage
        self.tokens.internal_burn(token_id.clone());
        self.token_metadata.remove(&token_id);
    }

    /// Update contract metadata
    pub fn update_contract_metadata(&mut self, metadata: TokenMetadata) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can update metadata");
        // Update the contract-level metadata
        // This would modify the NFT contract's metadata
    }

    /// Withdraw treasury funds
    pub fn withdraw_treasury(&mut self, amount: Balance) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can withdraw");

        let contract_balance = env::account_balance();
        assert!(contract_balance >= amount, "Insufficient contract balance");

        Promise::new(self.owner_id.clone()).transfer(amount);
    }
}

// Implement NEAR NFT standards
near_contract_standards::impl_non_fungible_token_core!(MintbaseNftContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(MintbaseNftContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(MintbaseNftContract, tokens);

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context() -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.current_account_id("contract.testnet".parse().unwrap());
        builder.signer_account_id("owner.testnet".parse().unwrap());
        builder.predecessor_account_id("owner.testnet".parse().unwrap());
        builder
    }

    #[test]
    fn test_mintbase_contract_creation() {
        let context = get_context().build();
        testing_env!(context);

        let contract = MintbaseNftContract::new(
            "owner.testnet".parse().unwrap(),
            "treasury.testnet".parse().unwrap(),
            Some(1_000_000_000_000_000_000_000_000), // 1 NEAR
        );

        assert_eq!(contract.owner_id, "owner.testnet".parse().unwrap());
        assert_eq!(contract.minting_fee, 1_000_000_000_000_000_000_000_000);
    }

    #[test]
    fn test_add_minter() {
        let context = get_context().build();
        testing_env!(context);

        let mut contract = MintbaseNftContract::default();

        let minter_id: AccountId = "minter.testnet".parse().unwrap();
        contract.add_minter(minter_id.clone());

        assert!(contract.is_minter(minter_id));
    }

    #[test]
    fn test_mint_nft() {
        let context = get_context()
            .attached_deposit(1_000_000_000_000_000_000_000_000)
            .build();
        testing_env!(context);

        let mut contract = MintbaseNftContract::new(
            "owner.testnet".parse().unwrap(),
            "treasury.testnet".parse().unwrap(),
            Some(1_000_000_000_000_000_000_000_000),
        );

        let metadata = TokenMetadata {
            title: Some("Test NFT".to_string()),
            description: Some("Mintbase compatible NFT".to_string()),
            media: Some("https://arweave.net/test".to_string()),
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

        let token = contract.nft_mint(
            "test_token".to_string(),
            metadata.clone(),
            "receiver.testnet".parse().unwrap(),
        );

        assert_eq!(token.token_id, "test_token");
        assert_eq!(token.owner_id, "receiver.testnet".parse().unwrap());
    }
}