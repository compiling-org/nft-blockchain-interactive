//! Soulbound Token Pallet
//! 
//! Non-transferable tokens for creator identity and reputation across chains

#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    dispatch::DispatchResult,
    pallet_prelude::*,
    traits::{Currency, ReservableCurrency},
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
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
    }

    /// Soulbound token data
    #[pallet::storage]
    #[pallet::getter(fn soulbound_token)]
    pub type SoulboundTokens<T: Config> = StorageDoubleMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        Blake2_128Concat,
        u64,
        SoulboundToken<T::AccountId>,
        OptionQuery,
    >;

    /// Next token ID
    #[pallet::storage]
    #[pallet::getter(fn next_token_id)]
    pub type NextTokenId<T> = StorageValue<_, u64, ValueQuery>;

    /// Creator reputation scores
    #[pallet::storage]
    #[pallet::getter(fn reputation)]
    pub type Reputation<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        ReputationData,
        ValueQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Soulbound token minted
        TokenMinted { owner: T::AccountId, token_id: u64 },
        /// Reputation updated
        ReputationUpdated { account: T::AccountId, new_score: u32 },
        /// Token metadata updated
        MetadataUpdated { owner: T::AccountId, token_id: u64 },
    }

    #[pallet::error]
    pub enum Error<T> {
        /// Token does not exist
        TokenNotFound,
        /// Not the token owner
        NotTokenOwner,
        /// Cannot transfer soulbound token
        CannotTransfer,
        /// Invalid reputation score
        InvalidReputation,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Mint a new soulbound token
        #[pallet::weight(10_000)]
        #[pallet::call_index(0)]
        pub fn mint_soulbound(
            origin: OriginFor<T>,
            token_type: TokenType,
            metadata: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let token_id = NextTokenId::<T>::get();
            NextTokenId::<T>::put(token_id + 1);

            let token = SoulboundToken {
                owner: who.clone(),
                token_id,
                token_type,
                metadata,
                issued_at: <frame_system::Pallet<T>>::block_number(),
                is_revoked: false,
            };

            SoulboundTokens::<T>::insert(&who, token_id, token);

            Self::deposit_event(Event::TokenMinted {
                owner: who,
                token_id,
            });

            Ok(())
        }

        /// Update reputation score
        #[pallet::weight(10_000)]
        #[pallet::call_index(1)]
        pub fn update_reputation(
            origin: OriginFor<T>,
            target: T::AccountId,
            score_delta: i32,
        ) -> DispatchResult {
            ensure_signed(origin)?;

            Reputation::<T>::mutate(&target, |rep| {
                let new_score = if score_delta >= 0 {
                    rep.score.saturating_add(score_delta as u32)
                } else {
                    rep.score.saturating_sub((-score_delta) as u32)
                };
                rep.score = new_score;
                rep.total_interactions += 1;
            });

            let new_rep = Reputation::<T>::get(&target);
            Self::deposit_event(Event::ReputationUpdated {
                account: target,
                new_score: new_rep.score,
            });

            Ok(())
        }

        /// Update token metadata
        #[pallet::weight(10_000)]
        #[pallet::call_index(2)]
        pub fn update_metadata(
            origin: OriginFor<T>,
            token_id: u64,
            new_metadata: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            SoulboundTokens::<T>::try_mutate(&who, token_id, |maybe_token| {
                let token = maybe_token.as_mut().ok_or(Error::<T>::TokenNotFound)?;
                ensure!(token.owner == who, Error::<T>::NotTokenOwner);
                token.metadata = new_metadata;
                Ok::<(), Error<T>>(())
            })?;

            Self::deposit_event(Event::MetadataUpdated {
                owner: who,
                token_id,
            });

            Ok(())
        }
    }
}

/// Soulbound token structure
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct SoulboundToken<AccountId> {
    pub owner: AccountId,
    pub token_id: u64,
    pub token_type: TokenType,
    pub metadata: Vec<u8>,
    pub issued_at: u32,
    pub is_revoked: bool,
}

/// Type of soulbound token
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum TokenType {
    CreatorIdentity,
    ReputationBadge,
    Achievement,
    Membership,
    Certification,
}

/// Reputation data for creators
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen, Default)]
pub struct ReputationData {
    pub score: u32,
    pub total_interactions: u32,
    pub badges: u32,
}
