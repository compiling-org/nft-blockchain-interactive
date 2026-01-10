import { useState } from 'react';
import { EmotionalFractalGenerator } from './EmotionalFractalGenerator';

interface CreativeToolsPanelProps {
  emotionalState: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  wallet: any;
  accountId: string;
  onUpdate: (data: any) => void;
}

export function CreativeToolsPanel({
  emotionalState,
  wallet,
  accountId,
  onUpdate
}: CreativeToolsPanelProps) {
  const handleFractalGenerated = (data: any) => {
    onUpdate({ type: 'fractal', accountId, data });
  };

  return (
    <div>
      <EmotionalFractalGenerator
        emotionalState={emotionalState}
        onFractalGenerated={handleFractalGenerated}
      />
    </div>
  );
}

export default CreativeToolsPanel;
