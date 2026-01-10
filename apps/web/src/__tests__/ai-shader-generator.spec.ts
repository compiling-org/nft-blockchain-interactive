import { describe, it, expect } from 'vitest';
import { AIShaderGenerator } from '../utils/ai-shader-generator';

describe('AIShaderGenerator', () => {
  it('initializes and generates shader code', async () => {
    const gen = new AIShaderGenerator();
    await gen.initialize();
    const shader = await gen.generateShader({
      prompt: 'biometric emotion abstract colorful',
      type: 'biometric',
      biometricData: { valence: 0.7, arousal: 0.6, dominance: 0.5, confidence: 0.9 },
      audioData: new Float32Array([0.1, 0.2, 0.3, 0.4]),
    });
    expect(typeof shader).toBe('string');
    expect(shader.length).toBeGreaterThan(50);
    expect(shader).toContain('@fragment');
  });
});

