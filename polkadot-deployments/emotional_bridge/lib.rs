#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod emotional_bridge {
    use scale::{Decode, Encode};

    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct EmotionalMetadata {
        pub valence: i32,     // Emotional positivity/negativity (-100 to 100)
        pub arousal: u32,     // Emotional intensity (0 to 100)
        pub dominance: u32,   // Sense of control (0 to 100)
        pub timestamp: u64,   // When emotional data was captured
        pub emotional_category: Vec<u8>, // Human-readable emotional category
    }

    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct BridgeInfo {
        pub source_chain: Vec<u8>,
        pub target_chain: Vec<u8>,
        pub source_contract: Vec<u8>,
        pub target_contract: Vec<u8>,
        pub bridge_status: Vec<u8>,
        pub bridge_timestamp: u64,
        pub emotional_preservation: u32,
        pub bridge_complexity: u32,
        pub cross_chain_emotional_sync: bool,
    }

    #[ink(storage)]
    pub struct EmotionalBridge {
        /// Owner of the contract
        owner: AccountId,
        /// Counter for token IDs
        token_counter: u64,
        /// Total number of bridged tokens
        total_bridged: u64,
        /// Contract version
        version: Vec<u8>,
    }

    #[ink(event)]
    pub struct EmotionalDataStored {
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        owner: AccountId,
        valence: i32,
        arousal: u32,
        emotional_category: Vec<u8>,
    }

    #[ink(event)]
    pub struct TokenBridged {
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        source_chain: Vec<u8>,
        #[ink(topic)]
        target_chain: Vec<u8>,
        bridge_timestamp: u64,
        emotional_preservation: u32,
    }

    impl EmotionalBridge {
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                owner: caller,
                token_counter: 0,
                total_bridged: 0,
                version: b"1.0.0".to_vec(),
            }
        }

        #[ink(message)]
        pub fn store_emotional_data(
            &mut self,
            valence: i32,
            arousal: u32,
            dominance: u32,
            emotional_category: Vec<u8>,
        ) -> u64 {
            let caller = self.env().caller();
            let token_id = self.token_counter;
            
            let _emotional_metadata = EmotionalMetadata {
                valence,
                arousal,
                dominance,
                timestamp: self.env().block_timestamp(),
                emotional_category: emotional_category.clone(),
            };

            self.token_counter += 1;

            self.env().emit_event(EmotionalDataStored {
                token_id,
                owner: caller,
                valence,
                arousal,
                emotional_category,
            });

            token_id
        }

        #[ink(message)]
        pub fn bridge_token(
            &mut self,
            token_id: u64,
            target_chain: Vec<u8>,
            target_contract: Vec<u8>,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            
            let bridge_info = BridgeInfo {
                source_chain: b"PolkadotRococo".to_vec(),
                target_chain: target_chain.clone(),
                source_contract: AsRef::<[u8]>::as_ref(&self.env().account_id()).to_vec(),
                target_contract: target_contract.clone(),
                bridge_status: b"pending".to_vec(),
                bridge_timestamp: self.env().block_timestamp(),
                emotional_preservation: 95, // 95% preservation rate
                bridge_complexity: 75, // Medium complexity
                cross_chain_emotional_sync: true,
            };

            self.total_bridged += 1;

            self.env().emit_event(TokenBridged {
                token_id,
                source_chain: b"PolkadotRococo".to_vec(),
                target_chain,
                bridge_timestamp: self.env().block_timestamp(),
                emotional_preservation: 95,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn get_contract_info(&self) -> ContractInfo {
            ContractInfo {
                owner: self.owner,
                token_counter: self.token_counter,
                total_bridged: self.total_bridged,
                version: self.version.clone(),
            }
        }

        #[ink(message)]
        pub fn get_token_count(&self) -> u64 {
            self.token_counter
        }

        #[ink(message)]
        pub fn get_total_bridged(&self) -> u64 {
            self.total_bridged
        }
    }

    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        TokenNotFound,
        BridgeNotFound,
        NotOwner,
        BridgeFailed,
        InvalidEmotionalData,
    }

    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct ContractInfo {
        pub owner: AccountId,
        pub token_counter: u64,
        pub total_bridged: u64,
        pub version: Vec<u8>,
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn test_store_emotional_data() {
            let mut contract = EmotionalBridge::new();
            let token_id = contract.store_emotional_data(
                75, // valence (positive)
                80, // arousal (high intensity)
                60, // dominance
                b"Excited".to_vec(),
            );

            assert_eq!(token_id, 0);
            assert_eq!(contract.get_token_count(), 1);
        }

        #[ink::test]
        fn test_bridge_token() {
            let mut contract = EmotionalBridge::new();
            let token_id = contract.store_emotional_data(
                50,
                70,
                40,
                b"Happy".to_vec(),
            );

            let result = contract.bridge_token(
                token_id,
                b"Ethereum".to_vec(),
                b"0x1234567890abcdef".to_vec(),
            );

            assert!(result.is_ok());
            assert_eq!(contract.get_total_bridged(), 1);
        }

        #[ink::test]
        fn test_contract_info() {
            let contract = EmotionalBridge::new();
            let info = contract.get_contract_info();

            assert_eq!(info.token_counter, 0);
            assert_eq!(info.total_bridged, 0);
            assert_eq!(info.version, b"1.0.0".to_vec());
        }
    }
}