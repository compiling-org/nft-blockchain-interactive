use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod biometric_nft {
    use super::*;

    pub fn initialize_nft(
        ctx: Context<InitializeNft>,
        emotion_data: EmotionData,
        quality_score: f64,
        biometric_hash: String,
    ) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;
        
        // Validate biometric quality
        require!(quality_score >= 0.7, ErrorCode::LowQualityScore);
        
        nft_account.owner = ctx.accounts.payer.key();
        nft_account.biometric_hash = biometric_hash;
        nft_account.emotion_data = emotion_data.clone();
        nft_account.quality_score = quality_score;
        nft_account.device_id = "emotiv_epoc_x".to_string();
        nft_account.timestamp = Clock::get()?.unix_timestamp as u64;
        nft_account.verification_method = "AI-Enhanced".to_string();
        nft_account.is_soulbound = true;
        
        // Create emotion history record
        let emotion_record = EmotionRecord {
            timestamp: nft_account.timestamp,
            emotion_data: emotion_data.clone(),
            context: "Minting".to_string(),
        };
        
        nft_account.emotion_history = vec![emotion_record];
        
        msg!("Biometric NFT minted for {} with emotion: {} (confidence: {:.2})", 
             ctx.accounts.payer.key(), 
             emotion_data.primary_emotion.clone(), 
             emotion_data.confidence);
        
        Ok(())
    }
    
    pub fn verify_biometric(
        ctx: Context<VerifyBiometric>,
        biometric_hash: String,
    ) -> Result<bool> {
        let nft_account = &ctx.accounts.nft_account;
        Ok(nft_account.biometric_hash == biometric_hash)
    }
    
    pub fn get_emotion_history(ctx: Context<GetEmotionHistory>) -> Result<Vec<EmotionRecord>> {
        Ok(ctx.accounts.nft_account.emotion_history.clone())
    }
    
    // Override transfer to make tokens soulbound
    pub fn transfer_soulbound(
        _ctx: Context<TransferSoulbound>,
        _to: Pubkey,
    ) -> Result<()> {
        err!(ErrorCode::SoulboundTransfer)
    }
}

#[derive(Accounts)]
pub struct InitializeNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + BiometricNftAccount::MAX_SIZE,
        seeds = [b"biometric_nft", payer.key().as_ref()],
        bump
    )]
    pub nft_account: Account<'info, BiometricNftAccount>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct VerifyBiometric<'info> {
    pub nft_account: Account<'info, BiometricNftAccount>,
}

#[derive(Accounts)]
pub struct GetEmotionHistory<'info> {
    pub nft_account: Account<'info, BiometricNftAccount>,
}

#[derive(Accounts)]
pub struct TransferSoulbound<'info> {
    #[account(mut)]
    pub nft_account: Account<'info, BiometricNftAccount>,
}

#[account]
pub struct BiometricNftAccount {
    pub owner: Pubkey,
    pub biometric_hash: String,
    pub emotion_data: EmotionData,
    pub quality_score: f64,
    pub device_id: String,
    pub timestamp: u64,
    pub verification_method: String,
    pub is_soulbound: bool,
    pub emotion_history: Vec<EmotionRecord>,
}

impl BiometricNftAccount {
    const MAX_SIZE: usize = 32 + // owner
        64 + // biometric_hash
        EmotionData::MAX_SIZE + // emotion_data
        8 + // quality_score
        32 + // device_id
        8 + // timestamp
        32 + // verification_method
        1 + // is_soulbound
        4 + 1024; // emotion_history - estimated max size
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct EmotionData {
    pub primary_emotion: String,
    pub confidence: f64,
    pub secondary_emotions: Vec<(String, f64)>,
    pub arousal: f64,
    pub valence: f64,
}

impl EmotionData {
    const MAX_SIZE: usize = 32 + // primary_emotion
        8 + // confidence
        4 + 256 + // secondary_emotions - estimated max size
        8 + // arousal
        8; // valence
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct EmotionRecord {
    pub timestamp: u64,
    pub emotion_data: EmotionData,
    pub context: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Biometric quality score too low")]
    LowQualityScore,
    #[msg("Soulbound tokens are non-transferable")]
    SoulboundTransfer,
}