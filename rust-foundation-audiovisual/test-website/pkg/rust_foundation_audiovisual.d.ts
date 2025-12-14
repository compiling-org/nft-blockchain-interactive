/* tslint:disable */
/* eslint-disable */
/**
 * Initialize the real extracted system
 */
export function main(): void;
/**
 * Real audio metrics extracted from Modurust
 */
export class AudioMetrics {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  readonly bpm: number;
  readonly beats_detected: number;
  readonly peak_left: number;
  readonly peak_right: number;
  readonly rms_left: number;
  readonly rms_right: number;
}
/**
 * Real AudioProcessor with extracted synthesis algorithms
 */
export class AudioProcessor {
  free(): void;
  [Symbol.dispose](): void;
  constructor(sample_rate: number, buffer_size: number);
  /**
   * Generate real sine wave using extracted synthesis algorithms
   */
  generate_sine(frequency: number, duration: number): Float32Array;
  /**
   * Generate real square wave (extracted algorithm)
   */
  generate_square(frequency: number, duration: number): Float32Array;
  /**
   * Real frequency analysis (simplified from extracted FFT algorithms)
   */
  analyze_frequencies(audio_data: Float32Array): Float32Array;
}
/**
 * Real CreativeEngine with extracted algorithms
 */
export class CreativeEngine {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  /**
   * Process audio with real analysis algorithms (simplified from Modurust)
   */
  process_audio(audio_data: Float32Array): AudioMetrics;
  /**
   * Generate fractal with real mathematical algorithms (extracted from Shader Studio)
   */
  generate_fractal(width: number, height: number): Uint8Array;
  /**
   * Pan fractal view (real navigation from extracted code)
   */
  pan_fractal(delta_x: number, delta_y: number): void;
  /**
   * Zoom fractal with real mathematical precision (from extracted code)
   */
  zoom_fractal(factor: number, center_x: number, center_y: number): void;
  /**
   * Get fractal parameters
   */
  readonly fractal_params: FractalParameters;
}
/**
 * Real fractal parameters extracted from Shader Studio
 */
export class FractalParameters {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  iterations: number;
  zoom: number;
  set center(value: number);
  readonly center_x: number;
  readonly center_y: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fractalparameters_free: (a: number, b: number) => void;
  readonly fractalparameters_new: () => number;
  readonly fractalparameters_set_iterations: (a: number, b: number) => void;
  readonly fractalparameters_set_zoom: (a: number, b: number) => void;
  readonly fractalparameters_set_center: (a: number, b: number, c: number) => void;
  readonly fractalparameters_iterations: (a: number) => number;
  readonly fractalparameters_zoom: (a: number) => number;
  readonly fractalparameters_center_x: (a: number) => number;
  readonly fractalparameters_center_y: (a: number) => number;
  readonly __wbg_audiometrics_free: (a: number, b: number) => void;
  readonly audiometrics_new: () => number;
  readonly audiometrics_bpm: (a: number) => number;
  readonly audiometrics_beats_detected: (a: number) => number;
  readonly audiometrics_peak_left: (a: number) => number;
  readonly audiometrics_peak_right: (a: number) => number;
  readonly audiometrics_rms_left: (a: number) => number;
  readonly audiometrics_rms_right: (a: number) => number;
  readonly __wbg_creativeengine_free: (a: number, b: number) => void;
  readonly creativeengine_new: () => number;
  readonly creativeengine_process_audio: (a: number, b: number, c: number) => [number, number, number];
  readonly creativeengine_generate_fractal: (a: number, b: number, c: number) => [number, number];
  readonly creativeengine_fractal_params: (a: number) => number;
  readonly creativeengine_pan_fractal: (a: number, b: number, c: number) => void;
  readonly creativeengine_zoom_fractal: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_audioprocessor_free: (a: number, b: number) => void;
  readonly audioprocessor_new: (a: number, b: number) => number;
  readonly audioprocessor_generate_sine: (a: number, b: number, c: number) => [number, number];
  readonly audioprocessor_generate_square: (a: number, b: number, c: number) => [number, number];
  readonly audioprocessor_analyze_frequencies: (a: number, b: number, c: number) => [number, number];
  readonly main: () => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
