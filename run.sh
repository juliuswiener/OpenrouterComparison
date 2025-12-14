#!/usr/bin/env bash
set -e

# OpenRouter Dashboard - Run Script

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting OpenRouter Dashboard...${NC}"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${BLUE}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Install/upgrade dependencies
echo -e "${BLUE}📥 Installing dependencies...${NC}"
pip install -q -r requirements.txt

# Run the server
echo -e "${GREEN}✨ Starting Flask server...${NC}"
python3 server.py
