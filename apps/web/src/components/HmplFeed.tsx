import React, { useEffect, useRef } from 'react';
import hmpl from 'hmpl-js';

interface HmplFeedProps {
    endpoint?: string;
}

export const HmplFeed: React.FC<HmplFeedProps> = ({ endpoint = '/hmpl/feed' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // HMPL template to fetch data from NestJS
            // Using a template string that HMPL can parse
            const template = `
        {{
          src: "http://localhost:3001${endpoint}",
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
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">🔮 Live Emotional Resonance (via HMPL)</h3>
            <div ref={containerRef} className="min-h-[100px] flex items-center justify-center bg-gray-800/20 rounded-lg border border-dashed border-gray-700">
                <span className="text-gray-500 animate-pulse">Syncing with emotional ether...</span>
            </div>
        </div>
    );
};

export default HmplFeed;
