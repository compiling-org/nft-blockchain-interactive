// Mainnet deployment configuration for all blockchain networks
export const MAINNET_CONFIG = {
  near: {
    network: 'mainnet',
    rpcUrl: 'https://rpc.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    archivalRpcUrl: 'https://archival-rpc.mainnet.near.org',
    
    // Mainnet contract accounts (to be deployed)
    contracts: {
      soulboundNFT: 'soulbound-nft.near',
      crossChainAI: 'cross-chain-ai.near',
      fractalStudio: 'fractal-studio.near',
      emotionalDAO: 'emotional-dao.near'
    },
    
    // Economic parameters
    minStorageDeposit: '0.1', // NEAR
    maxGasPerTransaction: '300000000000000', // 300 TGas
    gasPrice: '100000000', // 0.1 NEAR per TGas
    
    // Security settings
    multisigThreshold: 2,
    multisigAccounts: [
      'security-council.near',
      'dev-team.near',
      'community-governance.near'
    ]
  },
  
  solana: {
    network: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    websocketUrl: 'wss://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    
    // Alternative RPC providers for redundancy
    backupRpcUrls: [
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana',
      'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
    ],
    
    // Mainnet program IDs (to be deployed)
    programs: {
      biometricNFT: 'BioNFT1111111111111111111111111111111111111',
      emotionalMetadata: 'Emot111111111111111111111111111111111111111',
      crossChainBridge: 'Bridge1111111111111111111111111111111111111'
    },
    
    // Economic parameters
    rentExemption: {
      mint: '0.00203928', // SOL
      tokenAccount: '0.00203928', // SOL
      metadata: '0.001', // SOL
    },
    transactionFee: '0.00025', // SOL
    priorityFee: '0.0001', // SOL
    
    // Security settings
    multisigProgram: 'GokivDYuQXPZXXaN3hEzSdmVFAyGZq3Zp3T9hp8MhZ3',
    upgradeAuthority: 'Upgrade11111111111111111111111111111111111111'
  },
  
  filecoin: {
    network: 'mainnet',
    rpcUrl: 'https://api.node.glif.io',
    websocketUrl: 'wss://wss.node.glif.io/apigw/lotus',
    explorerUrl: 'https://filfox.info',
    
    // Storage configuration
    storage: {
      providers: [
        'f01234', // Primary storage provider
        'f05678', // Backup storage provider
        'f09123'  // Tertiary storage provider
      ],
      replicationFactor: 3,
      dealDuration: 518400, // 180 days in epochs
      verifiedDeal: true,
      
      // Pricing (in FIL)
      pricePerGiB: '0.0000000001', // 100 attoFIL per GiB per epoch
      collateral: '0.1', // FIL
      minDealValue: '0.01' // FIL
    },
    
    // Actor addresses (to be deployed)
    actors: {
      biometricStorage: 'f1biometric',
      creativeDataDAO: 'f1creativedao',
      crossChainBridge: 'f1bridge'
    }
  },
  
  polkadot: {
    network: 'polkadot',
    rpcUrl: 'wss://rpc.polkadot.io',
    explorerUrl: 'https://polkadot.subscan.io',
    
    // Parachain configuration
    parachain: {
      id: 2000, // Assuming we get parachain slot
      rpcUrl: 'wss://your-parachain.polkadot.io',
      sovereignAccount: 'para2000'
    },
    
    // Pallet addresses (to be deployed)
    pallets: {
      emotionalBridge: '0x01',
      soulboundIdentity: '0x02',
      crossChainNFT: '0x03'
    },
    
    // Economic parameters
    existentialDeposit: '1.0', // DOT
    transactionFee: '0.01', // DOT
    
    // Governance
    governance: {
      proposalDeposit: '100', // DOT
      votingPeriod: 28800, // Blocks (48 hours)
      enactmentDelay: 7200  // Blocks (12 hours)
    }
  },
  
  ethereum: {
    network: 'mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    websocketUrl: 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://etherscan.io',
    
    // Cross-chain bridge contracts
    contracts: {
      nftBridge: '0x1234567890123456789012345678901234567890',
      tokenBridge: '0x0987654321098765432109876543210987654321',
      governance: '0x1111111111111111111111111111111111111111'
    },
    
    // Economic parameters
    gasPrice: '20000000000', // 20 Gwei
    maxGasPerTransaction: '500000',
    bridgeFee: '0.01' // ETH
  }
};

// Production security settings
export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    burstAllowance: 10,
    cooldownPeriod: 60 // seconds
  },
  
  // Multi-signature requirements
  multisig: {
    requiredSignatures: 2,
    totalSigners: 3,
    timeLock: 86400 // 24 hours
  },
  
  // Emergency controls
  emergency: {
    pauseAll: false,
    pauseMinting: false,
    pauseTrading: false,
    pauseBridge: false
  },
  
  // Monitoring thresholds
  monitoring: {
    highGasThreshold: '0.1', // ETH equivalent
    failedTransactionThreshold: 10,
    responseTimeThreshold: 5000, // ms
    errorRateThreshold: 0.05 // 5%
  }
};

// AI model configuration for production
export const AI_CONFIG = {
  // Model serving
  modelServing: {
    tensorflowJS: {
      modelUrl: 'https://cdn.your-domain.com/models/emotion-detection/',
      fallbackUrl: 'https://backup-cdn.your-domain.com/models/',
      cacheTimeout: 3600000 // 1 hour
    },
    
    serverSide: {
      endpoint: 'https://ai-api.your-domain.com',
      apiKey: process.env.AI_API_KEY,
      timeout: 30000, // 30 seconds
      retryAttempts: 3
    }
  },
  
  // Model performance
  performance: {
    maxConcurrentRequests: 100,
    batchSize: 32,
    inferenceTimeout: 5000, // 5 seconds
    confidenceThreshold: 0.7
  }
};