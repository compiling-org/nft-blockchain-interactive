use std::fs;
use std::path::PathBuf;

#[test]
fn wasm_artifact_exists_and_is_valid() {
    // Resolve the expected wasm path relative to the crate root
    let mut wasm_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    wasm_path.push("target");
    wasm_path.push("wasm32-unknown-unknown");
    wasm_path.push("release");
    wasm_path.push("biometric_nft_actor.wasm");

    // Ensure the wasm file exists
    assert!(
        wasm_path.exists(),
        "WASM artifact not found at {:?}. Build with `cargo build --release --target wasm32-unknown-unknown` before running tests.",
        wasm_path
    );

    // Read bytes and validate the wasm magic header
    let bytes = fs::read(&wasm_path).expect("Failed to read wasm file");
    assert!(
        bytes.len() > 8,
        "WASM file is unexpectedly small: {} bytes",
        bytes.len()
    );
    let magic = &bytes[0..4];
    assert_eq!(
        magic,
        &[0x00, 0x61, 0x73, 0x6d],
        "Invalid WASM magic header in {:?}",
        wasm_path
    );
}
