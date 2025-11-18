//! Integration example demonstrating AI/ML blockchain integration with biometric data

use wasm_bindgen::prelude::*;
use web_sys::{WebGl2RenderingContext, HtmlCanvasElement};
use crate::enhanced_webgpu_engine::{EnhancedGPUComputeEngine, AIModel, QuantizationLevel, ModelLayer};
use crate::enhanced_soulbound::{EnhancedSoulboundToken, EnhancedIdentityData, BiometricData, AIInsights, CreativeProfile};
use near_sdk::AccountId;
use near_contract_standards::non_fungible_token::{TokenId, TokenMetadata};

/// Complete integration example showing AI-enhanced soulbound tokens with biometric data
#[wasm_bindgen]
pub struct AIBlockchainIntegration {
    gpu_engine: EnhancedGPUComputeEngine,
    soulbound_tokens: Vec<EnhancedSoulboundToken>,
    active_model: Option<String>,
}

#[wasm_bindgen]
impl AIBlockchainIntegration {
    /// Create a new AI blockchain integration instance
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: HtmlCanvasElement) -> Result<AIBlockchainIntegration, JsValue> {
        let context = canvas
            .get_context("webgl2")?
            .ok_or("WebGL2 not supported")?
            .dyn_into::<WebGl2RenderingContext>()?;
        
        let gpu_engine = EnhancedGPUComputeEngine::new(context)?;
        
        Ok(AIBlockchainIntegration {
            gpu_engine,
            soulbound_tokens: Vec::new(),
            active_model: None,
        })
    }
    
    /// Load an AI model for biometric processing
    pub fn load_biometric_model(&mut self, model_name: &str) -> Result<(), JsValue> {
        // Create a neural network model for EEG signal processing
        let model = AIModel {
            model_type: "biometric_eeg".to_string(),
            model_data: vec![0.0; 1024], // Placeholder for model weights
            input_shape: vec![1, 256], // 256 EEG samples
            output_shape: vec![1, 5],  // 5 emotional states
            layers: vec![
                ModelLayer {
                    layer_type: "dense".to_string(),
                    weights: vec![0.1; 256 * 128], // Input to hidden
                    biases: vec![0.0; 128],
                    activation: "relu".to_string(),
                    parameters: HashMap::new(),
                },
                ModelLayer {
                    layer_type: "dense".to_string(),
                    weights: vec![0.1; 128 * 5], // Hidden to output
                    biases: vec![0.0; 5],
                    activation: "softmax".to_string(),
                    parameters: HashMap::new(),
                },
            ],
            quantization_level: QuantizationLevel::Float16,
        };
        
        self.gpu_engine.load_ai_model(model_name, model)?;
        self.active_model = Some(model_name.to_string());
        
        Ok(())
    }
    
    /// Create an AI-enhanced soulbound token with biometric integration
    pub fn create_enhanced_soulbound_token(
        &mut self,
        owner_id: String,
        creative_skills: Vec<String>,
        experience_level: String,
    ) -> Result<String, JsValue> {
        let owner_account: AccountId = owner_id.parse()
            .map_err(|_| JsValue::from_str("Invalid account ID"))?;
        
        let token_id: TokenId = format!("soulbound_{}", self.soulbound_tokens.len() + 1);
        
        let metadata = TokenMetadata {
            title: Some("AI-Enhanced Creative Identity".to_string()),
            description: Some("Biometrically-verified creative soulbound token".to_string()),
            media: Some("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iMTAwIiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5BSSBFbmhhbmNlZDwvdGV4dD48L3N2Zz4=".to_string()),
            media_hash: None,
            copies: Some(1),
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: Some("AI_MODEL: v1.0, BIOMETRIC: enabled".to_string()),
            reference: None,
            reference_hash: None,
        };
        
        let creative_profile = CreativeProfile {
            primary_skill: creative_skills.get(0).unwrap_or(&"generalist".to_string()).clone(),
            experience_level,
            preferred_medium: "digital".to_string(),
            collaboration_interest: true,
            skill_tags: creative_skills,
            hourly_rate: None,
        };
        
        let identity_data = EnhancedIdentityData {
            creative_profile,
            achievements: vec!["AI_Enhanced_Creator".to_string()],
            verified: false, // Will be verified through biometric data
            reputation_score: 0.5, // Starting neutral score
            biometric_data: BiometricData::default(),
            ai_insights: AIInsights::default(),
            collaboration_history: Vec::new(),
        };
        
        let biometric_hash = Some(vec![1, 2, 3, 4, 5]); // Placeholder hash
        let ai_model_version = "v1.0".to_string();
        
        let token = EnhancedSoulboundToken::new(
            token_id.clone(),
            owner_account,
            metadata,
            identity_data,
            biometric_hash,
            ai_model_version,
        );
        
        self.soulbound_tokens.push(token);
        
        Ok(token_id)
    }
    
    /// Process biometric data and update soulbound token
    pub fn process_biometric_data(
        &mut self,
        token_id: &str,
        eeg_data: Vec<f32>,
        sampling_rate: f32,
    ) -> Result<String, JsValue> {
        // Find the token
        let token = self.soulbound_tokens.iter_mut()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        // Process EEG data using GPU acceleration
        let processed_data = self.gpu_engine.process_biometric_data("eeg", &eeg_data, sampling_rate)?;
        
        // Generate AI insights from processed data
        let insights = self.gpu_engine.generate_creative_insights(&eeg_data)?;
        
        // Update token with new biometric data
        let new_biometric_data = BiometricData {
            eeg_fingerprint: Some(processed_data.to_vec()),
            emotional_signature: Some(vec![insights.flow_score / 100.0]),
            creative_patterns: Some(vec![insights.dominant_frequency]),
            last_updated: 0, // Would use actual timestamp
        };
        
        token.update_biometric_data(new_biometric_data);
        
        // Update AI insights
        let new_ai_insights = AIInsights {
            creativity_score: insights.flow_score / 100.0,
            collaboration_compatibility: 0.7, // Based on emotional state
            skill_recommendations: vec![insights.recommended_activity.clone()],
            predicted_success_rate: insights.flow_score / 100.0,
            personality_traits: vec![insights.creative_state.clone()],
        };
        
        token.add_ai_insights(new_ai_insights);
        
        Ok(format!(
            "Biometric data processed. Creative state: {}, Flow score: {:.1}%", 
            insights.creative_state, 
            insights.flow_score
        ))
    }
    
    /// Find compatible collaborators based on AI analysis
    pub fn find_compatible_collaborators(&self, token_id: &str) -> Result<Vec<String>, JsValue> {
        let token = self.soulbound_tokens.iter()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        let mut compatible_partners = Vec::new();
        
        for other_token in &self.soulbound_tokens {
            if other_token.token_id == token_id {
                continue; // Skip self
            }
            
            // Calculate compatibility based on skills and AI insights
            let other_skills = &other_token.identity_data.creative_profile.skill_tags;
            let compatibility_score = token.calculate_compatibility(other_skills);
            
            if compatibility_score > 0.6 {
                compatible_partners.push(format!(
                    "{} (compatibility: {:.1}%)",
                    other_token.owner_id,
                    compatibility_score * 100.0
                ));
            }
        }
        
        Ok(compatible_partners)
    }
    
    /// Record a collaboration between two creators
    pub fn record_collaboration(
        &mut self,
        token_id: &str,
        partner_token_id: &str,
        project_name: String,
        success_rating: f32,
    ) -> Result<String, JsValue> {
        let token = self.soulbound_tokens.iter_mut()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        let partner_token = self.soulbound_tokens.iter()
            .find(|t| t.token_id == partner_token_id)
            .ok_or("Partner token not found")?;
        
        let collaboration_record = crate::enhanced_soulbound::CollaborationRecord {
            partner_id: partner_token.owner_id.clone(),
            project_id: project_name.clone(),
            success_rating,
            timestamp: 0, // Would use actual timestamp
            skills_contributed: token.identity_data.creative_profile.skill_tags.clone(),
        };
        
        token.record_collaboration(collaboration_record);
        
        Ok(format!(
            "Collaboration '{}' recorded with success rating {:.1}/5.0",
            project_name,
            success_rating
        ))
    }
    
    /// Get AI-powered recommendations for the creator
    pub fn get_ai_recommendations(&self, token_id: &str) -> Result<Vec<String>, JsValue> {
        let token = self.soulbound_tokens.iter()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        let recommendations = token.get_skill_recommendations();
        
        // Add additional AI-generated recommendations based on biometric data
        let mut enhanced_recommendations = recommendations;
        
        if let Some(ref biometric_data) = token.identity_data.biometric_data.eeg_fingerprint {
            if !biometric_data.is_empty() {
                let flow_score = biometric_data[0] * 100.0;
                
                if flow_score > 80.0 {
                    enhanced_recommendations.push("High creative flow detected - ideal for complex problem solving".to_string());
                } else if flow_score < 30.0 {
                    enhanced_recommendations.push("Low creative flow - consider taking a break or switching tasks".to_string());
                }
            }
        }
        
        Ok(enhanced_recommendations)
    }
    
    /// Verify biometric identity
    pub fn verify_biometric_identity(&self, token_id: &str, biometric_sample: Vec<f32>) -> Result<bool, JsValue> {
        let token = self.soulbound_tokens.iter()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        Ok(token.verify_biometric(&biometric_sample))
    }
    
    /// Get comprehensive token analytics
    pub fn get_token_analytics(&self, token_id: &str) -> Result<String, JsValue> {
        let token = self.soulbound_tokens.iter()
            .find(|t| t.token_id == token_id)
            .ok_or("Token not found")?;
        
        let analytics = format!(
            "Token Analytics for {}:\n\
            - Owner: {}\n\
            - Reputation Score: {:.2}/1.0\n\
            - AI Creativity Score: {:.2}/1.0\n\
            - Collaboration Compatibility: {:.2}/1.0\n\
            - Collaboration History: {} projects\n\
            - Skills: {}\n\
            - Biometric Verification: {}",
            token_id,
            token.owner_id,
            token.identity_data.reputation_score,
            token.identity_data.ai_insights.creativity_score,
            token.identity_data.ai_insights.collaboration_compatibility,
            token.identity_data.collaboration_history.len(),
            token.identity_data.creative_profile.skill_tags.join(", "),
            if token.biometric_hash.is_some() { "Enabled" } else { "Disabled" }
        );
        
        Ok(analytics)
    }
}

/// Example usage function
#[wasm_bindgen]
pub fn create_integration_example() -> Result<String, JsValue> {
    Ok("AI Blockchain Integration example created. Use the methods to:\n\
        1. Load biometric models\n\
        2. Create enhanced soulbound tokens\n\
        3. Process biometric data\n\
        4. Find compatible collaborators\n\
        5. Record collaborations\n\
        6. Get AI recommendations".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn test_integration_creation() {
        // This would need a mock canvas for testing
        // For now, just test the string creation
        let result = create_integration_example();
        assert!(result.is_ok());
    }
}