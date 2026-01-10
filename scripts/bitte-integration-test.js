/**
 * Bitte Integration Test Runner
 * Runs comprehensive tests for Bitte Protocol integration
 */

const { bitteService } = require('./src/services/bitteService.ts');

async function runIntegrationTests() {
  console.log('🚀 Starting Bitte Protocol Integration Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Test 1: Health Check
  try {
    console.log('🏥 Testing Health Check...');
    const health = await bitteService.getHealthStatus();
    console.log('✅ Health Check - PASSED');
    console.log(`   Status: ${health.status || 'unknown'}`);
    results.passed++;
    results.tests.push('Health Check');
  } catch (error) {
    console.log('❌ Health Check - FAILED:', error);
    results.failed++;
  }
  
  // Test 2: Wallet Connection
  try {
    console.log('\n👛 Testing Wallet Connection...');
    const connection = await bitteService.connectWallet();
    
    if (connection.success) {
      console.log('✅ Wallet Connection - PASSED');
      console.log(`   Account: ${connection.accountId}`);
      console.log(`   Public Key: ${connection.publicKey?.substring(0, 20)}...`);
      results.passed++;
      results.tests.push('Wallet Connection');
    } else {
      throw new Error(connection.error);
    }
  } catch (error) {
    console.log('❌ Wallet Connection - FAILED:', error);
    results.failed++;
  }
  
  // Test 3: AI Agents Loading
  try {
    console.log('\n🤖 Testing AI Agents Loading...');
    const agents = await bitteService.loadAIAgents();
    
    if (agents.length > 0) {
      console.log('✅ AI Agents Loading - PASSED');
      console.log(`   Found ${agents.length} agents:`);
      agents.forEach(agent => {
        console.log(`   - ${agent.name} (${agent.ai_model})`);
      });
      results.passed++;
      results.tests.push('AI Agents Loading');
    } else {
      throw new Error('No agents loaded');
    }
  } catch (error) {
    console.log('❌ AI Agents Loading - FAILED:', error);
    results.failed++;
  }
  
  // Test 4: Fractal Generation
  try {
    console.log('\n🎨 Testing Fractal Generation...');
    const emotionData = {
      valence: 0.7,
      arousal: 0.6,
      dominance: 0.8
    };
    
    const fractalResult = await bitteService.generateEmotionalFractal(emotionData);
    
    if (fractalResult.success && fractalResult.visualOutput) {
      console.log('✅ Fractal Generation - PASSED');
      console.log(`   Fractal ID: ${fractalResult.fractalId}`);
      console.log(`   Interactive: ${fractalResult.visualOutput.interactive}`);
      console.log(`   Controls: ${fractalResult.visualOutput.controls.join(', ')}`);
      console.log(`   SVG Length: ${fractalResult.visualOutput.svg.length} characters`);
      results.passed++;
      results.tests.push('Fractal Generation');
    } else {
      throw new Error(fractalResult.error || 'Fractal generation failed');
    }
  } catch (error) {
    console.log('❌ Fractal Generation - FAILED:', error);
    results.failed++;
  }
  
  // Test 5: NFT Minting
  try {
    console.log('\n🖼️  Testing NFT Minting...');
    const emotionData = {
      valence: 0.8,
      arousal: 0.7,
      dominance: 0.9
    };
    
    const generatedArt = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=';
    
    const mintResult = await bitteService.mintBiometricNFT(emotionData, generatedArt);
    
    if (mintResult.success) {
      console.log('✅ NFT Minting - PASSED');
      console.log(`   Token ID: ${mintResult.tokenId}`);
      console.log(`   Transaction: ${mintResult.transactionHash}`);
      console.log(`   Explorer: ${mintResult.explorerUrl}`);
      results.passed++;
      results.tests.push('NFT Minting');
    } else {
      throw new Error(mintResult.error || 'NFT minting failed');
    }
  } catch (error) {
    console.log('❌ NFT Minting - FAILED:', error);
    results.failed++;
  }
  
  // Test 6: AI Transaction Execution
  try {
    console.log('\n⚡ Testing AI Transaction Execution...');
    const txResult = await bitteService.executeAITransaction('deploy_agent', {
      agent_id: 'test_integration_agent',
      capabilities: ['emotion_analysis', 'biometric_verification']
    });
    
    if (txResult.success) {
      console.log('✅ AI Transaction Execution - PASSED');
      console.log(`   Transaction Hash: ${txResult.transactionHash}`);
      console.log(`   Explorer URL: ${txResult.explorerUrl}`);
      results.passed++;
      results.tests.push('AI Transaction Execution');
    } else {
      throw new Error(txResult.error || 'Transaction failed');
    }
  } catch (error) {
    console.log('❌ AI Transaction Execution - FAILED:', error);
    results.failed++;
  }
  
  // Final Results
  console.log('\n' + '='.repeat(50));
  console.log('📊 BITTE INTEGRATION TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Bitte Protocol integration is working correctly.');
    console.log('✨ The marketplace is ready for AI-powered biometric NFT operations.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
    console.log('🔧 Review the implementation and fix the issues before proceeding.');
  }
  
  console.log('\n📋 Tests Completed:');
  results.tests.forEach(test => {
    console.log(`   ✅ ${test}`);
  });
}

// Run the tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(console.error);
}

export { runIntegrationTests };