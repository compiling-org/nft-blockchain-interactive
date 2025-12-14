const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3004;

// Enable CORS
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve the debug marketplace
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'debug-marketplace.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketplace demo server running' });
});

app.listen(PORT, () => {
  console.log(`🛒 Bitte Marketplace Demo Server running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} to see the working marketplace`);
  console.log(`✅ This bypasses all the React/crypto module issues`);
});