const { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createInitializeMintInstruction, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');

// This is a mock deployment script for the biometric NFT program
// In a real deployment, you would have the compiled program binary

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'); // This is the ID from our Rust code

class BiometricNFTDeployer {
  constructor(rpcUrl = 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  async deployProgram(payerKeypair) {
    console.log('🚀 Starting Biometric NFT Program Deployment...');
    
    try {
      // In a real deployment, you would:
      // 1. Compile the Rust program to BPF/SBF
      // 2. Upload the program binary
      // 3. Create the program account
      // 4. Initialize the program
      
      console.log('📋 Program ID:', PROGRAM_ID.toString());
      console.log('💰 Deployer public key:', payerKeypair.publicKey.toString());
      
      // Get account info to verify program exists
      const accountInfo = await this.connection.getAccountInfo(PROGRAM_ID);
      if (accountInfo) {
        console.log('✅ Program account found with', accountInfo.lamports, 'lamports');
        console.log('✅ Program is executable:', accountInfo.executable);
        return {
          success: true,
          programId: PROGRAM_ID.toString(),
          status: 'Program already deployed'
        };
      } else {
        console.log('⚠️  Program account not found - would need to deploy');
        return {
          success: false,
          programId: PROGRAM_ID.toString(),
          status: 'Program needs deployment'
        };
      }
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async initializeNFT(payerKeypair, emotionData, qualityScore, biometricHash) {
    console.log('🎨 Initializing Biometric NFT...');
    
    try {
      // Create instruction data
      const instructionData = {
        emotion_data: emotionData,
        quality_score: qualityScore,
        biometric_hash: biometricHash
      };

      console.log('📊 Emotion Data:', emotionData);
      console.log('🔢 Quality Score:', qualityScore);
      console.log('🔐 Biometric Hash:', biometricHash);

      // In a real implementation, you would:
      // 1. Create the instruction with proper serialization
      // 2. Add accounts (payer, nft_account, mint, token_account, etc.)
      // 3. Send the transaction

      const mockTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payerKeypair.publicKey,
          toPubkey: PROGRAM_ID,
          lamports: 1000000 // 0.001 SOL for rent
        })
      );

      console.log('✅ Mock NFT initialization completed');
      return {
        success: true,
        transaction: 'mock_transaction_signature',
        nftId: 'mock_nft_id'
      };
    } catch (error) {
      console.error('❌ NFT initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyBiometric(nftId, biometricHash) {
    console.log('🔍 Verifying Biometric Data...');
    
    try {
      // Mock verification
      const isValid = Math.random() > 0.5; // Random for demo
      
      console.log('🔐 Biometric Hash:', biometricHash);
      console.log('✅ Verification Result:', isValid ? 'VALID' : 'INVALID');
      
      return {
        success: true,
        valid: isValid,
        confidence: Math.random()
      };
    } catch (error) {
      console.error('❌ Biometric verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getEmotionHistory(nftId) {
    console.log('📈 Retrieving Emotion History...');
    
    try {
      // Mock emotion history
      const mockHistory = [
        {
          timestamp: Date.now() - 3600000,
          emotion_data: {
            primary_emotion: 'creative',
            confidence: 0.85,
            secondary_emotions: [['focused', 0.7], ['excited', 0.6]],
            arousal: 0.8,
            valence: 0.7
          },
          context: 'Minting'
        },
        {
          timestamp: Date.now() - 7200000,
          emotion_data: {
            primary_emotion: 'focused',
            confidence: 0.92,
            secondary_emotions: [['calm', 0.8], ['creative', 0.6]],
            arousal: 0.6,
            valence: 0.8
          },
          context: 'Collaboration'
        }
      ];

      console.log('📊 Found', mockHistory.length, 'emotion records');
      return {
        success: true,
        history: mockHistory
      };
    } catch (error) {
      console.error('❌ Failed to retrieve emotion history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Demo function
async function runDemo() {
  console.log('🚀 Biometric NFT Solana Program Demo');
  console.log('=' .repeat(50));

  // Create a mock keypair (in real usage, load from file or generate securely)
  const mockKeypair = Keypair.generate();
  
  const deployer = new BiometricNFTDeployer();
  
  // Deploy program
  const deployResult = await deployer.deployProgram(mockKeypair);
  console.log('Deployment Result:', deployResult);
  
  // Initialize NFT
  const emotionData = {
    primary_emotion: 'creative',
    confidence: 0.89,
    secondary_emotions: [['focused', 0.75], ['excited', 0.62]],
    arousal: 0.78,
    valence: 0.82
  };
  
  const nftResult = await deployer.initializeNFT(
    mockKeypair,
    emotionData,
    0.85,
    '0x1234567890abcdef'
  );
  console.log('NFT Initialization Result:', nftResult);
  
  // Verify biometric
  const verifyResult = await deployer.verifyBiometric('mock_nft_id', '0x1234567890abcdef');
  console.log('Biometric Verification Result:', verifyResult);
  
  // Get emotion history
  const historyResult = await deployer.getEmotionHistory('mock_nft_id');
  console.log('Emotion History Result:', historyResult);
  
  console.log('=' .repeat(50));
  console.log('✅ Demo completed!');
}

// Export for use in other modules
module.exports = {
  BiometricNFTDeployer,
  runDemo,
  PROGRAM_ID
};

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}