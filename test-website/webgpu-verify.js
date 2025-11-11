// WebGPU Verification Script
async function verifyWebGPU() {
    console.log('🔍 Verifying WebGPU functionality...');
    
    // Check if WebGPU is supported
    if (!navigator.gpu) {
        console.warn('❌ WebGPU is not supported in this browser');
        return false;
    }
    
    try {
        // Request adapter
        console.log('🔌 Requesting WebGPU adapter...');
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.warn('❌ No WebGPU adapter available');
            return false;
        }
        console.log('✅ WebGPU adapter acquired');
        
        // Request device
        console.log('💻 Requesting WebGPU device...');
        const device = await adapter.requestDevice();
        if (!device) {
            console.warn('❌ Failed to create WebGPU device');
            return false;
        }
        console.log('✅ WebGPU device acquired');
        
        // Test canvas configuration
        console.log('🖼️ Testing canvas configuration...');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgpu');
        if (!context) {
            console.warn('❌ Failed to get WebGPU context');
            return false;
        }
        console.log('✅ WebGPU context acquired');
        
        // Configure canvas
        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: format,
            alphaMode: 'premultiplied'
        });
        console.log('✅ Canvas configured successfully');
        
        console.log('🎉 All WebGPU verification tests passed!');
        return true;
        
    } catch (error) {
        console.error('❌ WebGPU verification failed:', error);
        return false;
    }
}

// Run verification when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        await verifyWebGPU();
    }
});

// Export for global use
window.verifyWebGPU = verifyWebGPU;