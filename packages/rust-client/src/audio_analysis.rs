use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use rustfft::{FftPlanner, num_complex::Complex};

#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AudioFeatures {
    pub volume: f32,
    pub sub_bass: f32,
    pub bass: f32,
    pub low_mid: f32,
    pub mid: f32,
    pub upper_mid: f32,
    pub presence: f32,
    pub brilliance: f32,
    pub peak: f32,
    pub rms: f32,
    pub kick: f32,
    pub snare: f32,
    pub hihat: f32,
    pub flux: f32,
    pub centroid: f32,
    pub rolloff: f32,
    pub flatness: f32,
    pub zcr: f32,
    pub beat: f32,
    pub bpm: f32,
}

#[wasm_bindgen]
pub struct AdvancedAudioAnalyzer {
    pub sample_rate: u32,
    fft_size: usize,
    prev_bass_energy: f32,
}

#[wasm_bindgen]
impl AdvancedAudioAnalyzer {
    #[wasm_bindgen(constructor)]
    pub fn new(sample_rate: u32, fft_size: usize) -> Self {
        Self {
            sample_rate,
            fft_size: if fft_size.is_power_of_two() { fft_size } else { 1024 },
            prev_bass_energy: 0.0,
        }
    }

    #[wasm_bindgen]
    pub fn analyze(&mut self, samples: &[f32]) -> JsValue {
        if samples.len() < self.fft_size {
            return serde_wasm_bindgen::to_value(&AudioFeatures::default()).unwrap();
        }

        let mut features = AudioFeatures::default();
        
        // 1. Basic metrics (Volume, Peak, RMS)
        let mut sum_sq = 0.0;
        let mut peak = 0.0;
        for &s in samples.iter().take(self.fft_size) {
            sum_sq += s * s;
            peak = peak.max(s.abs());
        }
        features.rms = (sum_sq / self.fft_size as f32).sqrt();
        features.peak = peak;
        features.volume = features.rms * 2.0; // Scaled for UI visibility

        // 2. Frequency analysis
        let mut planner = FftPlanner::new();
        let fft = planner.plan_fft_forward(self.fft_size);
        
        let mut fft_buffer: Vec<Complex<f32>> = samples[..self.fft_size]
            .iter()
            .map(|&x| Complex::new(x, 0.0))
            .collect();
        
        // Apply Hanning window
        for (i, sample) in fft_buffer.iter_mut().enumerate() {
            let window = 0.5 - 0.5 * (2.0 * std::f32::consts::PI * i as f32 / self.fft_size as f32).cos();
            sample.re *= window;
        }
        
        fft.process(&mut fft_buffer);
        
        let magnitudes: Vec<f32> = fft_buffer[..self.fft_size / 2]
            .iter()
            .map(|c| c.norm())
            .collect();
        
        let nyquist = self.sample_rate as f32 / 2.0;
        let bin_width = nyquist / (self.fft_size as f32 / 2.0);
        
        // Sub-bands
        let get_band = |lo: f32, hi: f32| {
            let start = (lo / bin_width) as usize;
            let end = (hi / bin_width) as usize;
            let slice = &magnitudes[start.min(magnitudes.len())..end.min(magnitudes.len())];
            if slice.is_empty() { 0.0 } else { slice.iter().sum::<f32>() / slice.len() as f32 }
        };

        features.sub_bass = get_band(20.0, 60.0);
        features.bass = get_band(60.0, 250.0);
        features.low_mid = get_band(250.0, 500.0);
        features.mid = get_band(500.0, 2000.0);
        features.upper_mid = get_band(2000.0, 4000.0);
        features.presence = get_band(4000.0, 6000.0);
        features.brilliance = get_band(6000.0, 20000.0);

        // Kick detection (simple spectral flux in bass)
        features.kick = (features.sub_bass - self.prev_bass_energy).max(0.0) * 5.0;
        self.prev_bass_energy = features.sub_bass;

        // Spectral Shape
        let mut total_mag = 0.0;
        let mut weighted_sum = 0.0;
        for (i, &mag) in magnitudes.iter().enumerate() {
            total_mag += mag;
            weighted_sum += mag * (i as f32 * bin_width);
        }
        
        if total_mag > 0.0 {
            features.centroid = weighted_sum / total_mag / nyquist;
            
            // Rolloff (85% energy)
            let mut accum = 0.0;
            let target = total_mag * 0.85;
            for (i, &mag) in magnitudes.iter().enumerate() {
                accum += mag;
                if accum >= target {
                    features.rolloff = (i as f32 * bin_width) / nyquist;
                    break;
                }
            }
        }

        serde_wasm_bindgen::to_value(&features).unwrap()
    }
}
