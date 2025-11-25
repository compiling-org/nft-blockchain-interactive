use wasm_bindgen::prelude::*;
use js_sys::{Array, Object, Reflect};
use web_sys::console;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Tool system extracted from Modurust
#[wasm_bindgen]
pub struct ToolParameter {
    name: String,
    param_type: String,
    default_value: f32,
    min_value: Option<f32>,
    max_value: Option<f32>,
    description: String,
}

#[wasm_bindgen]
impl ToolParameter {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, param_type: String, default_value: f32) -> ToolParameter {
        ToolParameter {
            name,
            param_type,
            default_value,
            min_value: None,
            max_value: None,
            description: String::new(),
        }
    }

    #[wasm_bindgen(setter)]
    pub fn set_range(&mut self, min: f32, max: f32) {
        self.min_value = Some(min);
        self.max_value = Some(max);
    }

    #[wasm_bindgen(setter)]
    pub fn set_description(&mut self, description: String) {
        self.description = description;
    }
}

// Audio Engine extracted from Modurust
#[wasm_bindgen]
pub struct AudioEngine {
    sample_rate: f32,
    time: f32,
    bass_level: f32,
    mid_level: f32,
    treble_level: f32,
}

#[wasm_bindgen]
impl AudioEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AudioEngine {
        AudioEngine {
            sample_rate: 44100.0,
            time: 0.0,
            bass_level: 0.0,
            mid_level: 0.0,
            treble_level: 0.0,
        }
    }

    pub fn process_audio_frame(&mut self, input_buffer: &[f32]) -> Vec<f32> {
        // Simple audio processing - extract frequency bands
        let mut output = vec![0.0; input_buffer.len()];
        
        // Extract bass frequencies (simplified)
        let mut bass_sum = 0.0;
        for i in 0..input_buffer.len().min(100) {
            bass_sum += input_buffer[i].abs();
        }
        self.bass_level = bass_sum / 100.0;
        
        // Extract mid frequencies
        let mut mid_sum = 0.0;
        let mid_start = input_buffer.len() / 4;
        let mid_end = input_buffer.len() / 2;
        for i in mid_start..mid_end {
            mid_sum += input_buffer[i].abs();
        }
        self.mid_level = mid_sum / (mid_end - mid_start) as f32;
        
        // Extract treble frequencies
        let mut treble_sum = 0.0;
        let treble_start = input_buffer.len() * 3 / 4;
        for i in treble_start..input_buffer.len() {
            treble_sum += input_buffer[i].abs();
        }
        self.treble_level = treble_sum / (input_buffer.len() - treble_start) as f32;
        
        // Simple audio reactive effect
        for (i, sample) in input_buffer.iter().enumerate() {
            let reactive = 1.0 + self.bass_level * 0.5;
            output[i] = sample * reactive;
        }
        
        self.time += 1.0 / self.sample_rate;
        output
    }

    pub fn get_audio_levels(&self) -> Vec<f32> {
        vec![self.bass_level, self.mid_level, self.treble_level]
    }

    pub fn generate_sine_wave(&self, frequency: f32, amplitude: f32, duration: f32) -> Vec<f32> {
        let samples = (duration * self.sample_rate) as usize;
        let mut wave = Vec::with_capacity(samples);
        
        for i in 0..samples {
            let t = i as f32 / self.sample_rate;
            let sample = (t * frequency * 2.0 * std::f32::consts::PI).sin() * amplitude;
            wave.push(sample);
        }
        
        wave
    }
}

// Graphics Engine extracted from Shader Studio
#[wasm_bindgen]
pub struct GraphicsEngine {
    canvas_width: u32,
    canvas_height: u32,
    time: f32,
    zoom: f32,
    iterations: u32,
}

#[wasm_bindgen]
impl GraphicsEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> GraphicsEngine {
        GraphicsEngine {
            canvas_width: width,
            canvas_height: height,
            time: 0.0,
            zoom: 1.0,
            iterations: 100,
        }
    }

    // Simple fractal generation (Mandelbrot) extracted from Modurust
    pub fn generate_fractal(&self, center_x: f32, center_y: f32, valence: f32, arousal: f32, dominance: f32) -> Vec<u8> {
        let mut pixels = Vec::with_capacity((self.canvas_width * self.canvas_height * 4) as usize);
        
        for y in 0..self.canvas_height {
            for x in 0..self.canvas_width {
                // Convert pixel coordinates to complex plane
                let real = (x as f32 - self.canvas_width as f32 / 2.0) / (self.canvas_width as f32 / 4.0) * self.zoom + center_x;
                let imag = (y as f32 - self.canvas_height as f32 / 2.0) / (self.canvas_height as f32 / 4.0) * self.zoom + center_y;
                
                // Mandelbrot iteration
                let mut z_real = 0.0;
                let mut z_imag = 0.0;
                let mut iteration = 0;
                
                while z_real * z_real + z_imag * z_imag < 4.0 && iteration < self.iterations {
                    let temp = z_real * z_real - z_imag * z_imag + real;
                    z_imag = 2.0 * z_real * z_imag + imag;
                    z_real = temp;
                    iteration += 1;
                }
                
                // Color based on emotional parameters
                let t = iteration as f32 / self.iterations as f32;
                
                // Emotional color modulation extracted from reference
                let r = (t * (1.0 + valence) * 255.0) as u8;
                let g = (t * (1.0 + arousal) * 255.0) as u8;
                let b = (t * (1.0 + dominance) * 255.0) as u8;
                let a = 255;
                
                pixels.push(r);
                pixels.push(g);
                pixels.push(b);
                pixels.push(a);
            }
        }
        
        pixels
    }

    // Audio-reactive visualization extracted from Shader Studio
    pub fn generate_audio_reactive(&self, bass: f32, mid: f32, treble: f32, valence: f32, arousal: f32, dominance: f32) -> Vec<u8> {
        let mut pixels = Vec::with_capacity((self.canvas_width * self.canvas_height * 4) as usize);
        
        for y in 0..self.canvas_height {
            for x in 0..self.canvas_width {
                let uv_x = x as f32 / self.canvas_width as f32;
                let uv_y = y as f32 / self.canvas_height as f32;
                
                // Audio-reactive wave effects extracted from reference
                let wave1 = (uv_x * 10.0 + self.time * 2.0).sin() * bass;
                let wave2 = (uv_y * 15.0 + self.time * 1.5).cos() * mid;
                let sparkle = (self.time * 4.0).sin() * treble;
                
                // Emotional color mapping
                let r = (0.5 + wave1 * valence + sparkle * 0.2) * 255.0;
                let g = (0.5 + wave2 * arousal + sparkle * 0.3) * 255.0;
                let b = (0.5 + (wave1 + wave2) * dominance + sparkle * 0.5) * 255.0;
                
                pixels.push(r.min(255.0) as u8);
                pixels.push(g.min(255.0) as u8);
                pixels.push(b.min(255.0) as u8);
                pixels.push(255);
            }
        }
        
        pixels
    }

    pub fn update_time(&mut self, delta_time: f32) {
        self.time += delta_time;
    }

    pub fn set_zoom(&mut self, zoom: f32) {
        self.zoom = zoom.max(0.1).min(10.0);
    }

    pub fn set_iterations(&mut self, iterations: u32) {
        self.iterations = iterations.max(10).min(1000);
    }
}

// Tool system extracted from Modurust
#[wasm_bindgen]
pub struct CreativeTool {
    name: String,
    tool_type: String,
    parameters: Vec<ToolParameter>,
    code: String,
}

#[wasm_bindgen]
impl CreativeTool {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, tool_type: String) -> CreativeTool {
        CreativeTool {
            name,
            tool_type,
            parameters: Vec::new(),
            code: String::new(),
        }
    }

    pub fn add_parameter(&mut self, param: ToolParameter) {
        self.parameters.push(param);
    }

    pub fn set_code(&mut self, code: String) {
        self.code = code;
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn get_type(&self) -> String {
        self.tool_type.clone()
    }

    pub fn to_json(&self) -> JsValue {
        let obj = Object::new();
        Reflect::set(&obj, &"name".into(), &self.name.clone().into()).unwrap();
        Reflect::set(&obj, &"type".into(), &self.tool_type.clone().into()).unwrap();
        Reflect::set(&obj, &"code".into(), &self.code.clone().into()).unwrap();
        
        let params = Array::new();
        for param in &self.parameters {
            let param_obj = Object::new();
            Reflect::set(&param_obj, &"name".into(), &param.name.clone().into()).unwrap();
            Reflect::set(&param_obj, &"type".into(), &param.param_type.clone().into()).unwrap();
            Reflect::set(&param_obj, &"defaultValue".into(), &param.default_value.into()).unwrap();
            params.push(&param_obj);
        }
        Reflect::set(&obj, &"parameters".into(), &params).unwrap();
        
        obj.into()
    }
}

// Main Creative Engine combining extracted components
#[wasm_bindgen]
pub struct CreativeEngine {
    audio_engine: AudioEngine,
    graphics_engine: GraphicsEngine,
    tools: Vec<CreativeTool>,
    current_tool: Option<usize>,
}

#[wasm_bindgen]
impl CreativeEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_width: u32, canvas_height: u32) -> CreativeEngine {
        console_log!("Initializing Creative Engine with extracted components");
        
        let mut engine = CreativeEngine {
            audio_engine: AudioEngine::new(),
            graphics_engine: GraphicsEngine::new(canvas_width, canvas_height),
            tools: Vec::new(),
            current_tool: None,
        };
        
        engine.initialize_default_tools();
        engine
    }

    fn initialize_default_tools(&mut self) {
        // Fractal Generator Tool - extracted from Modurust
        let mut fractal_tool = CreativeTool::new("Fractal Generator".to_string(), "ShaderModule".to_string());
        fractal_tool.add_parameter(ToolParameter::new("zoom".to_string(), "float".to_string(), 1.0));
        fractal_tool.add_parameter(ToolParameter::new("iterations".to_string(), "int".to_string(), 100.0));
        fractal_tool.add_parameter(ToolParameter::new("centerX".to_string(), "float".to_string(), 0.0));
        fractal_tool.add_parameter(ToolParameter::new("centerY".to_string(), "float".to_string(), 0.0));
        fractal_tool.set_code("// Fractal generator shader code".to_string());
        self.tools.push(fractal_tool);
        
        // Audio Reactive Tool - extracted from Shader Studio
        let mut audio_tool = CreativeTool::new("Audio Reactive Visualizer".to_string(), "AudioProcessor".to_string());
        audio_tool.add_parameter(ToolParameter::new("sensitivity".to_string(), "float".to_string(), 1.0));
        audio_tool.add_parameter(ToolParameter::new("smoothness".to_string(), "float".to_string(), 0.5));
        audio_tool.set_code("// Audio reactive visualization".to_string());
        self.tools.push(audio_tool);
        
        console_log!("Default tools initialized from extracted components");
    }

    pub fn process_audio(&mut self, input_buffer: &[f32]) -> Vec<f32> {
        self.audio_engine.process_audio_frame(input_buffer)
    }

    pub fn generate_visuals(&mut self, tool_index: usize, valence: f32, arousal: f32, dominance: f32) -> Vec<u8> {
        if tool_index >= self.tools.len() {
            return Vec::new();
        }
        
        let audio_levels = self.audio_engine.get_audio_levels();
        let bass = audio_levels.get(0).unwrap_or(&0.0);
        let mid = audio_levels.get(1).unwrap_or(&0.0);
        let treble = audio_levels.get(2).unwrap_or(&0.0);
        
        match self.tools[tool_index].get_type().as_str() {
            "ShaderModule" => {
                self.graphics_engine.generate_fractal(0.0, 0.0, valence, arousal, dominance)
            },
            "AudioProcessor" => {
                self.graphics_engine.generate_audio_reactive(*bass, *mid, *treble, valence, arousal, dominance)
            },
            _ => Vec::new(),
        }
    }

    pub fn update(&mut self, delta_time: f32) {
        self.graphics_engine.update_time(delta_time);
    }

    pub fn get_tool_names(&self) -> Array {
        let names = Array::new();
        for tool in &self.tools {
            names.push(&tool.get_name().into());
        }
        names
    }

    pub fn get_tool_info(&self, index: usize) -> JsValue {
        if index >= self.tools.len() {
            return Object::new().into();
        }
        self.tools[index].to_json()
    }

    pub fn set_graphics_params(&mut self, width: u32, height: u32, zoom: f32, iterations: u32) {
        self.graphics_engine = GraphicsEngine::new(width, height);
        self.graphics_engine.set_zoom(zoom);
        self.graphics_engine.set_iterations(iterations);
    }
}

// Initialize the module
#[wasm_bindgen(start)]
pub fn main() {
    console_log!("Rust Foundation Audiovisual System initialized with extracted components");
}