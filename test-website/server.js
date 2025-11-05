// Simple local server for testing the blockchain NFT interactive website
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

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
    console.log('🧠⛓️  Blockchain NFT Interactive Test Server');
    console.log('='.repeat(60));
    console.log(`\n✅ Server running at http://localhost:${PORT}/`);
    console.log('\n📋 Available Test Modules:');
    console.log('  - Fractal Studio (NEAR Grant)');
    console.log('  - NUWE/MODURUST Marketplace (Mintbase Grant)');
    console.log('  - Neuroemotive AI (Solana Grant)');
    console.log('  - IPFS/Filecoin Storage');
    console.log('  - DAO Governance with Emotional Voting');
    console.log('  - Soulbound Tokens (Polkadot)');
    console.log('  - Biometric Testing (EEG/BMI Integration)');
    console.log('\n🚀 Press Ctrl+C to stop the server');
    console.log('='.repeat(60));
});
