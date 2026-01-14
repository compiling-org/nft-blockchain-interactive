// Deno script to validate emotional metadata schema
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const EmotionalMetadataSchema = z.object({
    version: z.string(),
    model: z.string(),
    timestamp: z.number(),
    emotional_state: z.object({
        valence: z.number().min(-1).max(1),
        arousal: z.number().min(-1).max(1),
        dominance: z.number().min(-1).max(1),
    }),
    confidence: z.number().min(0).max(1),
});

async function main() {
    console.log("🚀 Deno: Starting Emotional Metadata Validation...");

    // Example data from the grant projects
    const sampleData = {
        version: "1.0.0",
        model: "neuroemotive-vad-v1",
        timestamp: Date.now(),
        emotional_state: {
            valence: 0.85,
            arousal: 0.45,
            dominance: 0.60
        },
        confidence: 0.92
    };

    try {
        const result = EmotionalMetadataSchema.safeParse(sampleData);
        if (result.success) {
            console.log("✅ Validation successful!");
            console.log("Emotional Vector:", JSON.stringify(result.data.emotional_state, null, 2));
        } else {
            console.error("❌ Validation failed:", result.error.format());
            Deno.exit(1);
        }
    } catch (err) {
        console.error("💥 Unexpected error:", err);
        Deno.exit(1);
    }
}

main();
