@echo off
setlocal enabledelayedexpansion

:: Tea Store Demo - Windows Start Script
:: This script installs dependencies and starts both backend and frontend

echo ========================================
echo    Tea Store Demo - Startup Script
echo ========================================
echo.

:: Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"

:: ============================================
:: Backend Setup
:: ============================================
echo [1/4] Setting up Backend...

cd /d "%SCRIPT_DIR%backend"

:: Create virtual environment if it doesn't exist
if not exist "venv" (
    echo   Creating Python virtual environment...
    python -m venv venv
)

:: Activate virtual environment and install dependencies
echo   Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -q -r requirements.txt

echo   [OK] Backend dependencies installed
echo.

:: ============================================
:: Frontend Setup
:: ============================================
echo [2/4] Setting up Frontend...

cd /d "%SCRIPT_DIR%frontend"

:: Install npm dependencies
echo   Installing npm dependencies...
call npm install --silent

echo   [OK] Frontend dependencies installed
echo.

:: ============================================
:: Start Backend
:: ============================================
echo [3/4] Starting Backend on port 8765...

cd /d "%SCRIPT_DIR%backend"
start "Tea Store Backend" cmd /c "call venv\Scripts\activate.bat && python main.py"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

echo   [OK] Backend starting at http://localhost:8765
echo.

:: ============================================
:: Start Frontend
:: ============================================
echo [4/4] Starting Frontend on port 4321...

cd /d "%SCRIPT_DIR%frontend"
start "Tea Store Frontend" cmd /c "npm run dev"

:: Wait for frontend to start
timeout /t 3 /nobreak >nul

echo   [OK] Frontend starting at http://localhost:4321
echo.

:: ============================================
:: Ready!
:: ============================================
echo ========================================
echo    All services are running!
echo ========================================
echo.
echo   Frontend: http://localhost:4321
echo   Backend:  http://localhost:8765
echo.
echo   Close the terminal windows to stop services
echo.

pause
