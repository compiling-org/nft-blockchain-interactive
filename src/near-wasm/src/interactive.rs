//! Interactive NFT functionality

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, AccountId, Timestamp};
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct InteractionEvent {
    pub event_type: String,
    pub timestamp: Timestamp,
    pub user_id: AccountId,
    pub data: near_sdk::serde_json::Value,
    pub intensity: f32,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct InteractiveState {
    pub mood: String,
    pub energy_level: f32,
    pub creativity_index: f32,
    pub interaction_streak: u32,
    pub last_activity: Timestamp,
    pub evolution_stage: String,
}

impl Default for InteractiveState {
    fn default() -> Self {
        Self {
            mood: "neutral".to_string(),
            energy_level: 0.5,
            creativity_index: 0.5,
            interaction_streak: 0,
            last_activity: env::block_timestamp(),
            evolution_stage: "newborn".to_string(),
        }
    }
}

impl InteractiveState {
    pub fn process_interaction(&mut self, interaction: &InteractionEvent) {
        // Update based on interaction type
        match interaction.event_type.as_str() {
            "view" => {
                self.energy_level += 0.01;
                self.interaction_streak += 1;
            }
            "love" | "favorite" => {
                self.mood = "loved".to_string();
                self.energy_level += 0.05;
                self.creativity_index += 0.02;
                self.interaction_streak += 1;
            }
            "share" => {
                self.mood = "shared".to_string();
                self.energy_level += 0.03;
                self.creativity_index += 0.01;
                self.interaction_streak += 1;
            }
            "comment" => {
                self.mood = "engaged".to_string();
                self.energy_level += 0.02;
                self.creativity_index += 0.03;
                self.interaction_streak += 1;
            }
            "ignore" => {
                self.energy_level -= 0.02;
                self.interaction_streak = 0;
                if self.energy_level < 0.2 {
                    self.mood = "lonely".to_string();
                }
            }
            _ => {}
        }

        // Clamp values
        self.energy_level = self.energy_level.clamp(0.0, 1.0);
        self.creativity_index = self.creativity_index.clamp(0.0, 1.0);

        // Update evolution stage
        self.update_evolution_stage();

        self.last_activity = interaction.timestamp;
    }

    fn update_evolution_stage(&mut self) {
        if self.interaction_streak > 100 {
            self.evolution_stage = "legendary".to_string();
        } else if self.interaction_streak > 50 {
            self.evolution_stage = "mature".to_string();
        } else if self.interaction_streak > 20 {
            self.evolution_stage = "growing".to_string();
        } else if self.interaction_streak > 5 {
            self.evolution_stage = "adolescent".to_string();
        } else {
            self.evolution_stage = "young".to_string();
        }
    }

    pub fn get_rarity_score(&self) -> f32 {
        let streak_factor = (self.interaction_streak as f32).sqrt() / 10.0;
        let energy_factor = self.energy_level;
        let creativity_factor = self.creativity_index;

        (streak_factor + energy_factor + creativity_factor) / 3.0
    }

    pub fn should_evolve(&self) -> bool {
        let time_since_last_activity = env::block_timestamp() - self.last_activity;
        let one_day = 24 * 60 * 60 * 1_000_000_000; // nanoseconds

        // Check if it's been a day and we have high engagement
        time_since_last_activity > one_day &&
        self.interaction_streak > 10 &&
        self.energy_level > 0.7
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct InteractiveRules {
    pub max_daily_interactions: u32,
    pub evolution_thresholds: Vec<u32>,
    pub mood_transitions: near_sdk::serde_json::Value,
    pub special_events: Vec<String>,
}

impl Default for InteractiveRules {
    fn default() -> Self {
        Self {
            max_daily_interactions: 10,
            evolution_thresholds: vec![5, 20, 50, 100],
            mood_transitions: near_sdk::serde_json::json!({
                "neutral": ["happy", "sad", "excited"],
                "happy": ["ecstatic", "content", "neutral"],
                "sad": ["neutral", "lonely", "hopeful"],
                "excited": ["ecstatic", "energetic", "neutral"]
            }),
            special_events: vec![
                "birthday".to_string(),
                "anniversary".to_string(),
                "milestone".to_string(),
            ],
        }
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
        builder
    }

    #[test]
    fn test_interactive_state_default() {
        let state = InteractiveState::default();
        assert_eq!(state.mood, "neutral");
        assert_eq!(state.energy_level, 0.5);
        assert_eq!(state.creativity_index, 0.5);
    }

    #[test]
    fn test_interaction_processing() {
        let context = get_context().build();
        testing_env!(context);

        let mut state = InteractiveState::default();

        let interaction = InteractionEvent {
            event_type: "love".to_string(),
            timestamp: env::block_timestamp(),
            user_id: "user.testnet".parse().unwrap(),
            data: near_sdk::serde_json::json!({"intensity": 1.0}),
            intensity: 1.0,
        };

        state.process_interaction(&interaction);

        assert_eq!(state.mood, "loved");
        assert!(state.energy_level > 0.5);
        assert!(state.creativity_index > 0.5);
        assert_eq!(state.interaction_streak, 1);
    }

    #[test]
    fn test_evolution_stages() {
        let context = get_context().build();
        testing_env!(context);

        let mut state = InteractiveState::default();

        // Simulate many interactions
        for i in 0..25 {
            let interaction = InteractionEvent {
                event_type: "love".to_string(),
                timestamp: env::block_timestamp() + i as u64,
                user_id: "user.testnet".parse().unwrap(),
                data: near_sdk::serde_json::json!({"intensity": 1.0}),
                intensity: 1.0,
            };
            state.process_interaction(&interaction);
        }

        assert_eq!(state.evolution_stage, "growing");
        assert_eq!(state.interaction_streak, 25);
    }

    #[test]
    fn test_rarity_score() {
        let mut state = InteractiveState {
            interaction_streak: 25,
            energy_level: 0.8,
            creativity_index: 0.9,
            ..Default::default()
        };

        let rarity = state.get_rarity_score();
        assert!(rarity > 0.0 && rarity <= 1.0);
    }
}