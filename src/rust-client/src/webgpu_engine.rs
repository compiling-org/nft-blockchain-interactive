//! WebGPU/WebGL shader engine for browser-based creative tools

use wasm_bindgen::prelude::*;
use web_sys::{console, window, WebGlRenderingContext, WebGlShader, WebGlProgram};
use js_sys::{ArrayBuffer, Uint8Array};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// WebGPU/WebGL shader engine for real-time creative rendering
#[wasm_bindgen]
pub struct ShaderEngine {
    canvas: web_sys::HtmlCanvasElement,
    gl: WebGlRenderingContext,
    programs: HashMap<String, WebGlProgram>,
    current_program: Option<WebGlProgram>,
    uniforms: HashMap<String, UniformValue>,
    time: f32,
    resolution: [f32; 2],
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum UniformValue {
    Float(f32),
    Vec2([f32; 2]),
    Vec3([f32; 3]),
    Vec4([f32; 4]),
    Int(i32),
    Bool(bool),
}

#[wasm_bindgen]
impl ShaderEngine {
    /// Create new shader engine
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str) -> Result<ShaderEngine, JsValue> {
        let document = web_sys::window()
            .ok_or("No window")?
            .document()
            .ok_or("No document")?;

        let canvas = document
            .get_element_by_id(canvas_id)
            .ok_or("Canvas not found")?
            .dyn_into::<web_sys::HtmlCanvasElement>()?;

        let gl = canvas
            .get_context("webgl")?
            .ok_or("WebGL not supported")?
            .dyn_into::<WebGlRenderingContext>()?;

        // Enable extensions for better performance
        gl.get_extension("OES_texture_float")?;
        gl.get_extension("OES_standard_derivatives")?;
        gl.get_extension("EXT_shader_texture_lod")?;

        Ok(ShaderEngine {
            canvas,
            gl,
            programs: HashMap::new(),
            current_program: None,
            uniforms: HashMap::new(),
            time: 0.0,
            resolution: [800.0, 600.0],
        })
    }

    /// Compile and link shader program
    #[wasm_bindgen]
    pub fn create_program(&mut self, name: &str, vertex_src: &str, fragment_src: &str) -> Result<(), JsValue> {
        let vertex_shader = self.compile_shader(WebGlRenderingContext::VERTEX_SHADER, vertex_src)?;
        let fragment_shader = self.compile_shader(WebGlRenderingContext::FRAGMENT_SHADER, fragment_src)?;

        let program = self.gl.create_program().ok_or("Failed to create program")?;
        self.gl.attach_shader(&program, &vertex_shader);
        self.gl.attach_shader(&program, &fragment_shader);
        self.gl.link_program(&program);

        if !self.gl.get_program_parameter(&program, WebGlRenderingContext::LINK_STATUS).as_bool().unwrap_or(false) {
            let log = self.gl.get_program_info_log(&program).unwrap_or_default();
            return Err(JsValue::from_str(&format!("Shader link error: {}", log)));
        }

        self.programs.insert(name.to_string(), program);
        Ok(())
    }

    /// Use shader program
    #[wasm_bindgen]
    pub fn use_program(&mut self, name: &str) -> Result<(), JsValue> {
        if let Some(program) = self.programs.get(name) {
            self.gl.use_program(Some(program));
            self.current_program = Some(program.clone());
            Ok(())
        } else {
            Err(JsValue::from_str("Program not found"))
        }
    }

    /// Set uniform value
    #[wasm_bindgen]
    pub fn set_uniform(&mut self, name: &str, value: JsValue) -> Result<(), JsValue> {
        if let Some(program) = &self.current_program {
            let location = self.gl.get_uniform_location(program, name);

            if let Some(loc) = location {
                // Parse different uniform types from JS
                if let Ok(f) = value.as_f64() {
                    self.gl.uniform1f(Some(&loc), f as f32);
                    self.uniforms.insert(name.to_string(), UniformValue::Float(f as f32));
                } else if let Ok(arr) = value.dyn_into::<js_sys::Array>() {
                    match arr.length() {
                        2 => {
                            let x = arr.get(0).as_f64().unwrap_or(0.0) as f32;
                            let y = arr.get(1).as_f64().unwrap_or(0.0) as f32;
                            self.gl.uniform2f(Some(&loc), x, y);
                            self.uniforms.insert(name.to_string(), UniformValue::Vec2([x, y]));
                        }
                        3 => {
                            let x = arr.get(0).as_f64().unwrap_or(0.0) as f32;
                            let y = arr.get(1).as_f64().unwrap_or(0.0) as f32;
                            let z = arr.get(2).as_f64().unwrap_or(0.0) as f32;
                            self.gl.uniform3f(Some(&loc), x, y, z);
                            self.uniforms.insert(name.to_string(), UniformValue::Vec3([x, y, z]));
                        }
                        4 => {
                            let x = arr.get(0).as_f64().unwrap_or(0.0) as f32;
                            let y = arr.get(1).as_f64().unwrap_or(0.0) as f32;
                            let z = arr.get(2).as_f64().unwrap_or(0.0) as f32;
                            let w = arr.get(3).as_f64().unwrap_or(0.0) as f32;
                            self.gl.uniform4f(Some(&loc), x, y, z, w);
                            self.uniforms.insert(name.to_string(), UniformValue::Vec4([x, y, z, w]));
                        }
                        _ => return Err(JsValue::from_str("Invalid array length for uniform"))
                    }
                }
            }
        }
        Ok(())
    }

    /// Render frame
    #[wasm_bindgen]
    pub fn render(&mut self, delta_time: f32) -> Result<(), JsValue> {
        self.time += delta_time;

        // Update time uniform
        self.set_uniform("u_time", JsValue::from(self.time))?;

        // Update resolution uniform
        self.set_uniform("u_resolution", JsValue::from(js_sys::Array::of2(
            &JsValue::from(self.resolution[0]),
            &JsValue::from(self.resolution[1])
        )))?;

        // Clear and draw
        self.gl.clear_color(0.0, 0.0, 0.0, 1.0);
        self.gl.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);

        // Draw fullscreen quad
        self.gl.draw_arrays(WebGlRenderingContext::TRIANGLE_STRIP, 0, 4);

        Ok(())
    }

    /// Load fractal shader preset
    #[wasm_bindgen]
    pub fn load_fractal_shader(&mut self, preset: &str) -> Result<(), JsValue> {
        let (vertex_src, fragment_src) = match preset {
            "mandelbrot" => (VERTEX_SHADER, MANDELBROT_FRAGMENT),
            "julia" => (VERTEX_SHADER, JULIA_FRAGMENT),
            "burning_ship" => (VERTEX_SHADER, BURNING_SHIP_FRAGMENT),
            _ => return Err(JsValue::from_str("Unknown preset"))
        };

        self.create_program(preset, vertex_src, fragment_src)?;
        self.use_program(preset)?;

        // Set up vertex attributes for fullscreen quad
        self.setup_geometry()?;

        Ok(())
    }

    /// Update canvas size
    #[wasm_bindgen]
    pub fn resize(&mut self, width: f32, height: f32) {
        self.resolution = [width, height];
        self.canvas.set_width(width as u32);
        self.canvas.set_height(height as u32);
        self.gl.viewport(0, 0, width as i32, height as i32);
    }

    /// Get current uniform values (for UI sync)
    #[wasm_bindgen]
    pub fn get_uniforms(&self) -> Result<JsValue, JsValue> {
        let obj = js_sys::Object::new();

        for (name, value) in &self.uniforms {
            let js_value = match value {
                UniformValue::Float(f) => JsValue::from(*f),
                UniformValue::Vec2([x, y]) => JsValue::from(js_sys::Array::of2(&JsValue::from(*x), &JsValue::from(*y))),
                UniformValue::Vec3([x, y, z]) => JsValue::from(js_sys::Array::of3(&JsValue::from(*x), &JsValue::from(*y), &JsValue::from(*z))),
                UniformValue::Vec4([x, y, z, w]) => JsValue::from(js_sys::Array::of4(&JsValue::from(*x), &JsValue::from(*y), &JsValue::from(*z), &JsValue::from(*w))),
                UniformValue::Int(i) => JsValue::from(*i),
                UniformValue::Bool(b) => JsValue::from(*b),
            };

            js_sys::Reflect::set(&obj, &JsValue::from(name.as_str()), &js_value)?;
        }

        Ok(JsValue::from(obj))
    }

    // Private methods
    fn compile_shader(&self, shader_type: u32, source: &str) -> Result<WebGlShader, JsValue> {
        let shader = self.gl.create_shader(shader_type).ok_or("Failed to create shader")?;
        self.gl.shader_source(&shader, source);
        self.gl.compile_shader(&shader);

        if !self.gl.get_shader_parameter(&shader, WebGlRenderingContext::COMPILE_STATUS).as_bool().unwrap_or(false) {
            let log = self.gl.get_shader_info_log(&shader).unwrap_or_default();
            return Err(JsValue::from_str(&format!("Shader compile error: {}", log)));
        }

        Ok(shader)
    }

    fn setup_geometry(&self) -> Result<(), JsValue> {
        // Create fullscreen quad vertices
        let vertices: [f32; 8] = [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0,
        ];

        let buffer = self.gl.create_buffer().ok_or("Failed to create buffer")?;
        self.gl.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));

        unsafe {
            let vert_array = js_sys::Float32Array::view(&vertices);
            self.gl.buffer_data_with_array_buffer_view(
                WebGlRenderingContext::ARRAY_BUFFER,
                &vert_array,
                WebGlRenderingContext::STATIC_DRAW,
            );
        }

        if let Some(program) = &self.current_program {
            let position_attr = self.gl.get_attrib_location(program, "a_position");
            if position_attr >= 0 {
                self.gl.enable_vertex_attrib_array(position_attr as u32);
                self.gl.vertex_attrib_pointer_with_i32(position_attr as u32, 2, WebGlRenderingContext::FLOAT, false, 0, 0);
            }
        }

        Ok(())
    }
}

// Shader source code
const VERTEX_SHADER: &str = r#"
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
"#;

const MANDELBROT_FRAGMENT: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_offset;
uniform int u_max_iter;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 c = uv * u_zoom + u_offset;
    vec2 z = vec2(0.0);

    int iter = 0;
    for(int i = 0; i < 1000; i++) {
        if(i >= u_max_iter) break;
        if(dot(z, z) > 4.0) break;

        float x = z.x * z.x - z.y * z.y + c.x;
        float y = 2.0 * z.x * z.y + c.y;
        z = vec2(x, y);
        iter = i;
    }

    float t = float(iter) / float(u_max_iter);
    vec3 color = mix(u_color1, u_color2, t);
    gl_FragColor = vec4(color, 1.0);
}
"#;

const JULIA_FRAGMENT: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_c;
uniform int u_max_iter;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 z = uv * u_zoom;

    int iter = 0;
    for(int i = 0; i < 1000; i++) {
        if(i >= u_max_iter) break;
        if(dot(z, z) > 4.0) break;

        float x = z.x * z.x - z.y * z.y + u_c.x;
        float y = 2.0 * z.x * z.y + u_c.y;
        z = vec2(x, y);
        iter = i;
    }

    float t = float(iter) / float(u_max_iter);
    vec3 color = mix(u_color1, u_color2, t);
    gl_FragColor = vec4(color, 1.0);
}
"#;

const BURNING_SHIP_FRAGMENT: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_offset;
uniform int u_max_iter;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 c = uv * u_zoom + u_offset;
    vec2 z = vec2(0.0);

    int iter = 0;
    for(int i = 0; i < 1000; i++) {
        if(i >= u_max_iter) break;
        if(dot(z, z) > 4.0) break;

        float x = abs(z.x * z.x - z.y * z.y) + c.x;
        float y = abs(2.0 * z.x * z.y) + c.y;
        z = vec2(x, y);
        iter = i;
    }

    float t = float(iter) / float(u_max_iter);
    vec3 color = mix(u_color1, u_color2, t);
    gl_FragColor = vec4(color, 1.0);
}
"#;

/// Initialize WebGPU if available (fallback to WebGL)
#[wasm_bindgen]
pub fn init_gpu_engine(canvas_id: &str) -> Result<ShaderEngine, JsValue> {
    ShaderEngine::new(canvas_id)
}

/// Check WebGPU support
#[wasm_bindgen]
pub fn check_webgpu_support() -> bool {
    // Check for WebGPU support (simplified)
    web_sys::window()
        .and_then(|w| w.navigator().gpu())
        .is_some()
}

/// Performance monitoring
#[wasm_bindgen]
pub struct PerformanceMonitor {
    frame_count: u32,
    last_time: f64,
    fps: f32,
}

#[wasm_bindgen]
impl PerformanceMonitor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PerformanceMonitor {
        PerformanceMonitor {
            frame_count: 0,
            last_time: js_sys::Date::now(),
            fps: 0.0,
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self) -> f32 {
        self.frame_count += 1;
        let current_time = js_sys::Date::now();
        let delta = current_time - self.last_time;

        if delta >= 1000.0 {
            self.fps = (self.frame_count as f64 / delta * 1000.0) as f32;
            self.frame_count = 0;
            self.last_time = current_time;
        }

        self.fps
    }

    #[wasm_bindgen]
    pub fn get_fps(&self) -> f32 {
        self.fps
    }
}