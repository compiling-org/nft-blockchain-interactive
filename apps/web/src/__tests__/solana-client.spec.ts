import { describe, it, expect, beforeAll } from 'vitest';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import BiometricNFTClient from '../utils/solana-client';

// Polyfill WebCrypto for Node test environment
// @ts-ignore
globalThis.crypto = globalThis.crypto || require('crypto').webcrypto;

describe('BiometricNFTClient utilities', () => {
  let connection: Connection;
  let provider: AnchorProvider;
  let client: BiometricNFTClient;

  beforeAll(() => {
    connection = new Connection('http://localhost:8899', 'confirmed');
    const kp = Keypair.generate();
    const wallet = {
      publicKey: kp.publicKey as PublicKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
      payer: kp,
    } as any;
    provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    client = new BiometricNFTClient(connection, provider);
  });

  it('calculateQualityScore returns a value in [0,1]', () => {
    const score = client.calculateQualityScore({
      valence: 0.8,
      arousal: 0.6,
      dominance: 0.7,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('generateBiometricHash returns a 64-char hex string', async () => {
    const hash = await client.generateBiometricHash({
      valence: 0.5,
      arousal: 0.5,
      dominance: 0.5,
      timestamp: Date.now(),
    });
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

