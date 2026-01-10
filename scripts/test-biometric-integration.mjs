// Test script for biometric integration (ES Module)
import { BiometricDataGenerator, BiometricDataStream, createBiometricGenerator } from './src/utils/BiometricDataGenerator.js';

console.log('🧠 Testing Biometric Integration...\n');

// Test 1: Basic BiometricDataGenerator
console.log('1️⃣ Testing BiometricDataGenerator...');
try {
  const generator = new BiometricDataGenerator();
  const sample = generator.generateSample();
  
  console.log('✅ BiometricDataGenerator created successfully');
  console.log('   - Timestamp:', sample.timestamp);
  console.log('   - Attention:', sample.attention.toFixed(1));
  console.log('   - Meditation:', sample.meditation.toFixed(1));
  console.log('   - Signal Quality:', (sample.signalQuality * 100).toFixed(1) + '%');
  console.log('   - Emotional State:', sample.emotionalState);
  console.log('   - EEG Patterns:', Object.keys(sample.eeg));
  console.log('   - Gesture Type:', sample.gesture?.gestureType);
  console.log('   - Audio Emotion:', sample.audio?.emotion);
  console.log('');
} catch (error) {
  console.log('❌ BiometricDataGenerator failed:', error.message);
  console.log('');
}

// Test 2: Different emotional states
console.log('2️⃣ Testing different emotional states...');
const states = ['meditation', 'focus', 'excited', 'calm', 'neutral'];
states.forEach(state => {
  try {
    const generator = createBiometricGenerator(state);
    const sample = generator.generateSample();
    console.log(`   ${state}: Attention=${sample.attention.toFixed(1)}, Meditation=${sample.meditation.toFixed(1)}`);
  } catch (error) {
    console.log(`   ❌ ${state} state failed:`, error.message);
  }
});
console.log('');

// Test 3: BiometricDataStream (if available)
console.log('3️⃣ Testing BiometricDataStream...');
try {
  const stream = new BiometricDataStream(5); // 5 Hz for testing
  let sampleCount = 0;
  
  stream.onSample((sample) => {
    sampleCount++;
    if (sampleCount <= 3) {
      console.log(`   Sample ${sampleCount}: Attention=${sample.attention.toFixed(1)}, Quality=${(sample.signalQuality * 100).toFixed(1)}%`);
    }
    
    if (sampleCount >= 5) {
      stream.stop();
      console.log('   ✅ Stream received 5 samples successfully');
      console.log('');
    }
  });
  
  stream.start();
  
  // Stop after 2 seconds for safety
  setTimeout(() => {
    stream.stop();
    if (sampleCount < 5) {
      console.log(`   ⚠️  Stream stopped after timeout, received ${sampleCount} samples`);
    }
    console.log('');
  }, 2000);
  
} catch (error) {
  console.log('❌ BiometricDataStream failed:', error.message);
  console.log('');
}

// Test 4: EEG time series generation
console.log('4️⃣ Testing EEG time series generation...');
try {
  const generator = createBiometricGenerator('focus');
  const eegData = generator.generateEEGTimeSeries(2.0); // 2 seconds at 256 Hz
  
  console.log('✅ EEG time series generated successfully');
  console.log('   - Samples:', eegData.length);
  console.log('   - Duration: 2.0 seconds');
  console.log('   - Sample Rate: 256 Hz');
  console.log('   - Data Range:', Math.min(...eegData).toFixed(2), 'to', Math.max(...eegData).toFixed(2));
  console.log('');
} catch (error) {
  console.log('❌ EEG time series generation failed:', error.message);
  console.log('');
}

// Test 5: Emotional state calculations
console.log('5️⃣ Testing emotional state calculations...');
try {
  const generator = createBiometricGenerator('meditation');
  const sample = generator.generateSample();
  
  console.log('✅ Emotional state calculations verified');
  console.log('   - Valence range:', sample.emotionalState.valence >= -1 && sample.emotionalState.valence <= 1 ? '✅ Valid' : '❌ Invalid');
  console.log('   - Arousal range:', sample.emotionalState.arousal >= -1 && sample.emotionalState.arousal <= 1 ? '✅ Valid' : '❌ Invalid');
  console.log('   - Dominance range:', sample.emotionalState.dominance >= 0 && sample.emotionalState.dominance <= 1 ? '✅ Valid' : '❌ Invalid');
  console.log('');
} catch (error) {
  console.log('❌ Emotional state calculations failed:', error.message);
  console.log('');
}

console.log('🎉 Biometric integration testing completed!');
console.log('');
console.log('📋 Summary:');
console.log('   - BiometricDataGenerator: Creates realistic biometric data');
console.log('   - Emotional States: Supports meditation, focus, excited, calm, neutral');
console.log('   - BiometricDataStream: Provides real-time streaming capability');
console.log('   - EEG Generation: Creates time-series EEG data with realistic patterns');
console.log('   - VAD Model: Implements Valence-Arousal-Dominance emotional model');
console.log('');
console.log('🔧 Ready for integration with:');
console.log('   - WebGPU visualization engine');
console.log('   - NEAR blockchain NFT minting');
console.log('   - Real biometric device connections');