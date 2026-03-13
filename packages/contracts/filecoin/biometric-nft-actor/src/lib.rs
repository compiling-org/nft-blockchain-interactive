pub mod sim;
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};

#[cfg(target_arch = "wasm32")]
use fvm_shared::error::ExitCode;
#[cfg(target_arch = "wasm32")]
use fvm_ipld_encoding::{to_vec, from_slice};

#[cfg(not(target_arch = "wasm32"))]
use fvm_ipld_encoding::{to_vec, from_slice};

// Enhanced biometric NFT actor with proper IPLD storage


#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BiometricData {
    pub emotion_score: f64,
    pub biometric_hash: String,
    pub timestamp: u64,
    pub quality_score: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NFTMetadata {
    pub owner: u64, // Using u64 instead of Address to avoid type issues
    pub biometric_data: BiometricData,
    pub soulbound: bool,
    pub cross_chain_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct State {
    pub nfts: Vec<NFTMetadata>, // Direct storage of NFTs
    pub total_supply: u64,
    pub owner_to_tokens: std::collections::HashMap<u64, Vec<u64>>, // Owner to token IDs mapping
}

impl Default for State {
    fn default() -> Self {
        State {
            nfts: Vec::new(),
            total_supply: 0,
            owner_to_tokens: std::collections::HashMap::new(),
        }
    }
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub extern "C" fn invoke(params: u32) -> u32 {
    match params {
        1 => mint_biometric_nft(params),
        2 => get_nft_metadata(params),
        3 => verify_biometric_data(params),
        4 => transfer_nft(params),
        _ => {
            fvm_sdk::vm::abort(ExitCode::USR_UNHANDLED_MESSAGE.value(), Some("Invalid method"));
        }
    }
}

#[cfg(target_arch = "wasm32")]
fn mint_biometric_nft(params: u32) -> u32 {
    let mut state = load_state();
    let biometric_data = match parse_biometric_params(params) {
        Ok(data) => data,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_ILLEGAL_ARGUMENT.value(), Some("Invalid biometric data"));
        }
    };
    let nft_metadata = NFTMetadata {
        owner: fvm_sdk::message::caller(),
        biometric_data,
        soulbound: true,
        cross_chain_id: format!("filecoin_biometric_{}", state.total_supply),
    };
    state.nfts.push(nft_metadata);
    let caller = fvm_sdk::message::caller();
    state.owner_to_tokens.entry(caller).or_insert_with(Vec::new).push(state.total_supply);
    state.total_supply += 1;
    save_state(&state);
    (state.total_supply - 1) as u32
}

#[cfg(target_arch = "wasm32")]
fn get_nft_metadata(params: u32) -> u32 {
    let state = load_state();
    let token_id = match parse_token_id(params) {
        Ok(id) => id,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_ILLEGAL_ARGUMENT.value(), Some("Invalid token ID"));
        }
    };
    if token_id >= state.nfts.len() as u64 {
        fvm_sdk::vm::abort(ExitCode::USR_NOT_FOUND.value(), Some("NFT not found"));
    }
    let nft = &state.nfts[token_id as usize];
    match to_vec(nft) {
        Ok(_data) => {
            fvm_sdk::vm::exit(0, None, None);
        }
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_SERIALIZATION.value(), Some("Failed to serialize metadata"));
        }
    }
}

#[cfg(target_arch = "wasm32")]
fn verify_biometric_data(params: u32) -> u32 {
    let state = load_state();
    let (token_id, biometric_hash) = match parse_verification_params(params) {
        Ok(data) => data,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_ILLEGAL_ARGUMENT.value(), Some("Invalid verification parameters"));
        }
    };
    if token_id >= state.nfts.len() as u64 {
        fvm_sdk::vm::abort(ExitCode::USR_NOT_FOUND.value(), Some("NFT not found"));
    }
    let nft = &state.nfts[token_id as usize];
    let verification_result = nft.biometric_data.biometric_hash == biometric_hash;
    if verification_result { 
        fvm_sdk::vm::exit(1, None, None); 
    } else { 
        fvm_sdk::vm::exit(0, None, None); 
    }
}

#[cfg(target_arch = "wasm32")]
fn transfer_nft(params: u32) -> u32 {
    let state = load_state();
    let (token_id, _new_owner) = match parse_transfer_params(params) {
        Ok(data) => data,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_ILLEGAL_ARGUMENT.value(), Some("Invalid transfer parameters"));
        }
    };
    if token_id >= state.nfts.len() as u64 {
        fvm_sdk::vm::abort(ExitCode::USR_NOT_FOUND.value(), Some("NFT not found"));
    }
    let nft = &state.nfts[token_id as usize];
    if nft.soulbound {
        fvm_sdk::vm::abort(ExitCode::USR_FORBIDDEN.value(), Some("Soulbound tokens are non-transferable"));
    }
    fvm_sdk::vm::exit(1, None, None)
}

#[cfg(target_arch = "wasm32")]
fn get_params<T: DeserializeOwned>(params_id: u32) -> Result<T, ()> {
    let params_raw = match fvm_sdk::message::params_raw(params_id) {
        Ok(p) => p,
        Err(_) => return Err(()),
    };
    match from_slice(&params_raw.1) {
        Ok(p) => Ok(p),
        Err(_) => Err(()),
    }
}

#[cfg(target_arch = "wasm32")]
fn parse_biometric_params(params: u32) -> Result<BiometricData, ()> {
    get_params(params)
}

#[cfg(target_arch = "wasm32")]
fn parse_token_id(params: u32) -> Result<u64, ()> {
    get_params(params)
}

#[cfg(target_arch = "wasm32")]
fn parse_verification_params(params: u32) -> Result<(u64, String), ()> {
    get_params(params)
}

#[cfg(target_arch = "wasm32")]
fn parse_transfer_params(params: u32) -> Result<(u64, u64), ()> {
    get_params(params)
}

#[cfg(target_arch = "wasm32")]
fn load_state() -> State {
    let root_cid = match fvm_sdk::sself::root() {
        Ok(cid) => cid,
        Err(_) => {
            return State::default();
        }
    };
    match fvm_sdk::ipld::get(&root_cid) {
        Ok(data) => {
            match from_slice(&data) {
                Ok(state) => state,
                Err(_) => State::default(),
            }
        }
        Err(_) => State::default(),
    }
}

#[cfg(target_arch = "wasm32")]
fn save_state(state: &State) {
    let state_data = match to_vec(state) {
        Ok(data) => data,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_SERIALIZATION.value(), Some("Failed to serialize state"));
        }
    };
    let state_cid = match fvm_sdk::ipld::put(0x71, 32, 0x55, &state_data) {
        Ok(cid) => cid,
        Err(_) => {
            fvm_sdk::vm::abort(ExitCode::USR_SERIALIZATION.value(), Some("Failed to store state"));
        }
    };
    if let Err(_) = fvm_sdk::sself::set_root(&state_cid) {
        fvm_sdk::vm::abort(ExitCode::USR_ILLEGAL_STATE.value(), Some("Failed to update state root"));
    }
}
