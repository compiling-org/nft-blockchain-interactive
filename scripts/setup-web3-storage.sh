#!/bin/bash

# Web3.Storage Setup Script
# This script helps set up real Web3.Storage for IPFS uploads

echo "🌐 Web3.Storage Setup for Real IPFS Uploads"
echo "=========================================="

# Check if Web3.Storage token is already set
if [ -n "$WEB3_STORAGE_TOKEN" ]; then
    echo "✅ Web3.Storage token already configured"
    echo "Token: ${WEB3_STORAGE_TOKEN:0:10}..."
else
    echo "❌ No Web3.Storage token found"
    echo ""
    echo "To enable real IPFS uploads:"
    echo "1. Sign up at https://web3.storage"
    echo "2. Create a new API token"
    echo "3. Set the environment variable:"
    echo "   export WEB3_STORAGE_TOKEN='your-token-here'"
    echo ""
    echo "Alternatively, create a .env file with:"
    echo "WEB3_STORAGE_TOKEN=your-token-here"
fi

# Test the Web3.Storage integration
echo ""
echo "🧪 Testing Web3.Storage integration..."
node test-web3storage.js

echo ""
echo "📊 Web3.Storage Status:"
if [ -n "$WEB3_STORAGE_TOKEN" ]; then
    echo "✅ Real IPFS uploads enabled"
    echo "📤 Files will be stored on IPFS/Filecoin network"
    echo "🔗 Content will be accessible via IPFS gateways"
else
    echo "⚠️  Using fallback mode (mocked CIDs)"
    echo "💡 Set WEB3_STORAGE_TOKEN for real uploads"
fi