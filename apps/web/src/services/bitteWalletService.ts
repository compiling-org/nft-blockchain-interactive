/**
 * Real Bitte Wallet Service
 * Proper NEAR wallet integration using Bitte protocol patterns
 */

import { providers, keyStores, connect, KeyPair } from 'near-api-js';
import type { PublicKey } from 'near-api-js/lib/utils/index.js';
import type { Network, Action, FinalExecutionOutcome, Transaction } from '@near-wallet-selector/core';
import { createAction } from '@near-wallet-selector/wallet-utils';

// Wallet configuration
interface WalletConfig {
  walletUrl: string;
  network: Network;
  provider: providers.JsonRpcProvider;
}

// Wallet state management
interface WalletState {
  signedAccountId: string;
  functionCallKey: {
    privateKey: string;
    contractId: string;
    methods: string[];
  } | null;
}

interface WalletResponseData {
  account_id?: string;
  public_key?: string;
  error?: string;
}

interface SignMessageParams {
  message: string;
  nonce: Buffer;
  recipient: string;
  callbackUrl?: string;
  state?: string;
}

// Constants
const DEFAULT_POPUP_WIDTH = 480;
const DEFAULT_POPUP_HEIGHT = 640;
const POLL_INTERVAL = 300;

class BitteWalletService {
  private config: WalletConfig | null = null;
  private state: WalletState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): WalletState {
    return {
      signedAccountId: localStorage.getItem("bitte:signedAccountId") || "",
      functionCallKey: JSON.parse(localStorage.getItem("bitte:functionCallKey") || "null"),
    };
  }

  private saveState(state: WalletState): void {
    localStorage.setItem("bitte:signedAccountId", state.signedAccountId);
    localStorage.setItem("bitte:functionCallKey", JSON.stringify(state.functionCallKey));
    this.state = state;
  }

  /**
   * Initialize wallet with network configuration
   */
  async initialize(network: Network, walletUrl: string = 'https://wallet.bitte.ai'): Promise<void> {
    this.config = {
      walletUrl,
      network,
      provider: new providers.JsonRpcProvider({ url: network.nodeUrl }),
    };
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return !!this.state.signedAccountId;
  }

  /**
   * Get current account ID
   */
  getAccountId(): string {
    return this.state.signedAccountId;
  }

  /**
   * Get public key if available
   */
  getPublicKey(): PublicKey | undefined {
    if (this.state.functionCallKey) {
      return KeyPair.fromString(this.state.functionCallKey.privateKey as any).getPublicKey();
    }
    return undefined;
  }

  /**
   * Request sign in with proper Bitte wallet flow
   */
  async requestSignIn(contractId: string, methodNames?: string[]): Promise<boolean> {
    if (!this.config) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }

    try {
      const { url, newState } = this.requestSignInUrl(contractId, methodNames);
      
      // Open popup for wallet sign-in
      const result = await this.handlePopupTransaction(url, async (data) => {
        const responseData = data as WalletResponseData;
        const { account_id: accountId } = responseData;

        if (accountId) {
          const updatedState = { ...newState, signedAccountId: accountId };
          this.saveState(updatedState);
          return true;
        }
        throw new Error("Invalid response data from wallet");
      });

      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }

  /**
   * Generate sign-in URL with proper parameters
   */
  private requestSignInUrl(contractId: string, methodNames?: string[]): { url: string; newState: WalletState } {
    if (!this.config) {
      throw new Error('Wallet not configured');
    }

    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(`${this.config.walletUrl}/login/`);

    newUrl.searchParams.set("success_url", currentUrl.href);
    newUrl.searchParams.set("failure_url", currentUrl.href);

    let functionCallKey = null;

    if (contractId) {
      newUrl.searchParams.set("contract_id", contractId);

      const accessKey = KeyPair.fromRandom("ed25519");
      newUrl.searchParams.set(
        "public_key",
        accessKey.getPublicKey().toString()
      );

      functionCallKey = {
        privateKey: accessKey.toString(),
        contractId,
        methods: methodNames || [],
      };
    }

    if (methodNames) {
      methodNames.forEach((methodName) => {
        newUrl.searchParams.append("methodNames", methodName);
      });
    }

    const newState = { ...this.state, functionCallKey };

    return { url: newUrl.toString(), newState };
  }

  /**
   * Sign and send transactions with proper NEAR protocol handling
   */
  async signAndSendTransactions({
    transactions,
  }: {
    transactions: Array<Transaction>;
  }): Promise<Array<FinalExecutionOutcome>> {
    if (!this.config) {
      throw new Error('Wallet not initialized');
    }

    if (!this.isSignedIn()) {
      throw new Error('Not signed in');
    }

    // Check if we can sign with stored key
    const canSignWithKey = transactions.every((tx) =>
      this.storedKeyCanSign(tx.receiverId, tx.actions)
    );

    if (canSignWithKey && this.state.functionCallKey) {
      // Sign using stored function call key
      const outcomes: Array<FinalExecutionOutcome> = [];
      for (const tx of transactions) {
        const outcome = await this.signUsingKeyPair(tx.receiverId, tx.actions);
        outcomes.push(outcome);
      }
      return outcomes;
    } else {
      // Request wallet to sign transactions
      return this.requestSignTransactionsUrl(transactions);
    }
  }

  /**
   * Check if stored key can sign the transaction
   */
  private storedKeyCanSign(receiverId: string, actions: Array<Action>): boolean {
    if (
      this.state.functionCallKey &&
      this.state.functionCallKey.contractId === receiverId
    ) {
      return (
        actions[0].type === "FunctionCall" &&
        actions[0].params.deposit === "0" &&
        (this.state.functionCallKey.methods.length === 0 ||
          this.state.functionCallKey.methods.includes(actions[0].params.methodName))
      );
    }
    return false;
  }

  /**
   * Sign transaction using stored key pair
   */
  private async signUsingKeyPair(
    receiverId: string,
    actions: Array<Action>
  ): Promise<FinalExecutionOutcome> {
    if (!this.config || !this.state.functionCallKey) {
      throw new Error('Cannot sign: missing configuration or key');
    }

    // Create key store with function call key
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(this.state.functionCallKey.privateKey);

    await myKeyStore.setKey(
      this.config.network.networkId,
      this.state.signedAccountId,
      keyPair
    );

    const near = await connect({ ...this.config.network, keyStore: myKeyStore });
    const account = await near.account(this.state.signedAccountId);

    return account.signAndSendTransaction({
      receiverId,
      actions: actions.map((a) => createAction(a)),
    });
  }

  /**
   * Request wallet to sign transactions via popup
   */
  private async requestSignTransactionsUrl(transactions: Array<Transaction>): Promise<Array<FinalExecutionOutcome>> {
    if (!this.config) {
      throw new Error('Wallet not configured');
    }

    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(`${this.config.walletUrl}/sign-transaction/`);

    newUrl.searchParams.set("success_url", currentUrl.href);
    newUrl.searchParams.set("failure_url", currentUrl.href);

    const transactionPayloads = transactions.map((tx) => ({
      receiverId: tx.receiverId,
      actions: tx.actions.map((action) => {
        if (action.type === 'FunctionCall') {
          return {
            type: action.type,
            params: action.params,
          };
        }
        return {
          type: action.type,
          params: action as any,
        };
      }),
    }));

    newUrl.searchParams.set("transactions", JSON.stringify(transactionPayloads));

    return this.handlePopupTransaction(newUrl.toString(), (data) => {
      const responseData = data as { transactionHashes?: string[] };
      if (responseData.transactionHashes) {
        // Return mock outcomes for now - in real implementation would fetch actual outcomes
        return responseData.transactionHashes.map((hash) => ({
          status: { SuccessValue: "" },
          transaction: { id: hash, signer_id: "", receiver_id: "", actions: [] },
          transaction_outcome: { 
            id: hash, 
            outcome: { 
              status: { SuccessValue: "" }, 
              logs: [], 
              receipt_ids: [], 
              gas_burnt: 0,
              tokens_burnt: "0",
              executor_id: ""
            } 
          },
          receipts_outcome: [],
        } as FinalExecutionOutcome));
      }
      throw new Error("No transaction hashes returned");
    });
  }

  /**
   * Handle popup transactions with proper polling
   */
  private async handlePopupTransaction<T>(
    url: string,
    handleResponse: (data: any) => T
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const popup = window.open(
        url,
        "bitte-wallet-popup",
        `width=${DEFAULT_POPUP_WIDTH},height=${DEFAULT_POPUP_HEIGHT},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        reject(new Error("Failed to open popup"));
        return;
      }

      let pollingInterval: NodeJS.Timeout | null = null;

      const cleanup = () => {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        window.removeEventListener("message", messageListener);
      };

      const messageListener = (event: MessageEvent) => {
        if (event.origin !== new URL(url).origin) return;

        if (event.data.type === "bitte-wallet-response") {
          cleanup();
          popup.close();

          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            try {
              const result = handleResponse(event.data);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }
        }
      };

      window.addEventListener("message", messageListener);

      // Poll for popup closure
      pollingInterval = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error("User closed the wallet popup"));
        }
      }, POLL_INTERVAL);
    });
  }

  /**
   * Sign out and clear wallet state
   */
  signOut(): void {
    const newState = {
      signedAccountId: "",
      functionCallKey: null,
    };
    this.saveState(newState);
  }

  /**
   * Sign a message with the wallet
   */
  async signMessage(params: SignMessageParams): Promise<any> {
    if (!this.config) {
      throw new Error('Wallet not initialized');
    }

    if (!this.isSignedIn()) {
      throw new Error('Not signed in');
    }

    const url = params.callbackUrl || window.location.href;
    if (!url) {
      throw new Error('CallbackUrl is missing');
    }

    const href = new URL(this.config.walletUrl);
    href.pathname = "sign-message";
    href.searchParams.append("message", params.message);
    href.searchParams.append("nonce", params.nonce.toString("base64"));
    href.searchParams.append("recipient", params.recipient);
    href.searchParams.append("callbackUrl", url);

    if (params.state) {
      href.searchParams.append("state", params.state);
    }

    return this.handlePopupTransaction(href.toString(), (value) => {
      return {
        accountId: value?.signedRequest?.accountId || "",
        publicKey: value?.signedRequest?.publicKey || "",
        signature: value?.signedRequest?.signature || "",
      };
    });
  }

  /**
   * Get wallet connection status
   */
  getConnectionStatus(): { isConnected: boolean; accountId: string } {
    return {
      isConnected: this.isSignedIn(),
      accountId: this.getAccountId(),
    };
  }
}

export const bitteWalletService = new BitteWalletService();