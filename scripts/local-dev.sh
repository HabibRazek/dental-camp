#!/bin/bash

# ================================
# Dental Camp - Local Development Setup
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Dental Camp - Local Dev Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
        echo -e "${YELLOW}⚠ Please update .env with your credentials${NC}"
        exit 0
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ .env file exists${NC}"
echo ""

# Start Docker Compose
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run db:push

echo -e "${GREEN}✓ Database ready${NC}"
echo ""

# Show running containers
echo -e "${GREEN}Running containers:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup completed!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Application: ${GREEN}http://localhost:3000${NC}"
echo -e "Database: ${GREEN}postgresql://postgres:postgres@localhost:5432/dental_camp${NC}"
echo -e "Redis: ${GREEN}localhost:6379${NC}"
echo ""
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop: ${YELLOW}docker-compose down${NC}"
