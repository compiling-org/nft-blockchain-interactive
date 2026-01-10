import { connect, WalletConnection, keyStores } from 'near-api-js';
import BN from 'bn.js';

export interface WalletConfig {
  network: 'mainnet' | 'testnet';
  createAccessKeyFor?: string;
}

export class Wallet {
  walletConnection: WalletConnection | null = null;
  accountId: string = '';
  private config: any;
  private near: any;

  constructor(config: WalletConfig) {
    this.config = {
      networkId: config.network,
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: config.network === 'mainnet' 
        ? 'https://rpc.mainnet.near.org'
        : 'https://rpc.testnet.near.org',
      walletUrl: config.network === 'mainnet'
        ? 'https://wallet.mainnet.near.org'
        : 'https://wallet.testnet.near.org',
      helperUrl: config.network === 'mainnet'
        ? 'https://helper.mainnet.near.org'
        : 'https://helper.testnet.near.org',
      explorerUrl: config.network === 'mainnet'
        ? 'https://explorer.mainnet.near.org'
        : 'https://explorer.testnet.near.org',
      headers: {}
    };
  }

  async startUp() {
    try {
      this.near = await connect(this.config);
      this.walletConnection = new WalletConnection(this.near, 'bitte-ai-marketplace');
      
      if (this.walletConnection.getAccountId()) {
        this.accountId = this.walletConnection.getAccountId();
      }
    } catch (error) {
      console.error('Failed to initialize NEAR wallet:', error);
      throw error;
    }
  }

  signIn() {
    if (!this.walletConnection) {
      throw new Error('Wallet not initialized');
    }
    
    this.walletConnection.requestSignIn({
      contractId: this.config.createAccessKeyFor || 'bitte-ai-marketplace.testnet',
      methodNames: [],
      successUrl: window.location.origin,
      failureUrl: window.location.origin
    });
  }

  signOut() {
    if (!this.walletConnection) {
      throw new Error('Wallet not initialized');
    }
    
    this.walletConnection.signOut();
    this.accountId = '';
    window.location.replace(window.location.origin + window.location.pathname);
  }

  isSignedIn(): boolean {
    return !!this.walletConnection?.isSignedIn();
  }

  getAccountId(): string {
    return this.accountId;
  }

  async viewMethod(contractId: string, method: string, args: any = {}) {
    try {
      const account = this.near.account(this.accountId);
      return await account.viewFunction(contractId, method, args);
    } catch (error) {
      console.error('View method failed:', error);
      throw error;
    }
  }

  async callMethod(contractId: string, method: string, args: any = {}, gas?: string, deposit?: string) {
    if (!this.walletConnection) {
      throw new Error('Wallet not initialized');
    }

    try {
      const account = this.walletConnection.account();
      return await account.functionCall({
        contractId,
        methodName: method,
        args,
        gas: gas ? new BN(gas) : new BN('300000000000000'),
        attachedDeposit: deposit ? new BN(deposit) : new BN('0')
      });
    } catch (error) {
      console.error('Call method failed:', error);
      throw error;
    }
  }

  async getBalance() {
    if (!this.accountId) return '0';
    
    try {
      const account = await this.near.account(this.accountId);
      const balance = await account.getAccountBalance();
      return balance.available;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }
}

// Export singleton instance
export const wallet = new Wallet({ network: 'testnet' });