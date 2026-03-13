// Cross-Chain Bridge Configuration for Browser Environment

// Helper function to safely access Vite environment variables
function getViteEnv(key: keyof ImportMetaEnv): string | undefined {
  // In Vite, import.meta.env is available globally with proper types
  // Use type assertion for browser environments
  const env = (import.meta as unknown as { env?: ImportMetaEnv }).env;
  return env?.[key];
}

function getMode(): string | undefined {
  return (import.meta as unknown as { env?: ImportMetaEnv }).env?.MODE;
}

// Define proper type for Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_FILECOIN_ACTOR_ADDRESS?: string;
  readonly VITE_FILECOIN_DEFAULT_ADDRESS?: string;
  readonly MODE?: string;
}

export const bridgeConfig = {
    // Solana Configuration
    solana: {
        network: 'devnet',
        rpcUrl: 'https://api.devnet.solana.com',
        programId: '6QcK89CQXA1GNGtGyYRq3ewCVpCn2omVfemvkbSW6CoT', // Real deployed program ID
        idl: null, // IDL should be loaded dynamically or imported if JSON is available
        maxRetries: 3,
        retryDelay: 2000,
        confirmationTimeout: 60000
    },
    
    // Filecoin Configuration
    // NOTE: Replace with actual deployed actor addresses before production use
    filecoin: {
        network: 'calibration',
        rpcUrl: 'https://api.calibration.node.glif.io/rpc/v0',
        // TODO: Replace with actual biometric NFT actor address on Calibration network
        // Use Vite env variables (VITE_* prefix required for browser exposure)
        actorAddress: getViteEnv('VITE_FILECOIN_ACTOR_ADDRESS') || '',
        defaultAddress: getViteEnv('VITE_FILECOIN_DEFAULT_ADDRESS') || '',
        maxRetries: 3,
        retryDelay: 5000,
        confirmationTimeout: 300000
    },
    
    // Bridge Settings
    bridge: {
        minQualityScore: 0.7,
        maxTransferSize: 10 * 1024 * 1024, // 10MB
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

// Validation function to check if bridge is properly configured
// Throws error in production if required config is missing
export function isBridgeConfigured(): boolean {
    const { filecoin, solana } = bridgeConfig;
    const isProduction = getMode() === 'production';
    
    const hasValidConfig = !!(
        solana.programId &&
        solana.rpcUrl &&
        filecoin.actorAddress &&
        filecoin.actorAddress !== '0x0000000000000000000000000000000000000000' &&
        filecoin.actorAddress !== '' &&
        filecoin.defaultAddress &&
        filecoin.defaultAddress !== '0x0000000000000000000000000000000000000000' &&
        filecoin.defaultAddress !== ''
    );
    
    // In production, throw if configuration is invalid
    if (isProduction && !hasValidConfig) {
        const errors: string[] = [];
        if (!filecoin.actorAddress || filecoin.actorAddress === '') {
            errors.push('VITE_FILECOIN_ACTOR_ADDRESS');
        }
        if (!filecoin.defaultAddress || filecoin.defaultAddress === '') {
            errors.push('VITE_FILECOIN_DEFAULT_ADDRESS');
        }
        throw new Error(
            `CROSS-CHAIN BRIDGE: Missing required environment variables for production: ${errors.join(', ')}`
        );
    }
    
    return hasValidConfig;
}

// Warn about missing environment variables
export function validateEnvironmentVariables(): void {
    const filecoinConfig = bridgeConfig.filecoin;
    const isProduction = getMode() === 'production';
    
    if (!filecoinConfig.actorAddress || filecoinConfig.actorAddress === '') {
        console.warn('⚠️  CROSS-CHAIN BRIDGE: VITE_FILECOIN_ACTOR_ADDRESS not set. Filecoin transfers will fail.');
    }
    
    if (!filecoinConfig.defaultAddress || filecoinConfig.defaultAddress === '') {
        console.warn('⚠️  CROSS-CHAIN BRIDGE: VITE_FILECOIN_DEFAULT_ADDRESS not set. Filecoin transfers will fail.');
    }
    
    if (isProduction && (!filecoinConfig.actorAddress || !filecoinConfig.defaultAddress)) {
        console.error('❌ CROSS-CHAIN BRIDGE: Missing required environment variables for production!');
    }
}
