use biometric_nft_actor::sim::Sim;
use biometric_nft_actor::{BiometricData};

#[test]
fn end_to_end_mint_get_verify_transfer() {
    let mut sim = Sim::new();
    let data = BiometricData {
        emotion_score: 0.85,
        biometric_hash: "h1".to_string(),
        timestamp: 1,
        quality_score: 0.95,
    };
    let owner = 7u64;
    let token_id = sim.mint(owner, data);
    assert_eq!(token_id, 0);
    let meta = sim.get(token_id).unwrap();
    assert_eq!(meta.owner, owner);
    assert!(sim.verify(token_id, "h1"));
    assert!(!sim.verify(token_id, "h2"));
    let transfer_ok = sim.transfer(token_id, 8u64);
    assert!(!transfer_ok);
}
