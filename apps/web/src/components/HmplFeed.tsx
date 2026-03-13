import React, { useEffect, useRef } from 'react';
import hmpl from 'hmpl-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HmplFeedProps {
    endpoint?: string;
    emotionalState: {
        valence: number;
        arousal: number;
        dominance: number;
        creativity: number;
        focus: number;
    };
}

export const HmplFeed: React.FC<HmplFeedProps> = ({ endpoint = '/hmpl/feed', emotionalState }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const queryParams = new URLSearchParams({
                valence: emotionalState.valence.toString(),
                arousal: emotionalState.arousal.toString(),
                dominance: emotionalState.dominance.toString(),
                creativity: emotionalState.creativity.toString(),
                focus: emotionalState.focus.toString(),
            }).toString();

            const template = `
        {{
          src: "http://localhost:3001${endpoint}?${queryParams}",
          after: "replace"
        }}
      `;

            try {
                // hmpl.compile returns an object that we can execute
                // Note: hmpl-js usage might vary depending on version, 
                // but typically it handles the fetch and DOM injection.
                const request = hmpl.compile(template);
                const response = request();

                // Response contains the node that will be updated
                if (response.response) {
                    containerRef.current.appendChild(response.response);
                }
            } catch (err) {
                console.error("HMPL error:", err);
            }
        }
    }, []);

    return (
        <Card className="mt-8 bg-gray-900/50 border border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">🔮 Live Emotional Resonance (via HMPL)</CardTitle>
                <CardDescription className="text-gray-400">
                    Dynamic content feed modulated by real-time emotional state.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div ref={containerRef} className="min-h-[100px] flex items-center justify-center bg-gray-800/20 rounded-lg border border-dashed border-gray-700">
                    <span className="text-gray-500 animate-pulse">Syncing with emotional ether...</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default HmplFeed;
