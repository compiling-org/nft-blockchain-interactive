import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@coral-xyz/anchor';

// Correct IDL definition based on deployed program
const idl = {
  "address": "6QcK89CQXA1GNGtGyYRq3ewCVpCn2omVfemvkbSW6CoT",
  "metadata": {
    "name": "biometric_nft",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Biometric NFT program with emotional metadata",
    "address": "6QcK89CQXA1GNGtGyYRq3ewCVpCn2omVfemvkbSW6CoT"
  },
  "instructions": [
    {
      "name": "initialize_collection",
      "docs": [
        "Initialize a new biometric NFT collection"
      ],
      "discriminator": [112, 62, 53, 139, 173, 152, 98, 93],
      "accounts": [
        { "name": "collection", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [99, 111, 108, 108, 101, 99, 116, 105, 111, 110] }, { "kind": "account", "path": "authority" }] } },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "name", "type": "string" },
        { "name": "symbol", "type": "string" },
        { "name": "uri", "type": "string" }
      ]
    },
    {
      "name": "mint_biometric_nft",
      "docs": [
        "Mint a new biometric NFT with emotional metadata"
      ],
      "discriminator": [145, 243, 177, 25, 123, 84, 217, 181],
      "accounts": [
        { "name": "nft", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [110, 102, 116] }, { "kind": "account", "path": "collection" }, { "kind": "account", "path": "collection.total_supply", "account": "BiometricCollection" }] } },
        { "name": "collection", "writable": true },
        { "name": "owner", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "biometric_hash", "type": { "array": ["u8", 32] } },
        { "name": "emotion_data", "type": { "defined": { "name": "EmotionData" } } },
        { "name": "uri", "type": "string" }
      ]
    },
    {
      "name": "transfer_nft",
      "docs": [
        "Transfer NFT with emotional state validation"
      ],
      "discriminator": [190, 28, 194, 8, 194, 218, 78, 78],
      "accounts": [
        { "name": "nft", "writable": true },
        { "name": "current_owner", "signer": true }
      ],
      "args": [
        { "name": "new_owner", "type": "pubkey" }
      ]
    },
    {
      "name": "update_emotion_state",
      "docs": [
        "Update emotional state of existing NFT"
      ],
      "discriminator": [50, 187, 2, 162, 144, 7, 168, 132],
      "accounts": [
        { "name": "nft", "writable": true },
        { "name": "owner", "signer": true }
      ],
      "args": [
        { "name": "new_emotion_data", "type": { "defined": { "name": "EmotionData" } } }
      ]
    }
  ],
  "accounts": [
    { "name": "BiometricCollection", "discriminator": [154, 221, 202, 226, 157, 3, 71, 241] },
    { "name": "BiometricNFT", "discriminator": [10, 78, 148, 3, 235, 200, 106, 226] }
  ],
  "events": [
    { "name": "BiometricNFTMinted", "discriminator": [171, 167, 19, 185, 232, 147, 242, 78] },
    { "name": "CollectionInitialized", "discriminator": [254, 157, 250, 175, 1, 48, 188, 53] },
    { "name": "EmotionStateUpdated", "discriminator": [130, 70, 179, 181, 16, 128, 131, 105] },
    { "name": "NFTTransferred", "discriminator": [110, 58, 15, 124, 58, 131, 70, 111] }
  ],
  "types": [
    {
      "name": "BiometricCollection",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "pubkey" },
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "uri", "type": "string" },
          { "name": "total_supply", "type": "u64" }
        ]
      }
    },
    {
      "name": "BiometricNFT",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "collection", "type": "pubkey" },
          { "name": "owner", "type": "pubkey" },
          { "name": "biometric_hash", "type": { "array": ["u8", 32] } },
          { "name": "emotion_data", "type": { "defined": { "name": "EmotionData" } } },
          { "name": "uri", "type": "string" },
          { "name": "minted_at", "type": "i64" },
          { "name": "last_updated", "type": "i64" },
          { "name": "generation", "type": "u64" }
        ]
      }
    },
    {
      "name": "BiometricNFTMinted",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "nft", "type": "pubkey" },
          { "name": "collection", "type": "pubkey" },
          { "name": "owner", "type": "pubkey" },
          { "name": "biometric_hash", "type": { "array": ["u8", 32] } },
          { "name": "emotion_data", "type": { "defined": { "name": "EmotionData" } } },
          { "name": "generation", "type": "u64" }
        ]
      }
    },
    {
      "name": "CollectionInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "collection", "type": "pubkey" },
          { "name": "authority", "type": "pubkey" },
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" }
        ]
      }
    },
    {
      "name": "EmotionData",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "valence", "type": "f32" },
          { "name": "arousal", "type": "f32" },
          { "name": "dominance", "type": "f32" },
          { "name": "confidence", "type": "f32" },
          { "name": "timestamp", "type": "i64" }
        ]
      }
    },
    {
      "name": "EmotionStateUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "nft", "type": "pubkey" },
          { "name": "owner", "type": "pubkey" },
          { "name": "new_emotion_data", "type": { "defined": { "name": "EmotionData" } } },
          { "name": "updated_at", "type": "i64" }
        ]
      }
    },
    {
      "name": "NFTTransferred",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "nft", "type": "pubkey" },
          { "name": "from", "type": "pubkey" },
          { "name": "to", "type": "pubkey" },
          { "name": "emotion_data", "type": { "defined": { "name": "EmotionData" } } }
        ]
      }
    }
  ]
};

const PROGRAM_ID = new PublicKey('6QcK89CQXA1GNGtGyYRq3ewCVpCn2omVfemvkbSW6CoT');

export interface EmotionData {
  valence: number;
  arousal: number;
  dominance: number;
  confidence: number;
  timestamp: BN;
}

export class BiometricNFTClient {
  private program: Program;
  private connection: Connection;

  constructor(connection: Connection, provider: AnchorProvider) {
    this.connection = connection;
    this.program = new Program(idl as any, provider);
  }

  // Initialize a new collection
  async initializeCollection(
    name: string,
    symbol: string,
    uri: string,
    authority: PublicKey
  ): Promise<{ collectionPda: PublicKey; signature: string }> {
    const [collectionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection"), authority.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .initializeCollection(name, symbol, uri)
      .accounts({
        collection: collectionPda,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { collectionPda, signature: tx };
  }

  // Mint a new biometric NFT
  async mintBiometricNFT(
    owner: PublicKey,
    collectionPda: PublicKey,
    biometricHash: number[],
    emotionData: { valence: number; arousal: number; dominance: number; confidence: number },
    uri: string
  ): Promise<{ nftPda: PublicKey; signature: string }> {
    
    // Fetch collection to get total supply for PDA
    const collectionAccount = await this.program.account.biometricCollection.fetch(collectionPda);
    
    // Safely extract totalSupply with runtime validation
    let totalSupply: number;
    if (collectionAccount && typeof collectionAccount === 'object' && 'totalSupply' in collectionAccount) {
      totalSupply = Number((collectionAccount as any).totalSupply);
      if (isNaN(totalSupply)) {
        throw new Error('Invalid totalSupply: not a valid number');
      }
    } else {
      throw new Error('Invalid collection account: missing totalSupply field');
    }

    const [nftPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("nft"), collectionPda.toBuffer(), new BN(totalSupply).toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .mintBiometricNft(biometricHash, {
        valence: emotionData.valence,
        arousal: emotionData.arousal,
        dominance: emotionData.dominance,
        confidence: emotionData.confidence,
        timestamp: new BN(Date.now())
      }, uri)
      .accounts({
        nft: nftPda,
        collection: collectionPda,
        owner: owner,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { nftPda, signature: tx };
  }

  // Update emotional state
  async updateEmotionState(
    nftPda: PublicKey,
    owner: PublicKey,
    newEmotionData: { valence: number; arousal: number; dominance: number; confidence: number }
  ): Promise<string> {
    const tx = await this.program.methods
      .updateEmotionState({
        valence: newEmotionData.valence,
        arousal: newEmotionData.arousal,
        dominance: newEmotionData.dominance,
        confidence: newEmotionData.confidence,
        timestamp: new BN(Date.now())
      })
      .accounts({
        nft: nftPda,
        owner: owner,
      })
      .rpc();

    return tx;
  }
}

// Helper function to create AnchorProvider
export function createAnchorProvider(connection: Connection, wallet: any): AnchorProvider {
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  return provider;
}
