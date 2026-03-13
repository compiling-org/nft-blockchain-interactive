import { ethers } from 'ethers';

// Moonbase Alpha Chain ID
const MOONBASE_ALPHA_CHAIN_ID = 1287;
const MOONBASE_ALPHA_RPC = 'https://rpc.api.moonbase.moonbeam.network';

// Get bridge contract address from environment variable
// Required: VITE_MOONBASE_BRIDGE_CONTRACT must be set
function getBridgeContractAddress(): string {
  const env = import.meta.env;
  const address = env.VITE_MOONBASE_BRIDGE_CONTRACT;
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    console.warn('⚠️  POLKADOT BRIDGE: VITE_MOONBASE_BRIDGE_CONTRACT not set or is zero address. Bridge transactions will fail.');
    return '0x0000000000000000000000000000000000000000';
  }
  return address;
}

// ABI for CrossChainDataBridge
const BRIDGE_ABI = [
  "event StreamCreated(string indexed streamId, address indexed creator, string sourceChain, string targetChain, string ipfsHash, uint256 timestamp)",
  "function createDataStream(string _streamId, string _sourceChain, string _targetChain, string _ipfsHash, bytes _encryptedData, uint256 _epoch) external returns (string)",
  "function getStreamData(string _streamId) external view returns (address creator, string sourceChain, string targetChain, string ipfsHash, uint256 timestamp, uint256 epoch, bool active)",
  "function getActiveStreamsCount() external view returns (uint256)",
  "function activeStreamIds(uint256) external view returns (string)"
];

export class PolkadotBridgeClient {
  provider: ethers.BrowserProvider | null = null;
  signer: ethers.JsonRpcSigner | null = null;
  contract: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }

  async connect(): Promise<string | null> {
    if (!this.provider) {
        console.error("MetaMask not found");
        return null;
    }

    try {
      // Request account access
      const accounts = await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      
      // Check network
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== MOONBASE_ALPHA_CHAIN_ID) {
        try {
            await (window as any).ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x507' }], // 1287 in hex
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                await (window as any).ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x507',
                            chainName: 'Moonbase Alpha',
                            rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                            nativeCurrency: {
                                name: 'DEV',
                                symbol: 'DEV',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://moonbase.moonscan.io/']
                        },
                    ],
                });
            } else {
                throw switchError;
            }
        }
      }

      this.contract = new ethers.Contract(getBridgeContractAddress(), BRIDGE_ABI, this.signer);
      return accounts[0];
    } catch (error) {
      console.error("Failed to connect to Moonbase Alpha:", error);
      return null;
    }
  }

  async createDataStream(streamId: string, targetChain: string, ipfsHash: string, encryptedData: string = "0x"): Promise<string | null> {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const epoch = Math.floor(Date.now() / 1000);
      const tx = await this.contract.createDataStream(
        streamId,
        "moonbase-alpha",
        targetChain,
        ipfsHash,
        ethers.toUtf8Bytes(encryptedData),
        epoch
      );
      
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      return tx.hash;
    } catch (error) {
      console.error("Failed to create data stream:", error);
      return null;
    }
  }

  async getStreamData(streamId: string): Promise<any> {
    if (!this.contract) throw new Error("Contract not initialized");
    try {
        return await this.contract.getStreamData(streamId);
    } catch (error) {
        console.error("Failed to get stream data:", error);
        return null;
    }
  }
}
