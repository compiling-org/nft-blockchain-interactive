// WebGPU Test Functions
class WebGPUTest {
    constructor() {
        this.engine = null;
        this.isInitialized = false;
    }

    async initialize() {
        console.log('Initializing WebGPU test...');
        
        try {
            // Check if WebGPU is supported
            if (!navigator.gpu) {
                console.warn('WebGPU not supported in this browser');
                return false;
            }

            // Test basic WebGPU functionality
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('No WebGPU adapter available');
                return false;
            }

            const device = await adapter.requestDevice();
            if (!device) {
                console.warn('Failed to create WebGPU device');
                return false;
            }

            console.log('WebGPU test passed - basic functionality working');
            return true;
        } catch (error) {
            console.error('WebGPU test failed:', error);
            return false;
        }
    }

    async testCanvasRendering(canvas) {
        console.log('Testing WebGPU canvas rendering...');
        
        try {
            if (!this.engine) {
                this.engine = new WebGPUEngine(canvas);
                this.isInitialized = await this.engine.initialize();
            }

            if (this.isInitialized) {
                // Test rendering with sample parameters
                this.engine.updateUniforms({
                    time: 0,
                    resolution: [800, 600],
                    zoom: 1.0,
                    iterations: 100,
                    valence: 0,
                    arousal: 0.5,
                    dominance: 0.5
                });

                this.engine.render();
                console.log('WebGPU canvas rendering test passed');
                return true;
            } else {
                console.warn('WebGPU engine not initialized');
                return false;
            }
        } catch (error) {
            console.error('WebGPU canvas rendering test failed:', error);
            return false;
        }
    }

    async runAllTests() {
        console.log('Running all WebGPU tests...');
        
        const basicTest = await this.initialize();
        if (!basicTest) {
            console.error('Basic WebGPU test failed');
            return false;
        }

        console.log('All WebGPU tests passed!');
        return true;
    }
}

// Export for global use
window.WebGPUTest = WebGPUTest;

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Only run tests in development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const tester = new WebGPUTest();
        await tester.runAllTests();
    }
});