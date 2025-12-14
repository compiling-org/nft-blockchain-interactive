//! Gesture and MIDI Integration Module
//! Combines MediaPipe gesture control, Leap Motion tracking, and MIDI processing
//! for real-time audiovisual creative expression

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

/// Gesture-to-parameter mapping for creative control
#[wasm_bindgen]
pub struct GestureMidiMapper {
    gesture_params: Arc<Mutex<GestureParameters>>,
    midi_state: Arc<Mutex<MidiState>>,
    shader_uniforms: Arc<Mutex<ShaderUniforms>>,
    audio_params: Arc<Mutex<AudioParameters>>,
}

/// Parameters controlled by gestures
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GestureParameters {
    pub hand_position: [f32; 3], // x, y, z from MediaPipe/Leap
    pub hand_rotation: [f32; 3], // pitch, yaw, roll
    pub pinch_strength: f32,
    pub grab_strength: f32,
    pub gesture_type: String, // "point", "grab", "pinch", "swipe", etc.
    pub confidence: f32,
    pub timestamp: f64,
}

/// MIDI state and control
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MidiState {
    pub note_on: Vec<u8>, // Active MIDI notes
    pub control_changes: HashMap<u8, u8>, // CC values (mod wheel, expression, etc.)
    pub pitch_bend: i16,
    pub channel_pressure: u8,
    pub tempo: f32,
    pub clock: u32,
}

/// Shader uniform parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShaderUniforms {
    pub time: f32,
    pub resolution: [f32; 2],
    pub mouse: [f32; 2],
    pub gesture_pos: [f32; 3],
    pub gesture_rot: [f32; 3],
    pub pinch_strength: f32,
    pub grab_strength: f32,
    pub midi_note: f32,
    pub midi_velocity: f32,
    pub midi_cc1: f32, // Mod wheel
    pub midi_cc11: f32, // Expression
    pub audio_rms: f32,
    pub audio_spectrum: [f32; 8], // 8-band spectrum
}

/// Audio synthesis parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AudioParameters {
    pub frequency: f32,
    pub amplitude: f32,
    pub waveform: String, // "sine", "square", "sawtooth", "triangle"
    pub filter_cutoff: f32,
    pub filter_resonance: f32,
    pub attack: f32,
    pub decay: f32,
    pub sustain: f32,
    pub release: f32,
    pub lfo_rate: f32,
    pub lfo_depth: f32,
}

impl Default for GestureParameters {
    fn default() -> Self {
        Self {
            hand_position: [0.0, 0.0, 0.0],
            hand_rotation: [0.0, 0.0, 0.0],
            pinch_strength: 0.0,
            grab_strength: 0.0,
            gesture_type: "none".to_string(),
            confidence: 0.0,
            timestamp: 0.0,
        }
    }
}

impl Default for MidiState {
    fn default() -> Self {
        Self {
            note_on: Vec::new(),
            control_changes: HashMap::new(),
            pitch_bend: 0,
            channel_pressure: 0,
            tempo: 120.0,
            clock: 0,
        }
    }
}

impl Default for ShaderUniforms {
    fn default() -> Self {
        Self {
            time: 0.0,
            resolution: [800.0, 600.0],
            mouse: [0.0, 0.0],
            gesture_pos: [0.0, 0.0, 0.0],
            gesture_rot: [0.0, 0.0, 0.0],
            pinch_strength: 0.0,
            grab_strength: 0.0,
            midi_note: 0.0,
            midi_velocity: 0.0,
            midi_cc1: 0.0,
            midi_cc11: 0.0,
            audio_rms: 0.0,
            audio_spectrum: [0.0; 8],
        }
    }
}

impl Default for AudioParameters {
    fn default() -> Self {
        Self {
            frequency: 440.0,
            amplitude: 0.5,
            waveform: "sine".to_string(),
            filter_cutoff: 2000.0,
            filter_resonance: 0.5,
            attack: 0.01,
            decay: 0.1,
            sustain: 0.7,
            release: 0.3,
            lfo_rate: 1.0,
            lfo_depth: 0.1,
        }
    }
}

#[wasm_bindgen]
impl GestureMidiMapper {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            gesture_params: Arc::new(Mutex::new(GestureParameters::default())),
            midi_state: Arc::new(Mutex::new(MidiState::default())),
            shader_uniforms: Arc::new(Mutex::new(ShaderUniforms::default())),
            audio_params: Arc::new(Mutex::new(AudioParameters::default())),
        }
    }

    /// Update gesture parameters from MediaPipe hand data
    #[wasm_bindgen]
    pub fn update_hand_data(&mut self, landmarks_json: &str) -> Result<(), JsValue> {
        // Parse MediaPipe hand landmarks
        if let Ok(landmarks) = serde_json::from_str::<MediaPipeHandData>(landmarks_json) {
            if let Ok(mut params) = self.gesture_params.lock() {
                // Map hand landmarks to 3D position
                if let Some(wrist) = landmarks.landmarks.get(0) {
                    params.hand_position = [wrist.x, wrist.y, wrist.z];
                }
                
                // Calculate hand rotation from finger positions
                if landmarks.landmarks.len() > 20 {
                    let index_tip = &landmarks.landmarks[8];
                    let middle_tip = &landmarks.landmarks[12];
                    let ring_tip = &landmarks.landmarks[16];
                    
                    // Simple rotation calculation
                    params.hand_rotation = [
                        (index_tip.y - middle_tip.y) * 180.0, // pitch
                        (index_tip.x - middle_tip.x) * 180.0, // yaw  
                        (ring_tip.x - index_tip.x) * 180.0, // roll
                    ];
                }
                
                // Calculate pinch strength (thumb to index finger)
                if landmarks.landmarks.len() > 8 {
                    let thumb_tip = &landmarks.landmarks[4];
                    let index_tip = &landmarks.landmarks[8];
                    let distance = ((thumb_tip.x - index_tip.x).powi(2) + 
                                   (thumb_tip.y - index_tip.y).powi(2) + 
                                   (thumb_tip.z - index_tip.z).powi(2)).sqrt();
                    params.pinch_strength = (1.0 - distance.min(1.0)).max(0.0);
                }
                
                params.gesture_type = landmarks.gesture_type;
                params.confidence = landmarks.confidence;
                params.timestamp = js_sys::Date::now();
            }
        }
        
        self.update_mappings();
        Ok(())
    }

    /// Update from Leap Motion data
    #[wasm_bindgen]
    pub fn update_leap_data(&mut self, leap_json: &str) -> Result<(), JsValue> {
        if let Ok(leap_data) = serde_json::from_str::<LeapFrameData>(leap_json) {
            if let Some(hand) = leap_data.hands.first() {
                if let Ok(mut params) = self.gesture_params.lock() {
                    params.hand_position = [hand.palm_position.x, hand.palm_position.y, hand.palm_position.z];
                    params.hand_rotation = [
                        hand.palm_normal.x * 180.0,
                        hand.direction.y * 180.0, 
                        hand.palm_normal.z * 180.0,
                    ];
                    params.pinch_strength = hand.pinch_strength;
                    params.grab_strength = hand.grab_strength;
                    params.gesture_type = "leap".to_string();
                    params.confidence = hand.confidence;
                    params.timestamp = leap_data.timestamp;
                }
            }
        }
        
        self.update_mappings();
        Ok(())
    }

    /// Update MIDI state
    #[wasm_bindgen]
    pub fn update_midi_note(&mut self, note: u8, velocity: u8, is_note_on: bool) -> Result<(), JsValue> {
        if let Ok(mut midi) = self.midi_state.lock() {
            if is_note_on && velocity > 0 {
                if !midi.note_on.contains(&note) {
                    midi.note_on.push(note);
                }
            } else {
                midi.note_on.retain(|&n| n != note);
            }
        }
        
        // Map MIDI note to audio frequency
        if let Ok(mut audio) = self.audio_params.lock() {
            audio.frequency = 440.0 * 2.0f32.powf((note as f32 - 69.0) / 12.0);
            audio.amplitude = velocity as f32 / 127.0;
        }
        
        self.update_mappings();
        Ok(())
    }

    /// Update MIDI control change
    #[wasm_bindgen]
    pub fn update_midi_cc(&mut self, controller: u8, value: u8) -> Result<(), JsValue> {
        if let Ok(mut midi) = self.midi_state.lock() {
            midi.control_changes.insert(controller, value);
        }
        
        // Map common CCs to audio parameters
        if let Ok(mut audio) = self.audio_params.lock() {
            match controller {
                1 => audio.lfo_depth = value as f32 / 127.0, // Mod wheel
                11 => audio.amplitude = value as f32 / 127.0, // Expression
                74 => audio.filter_cutoff = 100.0 + (value as f32 / 127.0) * 10000.0, // Filter cutoff
                _ => {}
            }
        }
        
        self.update_mappings();
        Ok(())
    }

    /// Update audio analysis data
    #[wasm_bindgen]
    pub fn update_audio_analysis(&mut self, rms: f32, spectrum_json: &str) -> Result<(), JsValue> {
        if let Ok(spectrum) = serde_json::from_str::<Vec<f32>>(spectrum_json) {
            if let Ok(mut uniforms) = self.shader_uniforms.lock() {
                uniforms.audio_rms = rms;
                for (i, &val) in spectrum.iter().take(8).enumerate() {
                    uniforms.audio_spectrum[i] = val;
                }
            }
        }
        
        self.update_mappings();
        Ok(())
    }

    /// Update all mappings based on current state
    fn update_mappings(&self) {
        // Update shader uniforms from gesture and MIDI
        if let (Ok(gesture), Ok(midi), Ok(mut uniforms)) = (
            self.gesture_params.lock(),
            self.midi_state.lock(),
            self.shader_uniforms.lock()
        ) {
            uniforms.gesture_pos = gesture.hand_position;
            uniforms.gesture_rot = gesture.hand_rotation;
            uniforms.pinch_strength = gesture.pinch_strength;
            uniforms.grab_strength = gesture.grab_strength;
            
            if let Some(&note) = midi.note_on.first() {
                uniforms.midi_note = note as f32;
                uniforms.midi_velocity = 0.8; // Default velocity
            }
            
            if let Some(&cc1) = midi.control_changes.get(&1) {
                uniforms.midi_cc1 = cc1 as f32 / 127.0;
            }
            
            if let Some(&cc11) = midi.control_changes.get(&11) {
                uniforms.midi_cc11 = cc11 as f32 / 127.0;
            }
            
            uniforms.time = (js_sys::Date::now() as f32) / 1000.0;
        }
    }

    /// Get current shader uniforms as JSON
    #[wasm_bindgen]
    pub fn get_shader_uniforms(&self) -> Result<String, JsValue> {
        if let Ok(uniforms) = self.shader_uniforms.lock() {
            serde_json::to_string(&*uniforms)
                .map_err(|e| JsValue::from_str(&format!("Failed to serialize uniforms: {}", e)))
        } else {
            Err(JsValue::from_str("Failed to lock shader uniforms"))
        }
    }

    /// Get current audio parameters as JSON
    #[wasm_bindgen]
    pub fn get_audio_parameters(&self) -> Result<String, JsValue> {
        if let Ok(audio) = self.audio_params.lock() {
            serde_json::to_string(&*audio)
                .map_err(|e| JsValue::from_str(&format!("Failed to serialize audio params: {}", e)))
        } else {
            Err(JsValue::from_str("Failed to lock audio parameters"))
        }
    }

    /// Get gesture parameters as JSON
    #[wasm_bindgen]
    pub fn get_gesture_parameters(&self) -> Result<String, JsValue> {
        if let Ok(gesture) = self.gesture_params.lock() {
            serde_json::to_string(&*gesture)
                .map_err(|e| JsValue::from_str(&format!("Failed to serialize gesture params: {}", e)))
        } else {
            Err(JsValue::from_str("Failed to lock gesture parameters"))
        }
    }
}

/// MediaPipe hand data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
struct MediaPipeHandData {
    landmarks: Vec<MediaPipePoint>,
    gesture_type: String,
    confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MediaPipePoint {
    x: f32,
    y: f32,
    z: f32,
}

/// Leap Motion frame data (simplified)
#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeapFrameData {
    hands: Vec<LeapHandData>,
    timestamp: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeapHandData {
    palm_position: LeapVector,
    palm_normal: LeapVector,
    direction: LeapVector,
    pinch_strength: f32,
    grab_strength: f32,
    confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeapVector {
    x: f32,
    y: f32,
    z: f32,
}