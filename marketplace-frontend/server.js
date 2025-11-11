// Simple local server for testing the marketplace frontend
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎨 Marketplace Frontend Test Server');
    console.log('='.repeat(60));
    console.log(`\n✅ Server running at http://localhost:${PORT}/`);
    console.log('\n📋 Available Modules:');
    console.log('  - WGSL Studio with WebGPU');
    console.log('  - Node-based Shader Editor');
    console.log('  - NFT Minting Interface');
    console.log('  - Blockchain Integration');
    console.log('\n🚀 Press Ctrl+C to stop the server');
    console.log('='.repeat(60));
});