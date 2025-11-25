/* tslint:disable */
/* eslint-disable */
export function main(): void;
export class AudioEngine {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  process_audio_frame(input_buffer: Float32Array): Float32Array;
  get_audio_levels(): Float32Array;
  generate_sine_wave(frequency: number, amplitude: number, duration: number): Float32Array;
}
export class CreativeEngine {
  free(): void;
  [Symbol.dispose](): void;
  constructor(canvas_width: number, canvas_height: number);
  process_audio(input_buffer: Float32Array): Float32Array;
  generate_visuals(tool_index: number, valence: number, arousal: number, dominance: number): Uint8Array;
  update(delta_time: number): void;
  get_tool_names(): Array<any>;
  get_tool_info(index: number): any;
  set_graphics_params(width: number, height: number, zoom: number, iterations: number): void;
}
export class CreativeTool {
  free(): void;
  [Symbol.dispose](): void;
  constructor(name: string, tool_type: string);
  add_parameter(param: ToolParameter): void;
  set_code(code: string): void;
  get_name(): string;
  get_type(): string;
  to_json(): any;
}
export class GraphicsEngine {
  free(): void;
  [Symbol.dispose](): void;
  constructor(width: number, height: number);
  generate_fractal(center_x: number, center_y: number, valence: number, arousal: number, dominance: number): Uint8Array;
  generate_audio_reactive(bass: number, mid: number, treble: number, valence: number, arousal: number, dominance: number): Uint8Array;
  update_time(delta_time: number): void;
  set_zoom(zoom: number): void;
  set_iterations(iterations: number): void;
}
export class ToolParameter {
  free(): void;
  [Symbol.dispose](): void;
  constructor(name: string, param_type: string, default_value: number);
  set range(value: number);
  set description(value: string);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_toolparameter_free: (a: number, b: number) => void;
  readonly toolparameter_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly toolparameter_set_range: (a: number, b: number, c: number) => void;
  readonly toolparameter_set_description: (a: number, b: number, c: number) => void;
  readonly __wbg_audioengine_free: (a: number, b: number) => void;
  readonly audioengine_new: () => number;
  readonly audioengine_process_audio_frame: (a: number, b: number, c: number) => [number, number];
  readonly audioengine_get_audio_levels: (a: number) => [number, number];
  readonly audioengine_generate_sine_wave: (a: number, b: number, c: number, d: number) => [number, number];
  readonly graphicsengine_new: (a: number, b: number) => number;
  readonly graphicsengine_generate_fractal: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly graphicsengine_generate_audio_reactive: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
  readonly graphicsengine_update_time: (a: number, b: number) => void;
  readonly graphicsengine_set_zoom: (a: number, b: number) => void;
  readonly graphicsengine_set_iterations: (a: number, b: number) => void;
  readonly __wbg_creativetool_free: (a: number, b: number) => void;
  readonly creativetool_new: (a: number, b: number, c: number, d: number) => number;
  readonly creativetool_add_parameter: (a: number, b: number) => void;
  readonly creativetool_set_code: (a: number, b: number, c: number) => void;
  readonly creativetool_get_name: (a: number) => [number, number];
  readonly creativetool_get_type: (a: number) => [number, number];
  readonly creativetool_to_json: (a: number) => any;
  readonly __wbg_creativeengine_free: (a: number, b: number) => void;
  readonly creativeengine_new: (a: number, b: number) => number;
  readonly creativeengine_process_audio: (a: number, b: number, c: number) => [number, number];
  readonly creativeengine_generate_visuals: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly creativeengine_update: (a: number, b: number) => void;
  readonly creativeengine_get_tool_names: (a: number) => any;
  readonly creativeengine_get_tool_info: (a: number, b: number) => any;
  readonly creativeengine_set_graphics_params: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly main: () => void;
  readonly __wbg_graphicsengine_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
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
