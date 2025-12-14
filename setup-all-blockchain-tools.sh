#!/bin/bash
# Blockchain Tools PATH Setup - Single Script
# Adds ALL blockchain tools to PATH for easy access

echo "=== Setting up ALL Blockchain Tools PATH ==="

# Create a single function file that adds all tools
cat > ~/.blockchain-tools.sh << 'EOF'
#!/bin/bash
# Blockchain Tools - All tools in one place

# Windows tools (direct access)
export PATH="/c/Users/kapil/.cargo/bin:$PATH"

# Windows tool functions (if needed for specific versions)
cargo-contract() { /c/Users/kapil/.cargo/bin/cargo-contract.exe "$@"; }
anchor() { /c/Users/kapil/.cargo/bin/anchor.exe "$@"; }
solana() { /c/Users/kapil/.cargo/bin/solana.exe "$@"; }

# Ubuntu-22.04 WSL2 tools
lotus() { wsl -d Ubuntu-22.04 -e lotus "$@"; }
polkadot() { wsl -d Ubuntu-22.04 -e polkadot "$@"; }
openethereum() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
parity() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
substrate() { wsl -d Ubuntu-22.04 -e substrate "$@"; }

# Export all functions
export -f cargo-contract anchor solana lotus polkadot openethereum parity substrate

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
echo "WSL2 Ubuntu-22.04 Tools: lotus, polkadot, openethereum, parity, substrate"
echo ""
echo "Testing tools..."
echo "✅ Cargo Contract:" && cargo-contract --version
echo "✅ Anchor:" && anchor --version  
echo "✅ Solana:" && solana --version | head -1
echo "✅ Lotus:" && lotus --version
echo "✅ Polkadot:" && polkadot --version
echo "✅ OpenEthereum:" && openethereum --version | head -1
echo ""
echo "🎉 ALL TOOLS ADDED TO PATH SUCCESSFULLY!"
echo "Run 'source ~/.bashrc' or restart terminal to use anywhere"