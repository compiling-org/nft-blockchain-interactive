//! # NFT IPFS Integration
//!
//! Module for calculating content-addressed hash (CID) and pinning/retrieving data from IPFS/Filecoin.
//! Supports storage for NUWE, MODURUST, and Neuroemotive AI projects.

use cid::Cid;
use ipfs_api::IpfsClient as IpfsApiClient;
use multihash::{Code, MultihashDigest};
use serde::{Deserialize, Serialize};
use std::io::Cursor;

mod ipfs_client;
mod nuwe_storage;
mod modurust_storage;
mod neuroemotive_storage;

pub use ipfs_client::*;
pub use nuwe_storage::*;
pub use modurust_storage::*;
pub use neuroemotive_storage::*;

/// IPFS persistence layer for creative data
pub struct IpfsPersistenceLayer {
    client: IpfsApiClient,
    gateway_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PinResponse {
    pub cid: String,
    pub size: u64,
    pub timestamp: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreativeAsset {
    pub name: String,
    pub description: String,
    pub data: Vec<u8>,
    pub content_type: String,
    pub metadata: serde_json::Value,
}

impl IpfsPersistenceLayer {
    /// Create a new IPFS persistence layer
    pub fn new(host: &str, port: u16) -> Self {
        Self {
            client: IpfsClient::from_host_and_port(host, port).unwrap(),
            gateway_url: format!("http://{}:{}", host, port),
        }
    }

    /// Generate CID from creative data
    pub fn generate_cid(&self, data: &[u8]) -> Result<Cid, Box<dyn std::error::Error>> {
        // Create SHA-256 hash
        let hash = Code::Sha2_256.digest(data);

        // Create CID v1 with raw codec
        let cid = Cid::new_v1(0x55, hash);

        Ok(cid)
    }

    /// Add data to IPFS and return CID
    pub async fn add_to_ipfs(&self, data: &[u8]) -> Result<Cid, Box<dyn std::error::Error>> {
        let cursor = Cursor::new(data);
        let response = self.client.add(cursor).await?;

        // Parse the CID from response
        let cid = Cid::try_from(response.hash.as_str())?;

        Ok(cid)
    }

    /// Pin content to IPFS
    pub async fn pin_content(&self, cid: &Cid) -> Result<PinResponse, Box<dyn std::error::Error>> {
        let pin_response = self.client.pin_add(cid.to_string().as_str(), true).await?;

        Ok(PinResponse {
            cid: pin_response.pins[0].clone(),
            size: 0, // Would need to get actual size
            timestamp: chrono::Utc::now().to_rfc3339(),
        })
    }

    /// Retrieve data from IPFS by CID
    pub async fn get_from_ipfs(&self, cid: &Cid) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        let data = self.client.cat(cid.to_string().as_str()).await?;
        let bytes = data.collect::<Vec<_>>().await;
        Ok(bytes)
    }

    /// Create and upload creative asset
    pub async fn upload_creative_asset(&self, asset: CreativeAsset) -> Result<(Cid, PinResponse), Box<dyn std::error::Error>> {
        // Serialize asset data
        let asset_json = serde_json::to_vec(&asset)?;

        // Add to IPFS
        let cid = self.add_to_ipfs(&asset_json).await?;

        // Pin the content
        let pin_response = self.pin_content(&cid).await?;

        Ok((cid, pin_response))
    }

    /// Generate metadata for NFT
    pub fn generate_nft_metadata(&self, cid: &Cid, name: &str, description: &str) -> serde_json::Value {
        serde_json::json!({
            "name": name,
            "description": description,
            "image": format!("ipfs://{}", cid),
            "external_url": format!("https://ipfs.io/ipfs/{}", cid),
            "attributes": [
                {
                    "trait_type": "Creative Medium",
                    "value": "Generated Art"
                },
                {
                    "trait_type": "Storage",
                    "value": "IPFS"
                }
            ]
        })
    }
}

/// Utility function to create creative asset
pub fn create_creative_asset(
    name: &str,
    description: &str,
    data: Vec<u8>,
    content_type: &str,
    metadata: serde_json::Value
) -> CreativeAsset {
    CreativeAsset {
        name: name.to_string(),
        description: description.to_string(),
        data,
        content_type: content_type.to_string(),
        metadata,
    }
}

/// Batch upload multiple assets
pub async fn batch_upload_assets(
    layer: &IpfsPersistenceLayer,
    assets: Vec<CreativeAsset>
) -> Result<Vec<(String, Cid, PinResponse)>, Box<dyn std::error::Error>> {
    let mut results = Vec::new();

    for asset in assets {
        let (cid, pin_response) = layer.upload_creative_asset(asset.clone()).await?;
        results.push((asset.name, cid, pin_response));
    }

    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cid_generation() {
        let layer = IpfsPersistenceLayer::new("localhost", 5001);
        let data = b"Hello, IPFS!";
        let cid = layer.generate_cid(data).unwrap();
        assert!(!cid.to_string().is_empty());
    }

    #[test]
    fn test_creative_asset_creation() {
        let asset = create_creative_asset(
            "Test Art",
            "A test creative asset",
            vec![1, 2, 3, 4],
            "image/png",
            serde_json::json!({"artist": "Test Artist"})
        );

        assert_eq!(asset.name, "Test Art");
        assert_eq!(asset.content_type, "image/png");
    }

    #[test]
    fn test_nft_metadata_generation() {
        let layer = IpfsPersistenceLayer::new("localhost", 5001);
        let cid = Cid::try_from("bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi").unwrap();

        let metadata = layer.generate_nft_metadata(&cid, "Test NFT", "A test NFT");

        assert_eq!(metadata["name"], "Test NFT");
        assert!(metadata["image"].as_str().unwrap().starts_with("ipfs://"));
    }

    #[tokio::test]
    async fn test_ipfs_client_creation() {
        let layer = IpfsPersistenceLayer::new("localhost", 5001);
        // This test just verifies the client can be created
        // Actual IPFS operations would require a running IPFS node
        assert_eq!(layer.gateway_url, "http://localhost:5001");
    }
}