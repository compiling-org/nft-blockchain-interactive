import { myNearWalletService } from './myNearWalletService';

export interface SoulboundToken {
  token_id: string;
  owner_id: string;
  metadata: {
    title: string;
    description: string;
    media: string;
    extra: string;
  };
  soulbound: boolean;
  bound_to_account: string;
  created_at: number;
}

export interface MintSoulboundParams {
  title: string;
  description: string;
  media: string;
  boundToAccount: string;
}

export class SoulboundTokenService {
  private static instance: SoulboundTokenService;
  private contractId = 'soulbound_tokens.testnet';

  static getInstance(): SoulboundTokenService {
    if (!SoulboundTokenService.instance) {
      SoulboundTokenService.instance = new SoulboundTokenService();
    }
    return SoulboundTokenService.instance;
  }

  async mintSoulboundToken(params: MintSoulboundParams): Promise<{
    success: boolean;
    transactionHash?: string;
    tokenId?: string;
    error?: string;
  }> {
    if (!myNearWalletService.isSignedIn()) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const tokenId = `soulbound_${Date.now()}`;
      const accountId = myNearWalletService.getAccountId();

      // const actions = [{
      //   type: 'FunctionCall' as const,
      //   params: {
      //     methodName: 'mint_soulbound',
      //     args: {
      //       token_id: tokenId,
      //       receiver_id: accountId,
      //       token_metadata: {
      //         title: params.title,
      //         description: params.description,
      //         media: params.media,
      //         extra: JSON.stringify({
      //           soulbound: true,
      //           bound_to_account: params.boundToAccount,
      //           created_at: Date.now()
      //         })
      //       }
      //     },
      //     gas: '100000000000000',
      //     deposit: '1000000000000000000000000', // 1 NEAR for storage
      //   },
      // }];

      await myNearWalletService.callMethod(this.contractId, 'mint_soulbound', {
        token_id: tokenId,
        receiver_id: accountId,
        token_metadata: {
          title: params.title,
          description: params.description,
          media: params.media,
          extra: JSON.stringify({
            soulbound: true,
            bound_to_account: params.boundToAccount,
            created_at: Date.now()
          })
        },
        bound_to_account: params.boundToAccount
      }, '100000000000000', '1000000000000000000000000');
      
      return {
        success: true,
        transactionHash: 'mock_hash',
        tokenId,
      };
    } catch (error) {
      console.error('Mint soulbound token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint soulbound token',
      };
    }
  }

  async getSoulboundTokens(accountId: string): Promise<SoulboundToken[]> {
    try {
      const result = await myNearWalletService.viewMethod(
        this.contractId,
        'get_soulbound_tokens_for_owner',
        { account_id: accountId }
      );

      return result as SoulboundToken[];
    } catch (error) {
      console.error('Get soulbound tokens error:', error);
      return [];
    }
  }

  async verifyTokenBinding(tokenId: string, accountId: string): Promise<boolean> {
    try {
      const result = await myNearWalletService.viewMethod(
        this.contractId,
        'verify_token_binding',
        { token_id: tokenId, account_id: accountId }
      );

      return result as boolean;
    } catch (error) {
      console.error('Verify token binding error:', error);
      return false;
    }
  }

  async transferSoulboundToken(tokenId: string, toAccount: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // const actions = [{
      //   type: 'FunctionCall' as const,
      //   params: {
      //     methodName: 'transfer_soulbound',
      //     args: {
      //       token_id: tokenId,
      //       receiver_id: toAccount,
      //     },
      //     gas: '50000000000000',
      //     deposit: '0',
      //   },
      // }];

      // const accountId = myNearWalletService.getAccountId(); // Available but not used yet

      await myNearWalletService.callMethod(this.contractId, 'transfer_soulbound', {
        token_id: tokenId,
        receiver_id: toAccount,
      }, '50000000000000', '0');
      
      return { success: true };
    } catch (error) {
      console.error('Transfer soulbound token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to transfer soulbound token',
      };
    }
  }
}

export const soulboundTokenService = SoulboundTokenService.getInstance();