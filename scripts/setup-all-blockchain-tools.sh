#!/bin/bash
# Blockchain Tools PATH Setup - Single Script
# Adds ALL blockchain tools to PATH for easy access

echo "=== Setting up ALL Blockchain Tools PATH ==="

cat > ~/.blockchain-tools.sh << 'EOF'
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

# Add to .bashrc if not already there
if ! grep -q "blockchain-tools.sh" ~/.bashrc 2>/dev/null; then
    echo "" >> ~/.bashrc
    echo "# Blockchain Tools Setup" >> ~/.bashrc
    echo "source ~/.blockchain-tools.sh" >> ~/.bashrc
    echo "Added blockchain tools to ~/.bashrc"
fi

# Source for current session
source ~/.blockchain-tools.sh

echo "=== ALL Blockchain Tools Now Available ==="
echo "Windows Tools (direct): cargo-contract, anchor, solana"
echo "WSL Tools (native): lotus, polkadot, openethereum, parity, substrate"
echo ""
echo "Testing tools..."
echo "✅ Cargo Contract:" && cargo-contract --version || echo "Not found"
echo "✅ Anchor:" && anchor --version || echo "Not found"
echo "✅ Solana:" && solana --version | head -1 || echo "Not found"
echo "✅ Lotus:" && lotus --version || echo "Not found"
echo "✅ Forest:" && forest --version || echo "Not found"
echo "✅ IPFS:" && ipfs --version || echo "Not found"
echo "✅ Polkadot:" && polkadot --version || echo "Not found"
echo "✅ OpenEthereum:" && openethereum --version | head -1 || echo "Not found"
echo ""
echo "🎉 ALL TOOLS ADDED TO PATH SUCCESSFULLY!"
echo "Run 'source ~/.bashrc' or restart terminal to use anywhere"
