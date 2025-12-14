//! Real Audiovisual System - Extracted from actual working code in this project
//! Uses the substantial WebGL shader engine and music integration that already exists

use wasm_bindgen::prelude::*;
use web_sys::{WebGlRenderingContext, WebGlShader, WebGlProgram};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};

/// Real WebGL Shader Engine - extracted from src/rust-client/src/webgpu_engine.rs
#[wasm_bindgen]
pub struct RealAudiovisualEngine {
    canvas: web_sys::HtmlCanvasElement,
    gl: WebGlRenderingContext,
    programs: HashMap<String, WebGlProgram>,
    current_program: Option<WebGlProgram>,
    uniforms: HashMap<String, UniformValue>,
    time: f32,
    resolution: [f32; 2],
    // Audio integration
    audio_context: Option<web_sys::AudioContext>,
    oscillator: Option<web_sys::OscillatorNode>,
    gain_node: Option<web_sys::GainNode>,
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
impl RealAudiovisualEngine {
    /// Create new audiovisual engine with real WebGL and audio
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str) -> Result<RealAudiovisualEngine, JsValue> {
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
        let _ = gl.get_extension("OES_texture_float");
        let _ = gl.get_extension("OES_standard_derivatives");
        let _ = gl.get_extension("EXT_shader_texture_lod