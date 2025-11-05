//! Emotional State Cross-Chain Bridge
//! 
//! Bridge for Neuroemotive AI data between NEAR, Solana, and Polkadot

#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    dispatch::DispatchResult,
    pallet_prelude::*,
};
use frame_system::pallet_prelude::*;
use sp_std::vec::Vec;

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    /// Emotional state proofs from other chains
    #[pallet::storage]
    #[pallet::getter(fn emotional_proof)]
    pub type EmotionalProofs<T: Config> = StorageDoubleMap<
        _,
        Blake2_128Concat,
        SourceChain,
        Blake2_128Concat,
        Vec<u8>, // Transaction hash from source chain
        EmotionalStateProof,
        OptionQuery,
    >;

    /// Cross-chain session mappings
    #[pallet::storage]
    #[pallet::getter(fn session_mapping)]
    pub type SessionMappings<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        Vec<u8>, // Session ID
        CrossChainSession<T::AccountId>,
        OptionQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Emotional state proof submitted
        ProofSubmitted { chain: SourceChain, tx_hash: Vec<u8> },
        /// Cross-chain session created
        SessionCreated { session_id: Vec<u8>, chains: Vec<SourceChain> },
        /// Emotional data synchronized
        DataSynchronized { session_id: Vec<u8> },
    }

    #[pallet::error]
    pub enum Error<T> {
        /// Invalid proof
        InvalidProof,
        /// Session not found
        SessionNotFound,
        /// Chain not supported
        UnsupportedChain,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Submit emotional state proof from another chain
        #[pallet::weight(10_000)]
        #[pallet::call_index(0)]
        pub fn submit_emotional_proof(
            origin: OriginFor<T>,
            chain: SourceChain,
            tx_hash: Vec<u8>,
            emotional_data: EmotionalVector,
            zk_proof: Vec<u8>,
        ) -> DispatchResult {
            ensure_signed(origin)?;

            let proof = EmotionalStateProof {
                chain: chain.clone(),
                tx_hash: tx_hash.clone(),
                emotional_data,
                zk_proof,
                timestamp: <frame_system::Pallet<T>>::block_number(),
                verified: false, // Would verify ZK proof in production
            };

            EmotionalProofs::<T>::insert(&chain, &tx_hash, proof);

            Self::deposit_event(Event::ProofSubmitted { chain, tx_hash });

            Ok(())
        }

        /// Create cross-chain session
        #[pallet::weight(10_000)]
        #[pallet::call_index(1)]
        pub fn create_cross_chain_session(
            origin: OriginFor<T>,
            session_id: Vec<u8>,
            chains: Vec<SourceChain>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let session = CrossChainSession {
                session_id: session_id.clone(),
                creator: who,
                chains: chains.clone(),
                emotional_states: Vec::new(),
                created_at: <frame_system::Pallet<T>>::block_number(),
            };

            SessionMappings::<T>::insert(&session_id, session);

            Self::deposit_event(Event::SessionCreated { session_id, chains });

            Ok(())
        }

        /// Synchronize emotional data across chains
        #[pallet::weight(10_000)]
        #[pallet::call_index(2)]
        pub fn sync_emotional_data(
            origin: OriginFor<T>,
            session_id: Vec<u8>,
            chain: SourceChain,
            data: Vec<EmotionalVector>,
        ) -> DispatchResult {
            ensure_signed(origin)?;

            SessionMappings::<T>::try_mutate(&session_id, |maybe_session| {
                let session = maybe_session.as_mut().ok_or(Error::<T>::SessionNotFound)?;
                
                // Add emotional states from source chain
                for emotional_state in data {
                    session.emotional_states.push((chain.clone(), emotional_state));
                }
                
                Ok::<(), Error<T>>(())
            })?;

            Self::deposit_event(Event::DataSynchronized { session_id });

            Ok(())
        }
    }
}

/// Source blockchain
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum SourceChain {
    NEAR,
    Solana,
    Ethereum,
    Polkadot,
}

/// Emotional vector (Valence-Arousal-Dominance)
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct EmotionalVector {
    pub valence: i32,   // Scaled -100 to 100
    pub arousal: u32,   // Scaled 0 to 100
    pub dominance: u32, // Scaled 0 to 100
}

/// Proof of emotional state from another chain
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct EmotionalStateProof {
    pub chain: SourceChain,
    pub tx_hash: Vec<u8>,
    pub emotional_data: EmotionalVector,
    pub zk_proof: Vec<u8>,
    pub timestamp: u32,
    pub verified: bool,
}

/// Cross-chain session tracking
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct CrossChainSession<AccountId> {
    pub session_id: Vec<u8>,
    pub creator: AccountId,
    pub chains: Vec<SourceChain>,
    pub emotional_states: Vec<(SourceChain, EmotionalVector)>,
    pub created_at: u32,
}

impl EmotionalVector {
    /// Calculate distance between two emotional states
    pub fn distance(&self, other: &EmotionalVector) -> u32 {
        let dv = (self.valence - other.valence).abs() as u32;
        let da = (self.arousal as i32 - other.arousal as i32).abs() as u32;
        let dd = (self.dominance as i32 - other.dominance as i32).abs() as u32;
        
        // Euclidean distance
        ((dv * dv + da * da + dd * dd) as f64).sqrt() as u32
    }
}
