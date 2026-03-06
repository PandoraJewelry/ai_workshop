#!/bin/bash

# Tea Store Demo - Start Script
# This script installs dependencies and starts both backend and frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Tea Store Demo - Startup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}Services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ============================================
# Backend Setup
# ============================================
echo -e "${YELLOW}[1/4] Setting up Backend...${NC}"

cd "$SCRIPT_DIR/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "  Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo -e "  Installing Python dependencies..."
source venv/bin/activate
pip install -q -r requirements.txt

echo -e "${GREEN}  ✓ Backend dependencies installed${NC}"

# ============================================
# Frontend Setup
# ============================================
echo -e "${YELLOW}[2/4] Setting up Frontend...${NC}"

cd "$SCRIPT_DIR/frontend"

# Install npm dependencies
echo -e "  Installing npm dependencies..."
npm install --silent

echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"

# ============================================
# Start Backend
# ============================================
echo -e "${YELLOW}[3/4] Starting Backend on port 8765...${NC}"

cd "$SCRIPT_DIR/backend"
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Check if backend is running
if curl -s http://localhost:8765/api/products > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend running at http://localhost:8765${NC}"
else
    echo -e "${RED}  ✗ Backend failed to start${NC}"
    exit 1
fi

# ============================================
# Start Frontend
# ============================================
echo -e "${YELLOW}[4/4] Starting Frontend on port 4321...${NC}"

cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo -e "${GREEN}  ✓ Frontend running at http://localhost:4321${NC}"

# ============================================
# Ready!
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   All services are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC} http://localhost:4321"
echo -e "  ${BLUE}Backend:${NC}  http://localhost:8765"
echo ""
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop all services"
echo ""

# Keep script running
wait
