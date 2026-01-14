# Web3.Storage Integration Guide

## Quick Setup for Real IPFS Uploads

### 1. Get Your Web3.Storage Token
1. Visit https://web3.storage
2. Sign up for a free account
3. Create a new API token
4. Copy your token

### 2. Configure Your Environment
Choose one of these methods:

**Option A: Environment Variable**
```bash
export WEB3_STORAGE_TOKEN="your-token-here"
```

**Option B: .env File**
Create a `.env` file in the project root:
```
WEB3_STORAGE_TOKEN=your-token-here
```

**Option C: Direct Configuration**
Add to your frontend config:
```typescript
window.WEB3_STORAGE_TOKEN = "your-token-here";
```

### 3. Test Your Integration
Run the test script:
```bash
node test-web3storage.js
```

### 4. Verify Real Uploads
When properly configured, you should see:
- ✅ Real IPFS CIDs returned
- 🔗 Content accessible via IPFS gateways
- 📊 Upload progress indicators
- 💾 Permanent Filecoin storage

### 5. Monitor Usage
Check your Web3.Storage dashboard for:
- Upload statistics
- Storage usage
- Bandwidth consumption
- Content accessibility

## Fallback Behavior
Without a token, the system will:
- Generate realistic mock CIDs
- Simulate upload progress
- Return test data for development
- Log clear instructions for token setup

## Production Deployment
For production applications:
1. Use environment variables for tokens
2. Implement retry logic for failed uploads
3. Add content validation before upload
4. Monitor upload success rates
5. Set up backup storage strategies