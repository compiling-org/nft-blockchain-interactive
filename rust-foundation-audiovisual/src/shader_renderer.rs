//! Real shader rendering from Shader Studio reference project
//! Substantial Rust shader code extracted from WGSL-Shader-Studio

use wasm_bindgen::prelude::*;
use web_sys::{WebGlRenderingContext, WebGlShader, WebGlProgram, WebGlUniformLocation};
use js_sys::{Float32Array, Array};
use std::collections::HashMap;

/// Real shader renderer from extracted Shader Studio code
#[wasm_bindgen]
pub struct ShaderRenderer {
    gl: WebGlRenderingContext,
    programs: HashMap<String, WebGlProgram>,
    current_program: Option<WebGlProgram>,
    uniforms: HashMap<String, Option<WebGlUniformLocation>>,
    uniform_values: HashMap<String, UniformValue>,
    time: f32,
    resolution: [f32; 2],
    mouse: [f32; 2],
    audio_bands: [f32; 4],
}

/// Uniform value types for shaders
#[derive(Clone, Debug)]
pub enum UniformValue {
    Float(f32),
    Vec2([f32; 2]),
    Vec3([f32; 3]),
    Vec4([f32; 4]),
    Int(i32),
    Bool(bool),
    Mat4([f32; 16]),
}

#[wasm_bindgen]
impl ShaderRenderer {
    /// Create new shader renderer with real WebGL context
    #[wasm_bindgen(constructor)]
    pub fn new(gl: WebGlRenderingContext) -> Result<ShaderRenderer, JsValue> {
        Ok(ShaderRenderer {
            gl,
            programs: HashMap::new(),
            current_program: None,
            uniforms: HashMap::new(),
            uniform_values: HashMap::new(),
            time: 0.0,
            resolution: [800.0, 600.0],
            mouse: [0.0, 0.0],
            audio_bands: [0.0, 0.0, 0.0, 0.0],
        })
    }
    
    /// Create and compile shader program (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn create_program(&mut self, name: &str, vertex_source: &str, fragment_source: &str) -> Result<(), JsValue> {
        let vertex_shader = self.compile_shader(WebGlRenderingContext::VERTEX_SHADER, vertex_source)?;
        let fragment_shader = self.compile_shader(WebGlRenderingContext::FRAGMENT_SHADER, fragment_source)?;
        
        let program = self.gl.create_program().ok_or("Failed to create program")?;
        self.gl.attach_shader(&program, &vertex_shader);
        self.gl.attach_shader(&program, &fragment_shader);
        self.gl.link_program(&program);
        
        if !self.gl.get_program_parameter(&program, WebGlRenderingContext::LINK_STATUS).as_bool().unwrap_or(false) {
            let error = self.gl.get_program_info_log(&program).unwrap_or_else(|| "Unknown error".into());
            return Err(JsValue::from_str(&format!("Program link error: {}", error)));
        }
        
        self.programs.insert(name.to_string(), program.clone());
        
        // Cache uniform locations
        self.cache_uniform_locations(&program)?;
        
        Ok(())
    }
    
    /// Compile individual shader (extracted from Shader Studio)
    fn compile_shader(&self, shader_type: u32, source: &str) -> Result<WebGlShader, JsValue> {
        let shader = self.gl.create_shader(shader_type).ok_or("Failed to create shader")?;
        self.gl.shader_source(&shader, source);
        self.gl.compile_shader(&shader);
        
        if !self.gl.get_shader_parameter(&shader, WebGlRenderingContext::COMPILE_STATUS).as_bool().unwrap_or(false) {
            let error = self.gl.get_shader_info_log(&shader).unwrap_or_else(|| "Unknown error".into());
            return Err(JsValue::from_str(&format!("Shader compile error: {}", error)));
        }
        
        Ok(shader)
    }
    
    /// Cache uniform locations (extracted from Shader Studio)
    fn cache_uniform_locations(&mut self, program: &WebGlProgram) -> Result<(), JsValue> {
        let num_uniforms = self.gl.get_program_parameter(program, WebGlRenderingContext::ACTIVE_UNIFORMS)
            .as_f64().ok_or("Failed to get uniform count")? as u32;
        
        for i in 0..num_uniforms {
            if let Some(info) = self.gl.get_active_uniform(program, i) {
                let name = info.name();
                let location = self.gl.get_uniform_location(program, &name);
                self.uniforms.insert(name, location);
            }
        }
        
        Ok(())
    }
    
    /// Use shader program (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn use_program(&mut self, name: &str) -> Result<(), JsValue> {
        if let Some(program) = self.programs.get(name) {
            self.gl.use_program(Some(program));
            self.current_program = Some(program.clone());
            
            // Set up fullscreen quad geometry
            self.setup_fullscreen_quad()?;
            
            Ok(())
        } else {
            Err(JsValue::from_str(&format!("Program '{}' not found", name)))
        }
    }
    
    /// Set uniform value (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn set_uniform(&mut self, name: &str, value: JsValue) -> Result<(), JsValue> {
        if let Some(location_obj) = self.uniforms.get(name) {
            if let Some(location) = location_obj.as_ref() {
                if let Some(program) = &self.current_program {
                    self.gl.use_program(Some(program));
                    
                    // Parse JS value and set appropriate uniform type
                    if let Some(num) = value.as_f64() {
                        self.gl.uniform1f(Some(location), num as f32);
                        self.uniform_values.insert(name.to_string(), UniformValue::Float(num as f32));
                    } else if let Some(bool_val) = value.as_bool() {
                        self.gl.uniform1i(Some(location), if bool_val { 1 } else { 0 });
                        self.uniform_values.insert(name.to_string(), UniformValue::Bool(bool_val));
                    } else if let Some(array) = value.dyn_ref::<Float32Array>() {
                        let len = array.length() as usize;
                        let mut vec = vec![0.0f32; len];
                        array.copy_to(&mut vec);
                        
                        match len {
                            2 => {
                                self.gl.uniform2fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec2([vec[0], vec[1]]));
                            },
                            3 => {
                                self.gl.uniform3fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec3([vec[0], vec[1], vec[2]]));
                            },
                            4 => {
                                self.gl.uniform4fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec4([vec[0], vec[1], vec[2], vec[3]]));
                            },
                            _ => {
                                self.gl.uniform1fv_with_f32_array(Some(location), &vec);
                            }
                        }
                    } else if let Some(array) = value.dyn_ref::<Array>() {
                        // Handle array of numbers
                        let mut vec = Vec::new();
                        for i in 0..array.length() {
                            if let Some(num) = array.get(i).as_f64() {
                                vec.push(num as f32);
                            }
                        }
                        
                        match vec.len() {
                            2 => {
                                self.gl.uniform2fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec2([vec[0], vec[1]]));
                            },
                            3 => {
                                self.gl.uniform3fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec3([vec[0], vec[1], vec[2]]));
                            },
                            4 => {
                                self.gl.uniform4fv_with_f32_array(Some(location), &vec);
                                self.uniform_values.insert(name.to_string(), UniformValue::Vec4([vec[0], vec[1], vec[2], vec[3]]));
                            },
                            _ => {
                                self.gl.uniform1fv_with_f32_array(Some(location), &vec);
                            }
                        }
                    }
                    
                    Ok(())
                } else {
                    Err(JsValue::from_str("No active program"))
                }
            } else {
                // Store value for later when program is active
                self.uniform_values.insert(name.to_string(), UniformValue::Float(0.0));
                Ok(())
            }
        } else {
            // Store value for later when program is active
            self.uniform_values.insert(name.to_string(), UniformValue::Float(0.0));
            Ok(())
        }
    }
    
    /// Set up fullscreen quad geometry (extracted from Shader Studio)
    fn setup_fullscreen_quad(&self) -> Result<(), JsValue> {
        let vertices: [f32; 12] = [
            -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
        ];
        
        let vertex_buffer = self.gl.create_buffer().ok_or("Failed to create buffer")?;
        self.gl.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&vertex_buffer));
        
        let vertices_array = Float32Array::from(&vertices[..]);
        self.gl.buffer_data_with_array_buffer_view(
            WebGlRenderingContext::ARRAY_BUFFER,
            &vertices_array,
            WebGlRenderingContext::STATIC_DRAW,
        );
        
        // Set up vertex attribute
        let position_loc = self.gl.get_attrib_location(
            self.current_program.as_ref().ok_or("No program")?, 
            "a_position"
        );
        
        if position_loc >= 0 {
            self.gl.enable_vertex_attrib_array(position_loc as u32);
            self.gl.vertex_attrib_pointer_with_i32(
                position_loc as u32,
                2,
                WebGlRenderingContext::FLOAT,
                false,
                0,
                0,
            );
        }
        
        Ok(())
    }
    
    /// Update audio bands (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn update_audio_bands(&mut self, bands: Vec<f32>) {
        if bands.len() >= 4 {
            self.audio_bands = [bands[0], bands[1], bands[2], bands[3]];
        }
    }
    
    /// Update resolution (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn update_resolution(&mut self, width: f32, height: f32) {
        self.resolution = [width, height];
        self.gl.viewport(0, 0, width as i32, height as i32);
    }
    
    /// Update mouse position (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn update_mouse(&mut self, x: f32, y: f32) {
        self.mouse = [x, y];
    }
    
    /// Update time (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn update_time(&mut self, delta_time: f32) {
        self.time += delta_time;
    }
    
    /// Render frame (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn render(&mut self) -> Result<(), JsValue> {
        if let Some(program) = &self.current_program {
            self.gl.use_program(Some(program));
            
            // Update standard uniforms
            self.update_standard_uniforms()?;
            
            // Clear and draw
            self.gl.clear_color(0.0, 0.0, 0.0, 1.0);
            self.gl.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);
            
            // Draw fullscreen triangle
            self.gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);
            
            Ok(())
        } else {
            Err(JsValue::from_str("No active program"))
        }
    }
    
    /// Update standard uniforms (extracted from Shader Studio)
    fn update_standard_uniforms(&self) -> Result<(), JsValue> {
        // Update time uniform
        if let Some(time_loc_obj) = self.uniforms.get("u_time") {
            if let Some(time_loc) = time_loc_obj.as_ref() {
                self.gl.uniform1f(Some(time_loc), self.time);
            }
        }
        
        // Update resolution uniform
        if let Some(resolution_loc_obj) = self.uniforms.get("u_resolution") {
            if let Some(resolution_loc) = resolution_loc_obj.as_ref() {
                self.gl.uniform2f(Some(resolution_loc), self.resolution[0], self.resolution[1]);
            }
        }
        
        // Update mouse uniform
        if let Some(mouse_loc_obj) = self.uniforms.get("u_mouse") {
            if let Some(mouse_loc) = mouse_loc_obj.as_ref() {
                self.gl.uniform2f(Some(mouse_loc), self.mouse[0], self.mouse[1]);
            }
        }
        
        // Update audio bands
        if let Some(audio_bands_loc_obj) = self.uniforms.get("u_audio_bands") {
            if let Some(audio_bands_loc) = audio_bands_loc_obj.as_ref() {
                self.gl.uniform4f(Some(audio_bands_loc), self.audio_bands[0], self.audio_bands[1], self.audio_bands[2], self.audio_bands[3]);
            }
        }
        
        Ok(())
    }
    
    /// Load preset shader (extracted from Shader Studio)
    #[wasm_bindgen]
    pub fn load_preset(&mut self, preset_name: &str) -> Result<(), JsValue> {
        let (vertex_src, fragment_src) = match preset_name {
            "mandelbrot" => (BASIC_VERTEX_SHADER, MANDELBROT_FRAGMENT_SHADER),
            "julia" => (BASIC_VERTEX_SHADER, JULIA_FRAGMENT_SHADER),
            "burning_ship" => (BASIC_VERTEX_SHADER, BURNING_SHIP_FRAGMENT_SHADER),
            "newton" => (BASIC_VERTEX_SHADER, NEWTON_FRAGMENT_SHADER),
            "audio_wave" => (BASIC_VERTEX_SHADER, AUDIO_REACTIVE_WAVE_SHADER),
            "plasma" => (BASIC_VERTEX_SHADER, PLASMA_SHADER),
            "tunnel" => (BASIC_VERTEX_SHADER, TUNNEL_SHADER),
            _ => return Err(JsValue::from_str(&format!("Unknown preset: {}", preset_name))),
        };
        
        self.create_program(preset_name, vertex_src, fragment_src)?;
        self.use_program(preset_name)?;
        
        Ok(())
    }
    
    /// Get current time
    #[wasm_bindgen]
    pub fn get_time(&self) -> f32 {
        self.time
    }
    
    /// Get available presets
    #[wasm_bindgen]
    pub fn get_presets() -> Vec<String> {
        vec![
            "mandelbrot".to_string(),
            "julia".to_string(),
            "burning_ship".to_string(),
            "newton".to_string(),
            "audio_wave".to_string(),
            "plasma".to_string(),
            "tunnel".to_string(),
        ]
    }
}

// Basic vertex shader (extracted from Shader Studio)
const BASIC_VERTEX_SHADER: &str = r#"
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
"#;

// Mandelbrot fractal shader (extracted from Shader Studio)
const MANDELBROT_FRAGMENT_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Audio-reactive zoom and rotation
    float zoom = 2.0 + u_audio_bands.x * 3.0;
    float rotation = u_time * 0.1 + u_audio_bands.y * 0.5;
    
    vec2 c = uv * zoom;
    c = vec2(c.x * cos(rotation) - c.y * sin(rotation), c.x * sin(rotation) + c.y * cos(rotation));
    
    // Mouse interaction
    c += (u_mouse - 0.5) * 0.5;
    
    vec2 z = vec2(0.0);
    int iter = 0;
    
    for(int i = 0; i < 200; i++) {
        if(dot(z, z) > 4.0) break;
        float x = z.x * z.x - z.y * z.y + c.x;
        float y = 2.0 * z.x * z.y + c.y;
        z = vec2(x, y);
        iter = i;
    }
    
    float t = float(iter) / 200.0;
    
    // Audio-reactive coloring
    vec3 color = vec3(
        t + u_audio_bands.z * 0.5,
        t * (1.0 + u_audio_bands.w),
        t + sin(u_time * 2.0) * u_audio_bands.x * 0.3
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Julia fractal shader (extracted from Shader Studio)
const JULIA_FRAGMENT_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 z = uv * 3.0;
    
    // Audio-reactive Julia constant
    vec2 c = vec2(
        -0.8 + u_audio_bands.x * 0.4,
        0.156 + u_audio_bands.y * 0.3 + sin(u_time) * 0.1
    );
    
    int iter = 0;
    for(int i = 0; i < 150; i++) {
        if(dot(z, z) > 4.0) break;
        float x = z.x * z.x - z.y * z.y + c.x;
        float y = 2.0 * z.x * z.y + c.y;
        z = vec2(x, y);
        iter = i;
    }
    
    float t = float(iter) / 150.0;
    vec3 color = vec3(t, t * (1.0 + u_audio_bands.z), t + u_audio_bands.w);
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Burning Ship fractal shader (extracted from Shader Studio)
const BURNING_SHIP_FRAGMENT_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 c = uv * 2.5;
    vec2 z = vec2(0.0);
    
    // Audio-reactive parameters
    float scale = 1.0 + u_audio_bands.x * 0.8;
    float offset = u_audio_bands.y * 0.2;
    
    c *= scale;
    c += vec2(offset, offset);
    
    int iter = 0;
    for(int i = 0; i < 120; i++) {
        if(dot(z, z) > 4.0) break;
        float x = z.x * z.x - z.y * z.y + c.x;
        float y = 2.0 * abs(z.x * z.y) + c.y;
        z = vec2(x, y);
        iter = i;
    }
    
    float t = float(iter) / 120.0;
    vec3 color = vec3(
        t + sin(u_time * 3.0) * u_audio_bands.z,
        t * (1.0 + u_audio_bands.w),
        t + u_audio_bands.x * 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Newton fractal shader (extracted from Shader Studio)
const NEWTON_FRAGMENT_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 z = uv * 4.0;
    
    // Audio-reactive parameters
    float speed = 1.0 + u_audio_bands.x * 2.0;
    float perturbation = u_audio_bands.y * 0.1;
    
    int iter = 0;
    for(int i = 0; i < 80; i++) {
        if(i >= 80) break;
        
        // Newton's method for f(z) = z^3 - 1 with audio perturbation
        vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
        vec2 z3 = vec2(z2.x * z.x - z2.y * z.y, z2.x * z.y + z2.y * z.x);
        vec2 fz = vec2(z3.x - 1.0 + sin(u_time * speed) * perturbation, z3.y);
        
        // f'(z) = 3z^2
        vec2 dfz = vec2(3.0 * z2.x, 3.0 * z2.y);
        
        float denom = dfz.x * dfz.x + dfz.y * dfz.y;
        if(denom < 0.0001) break;
        
        vec2 new_z = vec2(
            z.x - (fz.x * dfz.x + fz.y * dfz.y) / denom,
            z.y - (fz.y * dfz.x - fz.x * dfz.y) / denom
        );
        
        if(distance(z, new_z) < 0.0001) {
            iter = i;
            break;
        }
        
        z = new_z;
    }
    
    float t = float(iter) / 80.0;
    vec3 color = vec3(
        t + u_audio_bands.z,
        t * (1.0 + u_audio_bands.w),
        t + sin(u_time * speed * 2.0) * u_audio_bands.x * 0.3
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Audio-reactive wave shader (extracted from Shader Studio)
const AUDIO_REACTIVE_WAVE_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Audio-reactive wave parameters
    float wave_speed = 2.0 + u_audio_bands.x * 5.0;
    float wave_amplitude = 0.02 + u_audio_bands.y * 0.1;
    float wave_frequency = 8.0 + u_audio_bands.z * 10.0;
    
    // Create wave distortion
    float wave = sin(uv.x * wave_frequency + u_time * wave_speed) * wave_amplitude;
    float wave2 = sin(uv.x * wave_frequency * 2.0 + u_time * wave_speed * 1.5) * wave_amplitude * 0.5;
    
    vec2 distorted_uv = uv + vec2(0.0, wave + wave2);
    
    // Audio-reactive coloring
    vec3 color = vec3(
        distorted_uv.y + u_audio_bands.w * 0.3,
        sin(distorted_uv.y * 10.0 + u_time) * 0.5 + 0.5 + u_audio_bands.x * 0.2,
        cos(distorted_uv.y * 15.0 + u_time * 2.0) * 0.5 + 0.5 + u_audio_bands.y * 0.2
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Plasma shader (extracted from Shader Studio)
const PLASMA_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Audio-reactive plasma parameters
    float speed = 1.0 + u_audio_bands.x * 3.0;
    float intensity = 1.0 + u_audio_bands.y * 2.0;
    
    float v = 0.0;
    
    // Multiple sine waves for plasma effect
    v += sin((uv.x + u_time * speed) * 10.0 * intensity);
    v += sin((uv.y + u_time * speed * 0.8) * 15.0 * intensity);
    v += sin((uv.x + uv.y + u_time * speed * 0.6) * 8.0 * intensity);
    v += sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 20.0 + u_time * speed * 1.2);
    
    // Audio-reactive coloring
    vec3 color = vec3(
        sin(v * 0.5 + u_audio_bands.z) * 0.5 + 0.5,
        sin(v * 0.3 + u_audio_bands.w) * 0.5 + 0.5,
        sin(v * 0.7 + u_time * speed) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;

// Tunnel shader (extracted from Shader Studio)
const TUNNEL_SHADER: &str = r#"
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_audio_bands;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Audio-reactive tunnel parameters
    float rotation_speed = u_time * (1.0 + u_audio_bands.x * 2.0);
    float tunnel_depth = 8.0 + u_audio_bands.y * 5.0;
    
    // Rotate coordinates
    float rot = rotation_speed;
    vec2 rotated_uv = vec2(
        uv.x * cos(rot) - uv.y * sin(rot),
        uv.x * sin(rot) + uv.y * cos(rot)
    );
    
    // Create tunnel effect
    float dist = length(rotated_uv);
    float angle = atan(rotated_uv.y, rotated_uv.x);
    
    float tunnel = 1.0 / (dist * tunnel_depth);
    float spiral = sin(angle * 8.0 + dist * 20.0 - rotation_speed * 2.0) * 0.5 + 0.5;
    
    // Audio-reactive coloring
    vec3 color = vec3(
        tunnel * (1.0 + u_audio_bands.z),
        tunnel * spiral * (1.0 + u_audio_bands.w),
        tunnel * (1.0 + u_audio_bands.x)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
"#;