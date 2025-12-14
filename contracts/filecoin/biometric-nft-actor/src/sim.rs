use crate::{BiometricData, NFTMetadata, State};

pub struct Sim {
    pub state: State,
}

impl Sim {
    pub fn new() -> Self {
        Self { state: State::default() }
    }

    pub fn mint(&mut self, owner: u64, data: BiometricData) -> u64 {
        let token_id = self.state.total_supply;
        let meta = NFTMetadata {
            owner,
            biometric_data: data,
            soulbound: true,
            cross_chain_id: format!("filecoin_biometric_{}", token_id),
        };
        self.state.nfts.push(meta);
        self.state.owner_to_tokens.entry(owner).or_insert_with(Vec::new).push(token_id);
        self.state.total_supply += 1;
        token_id
    }

    pub fn get(&self, token_id: u64) -> Option<&NFTMetadata> {
        if token_id >= self.state.nfts.len() as u64 {
            return None;
        }
        self.state.nfts.get(token_id as usize)
    }

    pub fn verify(&self, token_id: u64, hash: &str) -> bool {
        match self.get(token_id) {
            Some(nft) => nft.biometric_data.biometric_hash == hash,
            None => false,
        }
    }

    pub fn transfer(&mut self, token_id: u64, new_owner: u64) -> bool {
        if token_id >= self.state.nfts.len() as u64 {
            return false;
        }
        let nft = &self.state.nfts[token_id as usize];
        if nft.soulbound {
            return false;
        }
        let old_owner = nft.owner;
        if let Some(list) = self.state.owner_to_tokens.get_mut(&old_owner) {
            if let Some(pos) = list.iter().position(|t| *t == token_id) {
                list.remove(pos);
            }
        }
        self.state.owner_to_tokens.entry(new_owner).or_insert_with(Vec::new).push(token_id);
        true
    }
}
