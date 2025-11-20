@echo off
REM NEAR Fractal Studio Contract Redeploy Script (Windows)
REM Fixes deserialization by deploying to a fresh sub-account

echo 🚀 Redeploying NEAR Fractal Studio Contract to Fresh Account
echo.

REM Configuration
set CONTRACT_NAME=fractal-studio-v2.testnet
set MASTER_ACCOUNT=fractal-studio-final.testnet
set OWNER_ID=%MASTER_ACCOUNT%

REM Check near-cli
where near >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ near-cli not found. Install: npm install -g near-cli
    exit /b 1
)

REM Check Rust
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Rust not found. Install: https://rustup.rs/
    exit /b 1
)

echo 📋 Configuration:
echo   Contract: %CONTRACT_NAME%
echo   Owner:    %OWNER_ID%
echo.

REM Build contract
echo 🔨 Building contract...
cd grant-repositories\near-creative-engine\contracts\fractal-studio
cargo build --target wasm32-unknown-unknown --release

if not exist "target\wasm32-unknown-unknown\release\fractal_studio.wasm" (
    echo ❌ Build failed - WASM not found
    exit /b 1
)
echo ✅ Build successful
echo.

REM Create subaccount
echo 🏗️ Creating subaccount...
call near create-account %CONTRACT_NAME% --masterAccount %MASTER_ACCOUNT% --initialBalance 10
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Subaccount might already exist, continuing...
)
echo.

REM Deploy contract
echo 🚀 Deploying contract...
call near deploy %CONTRACT_NAME% --wasmFile target\wasm32-unknown-unknown\release\fractal_studio.wasm --accountId %MASTER_ACCOUNT%
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deploy failed
    exit /b 1
)
echo ✅ Deploy successful
echo.

REM Initialize contract
echo ⚙️ Initializing contract...
call near call %CONTRACT_NAME% new '{"owner_id":"%OWNER_ID%"}' --accountId %CONTRACT_NAME%
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Init failed
    exit /b 1
)
echo ✅ Init successful
echo.

REM Test metadata
echo 🧪 Testing metadata retrieval...
call near view %CONTRACT_NAME% nft_metadata
echo.

REM Test mint (requires deposit)
echo 🧪 Testing mint function...
call near call %CONTRACT_NAME% mint_fractal_nft ^
    '{"receiver_id":"%OWNER_ID%","session_data":{"emotion_arousal":0.7,"emotion_valence":0.3,"fractal_type":"mandelbrot","complexity_score":8.5,"duration_ms":5000,"ipfs_cid":"QmTest123","created_at":1234567890}}' ^
    --accountId %OWNER_ID% --deposit 0.1
echo.

REM Update frontend config
echo 📦 Updating frontend config...
cd ..\..\..\..
echo %CONTRACT_NAME% > near-contract-id.txt
echo ✅ Contract ID saved to near-contract-id.txt
echo.

echo 🎉 Redeploy complete!
echo 📍 New contract: %CONTRACT_NAME%
echo 🔧 Update test-website/index.html with this ID if needed
echo.

pause