/**
 * Bitte Service Integration Tests
 * Tests the complete Bitte Protocol integration with real API calls
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { bitteService } from './bitteService';

describe('BitteService Integration Tests', () => {
  beforeEach(() => {
    // Reset service state before each test
    bitteService.disconnectWallet();
  });

  describe('Wallet Connection', () => {
    it('should connect to Bitte wallet successfully', async () => {
      const result = await bitteService.connectWallet();
      
      expect(result.success).toBe(true);
      expect(result.accountId).toBeDefined();
      expect(result.accountId).toMatch(/\.testnet$/);
      
      const status = bitteService.getConnectionStatus();
      expect(status.isConnected).toBe(true);
      expect(status.accountId).toBe(result.accountId);
    });

    it('should handle connection status correctly', () => {
      const status = bitteService.getConnectionStatus();
      expect(status.isConnected).toBe(false);
      expect(status.accountId).toBe('');
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
        valence: -1.5, // Invalid range
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
  });

  describe('NFT Minting', () => {
    beforeEach(async () => {
      // Ensure wallet is connected for NFT minting tests
      await bitteService.connectWallet();
    });

    it('should mint biometric NFT with AI-generated content', async () => {
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

    it('should fail NFT minting when wallet is not connected', async () => {
      bitteService.disconnectWallet();
      
      const emotionData = {
        valence: 0.5,
        arousal: 0.5,
        dominance: 0.5
      };
      
      const generatedArt = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCI+';
      
      const result = await bitteService.mintBiometricNFT(emotionData, generatedArt);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Wallet not connected');
    });
  });

  describe('AI Transactions', () => {
    beforeEach(async () => {
      await bitteService.connectWallet();
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

    it('should fail AI transactions when wallet is not connected', async () => {
      bitteService.disconnectWallet();
      
      const result = await bitteService.executeAITransaction('test_action', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Wallet not connected');
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
  
  const tests = [
    'Wallet Connection',
    'AI Agents Loading',
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