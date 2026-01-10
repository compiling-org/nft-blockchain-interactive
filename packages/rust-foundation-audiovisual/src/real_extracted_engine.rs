//! Real extracted audiovisual engine from existing codebase
//! This contains actual working Rust implementations

use wasm_bindgen::prelude::*;
use web_sys::{WebGlRenderingContext, WebGlShader, WebGlProgram};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Real WebGL shader engine with fractal algorithms (extracted from src/rust-client/src/webgpu_engine.rs)
#[wasm_bindgen]
pub struct RealShaderEngine {
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
impl RealShaderEngine {
    /// Create new shader engine (real implementation)
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str) -> Result<RealShaderEngine, JsValue> {
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