#!/bin/bash

echo "=== COMPLETE BLOCKCHAIN TOOLS MASSACRE REPORT ==="
echo ""
echo "FOUND COMPLETE DISASTER:"
echo ""

echo "1. ANCHOR TOOLS:"
echo "   - anchor-attribute versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "anchor-attribute" | wc -l)"
echo "   - anchor-cli versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "anchor-cli" | wc -l)"
echo "   - anchor-client versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "anchor-client" | wc -l)"
echo "   - anchor-lang versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "anchor-lang" | wc -l)"
echo "   - anchor-syn versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "anchor-syn" | wc -l)"
echo ""

echo "2. SOLANA TOOLS:"
echo "   - solana-* packages: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "solana-" | wc -l)"
echo "   - solana-account-decoder versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "solana-account-decoder" | wc -l)"
echo "   - solana-clap-utils versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "solana-clap-utils" | wc -l)"
echo "   - solana-cli versions: $(ls /c/Users/kapil/.cargo/registry/src/index.crates.io-*/ | grep "sol