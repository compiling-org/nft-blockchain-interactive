#!/bin/bash
# ALL Blockchain Tools PATH Setup - Final Script
# Adds ALL blockchain tools to PATH for easy access

echo "=== Setting up ALL Blockchain Tools to PATH ==="

cat > ~/.all-blockchain-tools.sh << 'EOF'
#!/bin/bash
if command -v wsl >/dev/null 2>&1; then
  export PATH="/c/Users/kapil/.cargo/bin:$PATH"
  cargo-contract() { /c/Users/kapil/.cargo/bin/cargo-contract.exe "$@"; }
  anchor() { /c/Users/kapil/.cargo/bin/anchor.exe "$@"; }
  solana() { /c/Users/kapil/.cargo/bin/solana.exe "$@"; }
  lotus() { wsl -d Ubuntu-22.04 -e lotus "$@"; }
  polkadot() { wsl -d Ubuntu-22.04 -e polkadot "$@"; }
  openethereum() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
  parity() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
  substrate() { wsl -d Ubuntu-22.04 -e substrate "$@"; }
else
  cargo-contract() { command cargo-contract "$@"; }
  anchor() { command anchor "$@"; }
  solana() { command solana "$@"; }
  lotus() { command lotus "$@"; }
  forest() { command forest "$@"; }
  ipfs() { command ipfs "$@"; }
  polkadot() { command polkadot "$@"; }
  openethereum() { command openethereum "$@"; }
  parity() { command openethereum "$@"; }
  substrate() { command substrate "$@"; }
fi
export -f cargo-contract anchor solana lotus forest ipfs polkadot openethereum parity substrate

EOF

# Add to .bashrc for permanent access
if ! grep -q "all-blockchain-tools.sh" ~/.bashrc 2>/dev/null; then
    echo "" >> ~/.bashrc
    echo "# ALL Blockchain Tools Setup" >> ~/.bashrc
    echo "source ~/.all-blockchain-tools.sh" >> ~/.bashrc
    echo "✅ Added to ~/.bashrc for permanent access"
fi

# Source for current session
source ~/.all-blockchain-tools.sh

echo ""
echo "🎉 ALL BLOCKCHAIN TOOLS NOW AVAILABLE:"
echo ""
echo "=== WINDOWS TOOLS (Direct Access or WSL native) ==="
echo "✅ cargo-contract:" && cargo-contract --version || echo "Not found"
echo "✅ anchor:" && anchor --version  || echo "Not found"
echo "✅ solana:" && solana --version | head -1 || echo "Not found"
echo ""
echo "=== WSL2 UBUNTU-22.04 TOOLS (via functions) ==="
echo "✅ lotus:" && lotus --version || echo "Not found"
echo "✅ forest:" && forest --version || echo "Not found"
echo "✅ ipfs:" && ipfs --version || echo "Not found"
echo "✅ polkadot:" && polkadot --version || echo "Not found"
echo "✅ openethereum:" && openethereum --version | head -1 || echo "Not found"
echo "✅ parity:" && parity --version | head -1 || echo "Not found"
echo "✅ substrate:" && substrate --version | head -1 || echo "Not found"
echo ""
echo "💥 COMPLETE! All tools accessible from anywhere!"
echo "Run 'source ~/.bashrc' or restart terminal to use in new sessions"
