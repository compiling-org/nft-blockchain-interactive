//! Blockchain integration for creative tools and NFTs

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use web_sys::{console, window};

/// Multi-chain NFT interface
#[wasm_bindgen]
pub struct BlockchainConnector {
    near_connection: Option<NearConnection>,
    solana_connection: Option<SolanaConnection>,
    ethereum_connection: Option<EthereumConnection>,
    current_chain: ChainType,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum ChainType {
    Near,
    Solana,
    Ethereum,
    Polygon,
}

#[wasm_bindgen]
impl BlockchainConnector {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BlockchainConnector {
        BlockchainConnector {
            near_connection: None,
            solana_connection: None,
            ethereum_connection: None,
            current_chain: ChainType::Near,
        }
    }

    /// Connect to NEAR wallet
    #[wasm_bindgen]
    pub async fn connect_near(&mut self, network: &str) -> Result<(), JsValue> {
        // Initialize NEAR connection
        let connection = NearConnection::new(network).await?;
        self.near_connection = Some(connection);
        self.current_chain = ChainType::Near;
        Ok(())
    }

    /// Connect to Solana wallet
    #[wasm_bindgen]
    pub async fn connect_solana(&mut self) -> Result<(), JsValue> {
        let connection = SolanaConnection::new().await?;
        self.solana_connection = Some(connection);
        self.current_chain = ChainType::Solana;
        Ok(())
    }

    /// Connect to Ethereum wallet
    #[wasm_bindgen]
    pub async fn connect_ethereum(&mut self) -> Result<(), JsValue> {
        let connection = EthereumConnection::new().await?;
        self.ethereum_connection = Some(connection);
        self.current_chain = ChainType::Ethereum;
        Ok(())
    }

    /// Mint interactive NFT
    #[wasm_bindgen]
    pub async fn mint_interactive_nft(
        &self,
        metadata: &str,
        ipfs_cid: &str,
        interactive_params: JsValue
    ) -> Result<String, JsValue> {
        match self.current_chain {
            ChainType::Near => {
                if let Some(conn) = &self.near_connection {
                    conn.mint_interactive_nft(metadata, ipfs_cid, interactive_params).await
                } else {
                    Err(JsValue::from_str("NEAR not connected"))
                }
            }
            ChainType::Solana => {
                if let Some(conn) = &self.solana_connection {
                    conn.mint_interactive_nft(metadata, ipfs_cid, interactive_params).await
                } else {
                    Err(JsValue::from_str("Solana not connected"))
                }
            }
            ChainType::Ethereum => {
                if let Some(conn) = &self.ethereum_connection {
                    conn.mint_interactive_nft(metadata, ipfs_cid, interactive_params).await
                } else {
                    Err(JsValue::from_str("Ethereum not connected"))
                }
            }
            _ => Err(JsValue::from_str("Unsupported chain"))
        }
    }

    /// Create collaboration session
    #[wasm_bindgen]
    pub async fn create_session(&self, tool_type: &str, params: JsValue) -> Result<String, JsValue> {
        match self.current_chain {
            ChainType::Near => {
                if let Some(conn) = &self.near_connection {
                    conn.create_collaboration_session(tool_type, params).await
                } else {
                    Err(JsValue::from_str("NEAR not connected"))
                }
            }
            _ => Err(JsValue::from_str("Collaboration only supported on NEAR"))
        }
    }

    /// Join collaboration session
    #[wasm_bindgen]
    pub async fn join_session(&self, session_id: &str) -> Result<(), JsValue> {
        match self.current_chain {
            ChainType::Near => {
                if let Some(conn) = &self.near_connection {
                    conn.join_session(session_id).await
                } else {
                    Err(JsValue::from_str("NEAR not connected"))
                }
            }
            _ => Err(JsValue::from_str("Collaboration only supported on NEAR"))
        }
    }

    /// Publish creative patch
    #[wasm_bindgen]
    pub async fn publish_patch(&self, patch_data: JsValue) -> Result<String, JsValue> {
        match self.current_chain {
            ChainType::Near => {
                if let Some(conn) = &self.near_connection {
                    conn.publish_patch(patch_data).await
                } else {
                    Err(JsValue::from_str("NEAR not connected"))
                }
            }
            _ => Err(JsValue::from_str("Patch publishing only supported on NEAR"))
        }
    }

    /// Get user NFTs
    #[wasm_bindgen]
    pub async fn get_user_nfts(&self, address: &str) -> Result<JsValue, JsValue> {
        match self.current_chain {
            ChainType::Near => {
                if let Some(conn) = &self.near_connection {
                    conn.get_user_nfts(address).await
                } else {
                    Err(JsValue::from_str("NEAR not connected"))
                }
            }
            ChainType::Solana => {
                if let Some(conn) = &self.solana_connection {
                    conn.get_user_nfts(address).await
                } else {
                    Err(JsValue::from_str("Solana not connected"))
                }
            }
            ChainType::Ethereum => {
                if let Some(conn) = &self.ethereum_connection {
                    conn.get_user_nfts(address).await
                } else {
                    Err(JsValue::from_str("Ethereum not connected"))
                }
            }
            _ => Err(JsValue::from_str("Unsupported chain"))
        }
    }

    /// Get current chain
    #[wasm_bindgen]
    pub fn get_current_chain(&self) -> String {
        match self.current_chain {
            ChainType::Near => "near".to_string(),
            ChainType::Solana => "solana".to_string(),
            ChainType::Ethereum => "ethereum".to_string(),
            ChainType::Polygon => "polygon".to_string(),
        }
    }

    /// Switch chain
    #[wasm_bindgen]
    pub fn switch_chain(&mut self, chain: &str) {
        self.current_chain = match chain {
            "near" => ChainType::Near,
            "solana" => ChainType::Solana,
            "ethereum" => ChainType::Ethereum,
            "polygon" => ChainType::Polygon,
            _ => ChainType::Near,
        };
    }
}

/// NEAR blockchain connection
pub struct NearConnection {
    wallet_connection: JsValue,
    contract_id: String,
}

impl NearConnection {
    pub async fn new(network: &str) -> Result<Self, JsValue> {
        // Initialize NEAR wallet connection
        let wallet_connection = js_sys::Reflect::get(&window().unwrap(), &"nearWallet".into())?;

        Ok(NearConnection {
            wallet_connection,
            contract_id: match network {
                "mainnet" => "nft.compiling.near".to_string(),
                _ => "nft.compiling.testnet".to_string(),
            },
        })
    }

    pub async fn mint_interactive_nft(&self, metadata: &str, ipfs_cid: &str, interactive_params: JsValue) -> Result<String, JsValue> {
        // Call NEAR contract method
        let promise = js_sys::Reflect::get(&self.wallet_connection, &"callMethod".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet_connection,
            &js_sys::Array::of5(
                &JsValue::from(&self.contract_id),
                &JsValue::from("mint_interactive_nft"),
                &js_sys::JSON::parse(metadata)?,
                &JsValue::from("300000000000000"), // gas
                &JsValue::from("1000000000000000000000000"), // deposit (1 NEAR)
            )
        )?;

        // Convert promise to string (token ID)
        Ok(result.as_string().unwrap_or_default())
    }

    pub async fn create_collaboration_session(&self, tool_type: &str, params: JsValue) -> Result<String, JsValue> {
        let promise = js_sys::Reflect::get(&self.wallet_connection, &"callMethod".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet_connection,
            &js_sys::Array::of5(
                &JsValue::from(&self.contract_id),
                &JsValue::from("create_session"),
                &js_sys::Object::from_entries(&js_sys::Array::of2(
                    &js_sys::Array::of2(&JsValue::from("tool_type"), &JsValue::from(tool_type)),
                    &js_sys::Array::of2(&JsValue::from("params"), &params)
                ))?,
                &JsValue::from("300000000000000"),
                &JsValue::from("500000000000000000000000"),
            )
        )?;

        Ok(result.as_string().unwrap_or_default())
    }

    pub async fn join_session(&self, session_id: &str) -> Result<(), JsValue> {
        let promise = js_sys::Reflect::get(&self.wallet_connection, &"callMethod".into())?;
        js_sys::Reflect::apply(
            &promise,
            &self.wallet_connection,
            &js_sys::Array::of5(
                &JsValue::from(&self.contract_id),
                &JsValue::from("join_session"),
                &js_sys::JSON::parse(&format!("{{\"session_id\": \"{}\"}}", session_id))?,
                &JsValue::from("300000000000000"),
                &JsValue::from("0"),
            )
        )?;

        Ok(())
    }

    pub async fn publish_patch(&self, patch_data: JsValue) -> Result<String, JsValue> {
        let promise = js_sys::Reflect::get(&self.wallet_connection, &"callMethod".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet_connection,
            &js_sys::Array::of5(
                &JsValue::from(&self.contract_id),
                &JsValue::from("publish_patch"),
                &patch_data,
                &JsValue::from("300000000000000"),
                &JsValue::from("1000000000000000000000000"),
            )
        )?;

        Ok(result.as_string().unwrap_or_default())
    }

    pub async fn get_user_nfts(&self, address: &str) -> Result<JsValue, JsValue> {
        let promise = js_sys::Reflect::get(&self.wallet_connection, &"viewMethod".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet_connection,
            &js_sys::Array::of3(
                &JsValue::from(&self.contract_id),
                &JsValue::from("nft_tokens_for_owner"),
                &js_sys::JSON::parse(&format!("{{\"account_id\": \"{}\"}}", address))?,
            )
        )?;

        Ok(result)
    }
}

/// Solana blockchain connection
pub struct SolanaConnection {
    wallet: JsValue,
    program_id: String,
}

impl SolanaConnection {
    pub async fn new() -> Result<Self, JsValue> {
        let wallet = js_sys::Reflect::get(&window().unwrap(), &"solanaWallet".into())?;

        Ok(SolanaConnection {
            wallet,
            program_id: "CompilingNFT1111111111111111111111111111111".to_string(),
        })
    }

    pub async fn mint_interactive_nft(&self, metadata: &str, ipfs_cid: &str, interactive_params: JsValue) -> Result<String, JsValue> {
        // Call Solana program
        let promise = js_sys::Reflect::get(&self.wallet, &"sendTransaction".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet,
            &js_sys::Array::of1(&js_sys::Object::from_entries(&js_sys::Array::of3(
                &js_sys::Array::of2(&JsValue::from("programId"), &JsValue::from(&self.program_id)),
                &js_sys::Array::of2(&JsValue::from("metadata"), &JsValue::from(metadata)),
                &js_sys::Array::of2(&JsValue::from("ipfsCid"), &JsValue::from(ipfs_cid))
            ))?)
        )?;

        Ok(result.as_string().unwrap_or_default())
    }

    pub async fn get_user_nfts(&self, address: &str) -> Result<JsValue, JsValue> {
        // Query Solana program for user's NFTs
        let promise = js_sys::Reflect::get(&self.wallet, &"getProgramAccounts".into())?;
        let result = js_sys::Reflect::apply(
            &promise,
            &self.wallet,
            &js_sys::Array::of2(
                &JsValue::from(&self.program_id),
                &js_sys::Object::from_entries(&js_sys::Array::of1(
                    &js_sys::Array::of2(&JsValue::from("filters"), &js_sys::Array::of1(
                        &js_sys::Object::from_entries(&js_sys::Array::of2(
                            &js_sys::Array::of2(&JsValue::from("memcmp"), &js_sys::Object::from_entries(&js_sys::Array::of3(
                                &js_sys::Array::of2(&JsValue::from("offset"), &JsValue::from(8)),
                                &js_sys::Array::of2(&JsValue::from("bytes"), &JsValue::from(address)),
                                &js_sys::Array::of2(&JsValue::from("encoding"), &JsValue::from("base58"))
                            ))?)
                        ))?
                    ))
                ))?
            )
        )?;

        Ok(result)
    }
}

/// Ethereum/Polygon connection
pub struct EthereumConnection {
    provider: JsValue,
    contract_address: String,
}

impl EthereumConnection {
    pub async fn new() -> Result<Self, JsValue> {
        let provider = js_sys::Reflect::get(&window().unwrap(), &"ethereum".into())?;

        Ok(EthereumConnection {
            provider,
            contract_address: "0x1234567890123456789012345678901234567890".to_string(),
        })
    }

    pub async fn mint_interactive_nft(&self, metadata: &str, ipfs_cid: &str, interactive_params: JsValue) -> Result<String, JsValue> {
        // Call Ethereum contract
        let contract = js_sys::Reflect::get(&self.provider, &"Contract".into())?;
        let contract_instance = js_sys::Reflect::construct(
            &contract,
            &js_sys::Array::of2(
                &JsValue::from(&self.contract_address),
                &JsValue::from("[]") // ABI
            )
        )?;

        let mint_method = js_sys::Reflect::get(&contract_instance, &"mintInteractiveNFT".into())?;
        let result = js_sys::Reflect::apply(
            &mint_method,
            &contract_instance,
            &js_sys::Array::of3(
                &JsValue::from(metadata),
                &JsValue::from(ipfs_cid),
                &interactive_params
            )
        )?;

        Ok(result.as_string().unwrap_or_default())
    }

    pub async fn get_user_nfts(&self, address: &str) -> Result<JsValue, JsValue> {
        let contract = js_sys::Reflect::get(&self.provider, &"Contract".into())?;
        let contract_instance = js_sys::Reflect::construct(
            &contract,
            &js_sys::Array::of2(
                &JsValue::from(&self.contract_address),
                &JsValue::from("[]")
            )
        )?;

        let balance_method = js_sys::Reflect::get(&contract_instance, &"balanceOf".into())?;
        let balance = js_sys::Reflect::apply(
            &balance_method,
            &contract_instance,
            &js_sys::Array::of1(&JsValue::from(address))
        )?;

        Ok(balance)
    }
}

/// Utility functions for cross-chain operations
#[wasm_bindgen]
pub fn generate_nft_metadata(
    name: &str,
    description: &str,
    image_cid: &str,
    attributes: JsValue,
    interactive_data: JsValue
) -> String {
    format!(
        r#"{{
            "name": "{}",
            "description": "{}",
            "image": "ipfs://{}",
            "attributes": {},
            "interactive": {}
        }}"#,
        name, description, image_cid, js_sys::JSON::stringify(&attributes).unwrap(), js_sys::JSON::stringify(&interactive_data).unwrap()
    )
}

#[wasm_bindgen]
pub fn calculate_gas_estimate(chain: &str, operation: &str) -> u64 {
    match (chain, operation) {
        ("near", "mint") => 300_000_000_000_000,
        ("near", "transfer") => 100_000_000_000_000,
        ("solana", "mint") => 5000, // lamports
        ("ethereum", "mint") => 100_000, // gas units
        _ => 0
    }
}

#[wasm_bindgen]
pub fn validate_address(chain: &str, address: &str) -> bool {
    match chain {
        "near" => address.contains('.') && address.len() >= 2,
        "solana" => address.len() == 44, // Base58 encoded
        "ethereum" => address.starts_with("0x") && address.len() == 42,
        _ => false
    }
}