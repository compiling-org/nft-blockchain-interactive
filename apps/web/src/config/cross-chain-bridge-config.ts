/**
 * Browser-safe Cross-Chain Bridge Configuration
 */

export const bridgeConfig = {
    // Solana Configuration
    solana: {
        network: 'devnet' as const,
        rpcUrl: 'https://api.devnet.solana.com',
        programId: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
        maxRetries: 3,
        retryDelay: 2000,
        confirmationTimeout: 60000
    },

    // Filecoin Configuration
    filecoin: {
        network: 'calibration' as const,
        rpcUrl: 'https://api.calibration.node.glif.io/rpc/v0',
        actorAddress: 'f01000',
        defaultAddress: 'f1abcdefghijklmnopqrstuvwxyz1234567890abcd',
        maxRetries: 3,
        retryDelay: 5000,
        confirmationTimeout: 300000
    },

    // Cross-Chain Bridge Settings
    bridge: {
        minQualityScore: 0.7,
        maxTransferSize: 10 * 1024 * 1024,
        requireVerification: true,
        verificationTimeout: 180000,
        solanaFee: 0.001,
        filecoinFee: 0.01,
        enableMonitoring: true,
        monitoringInterval: 30000,
        maxBridgeRetries: 5,
        bridgeRetryDelay: 10000
    },

    // IPFS Configuration
    ipfs: {
        gateway: 'https://ipfs.io',
        apiUrl: 'https://api.pinata.cloud',
        pinMetadata: true,
        pinTimeout: 120000
    }
};

export default bridgeConfig;
