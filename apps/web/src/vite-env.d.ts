/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FILECOIN_ACTOR_ADDRESS: string;
  readonly VITE_FILECOIN_DEFAULT_ADDRESS: string;
  readonly VITE_NEAR_NETWORK: string;
  readonly VITE_SOLANA_NETWORK: string;
  readonly VITE_POLKADOT_NETWORK: string;
  readonly VITE_MOONBASE_BRIDGE_CONTRACT?: string;
  readonly VITE_NFT_STORAGE_TOKEN?: string;
  readonly VITE_WEB3_STORAGE_TOKEN?: string;
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
