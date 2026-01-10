import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  // Placeholder for blockchain interaction logic
  // This service will abstract interactions with various blockchain SDKs (NEAR, Solana, Polkadot)
  getHello(): string {
    return 'Hello from BlockchainService!';
  }
}
