@echo off
title CipherBenz Cybersecurity Command Center
cd /d "%~dp0"

echo ========================================================
echo  LAUNCHING CIPHERBENZ COMMAND CENTER
echo  Operator: Athulyanath (@CipherBenz)
echo  Endpoint: http://localhost:8080
echo ========================================================

start http://localhost:8080
python serve.py

if %ERRORLEVEL% NEQ 0 (
    echo Python not found. Opening index.html directly in browser...
    start index.html
)
pause
