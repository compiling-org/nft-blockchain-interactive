//! Simple Biometric Engine with MediaPipe and Voice Control
//! Focuses on accessible consumer-grade biometrics instead of complex EEG

use wasm_bindgen::prelude::*;
use js_sys::{Float32Array, Array};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Simple biometric data types for consumer devices
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BiometricInput {
    /// Hand tracking data from MediaPipe
    HandTracking(HandData),
    /// Face tracking data from MediaPipe
    FaceTracking(FaceData),
    /// Voice analysis data
    VoiceAnalysis(VoiceData),
    /// Simple heart rate from camera
    HeartRate(HeartRateData),
}

/// Hand tracking data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HandData {
    pub landmarks: Vec<Landmark>, // 21 hand landmarks
    pub gesture: String,
    pub confidence: f32,
    pub timestamp: f64,
}

/// Face tracking data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FaceData {
    pub landmarks: Vec<Landmark>, // 468 face landmarks
    pub expression: String,
    pub head_pose: HeadPose,
    pub confidence: f32,
    pub timestamp: f64,
}

/// Voice analysis data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceData {
    pub pitch: f32,
    pub volume: f32,
    pub emotion: String,
    pub text: Option<String>,
    pub confidence: f32,
    pub timestamp: f64,
}

/// Heart rate data from camera
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HeartRateData {
    pub bpm: f32,
    pub confidence: f32,
    pub timestamp: f64,
}

/// 3D landmark point
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Landmark {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

/// Head pose information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HeadPose {
    pub pitch: f32,
    pub yaw: f32,
    pub roll: f32,
}

/// Simple biometric engine for consumer devices
#[wasm_bindgen]
pub struct SimpleBiometricEngine {
    hand_history: Vec<HandData>,
    face_history: Vec<FaceData>,
    voice_history: Vec<VoiceData>,
    heart_rate_history: Vec<HeartRateData>,
}

#[wasm_bindgen]
impl SimpleBiometricEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            hand_history: Vec::new(),
            face_history: Vec::new(),
            voice_history: Vec::new(),
            heart_rate_history: Vec::new(),
        }
    }

    /// Process hand tracking data from MediaPipe
    pub fn process_hand_tracking(&mut self, landmarks: Vec<f32>, gesture: String, confidence: f32) -> Result<Float32Array, JsValue> {
        let mut hand_landmarks = Vec::new();
        
        // Convert flat array to 21 landmarks (63 values)
        for i in 0..21 {
            let idx = i * 3;
            if idx + 2 < landmarks.len() {
                hand_landmarks.push(Landmark {
                    x: landmarks[idx],
                    y: landmarks[idx + 1],
                    z: landmarks[idx + 2],
                });
            }
        }

        let hand_data = HandData {
            landmarks: hand_landmarks,
            gesture: gesture.clone(),
            confidence,
            timestamp: js_sys::Date::now(),
        };

        self.hand_history.push(hand_data.clone());
        
        // Keep only recent history
        if self.hand_history.len() > 100 {
            self.hand_history.remove(0);
        }

        // Return emotional state based on gesture
        let emotional_state = self.gesture_to_emotion(&gesture);
        Ok(Float32Array::from(&emotional_state[..]))
    }