//! Soulbound token functionality for creative identity

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Timestamp};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};

/// Soulbound token representing creative identity
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SoulboundToken {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: TokenMetadata,
    pub identity_data: IdentityData,
    pub minted_at: Timestamp,
    pub soulbound: bool,
}

/// Identity data for soulbound tokens
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct IdentityData {
    pub creative_profile: CreativeProfile,
    pub achievements: Vec<Achievement>,
    pub reputation_score: u32,
    pub verified_skills: Vec<String>,
    pub portfolio_links: Vec<String>,
}

/// Creative profile information
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct CreativeProfile {
    pub display_name: String,
    pub bio: String,
    pub artistic_style: Vec<String>,
    pub years_experience: u32,
    pub primary_medium: String,
    pub location: Option<String>,
}

/// Achievement/badge system
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Achievement {
    pub id: String,
    pub name: String,
    pub description: String,
    pub earned_at: Timestamp,
    pub issuer: AccountId,
    pub rarity: AchievementRarity,
}

/// Achievement rarity levels
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum AchievementRarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

/// Soulbound token contract
#[derive(BorshDeserialize, BorshSerialize)]
pub struct SoulboundIdentityContract {
    pub tokens: NonFungibleToken,
    pub soulbound_tokens: near_sdk::collections::UnorderedMap<TokenId, SoulboundToken>,
    pub achievements: near_sdk::collections::UnorderedMap<String, Achievement>,
    pub owner_id: AccountId,
}

impl Default for SoulboundIdentityContract {
    fn default() -> Self {
        Self {
            tokens: NonFungibleToken::default(),
            soulbound_tokens: near_sdk::collections::UnorderedMap::new(b"s"),
            achievements: near_sdk::collections::UnorderedMap::new(b"a"),
            owner_id: env::predecessor_account_id(),
        }
    }
}

#[near_bindgen]
impl SoulboundIdentityContract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            tokens: NonFungibleToken::new(
                b"t".to_vec(),
                owner_id.clone(),
                Some(TokenMetadata {
                    spec: "nft-1.0.0".to_string(),
                    name: "Soulbound Creative Identity".to_string(),
                    symbol: "SBID".to_string(),
                    icon: None,
                    base_uri: None,
                    reference: None,
                    reference_hash: None,
                }),
            ),
            soulbound_tokens: near_sdk::collections::UnorderedMap::new(b"s"),
            achievements: near_sdk::collections::UnorderedMap::new(b"a"),
            owner_id,
        }
    }

    /// Mint a soulbound identity token
    #[payable]
    pub fn mint_identity_token(
        &mut self,
        token_id: TokenId,
        metadata: TokenMetadata,
        identity_data: IdentityData,
    ) -> SoulboundToken {
        let caller = env::predecessor_account_id();

        // Create soulbound token
        let soulbound = SoulboundToken {
            token_id: token_id.clone(),
            owner_id: caller.clone(),
            metadata: metadata.clone(),
            identity_data,
            minted_at: env::block_timestamp(),
            soulbound: true,
        };

        // Store the soulbound token
        self.soulbound_tokens.insert(&token_id, &soulbound);

        // Mint as regular NFT (but mark as non-transferable)
        self.tokens.internal_mint(token_id.clone(), caller, Some(metadata));

        soulbound
    }

    /// Award an achievement to an identity
    pub fn award_achievement(
        &mut self,
        identity_token_id: TokenId,
        achievement: Achievement,
    ) {
        // Verify caller has permission to award achievements
        // In practice, this would check against authorized issuers
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Unauthorized to award achievements");

        // Get the identity token
        if let Some(mut soulbound) = self.soulbound_tokens.get(&identity_token_id) {
            // Add achievement to identity
            soulbound.identity_data.achievements.push(achievement.clone());

            // Update reputation score based on achievement rarity
            let rarity_bonus = match achievement.rarity {
                AchievementRarity::Common => 1,
                AchievementRarity::Uncommon => 5,
                AchievementRarity::Rare => 10,
                AchievementRarity::Epic => 25,
                AchievementRarity::Legendary => 50,
            };
            soulbound.identity_data.reputation_score += rarity_bonus;

            // Store updated identity
            self.soulbound_tokens.insert(&identity_token_id, &soulbound);

            // Store achievement globally
            self.achievements.insert(&achievement.id, &achievement);
        } else {
            env::panic_str("Identity token not found");
        }
    }

    /// Update creative profile
    pub fn update_profile(&mut self, token_id: TokenId, new_profile: CreativeProfile) {
        // Verify ownership
        if let Some(mut soulbound) = self.soulbound_tokens.get(&token_id) {
            assert_eq!(soulbound.owner_id, env::predecessor_account_id(), "Not token owner");

            // Update profile
            soulbound.identity_data.creative_profile = new_profile;
            self.soulbound_tokens.insert(&token_id, &soulbound);
        } else {
            env::panic_str("Identity token not found");
        }
    }

    /// Add verified skill
    pub fn add_verified_skill(&mut self, token_id: TokenId, skill: String) {
        // Verify ownership
        if let Some(mut soulbound) = self.soulbound_tokens.get(&token_id) {
            assert_eq!(soulbound.owner_id, env::predecessor_account_id(), "Not token owner");

            // Add skill if not already present
            if !soulbound.identity_data.verified_skills.contains(&skill) {
                soulbound.identity_data.verified_skills.push(skill);
                self.soulbound_tokens.insert(&token_id, &soulbound);
            }
        } else {
            env::panic_str("Identity token not found");
        }
    }

    /// Get soulbound token info
    pub fn get_identity_token(&self, token_id: TokenId) -> Option<SoulboundToken> {
        self.soulbound_tokens.get(&token_id)
    }

    /// Get achievements for an identity
    pub fn get_achievements(&self, token_id: TokenId) -> Vec<Achievement> {
        if let Some(soulbound) = self.soulbound_tokens.get(&token_id) {
            soulbound.identity_data.achievements
        } else {
            Vec::new()
        }
    }

    /// Get reputation score
    pub fn get_reputation_score(&self, token_id: TokenId) -> u32 {
        if let Some(soulbound) = self.soulbound_tokens.get(&token_id) {
            soulbound.identity_data.reputation_score
        } else {
            0
        }
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

    /// Create predefined achievements
    pub fn create_achievement_templates(&mut self) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can create templates");

        let achievements = vec![
            Achievement {
                id: "first_creation".to_string(),
                name: "First Creation".to_string(),
                description: "Created your first interactive NFT".to_string(),
                earned_at: 0, // Template
                issuer: self.owner_id.clone(),
                rarity: AchievementRarity::Common,
            },
            Achievement {
                id: "viral_artist".to_string(),
                name: "Viral Artist".to_string(),
                description: "NFT received 100+ interactions".to_string(),
                earned_at: 0,
                issuer: self.owner_id.clone(),
                rarity: AchievementRarity::Rare,
            },
            Achievement {
                id: "master_creator".to_string(),
                name: "Master Creator".to_string(),
                description: "Created 50+ interactive NFTs".to_string(),
                earned_at: 0,
                issuer: self.owner_id.clone(),
                rarity: AchievementRarity::Epic,
            },
        ];

        for achievement in achievements {
            self.achievements.insert(&achievement.id, &achievement);
        }
    }
}

// Implement NEAR NFT standards
near_contract_standards::impl_non_fungible_token_core!(SoulboundIdentityContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(SoulboundIdentityContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(SoulboundIdentityContract, tokens);

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
    fn test_soulbound_token_creation() {
        let context = get_context().build();
        testing_env!(context);

        let identity_data = IdentityData {
            creative_profile: CreativeProfile {
                display_name: "Test Artist".to_string(),
                bio: "Creative coder".to_string(),
                artistic_style: vec!["digital".to_string()],
                years_experience: 5,
                primary_medium: "code".to_string(),
                location: Some("Earth".to_string()),
            },
            achievements: Vec::new(),
            reputation_score: 0,
            verified_skills: vec!["Rust".to_string()],
            portfolio_links: vec!["https://example.com".to_string()],
        };

        assert_eq!(identity_data.creative_profile.display_name, "Test Artist");
        assert_eq!(identity_data.reputation_score, 0);
    }

    #[test]
    fn test_achievement_rarity() {
        let achievement = Achievement {
            id: "test".to_string(),
            name: "Test Achievement".to_string(),
            description: "Test".to_string(),
            earned_at: 0,
            issuer: "issuer.testnet".parse().unwrap(),
            rarity: AchievementRarity::Legendary,
        };

        assert_eq!(matches!(achievement.rarity, AchievementRarity::Legendary), true);
    }
}