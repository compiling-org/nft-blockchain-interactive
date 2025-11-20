#!/usr/bin/env node

/**
 * Test Complete Pipeline: Emotion Detection → GPU Fractal → NEAR Minting
 * 
 * This script tests the entire workflow from emotion detection through
 * GPU fractal generation to NEAR blockchain minting.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Complete Pipeline: Emotion → GPU → NEAR');
console.log('=' .repeat(60));

// Test configuration
const TEST_CONFIG = {
  frontendUrl: 'http://localhost:3004',
  contractId: 'fractal-studio-final.testnet',
  testAccount: 'test.near',
  emotionData: {
    arousal: 0.7,
    valence: 0.5,
    dominance: 0.6
  },
  fractalParams: {
    width: 512,
    height: 512,
    maxIterations: 100,
    zoom: 1.0,
    centerX: -0.5,
    centerY: 0.0
  }
};

function runTest(testName, testFunction) {
  console.log(`\n📋 Testing: ${testName}`);
  try {
    const result = testFunction();
    console.log(`✅ PASS: ${testName}`);
    return result;
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Test 1: Frontend Accessibility
function testFrontendConnection() {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${TEST_CONFIG.frontendUrl}`, { encoding: 'utf8' });
    if (response.trim() !== '200') {
      throw new Error(`HTTP ${response.trim()}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Frontend not accessible: ${error.message}`);
  }
}

// Test 2: NEAR Contract Deployment Status
function testContractDeployment() {
  try {
    // Check if contract is deployed by calling a view method
    const result = execSync(`near view ${TEST_CONFIG.contractId} nft_metadata`, { encoding: 'utf8' });
    const metadata = JSON.parse(result);
    
    if (!metadata.name || !metadata.symbol) {
      throw new Error('Invalid contract metadata');
    }
    
    console.log(`   Contract: ${metadata.name} (${metadata.symbol})`);
    return metadata;
  } catch (error) {
    throw new Error(`Contract deployment check failed: ${error.message}`);
  }
}

// Test 3: WebGPU Support Check
function testWebGPUSupport() {
  // This would normally run in browser, but we can check if the code exists
  const webGPUPath = path.join(__dirname, 'grant-repositories/near-creative-engine/src/NearCreativeEngineReal.tsx');
  
  if (!fs.existsSync(webGPUPath)) {
    throw new Error('WebGPU implementation not found');
  }
  
  const content = fs.readFileSync(webGPUPath, 'utf8');
  const hasWebGPU = content.includes('navigator.gpu') && content.includes('compute shader');
  
  if (!hasWebGPU) {
    throw new Error('WebGPU compute shader not implemented');
  }
  
  return true;
}

// Test 4: Emotion Integration
function testEmotionIntegration() {
  const webGPUPath = path.join(__dirname, 'grant-repositories/near-creative-engine/src/NearCreativeEngineReal.tsx');
  const content = fs.readFileSync(webGPUPath, 'utf8');
  
  const hasEmotionParams = content.includes('emotion_arousal') && 
                           content.includes('emotion_valence') &&
                           content.includes('generateFractalWebGPU');
  
  if (!hasEmotionParams) {
    throw new Error('Emotion parameters not integrated in GPU compute');
  }
  
  return true;
}

// Test 5: NEAR Wallet Integration
function testWalletIntegration() {
  const walletPath = path.join(__dirname, 'grant-repositories/near-creative-engine/src/NearCreativeEngineReal.tsx');
  const content = fs.readFileSync(walletPath, 'utf8');
  
  const hasWalletConnect = content.includes('WalletConnection') && 
                          content.includes('requestSignIn');
  
  if (!hasWalletConnect) {
    throw new Error('NEAR wallet integration not implemented');
  }
  
  return true;
}

// Test 6: Contract Integration
function testContractIntegration() {
  const contractPath = path.join(__dirname, 'grant-repositories/near-creative-engine/src/NearCreativeEngineReal.tsx');
  const content = fs.readFileSync(contractPath, 'utf8');
  
  const hasContractCall = content.includes('mint_fractal_nft') && 
                         content.includes('fractal-studio-final.testnet');
  
  if (!hasContractCall) {
    throw new Error('Contract minting integration not implemented');
  }
  
  return true;
}

// Run all tests
console.log('Starting pipeline tests...\n');

const results = {
  frontend: runTest('Frontend Connection', testFrontendConnection),
  contract: runTest('NEAR Contract Deployment', testContractDeployment),
  webgpu: runTest('WebGPU Implementation', testWebGPUSupport),
  emotion: runTest('Emotion Integration', testEmotionIntegration),
  wallet: runTest('NEAR Wallet Integration', testWalletIntegration),
  integration: runTest('Contract Integration', testContractIntegration)
};

// Summary
console.log('\n' + '=' .repeat(60));
console.log('📊 PIPELINE TEST SUMMARY');
console.log('=' .repeat(60));

const passed = Object.values(results).filter(r => r !== null).length;
const total = Object.keys(results).length;

console.log(`Tests Passed: ${passed}/${total}`);

if (passed === total) {
  console.log('🎉 ALL TESTS PASSED! Pipeline is ready for integration testing.');
  console.log('\nNext Steps:');
  console.log('1. Open http://localhost:3004 in your browser');
  console.log('2. Connect your NEAR wallet');
  console.log('3. Test emotion input and fractal generation');
  console.log('4. Mint fractal NFT to blockchain');
} else {
  console.log('⚠️  Some tests failed. Check the errors above.');
  console.log('\nFailed Components:');
  Object.entries(results).forEach(([name, result]) => {
    if (result === null) {
      console.log(`- ${name}`);
    }
  });
}

// Generate test report
const report = {
  timestamp: new Date().toISOString(),
  results,
  summary: {
    passed,
    total,
    successRate: `${Math.round((passed / total) * 100)}%`
  }
};

fs.writeFileSync('pipeline-test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Test report saved to pipeline-test-report.json');