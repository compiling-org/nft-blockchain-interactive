import { describe, it, expect } from 'vitest';
import { HybridAIManager } from '../utils/hybrid-ai-manager';

describe('HybridAIManager', () => {
  it('detectEmotion returns values in expected ranges', async () => {
    const ai = new HybridAIManager();
    const eeg = ai.generateSyntheticEEG();
    const audio = ai.generateSyntheticAudio();
    const result = await ai.detectEmotion(eeg, audio);

    expect(result.valence).toBeGreaterThanOrEqual(0);
    expect(result.valence).toBeLessThanOrEqual(1);
    expect(result.arousal).toBeGreaterThanOrEqual(0);
    expect(result.arousal).toBeLessThanOrEqual(1);
    expect(result.dominance).toBeGreaterThanOrEqual(0);
    expect(result.dominance).toBeLessThanOrEqual(1);
    expect(result.attention).toBeGreaterThanOrEqual(0);
    expect(result.attention).toBeLessThanOrEqual(1);
    expect(result.stress).toBeGreaterThanOrEqual(0);
    expect(result.stress).toBeLessThanOrEqual(1);
  });

  it('synthetic generators produce non-empty arrays', () => {
    const ai = new HybridAIManager();
    const eeg = ai.generateSyntheticEEG();
    const audio = ai.generateSyntheticAudio();
    expect(eeg.length).toBeGreaterThan(0);
    expect(audio.length).toBeGreaterThan(0);
  });
});

