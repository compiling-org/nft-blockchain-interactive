//! # Polkadot Client
//!
//! Client library for interacting with Polkadot chains for creative NFT metadata
//! and cross-chain bridging.

use subxt::{OnlineClient, PolkadotConfig};
use anyhow::Result;

mod emotional_bridge;
mod soulbound;

pub use emotional_bridge::*;
pub use soulbound::*;

/// Polkadot client for creative NFT operations
pub struct PolkadotClient {
    client: OnlineClient<PolkadotConfig>,
}

impl PolkadotClient {
    /// Create a new Polkadot client
    pub async fn new(url: &str) -> Result<Self> {
        let client = OnlineClient::<PolkadotConfig>::from_url(url).await?;
        Ok(Self { client })
    }

    /// Get the underlying subxt client
    pub fn client(&self) -> &OnlineClient<PolkadotConfig> {
        &self.client
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_polkadot_client_creation() {
        let client = PolkadotClient::new("ws://localhost:9944");
        assert_eq!(client.endpoint, "ws://localhost:9944");
    }
}