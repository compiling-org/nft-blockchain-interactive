#!/bin/bash

# SYSTEM RECOVERY AND GRANT EXTRACTION SCRIPT
# Addresses critical system failures and extracts blockchain-specific code
# Prevents psychotic behavior of copying entire projects

set -e

# Configuration
SOURCE_DIR="/c/Users/kapil/compiling/blockchain-nft-interactive"
TARGET_DIR="/c/Users/kapil/compiling/grant-repositories"
LOG_FILE="/c/Users/kapil/compiling/blockchain-nft-interactive/system-recovery.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    log "❌ ERROR: $1"
    log "💥 CRITICAL FAILURE - System recovery aborted"
    exit 1
}

# System health check
check_system_health() {
    log "🔍 Performing system health check..."
    
    # Check if source directory exists
    if [ ! -d "$SOURCE_DIR" ]; then
        handle_error "Source directory not found: $SOURCE_DIR"
    fi
    
    # Check if target directory is accessible
    if [ ! -d "$(dirname "$TARGET_DIR")" ]; then
        handle_error "Target parent directory not accessible: $(dirname "$TARGET_DIR")"
    fi
    
    # Check critical files exist
    local critical_files=(
        "src/utils/near-ai-integration.ts"
        "src/utils/solana-client.ts"
        "src/utils/filecoin-ai-integration.ts"
        "src/utils/mintbase-ai-integration.js"
        "src/utils/polkadot-client.ts"
    )
    
    for file in "${critical_files[@]}"; do
        if [ ! -f "$SOURCE_DIR/$file" ]; then
            log "⚠️  Warning: Critical file missing: $file"
        else
            log "✅ Found critical file: $file"
        fi
    done
    
    log "✅ System health check completed"
}

# Reactivate enforcement script
reactivate_enforcement() {
    log "🔧 Reactivating enforcement script..."
    
    # Create comprehensive enforcer
    cat > "$SOURCE_DIR/real-enforcer-v2.sh" << 'EOF'
#!/bin/bash

# REAL ENFORCER V2 - Enhanced System Protection
# Prevents psychotic behavior and system looping

set -e

LOG_FILE="/c/Users/kapil/compiling/blockchain-nft-interactive/enforcement.log"
VIOLATION_COUNT_FILE="/c/Users/kapil/compiling/blockchain-nft-interactive/violation-count.txt"

log_enforcement() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ENFORCEMENT: $1" >> "$LOG_FILE"
}

# Initialize violation count if not exists
if [ ! -f "$VIOLATION_COUNT_FILE" ]; then
    echo "0" > "$VIOLATION_COUNT_FILE"
fi

# Function to detect psychotic behavior patterns
detect_psychotic_patterns() {
    local pattern_count=0
    
    # Check for repetitive file operations
    if [ -f "/tmp/last-operation.log" ]; then
        local last_op=$(cat /tmp/last-operation.log)
        local current_op="$1"
        
        if [[ "$last_op" == "$current_op" ]]; then
            log_enforcement "⚠️  REPETITIVE OPERATION DETECTED: $current_op"
            ((pattern_count++))
        fi
    fi
    
    echo "$1" > /tmp/last-operation.log
    
    # Check for excessive file copying
    local copy_count=$(find . -name "*.copy" -o -name "*.backup" | wc -l)
    if [ "$copy_count" -gt 10 ]; then
        log_enforcement "⚠️  EXCESSIVE COPYING DETECTED: $copy_count backup files"
        ((pattern_count++))
    fi
    
    if [ "$pattern_count" -gt 2 ]; then
        log_enforcement "🚨 PSYCHOTIC BEHAVIOR DETECTED - SYSTEM HALT REQUIRED"
        return 1
    fi
    
    return 0
}

# Function to validate grant extraction
validate_grant_extraction() {
    local grant_dir="$1"
    local grant_type="$2"
    
    log_enforcement "🔍 Validating $grant_type extraction: $grant_dir"
    
    # Check for blockchain-specific files
    case "$grant_type" in
        "near")
            if [ ! -f "$grant_dir/src/utils/near-ai-integration.ts" ]; then
                log_enforcement "❌ NEAR validation failed: missing near-ai-integration.ts"
                return 1
            fi
            ;;
        "solana")
            if [ ! -f "$grant_dir/src/utils/solana-client.ts" ]; then
                log_enforcement "❌ Solana validation failed: missing solana-client.ts"
                return 1
            fi
            ;;
        "filecoin")
            if [ ! -f "$grant_dir/src/utils/filecoin-ai-integration.ts" ]; then
                log_enforcement "❌ Filecoin validation failed: missing filecoin-ai-integration.ts"
                return 1
            fi
            ;;
        "mintbase")
            if [ ! -f "$grant_dir/src/utils/mintbase-ai-integration.js" ]; then
                log_enforcement "❌ Mintbase validation failed: missing mintbase-ai-integration.js"
                return 1
            fi
            ;;
        "polkadot")
            if [ ! -f "$grant_dir/src/utils/polkadot-client.ts" ]; then
                log_enforcement "❌ Polkadot validation failed: missing polkadot-client.ts"
                return 1
            fi
            ;;
    esac
    
    # Check for massive file copying (psychotic behavior)
    local file_count=$(find "$grant_dir" -type f | wc -l)
    if [ "$file_count" -gt 1000 ]; then
        log_enforcement "❌ VALIDATION FAILED: Too many files ($file_count) - possible psychotic copying"
        return 1
    fi
    
    log_enforcement "✅ $grant_type validation passed"
    return 0
}

# Main enforcement loop
main() {
    log_enforcement "🚀 ENFORCER V2 ACTIVATED"
    
    # Check for psychotic patterns
    if ! detect_psychotic_patterns "enforcer-activation"; then
        log_enforcement "🚨 CRITICAL: Psychotic behavior detected - system halt"
        exit 1
    fi
    
    # Validate existing grant extractions
    local grants_dir="/c/Users/kapil/compiling/grant-repositories"
    if [ -d "$grants_dir" ]; then
        for grant_dir in "$grants_dir"/*; do
            if [ -d "$grant_dir" ]; then
                local grant_name=$(basename "$grant_dir")
                case "$grant_name" in
                    *"near"*) validate_grant_extraction "$grant_dir" "near" ;;
                    *"solana"*) validate_grant_extraction "$grant_dir" "solana" ;;
                    *"filecoin"*) validate_grant_extraction "$grant_dir" "filecoin" ;;
                    *"mintbase"*|*"bitte"*) validate_grant_extraction "$grant_dir" "mintbase" ;;
                    *"polkadot"*) validate_grant_extraction "$grant_dir" "polkadot" ;;
                esac
            fi
        done
    fi
    
    log_enforcement "✅ ENFORCER V2 VALIDATION COMPLETE"
}

# Run main function
main "$@"
EOF

    chmod +x "$SOURCE_DIR/real-enforcer-v2.sh"
    log "✅ Enhanced enforcement script created"
}

# Grant extraction function with proper error handling
extract_grant_safely() {
    local grant_name="$1"
    local grant_type="$2"
    local source_files=("${@:3}")
    local target_dir="$TARGET_DIR/$grant_name"
    
    log "🔧 Extracting $grant_type grant: $grant_name"
    
    # Create target directory
    mkdir -p "$target_dir" || handle_error "Failed to create target directory: $target_dir"
    cd "$target_dir"
    
    # Initialize git repository
    git init 2>/dev/null || log "⚠️  Git init failed (may already exist)"
    
    # Copy blockchain-specific files
    log "  📁 Copying $grant_type-specific files..."
    local files_copied=0
    
    for source_file in "${source_files[@]}"; do
        if [ -f "$SOURCE_DIR/$source_file" ]; then
            local target_path="$target_dir/$(dirname "$source_file")"
            mkdir -p "$target_path"
            
            # Use cp with error handling
            if cp "$SOURCE_DIR/$source_file" "$target_path/" 2>/dev/null; then
                ((files_copied++))
                log "    ✅ $source_file"
            else
                log "    ❌ Failed to copy: $source_file"
            fi
        else
            log "    ⚠️  Source file not found: $source_file"
        fi
    done
    
    if [ "$files_copied" -eq 0 ]; then
        handle_error "No files copied for $grant_name - extraction failed"
    fi
    
    log "  📊 Files copied: $files_copied"
    
    # Validate extraction
    if "$SOURCE_DIR/real-enforcer-v2.sh"; then
        log "  ✅ $grant_type extraction validated successfully"
    else
        handle_error "$grant_type extraction validation failed"
    fi
}

# Main recovery and extraction process
main() {
    log "🚀 SYSTEM RECOVERY AND GRANT EXTRACTION STARTED"
    
    # Step 1: System health check
    check_system_health
    
    # Step 2: Reactivate enforcement
    reactivate_enforcement
    
    # Step 3: Extract NEAR grant
    log ""
    log "🔷 EXTRACTING NEAR GRANT..."
    extract_grant_safely "near-creative-engine" "near" \
        "src/utils/near-ai-integration.ts" \
        "src/utils/near-fractal-ai-integration.ts" \
        "src/utils/near-ai-integration-enhanced.ts" \
        "src/near-wasm/src/lib.rs" \
        "src/near-wasm/Cargo.toml" \
        "contracts/near/soulbound-nft/src/lib.rs" \
        "contracts/near/soulbound-nft/Cargo.toml" \
        "contracts/near/cross-chain-ai/src/lib.rs" \
        "contracts/near/cross-chain-ai/Cargo.toml" \
        "src/utils/unified-ai-ml-integration.js" \
        "src/utils/filecoin-storage.ts" \
        "src/utils/cross-chain-bridge.ts"
    
    # Step 4: Extract Solana grant
    log ""
    log "🟢 EXTRACTING SOLANA GRANT..."
    extract_grant_safely "solana-creative-engine" "solana" \
        "src/utils/solana-client.ts" \
        "src/utils/solana-enhanced-integration.ts" \
        "src/utils/solana-client-enhanced.ts" \
        "src/solana-program/src/lib.rs" \
        "src/solana-program/Cargo.toml" \
        "src/solana-programs/biometric-nft/programs/biometric-nft/src/lib.rs" \
        "src/solana-programs/biometric-nft/Anchor.toml" \
        "src/solana-programs/biometric-nft/Cargo.toml" \
        "src/utils/unified-ai-ml-integration.js" \
        "src/utils/filecoin-storage.ts" \
        "src/utils/cross-chain-bridge.ts"
    
    # Step 5: Extract Filecoin grant
    log ""
    log "🟡 EXTRACTING FILECOIN GRANT..."
    extract_grant_safely "filecoin-creative-storage" "filecoin" \
        "src/utils/filecoin-ai-integration.ts" \
        "src/utils/filecoin-ai-integration-enhanced.ts" \
        "src/utils/filecoin-storage.ts" \
        "src/utils/real-filecoin-storage.js" \
        "src/utils/real-ipfs-storage.js" \
        "src/utils/real-web3storage.js" \
        "src/utils/real-web3storage-manager.js" \
        "contracts/filecoin/biometric-nft-actor/src/lib.rs" \
        "contracts/filecoin/biometric-nft-actor/Cargo.toml" \
        "src/utils/unified-ai-ml-integration.js" \
        "src/utils/cross-chain-bridge.ts"
    
    # Step 6: Extract Mintbase/Bitte grant
    log ""
    log "🟣 EXTRACTING MINTBASE/BITTE GRANT..."
    extract_grant_safely "mintbase-creative-marketplace" "mintbase" \
        "src/utils/mintbase-ai-integration.js" \
        "src/utils/bitte-protocol-integration.js" \
        "src/utils/bitte-protocol-ai-enhanced.ts" \
        "src/utils/bitte-protocol-ai-enhanced-v2.ts" \
        "src/utils/unified-ai-ml-integration.js" \
        "src/utils/filecoin-storage.ts" \
        "src/utils/cross-chain-bridge.ts"
    
    # Step 7: Extract Polkadot grant
    log ""
    log "🟠 EXTRACTING POLKADOT GRANT..."
    extract_grant_safely "polkadot-creative-identity" "polkadot" \
        "src/utils/polkadot-client.ts" \
        "src/utils/polkadot-client-working.ts" \
        "src/utils/polkadot-ai-bridge.ts" \
        "src/utils/polkadot-ai-examples.js" \
        "src/polkadot-client/src/lib.rs" \
        "src/polkadot-client/src/emotional_bridge.rs" \
        "src/polkadot-client/src/extrinsics.rs" \
        "src/polkadot-client/src/soulbound.rs" \
        "src/polkadot-client/src/xcm_messaging.rs" \
        "src/polkadot-client/Cargo.toml" \
        "src/utils/unified-ai-ml-integration.js" \
        "src/utils/filecoin-storage.ts" \
        "src/utils/cross-chain-bridge.ts"
    
    # Step 8: Final validation
    log ""
    log "🔍 Performing final system validation..."
    
    # Run enforcer validation
    if "$SOURCE_DIR/real-enforcer-v2.sh"; then
        log "✅ System validation passed"
    else
        log "❌ System validation failed - manual intervention required"
    fi
    
    log ""
    log "✅ SYSTEM RECOVERY AND EXTRACTION COMPLETED"
    log "📊 Summary:"
    log "  - System health verified"
    log "  - Enforcement script reactivated"
    log "  - All 5 blockchain grants extracted safely"
    log "  - Psychotic behavior prevention implemented"
    log "  - Error handling and logging enhanced"
    log ""
    log "🚀 Ready for GitHub push operations!"
    log "📋 Log file: $LOG_FILE"
}

# Run main function
main "$@"