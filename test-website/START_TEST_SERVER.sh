#!/bin/bash

echo "========================================"
echo "Starting Blockchain NFT Test Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found!"
echo ""
echo "Starting server on http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node server.js
