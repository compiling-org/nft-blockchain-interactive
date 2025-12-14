#!/bin/bash
# Script to update all grant extraction scripts with corrected project information

echo "============================================"
echo "Updating All Grant Extraction Scripts"
echo "============================================"

# Update the main extraction scripts to use correct folder names and references
echo "🔧 Updating extraction script references..."

# Create a mapping of old vs new project names
declare -A project_mappings=(
    ["rust-emotional-engine"]="rust-foundation-audiovisual"
    ["near-creative-engine"]="near-fractal-studio"  
    ["solana-creative-engine"]="solana-shader-system"
    ["filecoin-creative-engine"]="filecoin-storage-system"
    ["polkadot-creative-engine"]="polkadot-cross-chain"
    ["bitte-creative-engine"]="bitte-mobile-system"
)

# Function to update script references
update_script_references() {
    local script_file="$1"
    local old_name="$2"
    local new_name="$3"
    
    if [ -f "$script_file" ]; then
        # Update directory references
        sed -i "s/$old_name/$new_name/g" "$script_file"
        echo "✅ Updated $script_file: $old_name → $new_name"
    fi
}

# Update each extraction script
for old_name in "${!project_mappings[@]}"; do
    new_name="${project_mappings[$old_name]}"
    
    # Update Rust script
    update_script_references "extract-rust-grant.sh" "$old_name" "$new_name"
    
    # Update other grant scripts if they exist
    for script in extract-near-grant.sh extract-solana-grant.sh extract-filecoin-grant.sh extract-polkadot-grant.sh extract-bitte-grant.sh; do
        if [ -f "$script" ]; then
            update_script_references "$script" "$old_name" "$new_name"
        fi
    done
done

# Update documentation references in all scripts
echo "📄 Updating documentation references..."

# Update GitHub URLs to use correct repository names
sed -i 's/rust-emotional-engine/rust-foundation-audiovisual/g' extract-rust-grant.sh
sed -i 's|https://github.com/compiling-org/rust-emotional-engine|https://github.com/compiling-org/rust-foundation-audiovisual|g' extract-rust-grant.sh

# Update project descriptions to reflect corrected scope
sed -i 's/Emotional Engine/Web-Based Audiovisual Creative System/g' extract-rust-grant.sh
sed -i 's/emotionally-responsive/simple web-based/g' extract-rust-grant.sh
sed -i 's/biometric data integration/gesture-driven controls/g' extract-rust-grant.sh
sed -i 's/emotional modulation/gesture-driven parameter control/g' extract-rust-grant.sh

echo "✅ Updated Rust grant script with corrected project scope"

# Create consistency check script
cat > check-extraction-consistency.sh << 'EOF'
#!/bin/bash
# Script to check consistency across all extraction scripts

echo "🔍 Checking extraction script consistency..."

# Check for outdated references
outdated_terms=(
    "emotional-engine"
    "emotional-computing" 
    "biometric-processing"
    "fractal-shader-system"
    "modular-fractal"
)

correct_terms=(
    "audiovisual-creative"
    "web-based-creative"
    "gesture-driven"
    "WASM-compiled"
    "shader-studio"
)

for script in extract-*.sh; do
    if [ -f "$script" ]; then
        echo "📋 Checking $script..."
        
        # Check for outdated terms
        for term in "${outdated_terms[@]}"; do
            if grep -q "$term" "$script"; then
                echo "⚠️  Found outdated term: $term in $script"
            fi
        done
        
        # Check for correct terms
        found_correct=0
        for term in "${correct_terms[@]}"; do
            if grep -q "$term" "$script"; then
                found_correct=1
            fi
        done
        
        if [ $found_correct -eq 0 ]; then
            echo "⚠️  No correct project terms found in $script"
        fi
    fi
done

echo "✅ Consistency check complete"
EOF

chmod +x check-extraction-consistency.sh

# Create master extraction script that runs all updated scripts
cat > extract-all-grants-updated.sh << 'EOF'
#!/bin/bash
# Master extraction script using updated project references

echo "🚀 Running Updated Grant Extraction Scripts"
echo "============================================"

# Array of grant extraction scripts with their corrected names
declare -A grant_scripts=(
    ["Rust Foundation"]="extract-rust-grant.sh"
    ["NEAR Protocol"]="extract-near-grant.sh" 
    ["Solana"]="extract-solana-grant.sh"
    ["Filecoin"]="extract-filecoin-grant.sh"
    ["Polkadot"]="extract-polkadot-grant.sh"
    ["Bitte"]="extract-bitte-grant.sh"
)

# Run each extraction script
for grant_name in "${!grant_scripts[@]}"; do
    script="${grant_scripts[$grant_name]}"
    
    if [ -f "$script" ]; then
        echo ""
        echo "📦 Extracting $grant_name grant files..."
        echo "----------------------------------------"
        bash "$script"
        echo "✅ $grant_name extraction complete"
    else
        echo "⚠️  Script not found: $script"
    fi
done

echo ""
echo "============================================"
echo "✅ All Grant Extraction Scripts Complete!"
echo "============================================"
echo ""
echo "Updated repositories:"
echo "- Rust Foundation: rust-foundation-audiovisual"
echo "- NEAR Protocol: near-fractal-studio" 
echo "- Solana: solana-shader-system"
echo "- Filecoin: filecoin-storage-system"
echo "- Polkadot: polkadot-cross-chain"
echo "- Bitte: bitte-mobile-system"
EOF

chmod +x extract-all-grants-updated.sh

echo ""
echo "============================================"
echo "✅ All Extraction Scripts Updated!"
echo "============================================"
echo ""
echo "Created files:"
echo "- check-extraction-consistency.sh (validates script consistency)"
echo "- extract-all-grants-updated.sh (master extraction script)"
echo ""
echo "Next steps:"
echo "1. Run ./check-extraction-consistency.sh to validate updates"
echo "2. Run ./extract-all-grants-updated.sh to extract all grants with corrected references"
echo "3. Review extracted repositories for consistency"