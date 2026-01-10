//! Solana Emotional Metadata Program
//! 
//! High-performance metadata storage for creative NFTs with neuroemotive integration.
//! Enhanced with cross-chain bridge capabilities and advanced compression.

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Emotional vector for creative expression
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct EmotionalVector {
    pub valence: f32,        // -1.0 to 1.0 (negative to positive)
    pub arousal: f32,        // 0.0 to 1.0 (calm to excited)  
    pub dominance: f32,      // 0.0 to 1.0 (submissive to dominant)
    pub confidence: f32,     // 0.0 to 1.0 (confidence in prediction)
    pub timestamp: i64,      // Unix timestamp
}

/// Cross-chain bridge information
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct CrossChainInfo {
    pub target_chain: String,        // Target blockchain (e.g., "NEAR", "Polkadot")
    pub target_contract: Pubkey,     // Target contract address
    pub bridge_status: u8,           // 0 = pending, 1 = bridged, 2 = failed
    pub bridge_timestamp: i64,         // When bridge operation occurred
    pub emotional_hash: [u8; 32],      // Hash of emotional data for verification
}

/// Session parameters for creative work
#[account]
#[derive(Default)]
pub struct CreativeSession {
    pub creator: Pubkey,                    // Session owner
    pub session_id: [u8; 32],                // Unique session identifier
    pub start_time: i64,                     // Session start timestamp
    pub emotional_state: EmotionalVector,    // Current emotional state
    pub shader_params: Vec<f32>,             // WebGPU shader parameters
    pub interaction_count: u32,              // Number of interactions
    pub compressed_state: [u8; 32],        // Compressed state hash
    pub cross_chain_info: CrossChainInfo,  // Cross-chain bridge data
    pub reputation_score: f32,              // Creator reputation (0.0 to 1.0)
    pub emotional_complexity: f32,         // Calculated complexity score
    pub creativity_index: f32,               // Creativity measurement
    pub community_engagement: u32,           // Community interaction count
    pub last_updated: i64,                   // Last update timestamp
}

/// Performance data point for stream tracking
#[account]
#[derive(Default)]
pub struct PerformanceData {
    pub session_id: [u8; 32],                // Reference to session
    pub timestamp: i64,                      // Performance timestamp
    pub emotional_vector: EmotionalVector,   // Emotional state at time
    pub shader_parameters: Vec<f32>,         // Active shader params
    pub interaction_intensity: f32,          // Interaction intensity (0.0 to 1.0)
    pub emotional_impact: f32,               // Calculated emotional impact
    pub creativity_boost: f32,               // Creativity boost factor
    pub quality_score: f32,                  // Overall quality (0.0 to 1.0)
}

/// Reputation tracking for creators
#[account]
#[derive(Default)]
pub struct CreatorReputation {
    pub creator: Pubkey,                     // Creator's public key
    pub reputation_score: f32,               // Overall reputation (0.0 to 1.0)
    pub total_interactions: u64,             // Total interaction count
    pub last_updated: i64,                   // Last reputation update
    pub emotional_consistency: f32,          // Emotional state consistency
    pub creativity_score: f32,               // Average creativity score
    pub community_rank: u32,                 // Community ranking
    pub total_sessions: u32,                 // Number of creative sessions
}

/// Emotional trajectory tracking
#[account]
#[derive(Default)]
pub struct EmotionalTrajectory {
    pub session_id: [u8; 32],                // Reference to session
    pub emotional_history: Vec<EmotionalVector>, // Historical emotional states
    pub predicted_next: EmotionalVector,     // AI-predicted next state
    pub trajectory_complexity: f32,           // Complexity of emotional pattern
    pub update_count: u32,                   // Number of updates
}

#[program]
pub mod solana_emotional_metadata {
    use super::*;

    /// Initialize a new creative session
    pub fn initialize_session(
        ctx: Context<InitializeSession>,
        session_id: [u8; 32],
        initial_emotional_state: EmotionalVector,
        shader_params: Vec<f32>,
    ) -> Result<()> {
        let session = &mut ctx.accounts.session;
        let clock = Clock::get()?;
        
        session.creator = ctx.accounts.creator.key();
        session.session_id = session_id;
        session.start_time = clock.unix_timestamp;
        session.emotional_state = initial_emotional_state;
        session.shader_params = shader_params;
        session.interaction_count = 0;
        session.reputation_score = 0.5; // Start with neutral reputation
        session.emotional_complexity = 0.5;
        session.creativity_index = 0.5;
        session.community_engagement = 0;
        session.last_updated = clock.unix_timestamp;
        
        // Initialize compressed state (simple hash for now)
        session.compressed_state = hash_emotional_state(&initial_emotional_state);
        
        msg!("Creative session initialized: {:?}", session_id);
        
        Ok(())
    }

    /// Record performance data during creative session
    pub fn record_performance(
        ctx: Context<RecordPerformance>,
        emotional_vector: EmotionalVector,
        shader_parameters: Vec<f32>,
        interaction_intensity: f32,
        quality_score: f32,
    ) -> Result<()> {
        let performance = &mut ctx.accounts.performance;
        let session = &mut ctx.accounts.session;
        let clock = Clock::get()?;
        
        // Record performance data
        performance.session_id = session.session_id;
        performance.timestamp = clock.unix_timestamp;
        performance.emotional_vector = emotional_vector;
        performance.shader_parameters = shader_parameters.clone();
        performance.interaction_intensity = interaction_intensity;
        performance.quality_score = quality_score;
        
        // Calculate emotional impact and creativity boost
        performance.emotional_impact = calculate_emotional_impact(&emotional_vector, &session.emotional_state);
        performance.creativity_boost = calculate_creativity_boost(&shader_parameters, quality_score);
        
        // Update session
        session.emotional_state = emotional_vector;
        session.shader_params = shader_parameters;
        session.interaction_count += 1;
        session.last_updated = clock.unix_timestamp;
        
        // Update reputation based on quality
        session.reputation_score = update_reputation(session.reputation_score, quality_score);
        
        msg!("Performance recorded for session: {:?}", session.session_id);
        
        Ok(())
    }

    /// Update emotional trajectory with AI prediction
    pub fn update_emotional_trajectory(
        ctx: Context<UpdateEmotionalTrajectory>,
        new_emotional_state: EmotionalVector,
    ) -> Result<()> {
        let trajectory = &mut ctx.accounts.trajectory;
        let session = &mut ctx.accounts.session;
        
        // Add current state to history
        trajectory.emotional_history.push(session.emotional_state);
        
        // Keep only last 100 states to prevent unlimited growth
        if trajectory.emotional_history.len() > 100 {
            trajectory.emotional_history.remove(0);
        }
        
        // Simple prediction: trend-based (in real implementation, use AI model)
        trajectory.predicted_next = predict_next_emotional_state(&trajectory.emotional_history);
        
        // Calculate trajectory complexity
        trajectory.trajectory_complexity = calculate_trajectory_complexity(&trajectory.emotional_history);
        trajectory.update_count += 1;
        
        // Update session with new state
        session.emotional_state = new_emotional_state;
        session.emotional_complexity = trajectory.trajectory_complexity;
        
        msg!("Emotional trajectory updated for session: {:?}", session.session_id);
        
        Ok(())
    }

    /// Compress emotional state data for efficient storage
    pub fn compress_emotional_state(
        ctx: Context<CompressEmotionalState>,
        compression_target: Pubkey,
    ) -> Result<()> {
        let session = &mut ctx.accounts.session;
        
        // Simple compression: hash of current emotional state
        let compressed_hash = hash_emotional_state(&session.emotional_state);
        session.compressed_state = compressed_hash;
        
        msg!("Emotional state compressed for session: {:?}", session.session_id);
        
        Ok(())
    }

    /// Update creator reputation based on session performance
    pub fn update_creator_reputation(
        ctx: Context<UpdateCreatorReputation>,
        session_performance: f32,
    ) -> Result<()> {
        let reputation = &mut ctx.accounts.reputation;
        let session = &ctx.accounts.session;
        let clock = Clock::get()?;
        
        // Update reputation using weighted average
        let weight = 0.1; // New performance has 10% weight
        reputation.reputation_score = reputation.reputation_score * (1.0 - weight) + session_performance * weight;
        
        // Update metrics
        reputation.total_interactions += session.interaction_count as u64;
        reputation.last_updated = clock.unix_timestamp;
        reputation.total_sessions += 1;
        reputation.emotional_consistency = calculate_emotional_consistency(&reputation.reputation_score);
        reputation.creativity_score = (reputation.creativity_score * (reputation.total_sessions - 1) as f32 + session.creativity_index) / reputation.total_sessions as f32;
        
        msg!("Creator reputation updated for: {:?}", reputation.creator);
        
        Ok(())
    }
}

// Context structures for instructions
#[derive(Accounts)]
pub struct InitializeSession<'info> {
    #[account(init, payer = creator, space = 1024)]
    pub session: Account<'info, CreativeSession>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordPerformance<'info> {
    #[account(mut)]
    pub session: Account<'info, CreativeSession>,
    #[account(init, payer = creator, space = 512)]
    pub performance: Account<'info, PerformanceData>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEmotionalTrajectory<'info> {
    #[account(mut)]
    pub session: Account<'info, CreativeSession>,
    #[account(mut)]
    pub trajectory: Account<'info, EmotionalTrajectory>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct CompressEmotionalState<'info> {
    #[account(mut)]
    pub session: Account<'info, CreativeSession>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateCreatorReputation<'info> {
    #[account(mut)]
    pub reputation: Account<'info, CreatorReputation>,
    #[account(mut)]
    pub session: Account<'info, CreativeSession>,
    pub creator: Signer<'info>,
}

// Helper functions
fn hash_emotional_state(emotional_state: &EmotionalVector) -> [u8; 32] {
    use anchor_lang::solana_program::hash::hash;
    let data = [
        emotional_state.valence.to_le_bytes().as_ref(),
        emotional_state.arousal.to_le_bytes().as_ref(),
        emotional_state.dominance.to_le_bytes().as_ref(),
        emotional_state.confidence.to_le_bytes().as_ref(),
        emotional_state.timestamp.to_le_bytes().as_ref(),
    ].concat();
    hash(&data).to_bytes()
}

fn calculate_emotional_impact(current: &EmotionalVector, previous: &EmotionalVector) -> f32 {
    let valence_diff = (current.valence - previous.valence).abs();
    let arousal_diff = (current.arousal - previous.arousal).abs();
    let dominance_diff = (current.dominance - previous.dominance).abs();
    (valence_diff + arousal_diff + dominance_diff) / 3.0
}

fn calculate_creativity_boost(shader_params: &[f32], quality_score: f32) -> f32 {
    let param_variance = if shader_params.len() > 1 {
        let mean = shader_params.iter().sum::<f32>() / shader_params.len() as f32;
        let variance = shader_params.iter().map(|x| (x - mean).powi(2)).sum::<f32>() / shader_params.len() as f32;
        variance.sqrt()
    } else {
        0.0
    };
    (param_variance * 0.5 + quality_score * 0.5).min(1.0)
}

fn predict_next_emotional_state(history: &[EmotionalVector]) -> EmotionalVector {
    if history.len() < 2 {
        return EmotionalVector::default();
    }
    
    // Simple trend-based prediction (in real implementation, use ML model)
    let last = history.last().unwrap();
    let second_last = &history[history.len() - 2];
    
    EmotionalVector {
        valence: last.valence + (last.valence - second_last.valence),
        arousal: last.arousal + (last.arousal - second_last.arousal),
        dominance: last.dominance + (last.dominance - second_last.dominance),
        confidence: 0.7, // Lower confidence for prediction
        timestamp: last.timestamp + 60, // Assume 1 minute intervals
    }
}

fn calculate_trajectory_complexity(history: &[EmotionalVector]) -> f32 {
    if history.len() < 2 {
        return 0.5;
    }
    
    let mut total_change = 0.0;
    for i in 1..history.len() {
        let current = &history[i];
        let previous = &history[i - 1];
        
        let change = (current.valence - previous.valence).powi(2)
            + (current.arousal - previous.arousal).powi(2)
            + (current.dominance - previous.dominance).powi(2);
        total_change += change.sqrt();
    }
    
    (total_change / (history.len() - 1) as f32).min(1.0)
}

fn update_reputation(current: f32, performance: f32) -> f32 {
    let learning_rate = 0.1;
    current + learning_rate * (performance - current)
}

fn calculate_emotional_consistency(reputation: &f32) -> f32 {
    // Higher reputation = higher consistency
    reputation * 0.8 + 0.2
}