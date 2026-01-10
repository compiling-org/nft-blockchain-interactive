# AI/ML Library Integration Guide

## Overview
This guide explains how to integrate Iron Learn, LanceDB, and other AI/ML libraries with the biometric NFT pipeline for enhanced creative session analysis and cross-chain operations.

## Available AI/ML Libraries

### 1. Iron Learn Integration
**File**: `src/rust-client/src/iron_learn_integration.rs`
- **GPU-accelerated tensor operations** with CUDA support
- **Linear/logistic regression** for emotion classification
- **Complex number arithmetic** for signal processing
- **Biometric emotion classification** models
- **Training metrics** and performance monitoring

### 2. LanceDB Integration  
**File**: `src/rust-client/src/lancedb_integration.rs`
- **Vector storage** for blockchain assets and emotional data
- **BERT-style embedding generation** for semantic search
- **Cross-chain asset vectorization**
- **Emotional vector search** with similarity scoring
- **In-memory fallback** when DB feature disabled

### 3. Unified JavaScript/TypeScript Bridge
**Files**: 
- `src/utils/unified-ai-ml-integration.js`
- `src/utils/ai-ml-integration-examples.js`

## Integration Architecture

```
Biometric Data → Iron Learn → AI Analysis → LanceDB → Vector Storage → NFT Metadata
     ↓              ↓            ↓          ↓           ↓            ↓
EEG/EMG/ECG → Emotion Model → Predictions → Embeddings → Search → Blockchain
```

## Quick Start

### 1. Basic Biometric Processing
```javascript
import { unifiedAIMLPipeline } from './unified-ai-ml-integration.js';

// Process creative session data
const biometricData = {
  eeg: { /* EEG signal data */ },
  emg: { /* EMG signal data */ },
  ecg: { /* ECG signal data */ },
  emotions: { /* Emotional states */ }
};

const aiResults = await unifiedAIMLPipeline.processBiometricData(biometricData);
console.log('AI Analysis:', aiResults.iron_learn.predictions);
console.log('Vector Storage:', aiResults.lance_db);
```

### 2. Real-time Biometric Monitoring
```javascript
import { RealTimeBiometricMonitor } from './ai-ml-integration-examples.js';

const monitor = new RealTimeBiometricMonitor({
  callbacks: {
    onAnalysis: (results) => {
      console.log('Real-time analysis:', results);
    },
    onEmotionalChange: (results) => {
      console.log('Emotional change detected:', results);
    }
  }
});

await monitor.startMonitoring('session_123');
// ... monitoring happens automatically
const summary = monitor.stopMonitoring();
```

### 3. Similarity Search for Creative Sessions
```javascript
import { findSimilarCreativeSessions } from './ai-ml-integration-examples.js';

const similarSessions = await findSimilarCreativeSessions({
  states: [{ valence: 0.8, arousal: 0.6, dominance: 0.7 }],
  creative_type: 'fractal',
  biometric_signals: { /* signal data */ }
});
```

## Advanced Usage

### Custom Model Training with Iron Learn
```javascript
const trainingData = {
  samples: [
    {
      emotions: { valence: 0.8, arousal: 0.6, dominance: 0.7 },
      biometric_confidence: 0.9,
      emotion_label: 'excited'
    },
    // ... more samples
  ]
};

const model = await trainCustomEmotionModel(trainingData);
```

### Vector Search with LanceDB
```javascript
// Store emotional vector
const vectorId = await unifiedAIMLPipeline.wasmBridge.processWithLanceDB({
  emotions: aiResults.predictions,
  signals: biometricData,
  metadata: { session_id: 'session_123' }
}, 'store');

// Search for similar patterns
const similar = await unifiedAIMLPipeline.wasmBridge.processWithLanceDB({
  emotions: queryEmotions
}, 'search');
```

## Integration with Existing Pipeline

### 1. Enhanced Biometric Hash Generation
```javascript
// Generate biometric hash using AI analysis
const biometricHash = unifiedAIMLPipeline.generateBiometricHash(aiResults);

// Use in NFT metadata
const nftMetadata = {
  attributes: [{
    trait_type: 'Biometric Hash',
    value: biometricHash
  }, {
    trait_type: 'AI Model Accuracy',
    value: aiResults.iron_learn.model.training_metrics.accuracy
  }]
};
```

### 2. Cross-Chain Bridge Integration
```javascript
// Process biometric data before cross-chain transfer
const aiAnalysis = await unifiedAIMLPipeline.processBiometricData(biometricData);

// Include AI analysis in bridge transfer
const bridgeData = {
  biometric_hash: unifiedAIMLPipeline.generateBiometricHash(aiAnalysis),
  emotional_signature: aiAnalysis.iron_learn.predictions.map(p => p.predicted_emotion),
  ai_model_metrics: aiAnalysis.iron_learn.model.training_metrics,
  vector_references: aiAnalysis.lance_db
};
```

### 3. Storage Integration
```javascript
// Store AI-analyzed data with enhanced metadata
const storageData = {
  creative_session: sessionData,
  ai_analysis: aiResults,
  biometric_hash: biometricHash,
  vector_embeddings: aiResults.lance_db.embedding,
  similar_patterns: aiResults.similar_patterns
};

// Use with existing storage functions
await storeCreativeDataToFilecoin(storageData);
await storeCreativeSession(storageData);
```

## Configuration Options

### Iron Learn Configuration
```javascript
const config = {
  ironLearn: {
    learningRate: 0.001,      // Learning rate for training
    epochs: 500,               // Training epochs
    useGPU: true,             // Enable GPU acceleration
    regularization: 0.0001,    // L2 regularization
    batchSize: 16             // Batch size for training
  }
};
```

### LanceDB Configuration
```javascript
const config = {
  lanceDB: {
    vectorDimension: 512,     // Vector embedding dimension
    indexType: 'ivf_pq',      // Vector index type
    distanceMetric: 'cosine', // Distance metric for similarity
    similarityThreshold: 0.7  // Minimum similarity score
  }
};
```

## Biometric Signal Processing

### EEG Signal Analysis
- **Frequency bands**: delta, theta, alpha, beta, gamma
- **Emotion estimation**: valence, arousal, dominance from power spectral density
- **Signal quality assessment**: artifact detection and confidence scoring

### EMG Signal Analysis
- **Muscle activity detection**: tension and relaxation patterns
- **Emotion correlation**: stress and excitement indicators
- **Signal validation**: quality metrics and noise filtering

### ECG Signal Analysis
- **Heart rate variability (HRV)**: stress and relaxation indicators
- **Emotional state correlation**: autonomic nervous system response
- **Signal processing**: R-peak detection and HRV calculation

## Error Handling

```javascript
try {
  const results = await unifiedAIMLPipeline.processBiometricData(data);
} catch (error) {
  if (error.message.includes('WASM')) {
    console.error('WASM module loading failed');
  } else if (error.message.includes('Iron Learn')) {
    console.error('Iron Learn processing failed');
  } else if (error.message.includes('LanceDB')) {
    console.error('LanceDB operation failed');
  }
}
```

## Performance Optimization

### 1. Batch Processing
```javascript
// Process multiple sessions efficiently
const batchResults = await Promise.all(
  sessions.map(session => 
    unifiedAIMLPipeline.processBiometricData(session.biometric_data)
  )
);
```

### 2. Caching Strategy
```javascript
// Cache trained models
const modelCache = new Map();
if (!modelCache.has(modelId)) {
  const model = await trainCustomEmotionModel(trainingData);
  modelCache.set(modelId, model);
}
```

### 3. Vector Search Optimization
```javascript
// Use similarity thresholds to limit results
const similar = await searchVectors(queryVector, {
  limit: 10,
  similarity_threshold: 0.8  // Higher threshold = fewer but better matches
});
```

## Testing and Validation

### Unit Tests
```javascript
// Test biometric feature extraction
const features = extractBiometricFeatures(mockBiometricData);
assert(features.length > 0);
assert(features[0].hasOwnProperty('valence'));

// Test model training
const model = await trainIronLearnModel(trainingData);
assert(model.training_metrics.accuracy > 0.8);
```

### Integration Tests
```javascript
// Test complete pipeline
const results = await processCreativeSessionWithAI(sessionData);
assert(results.success === true);
assert(results.biometric_hash.length === 64); // SHA-256 hash
assert(results.ai_analysis.iron_learn.predictions.length > 0);
```

## Deployment Considerations

### WASM Module Loading
- Ensure WASM files are properly compiled and accessible
- Handle browser compatibility for WebAssembly
- Implement fallback for environments without WASM support

### GPU Acceleration
- Check for WebGPU support in target browsers
- Provide CPU fallback for GPU operations
- Optimize tensor operations for performance

### Vector Database
- Configure LanceDB for production use
- Implement proper indexing for vector search
- Handle database connection pooling and error recovery

## Next Steps

1. **Compile WASM modules** for Iron Learn and LanceDB
2. **Configure production LanceDB** instance
3. **Implement WebGPU acceleration** for tensor operations
4. **Add real-time streaming** for biometric data
5. **Integrate with blockchain** storage functions
6. **Deploy cross-chain bridge** with AI-enhanced metadata