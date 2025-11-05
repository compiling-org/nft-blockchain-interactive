@echo off
echo ========================================
echo Starting Blockchain NFT Test Server
echo ========================================
echo.
echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Starting server on http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
node server.js
pause
