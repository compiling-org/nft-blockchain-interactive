const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Create a new keypair
const keypair = Keypair.generate();

console.log('Generated Solana Keypair:');
console.log('Public Key:', keypair.publicKey.toString());

// Create the secret key array
const secretKey = Array.from(keypair.secretKey);

// Create config directory
const configDir = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'solana');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Save the keypair
const keypairPath = path.join(configDir, 'id.json');
fs.writeFileSync(keypairPath, JSON.stringify(secretKey));

console.log('Keypair saved to:', keypairPath);
console.log('Public Key:', keypair.publicKey.toString());