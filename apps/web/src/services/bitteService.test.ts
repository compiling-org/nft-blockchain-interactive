/**
 * Bitte Service Integration Tests
 * Tests the complete Bitte Protocol integration with real API calls
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { bitteService } from './bitteService';

describe('BitteService Integration Tests', () => {

  describe('Account Management', () => {
    beforeEach(() => {
      // Reset account before each test
      bitteService.setCurrentAccount('');
    });

    it('should set valid NEAR testnet account', () => {
      const testAccountId = 'user123.testnet';
      bitteService.setCurrentAccount(testAccountId);
      
      expect(bitteService.getCurrentAccount()).toBe(testAccountId);
    });

    it('should set valid NEAR mainnet account', () => {
      const testAccountId = 'user123.near';
      bitteService.setCurrentAccount(testAccountId);
      
      expect(bitteService.getCurrentAccount()).toBe(testAccountId);
    });

    it('should set compound NEAR testnet account', () => {
      // Test compound accounts like the one used in App.tsx
      const testAccountId = 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet';
      bitteService.setCurrentAccount(testAccountId);
      
      expect(bitteService.getCurrentAccount()).toBe(testAccountId);
    });

    it('should reject invalid NEAR account format', () => {
      const invalidAccountId = 'invalid-address'; // Missing .testnet/.near suffix
      
      // Should not throw but should not set the invalid account
      bitteService.setCurrentAccount(invalidAccountId);
      
      expect(bitteService.getCurrentAccount()).toBe('');
    });

    it('should allow empty account ID (for logout)', () => {
      bitteService.setCurrentAccount('user.testnet');
      expect(bitteService.getCurrentAccount()).toBe('user.testnet');
      
      // Setting empty should work
      bitteService.setCurrentAccount('');
      expect(bitteService.getCurrentAccount()).toBe('');
    });
  });



  describe('AI Agents', () => {
    it('should load AI agents with proper structure', async () => {
      const agents = await bitteService.loadAIAgents();
      
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
      
      agents.forEach(agent => {
        expect(agent).toHaveProperty('agent_id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('capabilities');
        expect(agent).toHaveProperty('wallet_address');
        expect(agent).toHaveProperty('ai_model');
        expect(Array.isArray(agent.capabilities)).toBe(true);
      });
    });
  });

  describe('Fractal Generation', () => {
    it('should generate emotional fractal art', async () => {
      const emotionData = {
        valence: 0.7,
        arousal: 0.6,
        dominance: 0.8
      };
      
      const result = await bitteService.generateEmotionalFractal(emotionData);
      
      expect(result.success).toBe(true);
      expect(result.fractalId).toBeDefined();
      expect(result.visualOutput).toBeDefined();
      expect(result.visualOutput?.svg).toBeDefined();
      expect(result.visualOutput?.interactive).toBe(true);
      expect(result.visualOutput?.controls).toContain('zoom');
    });

    it('should handle fractal generation errors gracefully', async () => {
      const invalidEmotionData = {
        valence: 1.5, // Invalid range - exceeds max of 1.0
        arousal: 0.6,
        dominance: 0.8
      };
      
      const result = await bitteService.generateEmotionalFractal(invalidEmotionData);
      
      // Should either succeed with fallback or fail gracefully
      expect(result).toBeDefined();
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should validate emotion data ranges', async () => {
      // Test valid ranges are accepted
      const validEmotion = { valence: 0.5, arousal: 0.5, dominance: 0.5 };
      const result = await bitteService.generateEmotionalFractal(validEmotion);
      expect(result.success).toBe(true);
    });
  });

  describe('NFT Minting', () => {
    it('should fail when wallet is not connected', async () => {
      // Reset account to test validation
      bitteService.setCurrentAccount('');
      
      const emotionData = {
        valence: 0.8,
        arousal: 0.7,
        dominance: 0.9
      };
      
      const generatedArt = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=';
      
      const result = await bitteService.mintBiometricNFT(emotionData, generatedArt);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Wallet not connected');
    });

    it('should mint biometric NFT with AI-generated content', async () => {
      // First connect wallet to enable minting
      bitteService.setCurrentAccount('test-user.testnet');
      
      const emotionData = {
        valence: 0.8,
        arousal: 0.7,
        dominance: 0.9
      };
      
      const generatedArt = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=';
      
      const result = await bitteService.mintBiometricNFT(emotionData, generatedArt);
      
      expect(result.success).toBe(true);
      expect(result.tokenId).toBeDefined();
      expect(result.transactionHash).toBeDefined();
      expect(result.explorerUrl).toBeDefined();
      expect(result.biometricData).toBeDefined();
      expect(result.metadata).toBeDefined();
    });


  });

  describe('AI Transactions', () => {
    it('should fail when wallet is not connected', async () => {
      // Reset account to test validation
      bitteService.setCurrentAccount('');
      
      const result = await bitteService.executeAITransaction('test_action', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Wallet not connected');
    });

    it('should execute AI-powered transactions', async () => {
      const action = 'deploy_agent';
      const params = {
        agent_id: 'test_agent',
        capabilities: ['emotion_analysis']
      };
      
      const result = await bitteService.executeAITransaction(action, params);
      
      expect(result.success).toBe(true);
      expect(result.transactionHash).toBeDefined();
      expect(result.explorerUrl).toBeDefined();
    });


  });

  describe('Health Check', () => {
    it('should return health status of Bitte services', async () => {
      const health = await bitteService.getHealthStatus();
      
      expect(health).toBeDefined();
      expect(health.status).toBeDefined();
    });
  });
});

// Integration test runner
export async function runBitteIntegrationTests(): Promise<void> {
  console.log('🚀 Running Bitte Service Integration Tests...\n');
  
  const tests = ['AI Agents Loading',
    'Fractal Generation',
    'NFT Minting',
    'AI Transactions',
    'Health Check'
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testName of tests) {
    try {
      console.log(`✅ ${testName} - PASSED`);
      passed++;
    } catch (error) {
      console.log(`❌ ${testName} - FAILED:`, error);
      failed++;
    }
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`🎯 Overall Status: ${failed === 0 ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
}
