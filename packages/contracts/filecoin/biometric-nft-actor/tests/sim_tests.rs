use biometric_nft_actor::{sim::Sim, BiometricData};

#[test]
fn mint_and_get_metadata() {
    let mut sim = Sim::new();
    let owner = 42u64;
    let data = BiometricData {
        emotion_score: 0.82,
        biometric_hash: "hash_abc123".to_string(),
        timestamp: 1_736_000_000,
        quality_score: 0.93,
    };
    let token_id = sim.mint(owner, data.clone());
    assert_eq!(token_id, 0u64);

    let meta = sim.get(token_id).expect("metadata must exist");
    assert_eq!(meta.owner, owner);
    assert_eq!(meta.biometric_data.biometric_hash, data.biometric_hash);
    assert!(meta.soulbound);
    assert!(meta.cross_chain_id.starts_with("filecoin_biometric_"));
}

#[test]
fn verify_biometric_hash() {
    let mut sim = Sim::new();
    let owner = 7u64;
    let data = BiometricData {
        emotion_score: 0.71,
        biometric_hash: "verify_me".to_string(),
        timestamp: 1_736_000_100,
        quality_score: 0.88,
    };
    let token_id = sim.mint(owner, data);

    assert!(sim.verify(token_id, "verify_me"));
    assert!(!sim.verify(token_id, "no_match"));
}

#[test]
fn soulbound_transfer_is_blocked() {
    let mut sim = Sim::new();
    let owner = 1u64;
    let data = BiometricData {
        emotion_score: 0.64,
        biometric_hash: "sb_hash".to_string(),
        timestamp: 1_736_000_200,
        quality_score: 0.9,
    };
    let token_id = sim.mint(owner, data);

    let ok = sim.transfer(token_id, 2u64);
    assert!(!ok, "soulbound tokens should not be transferable");
}
