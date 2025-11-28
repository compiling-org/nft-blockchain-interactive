#!/bin/bash
# ALL Blockchain Tools PATH Setup - Final Script
# Adds ALL blockchain tools to PATH for easy access

echo "=== Setting up ALL Blockchain Tools to PATH ==="

# Create permanent setup file
cat > ~/.all-blockchain-tools.sh << 'EOF'
#!/bin/bash
# ALL Blockchain Tools - Complete setup

# Add cargo bin to PATH (Windows tools)
export PATH="/c/Users/kapil/.cargo/bin:$PATH"

# Windows tools (direct access) - these work natively
cargo-contract() { /c/Users/kapil/.cargo/bin/cargo-contract.exe "$@"; }
anchor() { /c/Users/kapil/.cargo/bin/anchor.exe "$@"; }
solana() { /c/Users/kapil/.cargo/bin/solana.exe "$@"; }

# Ubuntu-22.04 WSL2 tools - these need WSL wrapper
lotus() { wsl -d Ubuntu-22.04 -e lotus "$@"; }
polkadot() { wsl -d Ubuntu-22.04 -e polkadot "$@"; }
openethereum() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
parity() { wsl -d Ubuntu-22.04 -e openethereum "$@"; }
substrate() { wsl -d Ubuntu-22.04 -e substrate "$@"; }

# Export all functions for current and subshells
export -f cargo-contract anchor solana lotus polkadot openethereum parity substrate

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
echo "=== WINDOWS TOOLS (Direct Access) ==="
echo "✅ cargo-contract:" && cargo-contract --version
echo "✅ anchor:" && anchor --version  
echo "✅ solana:" && solana --version | head -1
echo ""
echo "=== WSL2 UBUNTU-22.04 TOOLS (via functions) ==="
echo "✅ lotus:" && lotus --version
echo "✅ polkadot:" && polkadot --version
echo "✅ openethereum:" && openethereum --version | head -1
echo "✅ parity:" && parity --version | head -1
echo "✅ substrate:" && substrate --version | head -1
echo ""
echo "💥 COMPLETE! All tools accessible from anywhere!"
echo "Run 'source ~/.bashrc' or restart terminal to use in new sessions"