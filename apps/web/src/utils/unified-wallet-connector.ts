import { wallet } from './near-wallet.js';

export interface NEARAccount {
  accountId: string;
  balance: string;
}

export default class UnifiedWalletConnector {
  private nearAccount: NEARAccount | null = null;

  async connectNEAR(): Promise<NEARAccount | null> {
    try {
      await wallet.startUp();
      
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        const balance = await wallet.getBalance();
        
        this.nearAccount = {
          accountId,
          balance
        };
        
        return this.nearAccount;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to connect NEAR wallet:', error);
      return null;
    }
  }

  async disconnectNEAR(): Promise<void> {
    try {
      wallet.signOut();
      this.nearAccount = null;
    } catch (error) {
      console.error('Failed to disconnect NEAR wallet:', error);
    }
  }

  getNEARAccount(): NEARAccount | null {
    return this.nearAccount;
  }

  isNEARConnected(): boolean {
    return this.nearAccount !== null;
  }

  async signInNEAR(): Promise<void> {
    wallet.signIn();
  }

  async callNEARMethod(contractId: string, method: string, args: any = {}, gas?: string, deposit?: string): Promise<any> {
    return wallet.callMethod(contractId, method, args, gas, deposit);
  }

  async viewNEARMethod(contractId: string, method: string, args: any = {}): Promise<any> {
    return wallet.viewMethod(contractId, method, args);
  }
}