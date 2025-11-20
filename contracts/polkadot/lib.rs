#![cfg_attr(not(feature = "std"), no_std)]

use ink::prelude::vec::Vec;
use ink::prelude::string::String;
use ink::storage::Mapping;
use scale::{Decode, Encode};

#[ink::contract]
mod soulbound_identity {
    use super::*;

    /// Identity information stored for each soulbound identity
    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Identity {
        /// Unique identifier for the identity
        pub identity_id: u64,
        /// Account address of the identity owner
        pub owner: AccountId,
        /// Human-readable name for the identity
        pub name: String,
        /// Biometric hash for verification
        pub biometric_hash: Vec<u8>,
        /// Emotional parameters (valence, arousal, dominance)
        pub emotion_data: EmotionData,
        /// Additional metadata stored as IPFS hash
        pub metadata_uri: String,
        /// Timestamp when identity was created
        pub created_at: u64,
        /// Whether this identity is verified
        pub verified: bool,
        /// Reputation score (0-100)
        pub reputation_score: u8,
    }

    /// Emotional data structure for biometric integration
    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct EmotionData {
        /// Valence: positive/negative emotion (-1.0 to 1.0)
        pub valence: i8,
        /// Arousal: energy level (-1.0 to 1.0, scaled to -128 to 127)
        pub arousal: i8,
        /// Dominance: control level (-1.0 to 1.0, scaled to -128 to 127)
        pub dominance: i8,
        /// Confidence in emotion detection (0-100)
        pub confidence: u8,
        /// Timestamp of emotion reading
        pub timestamp: u64,
    }

    /// Verification request for identity
    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct VerificationRequest {
        /// Identity being verified
        pub identity_id: u64,
        /// Verifier account
        pub verifier: AccountId,
        /// Verification type (biometric, social, etc.)
        pub verification_type: VerificationType,
        /// Verification data
        pub verification_data: Vec<u8>,
        /// Status of verification
        pub status: VerificationStatus,
    }

    /// Type of verification
    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum VerificationType {
        Biometric,
        Social,
        Government,
        Community,
    }

    /// Status of verification
    #[derive(Debug, Clone, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum VerificationStatus {
        Pending,
        Approved,
        Rejected,
        Expired,
    }

    /// Events emitted by the contract
    #[ink(event)]
    pub struct IdentityCreated {
        #[ink(topic)]
        identity_id: u64,
        #[ink(topic)]
        owner: AccountId,
        name: String,
    }

    #[ink(event)]
    pub struct IdentityUpdated {
        #[ink(topic)]
        identity_id: u64,
        #[ink(topic)]
        owner: AccountId,
    }

    #[ink(event)]
    pub struct IdentityVerified {
        #[ink(topic)]
        identity_id: u64,
        verifier: AccountId,
        reputation_score: u8,
    }

    #[ink(event)]
    pub struct VerificationRequested {
        #[ink(topic)]
        identity_id: u64,
        verifier: AccountId,
        verification_type: VerificationType,
    }

    /// Storage structure for the contract
    #[ink(storage)]
    pub struct SoulboundIdentity {
        /// Mapping from identity ID to identity data
        identities: Mapping<u64, Identity>,
        /// Mapping from account to their identity ID (one-to-one relationship)
        owner_to_identity: Mapping<AccountId, u64>,
        /// Mapping from identity ID to verification requests
        verification_requests: Mapping<u64, Vec<VerificationRequest>>,
        /// Counter for identity IDs
        identity_counter: u64,
        /// Contract owner
        owner: AccountId,
        /// Authorized verifiers
        authorized_verifiers: Mapping<AccountId, bool>,
    }

    impl SoulboundIdentity {
        /// Constructor that initializes the contract
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                identities: Mapping::default(),
                owner_to_identity: Mapping::default(),
                verification_requests: Mapping::default(),
                identity_counter: 0,
                owner: caller,
                authorized_verifiers: Mapping::default(),
            }
        }

        /// Create a new soulbound identity
        #[ink(message)]
        pub fn create_identity(
            &mut self,
            name: String,
            biometric_hash: Vec<u8>,
            emotion_data: EmotionData,
            metadata_uri: String,
        ) -> Result<u64, Error> {
            let caller = self.env().caller();
            
            // Ensure user doesn't already have an identity
            if self.owner_to_identity.contains(caller) {
                return Err(Error::AlreadyHasIdentity);
            }

            // Generate new identity ID
            self.identity_counter += 1;
            let identity_id = self.identity_counter;

            let identity = Identity {
                identity_id,
                owner: caller,
                name: name.clone(),
                biometric_hash,
                emotion_data,
                metadata_uri,
                created_at: self.env().block_timestamp(),
                verified: false,
                reputation_score: 0,
            };

            // Store identity
            self.identities.insert(identity_id, &identity);
            self.owner_to_identity.insert(caller, &identity_id);

            // Emit event
            self.env().emit_event(IdentityCreated {
                identity_id,
                owner: caller,
                name,
            });

            Ok(identity_id)
        }

        /// Update identity information
        #[ink(message)]
        pub fn update_identity(
            &mut self,
            identity_id: u64,
            name: Option<String>,
            biometric_hash: Option<Vec<u8>>,
            emotion_data: Option<EmotionData>,
            metadata_uri: Option<String>,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            
            let mut identity = self.get_identity(identity_id)?;
            
            // Ensure caller owns the identity
            if identity.owner != caller {
                return Err(Error::NotOwner);
            }

            // Update fields if provided
            if let Some(name) = name {
                identity.name = name;
            }
            if let Some(biometric_hash) = biometric_hash {
                identity.biometric_hash = biometric_hash;
            }
            if let Some(emotion_data) = emotion_data {
                identity.emotion_data = emotion_data;
            }
            if let Some(metadata_uri) = metadata_uri {
                identity.metadata_uri = metadata_uri;
            }

            // Store updated identity
            self.identities.insert(identity_id, &identity);

            // Emit event
            self.env().emit_event(IdentityUpdated {
                identity_id,
                owner: caller,
            });

            Ok(())
        }

        /// Request verification for an identity
        #[ink(message)]
        pub fn request_verification(
            &mut self,
            identity_id: u64,
            verification_type: VerificationType,
            verification_data: Vec<u8>,
        ) -> Result<(), Error> {
            let verifier = self.env().caller();
            
            // Ensure identity exists
            let identity = self.get_identity(identity_id)?;
            
            // Ensure verifier is authorized
            if !self.authorized_verifiers.contains(verifier) || !self.authorized_verifiers.get(verifier).unwrap_or(false) {
                return Err(Error::UnauthorizedVerifier);
            }

            let request = VerificationRequest {
                identity_id,
                verifier,
                verification_type: verification_type.clone(),
                verification_data,
                status: VerificationStatus::Pending,
            };

            // Add verification request
            let mut requests = self.verification_requests.get(identity_id).unwrap_or_default();
            requests.push(request);
            self.verification_requests.insert(identity_id, &requests);

            // Emit event
            self.env().emit_event(VerificationRequested {
                identity_id,
                verifier,
                verification_type,
            });

            Ok(())
        }

        /// Approve verification for an identity
        #[ink(message)]
        pub fn approve_verification(
            &mut self,
            identity_id: u64,
            verifier: AccountId,
            reputation_score: u8,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            
            // Ensure caller is the verifier
            if caller != verifier {
                return Err(Error::UnauthorizedVerifier);
            }

            // Get verification requests
            let mut requests = self.verification_requests.get(identity_id).unwrap_or_default();
            
            // Find and update the request
            let mut found = false;
            for request in requests.iter_mut() {
                if request.verifier == verifier && request.status == VerificationStatus::Pending {
                    request.status = VerificationStatus::Approved;
                    found = true;
                    break;
                }
            }

            if !found {
                return Err(Error::VerificationRequestNotFound);
            }

            // Update verification requests
            self.verification_requests.insert(identity_id, &requests);

            // Update identity verification status
            let mut identity = self.get_identity(identity_id)?;
            identity.verified = true;
            identity.reputation_score = reputation_score.min(100);
            self.identities.insert(identity_id, &identity);

            // Emit event
            self.env().emit_event(IdentityVerified {
                identity_id,
                verifier,
                reputation_score,
            });

            Ok(())
        }

        /// Get identity by ID
        #[ink(message)]
        pub fn get_identity(&self, identity_id: u64) -> Result<Identity, Error> {
            self.identities.get(identity_id).ok_or(Error::IdentityNotFound)
        }

        /// Get identity by owner address
        #[ink(message)]
        pub fn get_identity_by_owner(&self, owner: AccountId) -> Result<Identity, Error> {
            let identity_id = self.owner_to_identity.get(owner).ok_or(Error::NoIdentity)?;
            self.get_identity(identity_id)
        }

        /// Get verification requests for an identity
        #[ink(message)]
        pub fn get_verification_requests(&self, identity_id: u64) -> Vec<VerificationRequest> {
            self.verification_requests.get(identity_id).unwrap_or_default()
        }

        /// Add authorized verifier (owner only)
        #[ink(message)]
        pub fn add_authorized_verifier(&mut self, verifier: AccountId) -> Result<(), Error> {
            let caller = self.env().caller();
            if caller != self.owner {
                return Err(Error::NotOwner);
            }
            self.authorized_verifiers.insert(verifier, &true);
            Ok(())
        }

        /// Remove authorized verifier (owner only)
        #[ink(message)]
        pub fn remove_authorized_verifier(&mut self, verifier: AccountId) -> Result<(), Error> {
            let caller = self.env().caller();
            if caller != self.owner {
                return Err(Error::NotOwner);
            }
            self.authorized_verifiers.insert(verifier, &false);
            Ok(())
        }

        /// Get total number of identities
        #[ink(message)]
        pub fn identity_count(&self) -> u64 {
            self.identity_counter
        }

        /// Check if an account has an identity
        #[ink(message)]
        pub fn has_identity(&self, account: AccountId) -> bool {
            self.owner_to_identity.contains(account)
        }
    }

    /// Error types for the contract
    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Identity not found
        IdentityNotFound,
        /// User already has an identity
        AlreadyHasIdentity,
        /// User does not have an identity
        NoIdentity,
        /// Not the owner of the identity
        NotOwner,
        /// Unauthorized verifier
        UnauthorizedVerifier,
        /// Verification request not found
        VerificationRequestNotFound,
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<Environment>()
        }

        fn set_caller(caller: AccountId) {
            ink::env::test::set_caller::<Environment>(caller);
        }

        fn create_test_emotion_data() -> EmotionData {
            EmotionData {
                valence: 50,    // 0.39 (scaled from -128 to 127)
                arousal: 30,    // 0.23
                dominance: 40,  // 0.31
                confidence: 85,
                timestamp: 1640995200, // Mock timestamp
            }
        }

        #[ink::test]
        fn test_create_identity() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            
            let mut contract = SoulboundIdentity::new();
            
            let name = String::from("Alice Identity");
            let biometric_hash = vec![1, 2, 3, 4, 5];
            let emotion_data = create_test_emotion_data();
            let metadata_uri = String::from("ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
            
            let result = contract.create_identity(
                name.clone(),
                biometric_hash.clone(),
                emotion_data.clone(),
                metadata_uri.clone(),
            );
            
            assert!(result.is_ok());
            let identity_id = result.unwrap();
            assert_eq!(identity_id, 1);
            
            // Verify identity was created
            let identity = contract.get_identity(identity_id).unwrap();
            assert_eq!(identity.name, name);
            assert_eq!(identity.biometric_hash, biometric_hash);
            assert_eq!(identity.emotion_data.valence, emotion_data.valence);
            assert_eq!(identity.metadata_uri, metadata_uri);
            assert!(!identity.verified);
            assert_eq!(identity.reputation_score, 0);
        }

        #[ink::test]
        fn test_cannot_create_multiple_identities() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            
            let mut contract = SoulboundIdentity::new();
            
            let emotion_data = create_test_emotion_data();
            
            // Create first identity
            let result1 = contract.create_identity(
                String::from("First Identity"),
                vec![1, 2, 3],
                emotion_data.clone(),
                String::from("ipfs://first"),
            );
            assert!(result1.is_ok());
            
            // Try to create second identity - should fail
            let result2 = contract.create_identity(
                String::from("Second Identity"),
                vec![4, 5, 6],
                emotion_data,
                String::from("ipfs://second"),
            );
            assert_eq!(result2, Err(Error::AlreadyHasIdentity));
        }

        #[ink::test]
        fn test_update_identity() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            
            let mut contract = SoulboundIdentity::new();
            
            let emotion_data = create_test_emotion_data();
            
            // Create identity
            let identity_id = contract.create_identity(
                String::from("Original Name"),
                vec![1, 2, 3],
                emotion_data.clone(),
                String::from("ipfs://original"),
            ).unwrap();
            
            // Update identity
            let new_name = String::from("Updated Name");
            let new_biometric_hash = vec![7, 8, 9];
            let mut new_emotion_data = emotion_data.clone();
            new_emotion_data.valence = 60;
            let new_metadata_uri = String::from("ipfs://updated");
            
            let result = contract.update_identity(
                identity_id,
                Some(new_name.clone()),
                Some(new_biometric_hash.clone()),
                Some(new_emotion_data.clone()),
                Some(new_metadata_uri.clone()),
            );
            
            assert!(result.is_ok());
            
            // Verify updates
            let identity = contract.get_identity(identity_id).unwrap();
            assert_eq!(identity.name, new_name);
            assert_eq!(identity.biometric_hash, new_biometric_hash);
            assert_eq!(identity.emotion_data.valence, new_emotion_data.valence);
            assert_eq!(identity.metadata_uri, new_metadata_uri);
        }

        #[ink::test]
        fn test_cannot_update_others_identity() {
            let accounts = default_accounts();
            
            let mut contract = SoulboundIdentity::new();
            
            let emotion_data = create_test_emotion_data();
            
            // Alice creates identity
            set_caller(accounts.alice);
            let identity_id = contract.create_identity(
                String::from("Alice Identity"),
                vec![1, 2, 3],
                emotion_data,
                String::from("ipfs://alice"),
            ).unwrap();
            
            // Bob tries to update Alice's identity - should fail
            set_caller(accounts.bob);
            let result = contract.update_identity(
                identity_id,
                Some(String::from("Bob's Update")),
                None,
                None,
                None,
            );
            
            assert_eq!(result, Err(Error::NotOwner));
        }

        #[ink::test]
        fn test_verification_flow() {
            let accounts = default_accounts();
            
            let mut contract = SoulboundIdentity::new();
            
            let emotion_data = create_test_emotion_data();
            
            // Alice creates identity
            set_caller(accounts.alice);
            let identity_id = contract.create_identity(
                String::from("Alice Identity"),
                vec![1, 2, 3],
                emotion_data,
                String::from("ipfs://alice"),
            ).unwrap();
            
            // Contract owner adds Bob as authorized verifier
            set_caller(accounts.alice); // Contract owner
            contract.add_authorized_verifier(accounts.bob).unwrap();
            
            // Bob requests verification
            set_caller(accounts.bob);
            let result = contract.request_verification(
                identity_id,
                VerificationType::Biometric,
                vec![9, 8, 7, 6, 5],
            );
            assert!(result.is_ok());
            
            // Bob approves verification
            let result = contract.approve_verification(
                identity_id,
                accounts.bob,
                85,
            );
            assert!(result.is_ok());
            
            // Verify identity is now verified
            let identity = contract.get_identity(identity_id).unwrap();
            assert!(identity.verified);
            assert_eq!(identity.reputation_score, 85);
        }
    }
}