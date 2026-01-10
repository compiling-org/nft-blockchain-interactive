//! Real audio synthesis from Modurust reference project
//! Substantial Rust audio code extracted from nuwe-stripped

use wasm_bindgen::prelude::*;
use std::sync::{Arc, Mutex};
use web_sys::{AudioContext, GainNode, AnalyserNode};

/// Real music engine from extracted Modurust code
#[wasm_bindgen]
pub struct MusicEngine {
    audio_context: Option<AudioContext>,
    master_gain: Option<GainNode>,
    analyser: Option<AnalyserNode>,
    sample_rate: f32,
    is_playing: Arc<Mutex<bool>>,
    current_bpm: Arc<Mutex<f32>>,
    current_key: Arc<Mutex<String>>,
}

#[wasm_bindgen]
impl MusicEngine {
    /// Create new music engine with real audio context
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<MusicEngine, JsValue> {
        let window = web_sys::window().ok_or("No window")?;
        let audio_context = AudioContext::new()?;
        
        // Create master gain node
        let master_gain = audio_context.create_gain()?;
        master_gain.gain().set_value(0.7);
        master_gain.connect_with_audio_node(&audio_context.destination())?;
        
        // Create analyser for audio metrics
        let analyser = audio_context.create_analyser()?;
        analyser.set_fft_size(2048);
        analyser.connect_with_audio_node(&master_gain)?;
        
        Ok(MusicEngine {
            audio_context: Some(audio_context),
            master_gain: Some(master_gain),
            analyser: Some(analyser),
            sample_rate: 44100.0,
            is_playing: Arc::new(Mutex::new(false)),
            current_bpm: Arc::new(Mutex::new(120.0)),
            current_key: Arc::new(Mutex::new("C".to_string())),
        })
    }
    
    /// Generate music from emotional parameters (extracted from Modurust)
    #[wasm_bindgen]
    pub fn generate_music_from_emotion(&mut self, valence: f32, arousal: f32, dominance: f32) -> Result<(), JsValue> {
        // Map emotions to musical parameters (from extracted Modurust code)
        let key = match (valence * 4.0) as i32 {
            0 => "C",
            1 => "G", 
            2 => "A",
            3 => "D",
            _ => "C",
        };
        
        let bpm = 60.0 + arousal * 120.0; // 60-180 BPM range
        let complexity = dominance; // 0-1 complexity
        
        *self.current_bpm.lock().unwrap() = bpm;
        *self.current_key.lock().unwrap() = key.to_string();
        
        // Generate audio pattern based on extracted algorithm
        self.generate_pattern(key, bpm, complexity)?;
        
        Ok(())
    }
    
    /// Generate musical pattern (extracted algorithm)
    fn generate_pattern(&self, key: &str, _bpm: f32, complexity: f32) -> Result<(), JsValue> {
        if let Some(audio_context) = &self.audio_context {
            let bpm = *self.current_bpm.lock().unwrap();
            let beat_duration = 60.0 / bpm;
            
            // Create chord progression based on key (extracted from Modurust)
            let scale_notes = self.get_scale_notes(key);
            let chord_progression = self.get_chord_progression(key, complexity);
            
            // Generate melody based on complexity
            let melody_notes = self.generate_melody(&scale_notes, complexity);
            
            // Schedule notes
            let mut time = audio_context.current_time();
            
            for (i, &note) in melody_notes.iter().enumerate() {
                self.schedule_note(audio_context, note, time, beat_duration * 0.5)?;
                time += (beat_duration * (0.5 + complexity * 0.5)) as f64;
            }
            
            // Schedule chord accompaniment
            for (chord_idx, chord) in chord_progression.iter().enumerate() {
                self.schedule_chord(audio_context, chord, time + chord_idx as f64 * beat_duration as f64 * 2.0, beat_duration)?;
            }
        }
        
        Ok(())
    }
    
    /// Get scale notes for key (extracted algorithm)
    fn get_scale_notes(&self, key: &str) -> Vec<f32> {
        let base_freq = self.get_key_frequency(key);
        let intervals = [0.0, 2.0, 4.0, 5.0, 7.0, 9.0, 11.0]; // Major scale
        
        intervals.iter()
            .map(|&interval| base_freq * 2.0f32.powf(interval / 12.0))
            .collect()
    }
    
    /// Get chord progression (extracted algorithm)
    fn get_chord_progression(&self, key: &str, complexity: f32) -> Vec<Vec<f32>> {
        let scale_notes = self.get_scale_notes(key);
        
        // Simple I-V-vi-IV progression
        vec![
            vec![scale_notes[0], scale_notes[2], scale_notes[4]], // I
            vec![scale_notes[4], scale_notes[6], scale_notes[1]], // V
            vec![scale_notes[5], scale_notes[0], scale_notes[2]], // vi
            vec![scale_notes[3], scale_notes[5], scale_notes[0]], // IV
        ]
    }
    
    /// Generate melody notes (extracted algorithm)
    fn generate_melody(&self, scale_notes: &[f32], complexity: f32) -> Vec<f32> {
        let mut melody = Vec::new();
        let mut current_note = 0;
        
        for i in 0..16 {
            // Add variation based on complexity
            let variation = (complexity * 3.0) as i32;
            let next_offset = (i % (variation + 1)) as isize - (variation / 2) as isize;
            
            current_note = ((current_note as isize + next_offset).max(0) as usize) % scale_notes.len();
            melody.push(scale_notes[current_note]);
            
            // Add octave jumps for higher complexity
            if complexity > 0.7 && i % 4 == 0 {
                melody.push(scale_notes[current_note] * 2.0);
            }
        }
        
        melody
    }
    
    /// Get key frequency (extracted algorithm)
    fn get_key_frequency(&self, key: &str) -> f32 {
        match key {
            "C" => 261.63,
            "G" => 392.00,
            "A" => 440.00,
            "D" => 293.66,
            _ => 261.63,
        }
    }
    
    /// Schedule individual note (extracted algorithm)
    fn schedule_note(&self, audio_context: &AudioContext, frequency: f32, time: f64, duration: f32) -> Result<(), JsValue> {
        let oscillator = audio_context.create_oscillator()?;
        let gain_node = audio_context.create_gain()?;
        
        oscillator.set_type(web_sys::OscillatorType::Sine);
        oscillator.frequency().set_value(frequency);
        
        // ADSR envelope (extracted from Modurust)
        let attack = 0.01;
        let decay = 0.1;
        let sustain = 0.7;
        let release = duration as f64 * 0.3;
        
        gain_node.gain().set_value(0.0);
        gain_node.gain().linear_ramp_to_value_at_time(1.0, time + attack)?;
        gain_node.gain().linear_ramp_to_value_at_time(sustain, time + attack + decay)?;
        gain_node.gain().linear_ramp_to_value_at_time(0.0, time + duration as f64 + release)?;
        
        oscillator.connect_with_audio_node(&gain_node)?;
        if let Some(master_gain) = &self.master_gain {
            gain_node.connect_with_audio_node(master_gain)?;
        }
        
        oscillator.start()?;
        oscillator.stop_with_when(time + duration as f64 + release)?;
        
        Ok(())
    }
    
    /// Schedule chord (extracted algorithm)
    fn schedule_chord(&self, audio_context: &AudioContext, frequencies: &[f32], time: f64, duration: f32) -> Result<(), JsValue> {
        for &frequency in frequencies {
            self.schedule_note(audio_context, frequency, time, duration * 2.0)?;
        }
        Ok(())
    }
    
    /// Get current audio metrics (extracted from Modurust)
    #[wasm_bindgen]
    pub fn get_audio_metrics(&self) -> Result<JsValue, JsValue> {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &"bpm".into(), &JsValue::from(*self.current_bpm.lock().unwrap()))?;
        js_sys::Reflect::set(&obj, &"key".into(), &JsValue::from_str(&self.current_key.lock().unwrap()))?;
        js_sys::Reflect::set(&obj, &"sample_rate".into(), &JsValue::from(self.sample_rate))?;
        
        if let Some(analyser) = &self.analyser {
            let mut data_array = vec![0u8; 2048];
            let uint8_array = js_sys::Uint8Array::from(&data_array[..]);
            analyser.get_byte_frequency_data(&mut data_array[..]);
            
            let mut sum = 0.0;
            for i in 0..uint8_array.length() {
                sum += uint8_array.get_index(i) as f32;
            }
            let average = sum / uint8_array.length() as f32;
            
            js_sys::Reflect::set(&obj, &"spectrum_average".into(), &JsValue::from(average))?;
        }
        
        Ok(JsValue::from(obj))
    }
    
    /// Stop all audio
    #[wasm_bindgen]
    pub fn stop(&mut self) {
        *self.is_playing.lock().unwrap() = false;
    }
}

/// Real-time audio analysis (extracted from Modurust)
#[wasm_bindgen]
pub struct AudioAnalyzer {
    fft_size: usize,
    spectrum: Vec<f32>,
    waveform: Vec<f32>,
    rms: f32,
    peak: f32,
    bass_level: f32,
    mid_level: f32,
    treble_level: f32,
}

#[wasm_bindgen]
impl AudioAnalyzer {
    #[wasm_bindgen(constructor)]
    pub fn new(fft_size: usize) -> Self {
        Self {
            fft_size,
            spectrum: vec![0.0; fft_size / 2],
            waveform: vec![0.0; fft_size],
            rms: 0.0,
            peak: 0.0,
            bass_level: 0.0,
            mid_level: 0.0,
            treble_level: 0.0,
        }
    }
    
    /// Analyze audio data (extracted algorithm)
    #[wasm_bindgen]
    pub fn analyze(&mut self, audio_data: &[f32]) {
        // Calculate RMS (Root Mean Square)
        let sum_squares: f32 = audio_data.iter().map(|&x| x * x).sum();
        self.rms = (sum_squares / audio_data.len() as f32).sqrt();
        
        // Find peak
        self.peak = audio_data.iter()
            .map(|&x| x.abs())
            .fold(0.0f32, |a, b| a.max(b));
        
        // Simple frequency band analysis (extracted from Modurust)
        let bass_end = audio_data.len() / 8;
        let mid_end = audio_data.len() / 2;
        
        let bass_sum: f32 = audio_data[..bass_end].iter().map(|&x| x.abs()).sum();
        let mid_sum: f32 = audio_data[bass_end..mid_end].iter().map(|&x| x.abs()).sum();
        let treble_sum: f32 = audio_data[mid_end..].iter().map(|&x| x.abs()).sum();
        
        self.bass_level = bass_sum / bass_end as f32;
        self.mid_level = mid_sum / (mid_end - bass_end) as f32;
        self.treble_level = treble_sum / (audio_data.len() - mid_end) as f32;
    }
    
    /// Get frequency bands (extracted algorithm)
    #[wasm_bindgen]
    pub fn get_frequency_bands(&self) -> Vec<f32> {
        vec![self.bass_level, self.mid_level, self.treble_level]
    }
    
    /// Detect beats (extracted algorithm)
    #[wasm_bindgen]
    pub fn detect_beats(&self, threshold: f32) -> bool {
        self.peak > threshold && self.bass_level > self.peak * 0.6
    }
    
    /// Get audio metrics
    #[wasm_bindgen]
    pub fn get_metrics(&self) -> Vec<f32> {
        vec![self.rms, self.peak, self.bass_level, self.mid_level, self.treble_level]
    }
}

/// MIDI note to frequency conversion (extracted from Modurust)
#[wasm_bindgen]
pub fn note_to_frequency(note: u8) -> f32 {
    440.0 * 2.0f32.powf((note as f32 - 69.0) / 12.0)
}

/// Frequency to MIDI note conversion (extracted from Modurust)
#[wasm_bindgen]
pub fn frequency_to_note(frequency: f32) -> u8 {
    (69.0 + 12.0 * (frequency / 440.0).log2()).round() as u8
}

/// Generate waveform samples (extracted from Modurust)
#[wasm_bindgen]
pub fn generate_waveform(wave_type: &str, frequency: f32, sample_rate: f32, duration: f32) -> Vec<f32> {
    let num_samples = (sample_rate * duration) as usize;
    let mut samples = Vec::with_capacity(num_samples);
    
    for i in 0..num_samples {
        let t = i as f32 / sample_rate;
        let sample = match wave_type {
            "sine" => (2.0 * std::f32::consts::PI * frequency * t).sin(),
            "square" => {
                if (2.0 * std::f32::consts::PI * frequency * t).sin() > 0.0 { 1.0 } else { -1.0 }
            },
            "sawtooth" => {
                let phase = (2.0 * std::f32::consts::PI * frequency * t) % (2.0 * std::f32::consts::PI);
                phase / std::f32::consts::PI - 1.0
            },
            "triangle" => {
                let phase = (2.0 * std::f32::consts::PI * frequency * t) % (2.0 * std::f32::consts::PI);
                if phase < std::f32::consts::PI {
                    2.0 * phase / std::f32::consts::PI - 1.0
                } else {
                    3.0 - 2.0 * phase / std::f32::consts::PI
                }
            },
            _ => 0.0,
        };
        
        samples.push(sample);
    }
    
    samples
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_note_frequency_conversion() {
        let freq = note_to_frequency(69);
        assert!((freq - 440.0).abs() < 1e-3);
        let note = frequency_to_note(440.0);
        assert_eq!(note, 69);
    }

    #[test]
    fn test_generate_waveform_length_and_bounds() {
        let samples = generate_waveform("sine", 440.0, 44100.0, 1.0);
        assert_eq!(samples.len(), 44100);
        let max = samples.iter().fold(f32::MIN, |a, &b| a.max(b));
        let min = samples.iter().fold(f32::MAX, |a, &b| a.min(b));
        assert!(max <= 1.0 && min >= -1.0);
    }

    #[test]
    fn test_audio_analyzer_metrics() {
        let mut analyzer = AudioAnalyzer::new(1024);
        let data = vec![1.0f32; 1024];
        analyzer.analyze(&data);
        let metrics = analyzer.get_metrics();
        assert_eq!(metrics.len(), 5);
        assert!((metrics[0] - 1.0).abs() < 1e-6);
        assert!((metrics[1] - 1.0).abs() < 1e-6);
        let bands = analyzer.get_frequency_bands();
        assert_eq!(bands.len(), 3);
    }
}
