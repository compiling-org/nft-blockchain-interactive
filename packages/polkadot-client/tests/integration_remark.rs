#![cfg(all(test, not(target_os = "windows")))]

use polkadot_client::{ExtrinsicSubmitter, TransactionStatus};
use subxt::{OnlineClient, PolkadotConfig};

#[tokio::test]
#[ignore]
async fn integration_system_remark() {
    let url = std::env::var("POLKADOT_NODE_URL").unwrap_or_else(|_| "wss://rpc.polkadot.io".to_string());
    let client = OnlineClient::<PolkadotConfig>::from_url(&url).await.unwrap();
    let submitter = ExtrinsicSubmitter::new(client);
    let suri = std::env::var("POLKADOT_SURI").unwrap_or_else(|_| "//Alice".to_string());
    let result = submitter.submit_remark_with_suri(&suri, b"integration").await.unwrap();
    assert!(matches!(result.status, TransactionStatus::Finalized | TransactionStatus::InBlock));
}
