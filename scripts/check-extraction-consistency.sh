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
