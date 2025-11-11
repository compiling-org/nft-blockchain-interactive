// MODURUST Tool System for Modular Creative Tools

class ModurustTool {
    constructor(name, type, version = "1.0.0") {
        this.toolId = Date.now() + Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.type = type;
        this.version = version;
        this.creator = "anonymous";
        this.createdAt = new Date().toISOString();
        this.parameters = [];
        this.inputs = [];
        this.outputs = [];
        this.dependencies = [];
        this.code = "";
        this.presets = [];
    }
    
    // Add a parameter to the tool
    addParameter(name, type, defaultValue, min = null, max = null, description = "") {
        this.parameters.push({
            name: name,
            type: type,
            defaultValue: defaultValue,
            minValue: min,
            maxValue: max,
            description: description
        });
        return this;
    }
    
    // Add an input port
    addInput(name, dataType, description = "") {
        this.inputs.push({
            name: name,
            dataType: dataType,
            description: description
        });
        return this;
    }
    
    // Add an output port
    addOutput(name, dataType, description = "") {
        this.outputs.push({
            name: name,
            dataType: dataType,
            description: description
        });
        return this;
    }
    
    // Add a dependency
    addDependency(toolId) {
        this.dependencies.push(toolId);
        return this;
    }
    
    // Set the tool code
    setCode(code) {
        this.code = code;
        return this;
    }
    
    // Add a preset
    addPreset(name, parameters, description = "") {
        this.presets.push({
            name: name,
            parameters: parameters,
            description: description
        });
        return this;
    }
    
    // Export tool as JSON
    toJSON() {
        return {
            toolId: this.toolId,
            name: this.name,
            type: this.type,
            version: this.version,
            creator: this.creator,
            createdAt: this.createdAt,
            parameters: this.parameters,
            inputs: this.inputs,
            outputs: this.outputs,
            dependencies: this.dependencies,
            code: this.code,
            presets: this.presets
        };
    }
    
    // Create from JSON
    static fromJSON(json) {
        const tool = new ModurustTool(json.name, json.type, json.version);
        tool.toolId = json.toolId;
        tool.creator = json.creator;
        tool.createdAt = json.createdAt;
        tool.parameters = json.parameters || [];
        tool.inputs = json.inputs || [];
        tool.outputs = json.outputs || [];
        tool.dependencies = json.dependencies || [];
        tool.code = json.code || "";
        tool.presets = json.presets || [];
        return tool;
    }
}

// MODURUST Tool Library
class ModurustLibrary {
    constructor() {
        this.tools = new Map();
        this.initializeDefaultTools();
    }
    
    // Initialize default tools
    initializeDefaultTools() {
        // Fractal Generator Tool
        const fractalTool = new ModurustTool("Fractal Generator", "ShaderModule")
            .addParameter("fractalType", "enum", "mandelbrot", null, null, "Type of fractal to generate")
            .addParameter("zoom", "float", 1.0, 0.1, 10.0, "Zoom level")
            .addParameter("iterations", "int", 100, 10, 1000, "Number of iterations")
            .addParameter("colorIntensity", "float", 1.0, 0.0, 2.0, "Color intensity")
            .addInput("emotionalInput", "Emotional", "Emotional state input")
            .addOutput("fractalTexture", "Image", "Generated fractal texture")
            .setCode(`
// Fractal Generator Shader
precision highp float;

uniform float u_zoom;
uniform int u_iterations;
uniform vec2 u_resolution;
uniform vec3 u_emotion; // valence, arousal, dominance

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 c = uv * u_zoom - vec2(0.5, 0.0);
    vec2 z = vec2(0.0);
    
    int i;
    for(i = 0; i < u_iterations; i++) {
        if(dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    }
    
    float t = float(i) / float(u_iterations);
    
    // Emotional color modulation
    vec3 color = mix(
        vec3(0.0, 0.0, t * u_emotion.x),
        vec3(t * u_emotion.y, t * u_emotion.z, 1.0),
        t
    );
    
    gl_FragColor = vec4(color, 1.0);
}
            `)
            .addPreset("Classic Mandelbrot", {
                fractalType: "mandelbrot",
                zoom: 1.0,
                iterations: 100,
                colorIntensity: 1.0
            }, "Classic Mandelbrot set visualization")
            .addPreset("Deep Zoom", {
                fractalType: "mandelbrot",
                zoom: 5.0,
                iterations: 500,
                colorIntensity: 1.5
            }, "Deep zoom into the Mandelbrot set");
        
        this.addTool(fractalTool);
        
        // Audio Reactive Tool
        const audioTool = new ModurustTool("Audio Reactive Visualizer", "AudioProcessor")
            .addParameter("sensitivity", "float", 1.0, 0.1, 3.0, "Audio sensitivity")
            .addParameter("smoothness", "float", 0.5, 0.0, 1.0, "Smoothing factor")
            .addParameter("visualMode", "enum", "spectrum", null, null, "Visualization mode")
            .addInput("audioInput", "Audio", "Audio signal input")
            .addInput("emotionalInput", "Emotional", "Emotional state input")
            .addOutput("visualOutput", "Video", "Audio-reactive visualization")
            .setCode(`
// Audio Reactive Visualizer
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform vec3 u_emotion;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // Audio-reactive visualization
    float wave = sin(uv.x * 10.0 + u_time * 2.0) * u_bass;
    float pulse = cos(uv.y * 15.0 + u_time * 1.5) * u_mid;
    float sparkle = sin(u_time * 4.0) * u_treble;
    
    // Emotional color mapping
    vec3 color = vec3(
        0.5 + 0.5 * wave * u_emotion.x,
        0.5 + 0.5 * pulse * u_emotion.y,
        0.5 + 0.5 * sparkle * u_emotion.z
    );
    
    gl_FragColor = vec4(color, 1.0);
}
            `)
            .addPreset("Spectrum Analyzer", {
                sensitivity: 1.0,
                smoothness: 0.5,
                visualMode: "spectrum"
            }, "Frequency spectrum visualization")
            .addPreset("Bass Pulse", {
                sensitivity: 2.0,
                smoothness: 0.3,
                visualMode: "bass"
            }, "Strong bass-responsive visualization");
        
        this.addTool(audioTool);
        
        // Particle System Tool
        const particleTool = new ModurustTool("Particle System", "VisualEffect")
            .addParameter("particleCount", "int", 100, 10, 1000, "Number of particles")
            .addParameter("speed", "float", 1.0, 0.1, 5.0, "Particle speed")
            .addParameter("size", "float", 2.0, 0.5, 10.0, "Particle size")
            .addParameter("life", "float", 5.0, 1.0, 20.0, "Particle lifetime")
            .addInput("emitterPosition", "Vector2", "Particle emitter position")
            .addInput("emotionalInput", "Emotional", "Emotional state input")
            .addOutput("particleOutput", "Video", "Particle system output")
            .setCode(`
// Particle System
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform int u_particleCount;
uniform vec3 u_emotion;

struct Particle {
    vec2 position;
    vec2 velocity;
    float life;
};

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);
    
    // Simple particle effect based on emotional state
    for(int i = 0; i < 50; i++) {
        float angle = u_time * 0.5 + float(i) * 0.1;
        vec2 pos = vec2(
            0.5 + cos(angle) * 0.3 * u_emotion.x,
            0.5 + sin(angle) * 0.3 * u_emotion.y
        );
        
        float dist = distance(uv, pos);
        float intensity = 0.01 / (dist + 0.01);
        
        color += vec3(
            intensity * u_emotion.x,
            intensity * u_emotion.y,
            intensity * u_emotion.z
        );
    }
    
    gl_FragColor = vec4(color, 1.0);
}
            `)
            .addPreset("Emotional Particles", {
                particleCount: 100,
                speed: 1.0,
                size: 2.0,
                life: 5.0
            }, "Particles that respond to emotional state")
            .addPreset("Swarm Effect", {
                particleCount: 500,
                speed: 2.0,
                size: 1.0,
                life: 3.0
            }, "Dense swarm particle effect");
        
        this.addTool(particleTool);
    }
    
    // Add a tool to the library
    addTool(tool) {
        this.tools.set(tool.toolId, tool);
        return tool.toolId;
    }
    
    // Get a tool by ID
    getTool(toolId) {
        return this.tools.get(toolId);
    }
    
    // Get all tools
    getAllTools() {
        return Array.from(this.tools.values());
    }
    
    // Get tools by type
    getToolsByType(type) {
        return Array.from(this.tools.values()).filter(tool => tool.type === type);
    }
    
    // Export tool to IPFS format
    exportToolToIPFS(toolId) {
        const tool = this.getTool(toolId);
        if (!tool) return null;
        
        return {
            type: 'modurust-tool',
            grant: 'Mintbase',
            tool_id: tool.toolId,
            name: tool.name,
            category: tool.type,
            parameters: tool.parameters,
            dependencies: tool.dependencies,
            version: tool.version,
            timestamp: new Date().toISOString(),
            code: tool.code,
            presets: tool.presets
        };
    }
    
    // Create a patch from multiple tools
    createPatch(name, toolIds) {
        const patch = {
            patchId: Date.now() + Math.random().toString(36).substr(2, 9),
            name: name,
            createdAt: new Date().toISOString(),
            tools: toolIds,
            connections: [],
            parameterStates: []
        };
        
        return patch;
    }
}

// Initialize the MODURUST library
const modurustLibrary = new ModurustLibrary();

// Export for global use
window.ModurustTool = ModurustTool;
window.ModurustLibrary = ModurustLibrary;
window.modurustLibrary = modurustLibrary;

// Example usage functions
function createFractalTool() {
    const tool = new ModurustTool("Custom Fractal Generator", "ShaderModule");
    tool.addParameter("complexity", "int", 100, 10, 500, "Fractal complexity")
        .addParameter("colorScheme", "enum", "rainbow", null, null, "Color scheme")
        .addInput("seed", "float", "Random seed for variation")
        .addOutput("texture", "Image", "Generated fractal texture");
    
    modurustLibrary.addTool(tool);
    return tool.toolId;
}

function createAudioTool() {
    const tool = new ModurustTool("Beat Detector", "AudioProcessor");
    tool.addParameter("threshold", "float", 0.5, 0.0, 1.0, "Beat detection threshold")
        .addInput("audioStream", "Audio", "Input audio stream")
        .addOutput("beatEvents", "Event", "Detected beat events");
    
    modurustLibrary.addTool(tool);
    return tool.toolId;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('MODURUST Tool System initialized');
    console.log(`Loaded ${modurustLibrary.getAllTools().length} default tools`);
});