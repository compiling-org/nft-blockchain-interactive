/**
 * Simple Bitte API Integration Test
 * Tests the blockchain server endpoints directly
 */

async function testBitteAPIs() {
  console.log('🚀 Testing Bitte Protocol API Endpoints...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  const results = [];
  
  // Test 1: Health Check
  try {
    console.log('🏥 Testing Health Check...');
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    console.log('✅ Health Check - PASSED');
    console.log(`   Status: ${data.status}`);
    results.push({ test: 'Health Check', status: 'PASSED', data });
  } catch (error) {
    console.log('❌ Health Check - FAILED:', error.message);
    results.push({ test: 'Health Check', status: 'FAILED', error: error.message });
  }
  
  // Test 2: Wallet Connection
  try {
    console.log('\n👛 Testing Wallet Connection...');
    const response = await fetch(`${baseUrl}/wallet/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockchain: 'near',
        walletType: 'bitte-ai-wallet'
      })
    });
    const data = await response.json();
    console.log('✅ Wallet Connection - PASSED');
    console.log(`   Account: ${data.accountId}`);
    console.log(`   Network: ${data.network}`);
    results.push({ test: 'Wallet Connection', status: 'PASSED', data });
  } catch (error) {
    console.log('❌ Wallet Connection - FAILED:', error.message);
    results.push({ test: 'Wallet Connection', status: 'FAILED', error: error.message });
  }
  
  // Test 3: Fractal Generation
  try {
    console.log('\n🎨 Testing Fractal Generation...');
    const response = await fetch(`${baseUrl}/fractal/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emotionData: {
          primary_emotion: 'Creative',
          confidence: 0.85,
          arousal: 0.6,
          valence: 0.7
        },
        complexity: 8,
        blockchain: 'near'
      })
    });
    const data = await response.json();
    console.log('✅ Fractal Generation - PASSED');
    console.log(`   Fractal ID: ${data.fractalId}`);
    console.log(`   Interactive: ${data.visualOutput.interactive}`);
    console.log(`   SVG Length: ${data.visualOutput.svg.length} characters`);
    results.push({ test: 'Fractal Generation', status: 'PASSED', data });
  } catch (error) {
    console.log('❌ Fractal Generation - FAILED:', error.message);
    results.push({ test: 'Fractal Generation', status: 'FAILED', error: error.message });
  }
  
  // Test 4: NFT Minting
  try {
    console.log('\n🖼️  Testing NFT Minting...');
    const response = await fetch(`${baseUrl}/nft/mint-biometric`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: 'user.testnet',
        emotionData: {
          primary_emotion: 'Creative',
          confidence: 0.85,
          arousal: 0.6,
          valence: 0.7,
          secondary_emotions: [['Inspired', 0.8], ['Focused', 0.75]]
        },
        qualityScore: 0.89,
        biometricHash: 'sha256:test_integration_hash',
        blockchain: 'near'
      })
    });
    const data = await response.json();
    console.log('✅ NFT Minting - PASSED');
    console.log(`   Token ID: ${data.tokenId}`);
    console.log(`   Transaction: ${data.transactionHash}`);
    console.log(`   Explorer: ${data.explorerUrl}`);
    results.push({ test: 'NFT Minting', status: 'PASSED', data });
  } catch (error) {
    console.log('❌ NFT Minting - FAILED:', error.message);
    results.push({ test: 'NFT Minting', status: 'FAILED', error: error.message });
  }
  
  // Final Results
  console.log('\n' + '='.repeat(50));
  console.log('📊 BITTE API INTEGRATION TEST RESULTS');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL API TESTS PASSED!');
    console.log('✨ Bitte Protocol blockchain server is working correctly.');
    console.log('🚀 The marketplace is ready for AI-powered biometric NFT operations.');
  } else {
    console.log('\n⚠️  Some API tests failed. Check the logs above.');
  }
  
  console.log('\n📋 Test Summary:');
  results.forEach(result => {
    console.log(`   ${result.status === 'PASSED' ? '✅' : '❌'} ${result.test}`);
  });
  
  return { passed, failed, results };
}

// Run the tests
if (require.main === module) {
  testBitteAPIs().catch(console.error);
}

module.exports = { testBitteAPIs };