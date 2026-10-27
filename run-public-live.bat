@echo off
title Lookman App - Public Live Server
echo ========================================================
echo        LOOKMAN DISTRIBUTION - PUBLIC LIVE SERVER
echo ========================================================
echo.
echo 1. Starting Backend Server...
start /b cmd /c "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul

echo 2. Launching Cloudflare Public Live Tunnel...
echo.
echo ========================================================
echo Your website will be publicly accessible worldwide!
echo Check the URL below once connection completes:
echo ========================================================
echo.
"%~dp0cloudflared.exe" tunnel --url http://localhost:5000
pause
