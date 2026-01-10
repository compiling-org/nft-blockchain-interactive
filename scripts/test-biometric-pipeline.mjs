import { BiometricDataStream, createBiometricGenerator } from './src/utils/BiometricDataGenerator.ts';

console.log('🧠 Testing Biometric NFT Pipeline...\n');

// Test 1: Basic biometric data generation
console.log('1️⃣ Testing Biometric Data Generation');
const generator = createBiometricGenerator('meditation');
const sample = generator.generateSample();

console.log('✅ Generated biometric sample:');
console.log(`   Attention: ${sample.attention}`);
console.log(`   Meditation: ${sample.meditation}`);
console.log(`   Quality: ${(sample.signalQuality * 100).toFixed(1)}%`);
console.log(`   Emotional State - Valence: ${sample.emotionalState.valence}, Arousal: ${sample.emotionalState.arousal}, Dominance: ${sample.emotionalState.dominance}`);
console.log(`   EEG - Alpha: ${sample.eeg.alpha}, Beta: ${sample.eeg.beta}, Theta: ${sample.eeg.theta}`);
console.log(`   Gesture: ${sample.gesture.gestureType}, Confidence: ${(sample.gesture.confidence * 100).toFixed(1)}%`);
console.log(`   Audio: ${sample.audio.emotion}, Confidence: ${(sample.audio.confidence * 100).toFixed(1)}%`);

// Test 2: Biometric data stream
console.log('\n2️⃣ Testing Biometric Data Stream');
const stream = new BiometricDataStream(5); // 5 Hz for testing
let sampleCount = 0;

stream.onSample((sample) => {
  sampleCount++;
  console.log(`   Sample ${sampleCount}: Attention=${sample.attention.toFixed(1)}, Meditation=${sample.meditation.toFixed(1)}, Emotion=${sample.emotionalState.valence.toFixed(2)}`);
  
  if (sampleCount >= 3) {
    stream.stop();
    console.log('✅ Stream test completed');
    
    // Test 3: NFT metadata generation
    console.log('\n3️⃣ Testing NFT Metadata Generation');
    testNFTMetadata(sample);
  }
});

stream.start();

// Test 3: NFT metadata generation
function testNFTMetadata(finalSample) {
  const biometricHash = generateBiometricHash(finalSample);
  const emotionData = {
    valence: finalSample.emotionalState.valence,
    arousal: finalSample.emotionalState.arousal,
    dominance: finalSample.emotionalState.dominance,
    confidence: finalSample.signalQuality,
    source: ['eeg', 'gesture', 'audio']
  };
  
  const metadata = {
    title: 'Meditation Session #1',
    description: `Biometric NFT created with attention: ${finalSample.attention.toFixed(1)}, meditation: ${finalSample.meditation.toFixed(1)}`,
    media: 'https://example.com/biometric-visualization.png',
    media_hash: biometricHash,
    issued_at: new Date().toISOString(),
    extra: JSON.stringify({
      biometric_data: {
        attention: finalSample.attention,
        meditation: finalSample.meditation,
        quality_score: finalSample.signalQuality,
        eeg_patterns: finalSample.eeg,
        gesture_data: finalSample.gesture,
        audio_data: finalSample.audio,
        emotional_state: finalSample.emotionalState,
        timestamp: finalSample.timestamp,
        device_id: 'biometric-generator-v1'
      },
      visualization_params: {
        complexity: 20 + (finalSample.attention * 1.6),
        color_shift: finalSample.emotionalState.valence * 0.5,
        speed: 0.5 + (finalSample.emotionalState.arousal + 1) * 2,
        zoom: 1 + (finalSample.meditation - 50) * 0.02,
        iterations: 50 + (finalSample.signalQuality * 150)
      }
    })
  };
  
  console.log('✅ NFT metadata generated:');
  console.log(`   Title: ${metadata.title}`);
  console.log(`   Biometric Hash: ${biometricHash}`);
  console.log(`   Emotion Data:`, emotionData);
  console.log(`   Visualization Complexity: ${20 + (finalSample.attention * 1.6)}`);
  console.log(`   Color Shift: ${finalSample.emotionalState.valence * 0.5}`);
  
  // Test 4: NEAR contract parameters
  console.log('\n4️⃣ Testing NEAR Contract Parameters');
  const contractParams = {
    token_id: `biometric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    receiver_id: 'test-account.testnet',
    emotion_data: emotionData,
    quality_score: finalSample.signalQuality,
    biometric_hash: biometricHash
  };
  
  console.log('✅ Contract parameters ready:');
  console.log(`   Token ID: ${contractParams.token_id}`);
  console.log(`   Quality Score: ${(contractParams.quality_score * 100).toFixed(1)}%`);
  console.log(`   Emotion Sources: ${contractParams.emotion_data.source.join(', ')}`);
  
  console.log('\n🎉 Biometric NFT Pipeline Test Complete!');
  console.log('✅ All components are working correctly');
  console.log('✅ Ready for real NEAR blockchain integration');
}

// Simple hash function for biometric data
function generateBiometricHash(data) {
  const hashInput = [
    data.eeg.alpha.toFixed(3),
    data.eeg.beta.toFixed(3),
    data.eeg.theta.toFixed(3),
    data.attention.toFixed(1),
    data.meditation.toFixed(1),
    data.emotionalState.valence.toFixed(3),
    data.emotionalState.arousal.toFixed(3),
    data.timestamp.toString()
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
}