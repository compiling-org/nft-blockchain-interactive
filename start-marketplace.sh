#!/bin/bash

# Script to start the test marketplace frontend
echo "🚀 Starting Test Marketplace Frontend"
echo "==================================="

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python to serve the frontend."
    exit 1
fi

# Check if the frontend directory exists
if [ ! -d "marketplace-frontend" ]; then
    echo "❌ Marketplace frontend directory not found."
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Start the web server
echo "📁 Serving files from: marketplace-frontend/"
echo "🌐 Server address: http://localhost:8000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

cd marketplace-frontend
$PYTHON_CMD -m http.server 8000