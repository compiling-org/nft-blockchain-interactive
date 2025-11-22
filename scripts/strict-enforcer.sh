#!/bin/bash

# 🚨 STRICT ENFORCEMENT SCRIPT - ZERO TOLERANCE 🚨
# This script prevents destructive loops and fake behavior

set -euo pipefail

# RED FLAGS that trigger immediate termination
RED_FLAGS=(
    "✅.*COMPLETE"
    "✅.*WORKING" 
    "✅.*IMPLEMENTED"
    "mock.*data"
    "simulated.*results"
    "placeholder.*implementation"
    "comprehensive.*framework"
    "sophisticated.*architecture"
    "DONE ✅"
    "✅.*DONE"
    "✅.*Real"
    "✅.*Built"
)

# Function to check for red flags in files
check_red_flags() {
    local file="$1"
    for flag in "${RED_FLAGS[@]}"; do
        if grep -q "$flag" "$file" 2>/dev/null; then
            echo "🚨 RED FLAG DETECTED: $flag in $file"
            return 1
        fi
    done
    return 0
}

# Function to check if we're in a documentation loop
check_documentation_loop() {
    # Exclude node_modules and other irrelevant directories
    local docs_count=$(find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/target/*" | wc -l)
    local code_count=$(find ./src -name "*.ts" -o -name "*.tsx" -o -name "*.rs" | wc -l)
    
    if [ "$docs_count" -gt "$code_count" ]; then
        echo "🚨 DOCUMENTATION LOOP DETECTED: $docs_count docs vs $code_count code files"
        return 1
    fi
    return 0
}

# Function to check for fake completion claims
check_fake_completions() {
    if grep -r "✅.*Complete" . --include="*.md" --include="*.ts" --include="*.tsx" 2>/dev/null; then
        echo "🚨 FAKE COMPLETION CLAIMS DETECTED"
        return 1
    fi
    return 0
}

# Function to verify actual build status
verify_build() {
    if ! npm run build >/dev/null 2>&1; then
        echo "🚨 BUILD FAILURE - Code does not compile"
        return 1
    fi
    return 0
}

# Main enforcement logic
main() {
    echo "🔍 STRICT ENFORCEMENT CHECK STARTING..."
    
    # Check for red flags in key files
    for file in README.md docs/*.md src/**/*.ts src/**/*.tsx; do
        if [ -f "$file" ]; then
            if ! check_red_flags "$file"; then
                echo "❌ ENFORCEMENT FAILED: Remove false completion claims"
                exit 1
            fi
        fi
    done
    
    # Check for documentation loops
    if ! check_documentation_loop; then
        echo "❌ ENFORCEMENT FAILED: Stop creating documentation, build working code"
        exit 1
    fi
    
    # Check for fake completion claims
    if ! check_fake_completions; then
        echo "❌ ENFORCEMENT FAILED: Remove all ✅ symbols from incomplete features"
        exit 1
    fi
    
    # Verify build works
    if ! verify_build; then
        echo "❌ ENFORCEMENT FAILED: Fix compilation errors before claiming completion"
        exit 1
    fi
    
    echo "✅ ENFORCEMENT PASSED: Continue with real development"
}

# Run enforcement if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi