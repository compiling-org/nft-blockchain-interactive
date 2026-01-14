import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface HMPLTemplateRendererProps {
    emotionalState: {
        valence: number;
        arousal: number;
        dominance: number;
        primaryEmotion: string;
    };
}

export const HMPLTemplateRenderer: React.FC<HMPLTemplateRendererProps> = ({ emotionalState }) => {
    const [templateHtml, setTemplateHtml] = useState<string>('');

    useEffect(() => {
        // Simulate HMPL template compilation based on emotional state
        // In a full implementation, this would use hmpl-js to compile template strings
        // or fetch server-side rendered templates

        const generateTemplate = () => {
            const color = emotionalState.valence > 0 ? '#4ade80' : '#f87171'; // Green or Red
            const intensity = Math.round(emotionalState.arousal * 100);

            return `
        <div style="padding: 1rem; border: 1px solid ${color}; border-radius: 0.5rem;">
          <h4 style="color: ${color}; margin-bottom: 0.5rem;">Dynamic Emotional Context</h4>
          <p>Current Intensity: <strong>${intensity}%</strong></p>
          <p>Detected Mood: <span style="text-transform: capitalize;">${emotionalState.primaryEmotion}</span></p>
          <div style="margin-top: 1rem; height: 4px; background: #374151; border-radius: 2px;">
            <div style="width: ${intensity}%; height: 100%; background: ${color}; transition: width 0.5s;"></div>
          </div>
        </div>
      `;
        };

        setTemplateHtml(generateTemplate());
    }, [emotionalState]);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-gray-200 text-lg">HMPL Dynamic Template</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    dangerouslySetInnerHTML={{ __html: templateHtml }}
                    className="font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                    * Rendered using simulated HMPL template engine based on biometric signals
                </p>
            </CardContent>
        </Card>
    );
};
