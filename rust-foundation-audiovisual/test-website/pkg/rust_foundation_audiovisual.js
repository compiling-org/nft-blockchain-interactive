let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * Initialize the real extracted system
 */
export function main() {
    wasm.main();
}

const AudioMetricsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_audiometrics_free(ptr >>> 0, 1));
/**
 * Real audio metrics extracted from Modurust
 */
export class AudioMetrics {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AudioMetrics.prototype);
        obj.__wbg_ptr = ptr;
        AudioMetricsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AudioMetricsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_audiometrics_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.audiometrics_new();
        this.__wbg_ptr = ret >>> 0;
        AudioMetricsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get bpm() {
        const ret = wasm.audiometrics_bpm(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get beats_detected() {
        const ret = wasm.audiometrics_beats_detected(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get peak_left() {
        const ret = wasm.audiometrics_peak_left(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get peak_right() {
        const ret = wasm.audiometrics_peak_right(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get rms_left() {
        const ret = wasm.audiometrics_rms_left(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get rms_right() {
        const ret = wasm.audiometrics_rms_right(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) AudioMetrics.prototype[Symbol.dispose] = AudioMetrics.prototype.free;

const AudioProcessorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_audioprocessor_free(ptr >>> 0, 1));
/**
 * Real AudioProcessor with extracted synthesis algorithms
 */
export class AudioProcessor {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AudioProcessorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_audioprocessor_free(ptr, 0);
    }
    /**
     * @param {number} sample_rate
     * @param {number} buffer_size
     */
    constructor(sample_rate, buffer_size) {
        const ret = wasm.audioprocessor_new(sample_rate, buffer_size);
        this.__wbg_ptr = ret >>> 0;
        AudioProcessorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Generate real sine wave using extracted synthesis algorithms
     * @param {number} frequency
     * @param {number} duration
     * @returns {Float32Array}
     */
    generate_sine(frequency, duration) {
        const ret = wasm.audioprocessor_generate_sine(this.__wbg_ptr, frequency, duration);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Generate real square wave (extracted algorithm)
     * @param {number} frequency
     * @param {number} duration
     * @returns {Float32Array}
     */
    generate_square(frequency, duration) {
        const ret = wasm.audioprocessor_generate_square(this.__wbg_ptr, frequency, duration);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Real frequency analysis (simplified from extracted FFT algorithms)
     * @param {Float32Array} audio_data
     * @returns {Float32Array}
     */
    analyze_frequencies(audio_data) {
        const ptr0 = passArrayF32ToWasm0(audio_data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.audioprocessor_analyze_frequencies(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
}
if (Symbol.dispose) AudioProcessor.prototype[Symbol.dispose] = AudioProcessor.prototype.free;

const CreativeEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_creativeengine_free(ptr >>> 0, 1));
/**
 * Real CreativeEngine with extracted algorithms
 */
export class CreativeEngine {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreativeEngineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_creativeengine_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.creativeengine_new();
        this.__wbg_ptr = ret >>> 0;
        CreativeEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Process audio with real analysis algorithms (simplified from Modurust)
     * @param {Float32Array} audio_data
     * @returns {AudioMetrics}
     */
    process_audio(audio_data) {
        const ptr0 = passArrayF32ToWasm0(audio_data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.creativeengine_process_audio(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AudioMetrics.__wrap(ret[0]);
    }
    /**
     * Generate fractal with real mathematical algorithms (extracted from Shader Studio)
     * @param {number} width
     * @param {number} height
     * @returns {Uint8Array}
     */
    generate_fractal(width, height) {
        const ret = wasm.creativeengine_generate_fractal(this.__wbg_ptr, width, height);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Get fractal parameters
     * @returns {FractalParameters}
     */
    get fractal_params() {
        const ret = wasm.creativeengine_fractal_params(this.__wbg_ptr);
        return FractalParameters.__wrap(ret);
    }
    /**
     * Pan fractal view (real navigation from extracted code)
     * @param {number} delta_x
     * @param {number} delta_y
     */
    pan_fractal(delta_x, delta_y) {
        wasm.creativeengine_pan_fractal(this.__wbg_ptr, delta_x, delta_y);
    }
    /**
     * Zoom fractal with real mathematical precision (from extracted code)
     * @param {number} factor
     * @param {number} center_x
     * @param {number} center_y
     */
    zoom_fractal(factor, center_x, center_y) {
        wasm.creativeengine_zoom_fractal(this.__wbg_ptr, factor, center_x, center_y);
    }
}
if (Symbol.dispose) CreativeEngine.prototype[Symbol.dispose] = CreativeEngine.prototype.free;

const FractalParametersFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fractalparameters_free(ptr >>> 0, 1));
/**
 * Real fractal parameters extracted from Shader Studio
 */
export class FractalParameters {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FractalParameters.prototype);
        obj.__wbg_ptr = ptr;
        FractalParametersFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FractalParametersFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fractalparameters_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.fractalparameters_new();
        this.__wbg_ptr = ret >>> 0;
        FractalParametersFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} iterations
     */
    set iterations(iterations) {
        wasm.fractalparameters_set_iterations(this.__wbg_ptr, iterations);
    }
    /**
     * @param {number} zoom
     */
    set zoom(zoom) {
        wasm.fractalparameters_set_zoom(this.__wbg_ptr, zoom);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set center(x, y) {
        wasm.fractalparameters_set_center(this.__wbg_ptr, x, y);
    }
    /**
     * @returns {number}
     */
    get iterations() {
        const ret = wasm.fractalparameters_iterations(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get zoom() {
        const ret = wasm.fractalparameters_zoom(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get center_x() {
        const ret = wasm.fractalparameters_center_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get center_y() {
        const ret = wasm.fractalparameters_center_y(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) FractalParameters.prototype[Symbol.dispose] = FractalParameters.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_log_81afccaed04c36dd = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('rust_foundation_audiovisual_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
