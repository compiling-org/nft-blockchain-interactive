// Generate a valid Solana program ID
const { Keypair } = require('@solana/web3.js');

// Generate a new keypair for the program
const programKeypair = Keypair.generate();

console.log('Generated Solana Program Keypair:');
console.log('Public Key (Program ID):', programKeypair.publicKey.toString());
console.log('Secret Key (Base64):', Buffer.from(programKeypair.secretKey).toString('base64'));

// Save for deployment
const fs = require('fs');
fs.writeFileSync('solana-program-keypair.json', JSON.stringify(Array.from(programKeypair.secretKey)));

console.log('\n✅ Program keypair saved to solana-program-keypair.json');
console.log('📋 Use this Program ID in your frontend:', programKeypair.publicKey.toString());