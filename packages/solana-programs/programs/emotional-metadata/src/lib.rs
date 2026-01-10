use anchor_lang::prelude::*;

declare_id!("Emot111111111111111111111111111111111111111");

#[program]
pub mod emotional_metadata {
    use super::*;

    /// Initialize emotional metadata registry
    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.total_records = 0;
        registry.last_update = Clock::get()?.unix_timestamp;
        
        emit!(RegistryInitialized {
            registry: registry.key(),
            authority: registry.authority,
            timestamp: registry.last_update,
        });

        Ok(())
    }

    /// Store emotional metadata for an NFT
    pub fn store_emotional_metadata(
        ctx: Context<StoreEmotionalMetadata>,
        nft_mint: Pubkey,
        emotion_vector: EmotionVector,
        biometric_signature: [u8; 64],
        ai_confidence: f32,
    ) -> Result<()> {
        let metadata = &mut ctx.accounts.metadata;
        let registry = &mut ctx.accounts.registry;
        
        metadata.nft_mint = nft_mint;
        metadata.owner = ctx.accounts.owner.key();
        metadata.emotion_vector = emotion_vector;
        metadata.biometric_signature = biometric_signature;
        metadata.ai_confidence = ai_confidence;
        metadata.timestamp = Clock::get()?.unix_timestamp;
        metadata.generation = registry.total_records + 1;
        
        registry.total_records += 1;
        registry.last_update = metadata.timestamp;
        
        emit!(EmotionalMetadataStored {
            metadata: metadata.key(),
            nft_mint: metadata.nft_mint,
            owner: metadata.owner,
            emotion_vector: metadata.emotion_vector.clone(),
            ai_confidence: metadata.ai_confidence,
            timestamp: metadata.timestamp,
        });

        Ok(())
    }

    /// Update emotional state with new biometric data
    pub fn update_emotional_state(
        ctx: Context<UpdateEmotionalState>,
        new_emotion_vector: EmotionVector,
        new_biometric_signature: [u8; 64],
        new_ai_confidence: f32,
    ) -> Result<()> {
        let metadata = &mut ctx.accounts.metadata;
        require!(metadata.owner == ctx.accounts.owner.key(), ErrorCode::Unauthorized);
        
        metadata.emotion_vector = new_emotion_vector;
        metadata.biometric_signature = new_biometric_signature;
        metadata.ai_confidence = new_ai_confidence;
        metadata.timestamp = Clock::get()?.unix_timestamp;
        
        emit!(EmotionalStateUpdated {
            metadata: metadata.key(),
            nft_mint: metadata.nft_mint,
            owner: metadata.owner,
            new_emotion_vector: metadata.emotion_vector.clone(),
            new_ai_confidence: metadata.ai_confidence,
            updated_at: metadata.timestamp,
        });

        Ok(())
    }

    /// Query emotional state history
    pub fn query_emotional_state(
        ctx: Context<QueryEmotionalState>,
    ) -> Result<EmotionVector> {
        let metadata = &ctx.accounts.metadata;
        Ok(metadata.emotion_vector.clone())
    }

    /// Analyze emotional patterns across multiple NFTs
    pub fn analyze_emotional_patterns(
        ctx: Context<AnalyzeEmotionalPatterns>,
        nft_mints: Vec<Pubkey>,
    ) -> Result<EmotionalAnalysis> {
        let mut total_valence = 0.0;
        let mut total_arousal = 0.0;
        let mut total_dominance = 0.0;
        let mut confidence_sum = 0.0;
        
        for mint in &nft_mints {
            // In a real implementation, this would fetch metadata for each NFT
            // For now, we'll use a simplified calculation
            total_valence += 0.5; // Placeholder
            total_arousal += 0.3; // Placeholder
            total_dominance += 0.7; // Placeholder
            confidence_sum += 0.8; // Placeholder
        }
        
        let count = nft_mints.len() as f32;
        
        Ok(EmotionalAnalysis {
            average_valence: total_valence / count,
            average_arousal: total_arousal / count,
            average_dominance: total_dominance / count,
            overall_confidence: confidence_sum / count,
            emotional_stability: calculate_stability(total_valence / count, total_arousal / count, total_dominance / count),
            pattern_type: classify_pattern(total_valence / count, total_arousal / count, total_dominance / count),
        })
    }
}

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8,
        seeds = [b"registry", authority.key().as_ref()],
        bump
    )]
    pub registry: Account<'info, EmotionalRegistry>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StoreEmotionalMetadata<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 64 + 4 + 8 + 8,
        seeds = [b"metadata", nft_mint.as_ref(), &registry.total_records.to_le_bytes()],
        bump
    )]
    pub metadata: Account<'info, EmotionalMetadata>,
    
    #[account(mut)]
    pub registry: Account<'info, EmotionalRegistry>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEmotionalState<'info> {
    #[account(mut)]
    pub metadata: Account<'info, EmotionalMetadata>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct QueryEmotionalState<'info> {
    pub metadata: Account<'info, EmotionalMetadata>,
}

#[derive(Accounts)]
pub struct AnalyzeEmotionalPatterns<'info> {
    pub authority: Signer<'info>,
}

#[account]
pub struct EmotionalRegistry {
    pub authority: Pubkey,
    pub total_records: u64,
    pub last_update: i64,
}

#[account]
pub struct EmotionalMetadata {
    pub nft_mint: Pubkey,
    pub owner: Pubkey,
    pub emotion_vector: EmotionVector,
    pub biometric_signature: [u8; 64],
    pub ai_confidence: f32,
    pub timestamp: i64,
    pub generation: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EmotionVector {
    pub valence: f32,    // pleasure (0.0 to 1.0)
    pub arousal: f32,    // energy level (0.0 to 1.0)
    pub dominance: f32,  // control level (0.0 to 1.0)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub average_valence: f32,
    pub average_arousal: f32,
    pub average_dominance: f32,
    pub overall_confidence: f32,
    pub emotional_stability: f32,
    pub pattern_type: PatternType,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum PatternType {
    StablePositive,
    StableNegative,
    UnstableMixed,
    NeutralStable,
    HighEnergy,
    LowEnergy,
}

fn calculate_stability(valence: f32, arousal: f32, dominance: f32) -> f32 {
    // Calculate emotional stability based on variance
    let mean = (valence + arousal + dominance) / 3.0;
    let variance = ((valence - mean).powi(2) + (arousal - mean).powi(2) + (dominance - mean).powi(2)) / 3.0;
    1.0 - (variance * 4.0).min(1.0) // Higher stability = lower variance
}

fn classify_pattern(valence: f32, arousal: f32, dominance: f32) -> PatternType {
    match (valence > 0.5, arousal > 0.5, dominance > 0.5) {
        (true, true, true) => PatternType::StablePositive,
        (false, true, true) => PatternType::StableNegative,
        (true, false, false) => PatternType::LowEnergy,
        (false, true, false) => PatternType::HighEnergy,
        _ => PatternType::UnstableMixed,
    }
}

#[event]
pub struct RegistryInitialized {
    pub registry: Pubkey,
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct EmotionalMetadataStored {
    pub metadata: Pubkey,
    pub nft_mint: Pubkey,
    pub owner: Pubkey,
    pub emotion_vector: EmotionVector,
    pub ai_confidence: f32,
    pub timestamp: i64,
}

#[event]
pub struct EmotionalStateUpdated {
    pub metadata: Pubkey,
    pub nft_mint: Pubkey,
    pub owner: Pubkey,
    pub new_emotion_vector: EmotionVector,
    pub new_ai_confidence: f32,
    pub updated_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid emotional vector values")]
    InvalidEmotionVector,
    #[msg("Biometric signature invalid")]
    InvalidBiometricSignature,
    #[msg("AI confidence too low")]
    LowAIConfidence,
    #[msg("NFT mint not found")]
    NFTMintNotFound,
    #[msg("Emotional metadata not found")]
    MetadataNotFound,
}