use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use solana_program::pubkey;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod biometric_nft {
    use super::*;

    /// Initialize a new biometric NFT collection
    pub fn initialize_collection(
        ctx: Context<InitializeCollection>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        collection.name = name;
        collection.symbol = symbol;
        collection.uri = uri;
        collection.total_supply = 0;
        collection.authority = ctx.accounts.authority.key();
        
        emit!(CollectionInitialized {
            collection: collection.key(),
            authority: collection.authority,
            name: collection.name.clone(),
            symbol: collection.symbol.clone(),
        });

        Ok(())
    }

    /// Mint a new biometric NFT with emotional metadata
    pub fn mint_biometric_nft(
        ctx: Context<MintBiometricNFT>,
        biometric_hash: [u8; 32],
        emotion_data: EmotionData,
        uri: String,
    ) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        let collection = &mut ctx.accounts.collection;
        
        nft.collection = collection.key();
        nft.owner = ctx.accounts.owner.key();
        nft.biometric_hash = biometric_hash;
        nft.emotion_data = emotion_data;
        nft.uri = uri;
        nft.minted_at = Clock::get()?.unix_timestamp;
        nft.generation = collection.total_supply + 1;
        
        collection.total_supply += 1;
        
        emit!(BiometricNFTMinted {
            nft: nft.key(),
            collection: nft.collection,
            owner: nft.owner,
            biometric_hash: nft.biometric_hash,
            emotion_data: nft.emotion_data.clone(),
            generation: nft.generation,
        });

        Ok(())
    }

    /// Update emotional state of existing NFT
    pub fn update_emotion_state(
        ctx: Context<UpdateEmotionState>,
        new_emotion_data: EmotionData,
    ) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        require!(nft.owner == ctx.accounts.owner.key(), ErrorCode::Unauthorized);
        
        nft.emotion_data = new_emotion_data;
        nft.last_updated = Clock::get()?.unix_timestamp;
        
        emit!(EmotionStateUpdated {
            nft: nft.key(),
            owner: nft.owner,
            new_emotion_data: nft.emotion_data.clone(),
            updated_at: nft.last_updated,
        });

        Ok(())
    }

    /// Transfer NFT with emotional state validation
    pub fn transfer_nft(
        ctx: Context<TransferNFT>,
        new_owner: Pubkey,
    ) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        require!(nft.owner == ctx.accounts.current_owner.key(), ErrorCode::Unauthorized);
        
        // Emotional state must be stable for transfer (low arousal)
        require!(nft.emotion_data.arousal < 0.7, ErrorCode::EmotionalStateUnstable);
        
        nft.owner = new_owner;
        nft.last_updated = Clock::get()?.unix_timestamp;
        
        emit!(NFTTransferred {
            nft: nft.key(),
            from: ctx.accounts.current_owner.key(),
            to: new_owner,
            emotion_data: nft.emotion_data.clone(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCollection<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 64 + 32 + 200,
        seeds = [b"collection", authority.key().as_ref()],
        bump
    )]
    pub collection: Account<'info, BiometricCollection>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintBiometricNFT<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 32 + 200 + 64 + 8 + 8 + 4,
        seeds = [b"nft", collection.key().as_ref(), &collection.total_supply.to_le_bytes()],
        bump
    )]
    pub nft: Account<'info, BiometricNFT>,
    
    #[account(mut)]
    pub collection: Account<'info, BiometricCollection>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEmotionState<'info> {
    #[account(mut)]
    pub nft: Account<'info, BiometricNFT>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferNFT<'info> {
    #[account(mut)]
    pub nft: Account<'info, BiometricNFT>,
    
    pub current_owner: Signer<'info>,
}

#[account]
pub struct BiometricCollection {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub total_supply: u64,
}

#[account]
pub struct BiometricNFT {
    pub collection: Pubkey,
    pub owner: Pubkey,
    pub biometric_hash: [u8; 32],
    pub emotion_data: EmotionData,
    pub uri: String,
    pub minted_at: i64,
    pub last_updated: i64,
    pub generation: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EmotionData {
    pub valence: f32,    // pleasure (0.0 to 1.0)
    pub arousal: f32,    // energy level (0.0 to 1.0)  
    pub dominance: f32,  // control level (0.0 to 1.0)
    pub confidence: f32, // AI confidence (0.0 to 1.0)
    pub timestamp: i64,  // when emotion was detected
}

#[event]
pub struct CollectionInitialized {
    pub collection: Pubkey,
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
}

#[event]
pub struct BiometricNFTMinted {
    pub nft: Pubkey,
    pub collection: Pubkey,
    pub owner: Pubkey,
    pub biometric_hash: [u8; 32],
    pub emotion_data: EmotionData,
    pub generation: u64,
}

#[event]
pub struct EmotionStateUpdated {
    pub nft: Pubkey,
    pub owner: Pubkey,
    pub new_emotion_data: EmotionData,
    pub updated_at: i64,
}

#[event]
pub struct NFTTransferred {
    pub nft: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub emotion_data: EmotionData,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Emotional state too unstable for transfer")]
    EmotionalStateUnstable,
    #[msg("Invalid biometric data")]
    InvalidBiometricData,
    #[msg("Collection is full")]
    CollectionFull,
}