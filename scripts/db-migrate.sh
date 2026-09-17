#!/bin/bash

# ================================
# Dental Camp - Database Migration Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Database Migration Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL environment variable is not set${NC}"
    exit 1
fi

echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma db push

echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

# Optional: Seed database
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "prisma/seed.ts" ]; then
        echo -e "${YELLOW}Seeding database...${NC}"
        npx tsx prisma/seed.ts
        echo -e "${GREEN}✓ Database seeded${NC}"
    else
        echo -e "${YELLOW}⚠ No seed file found${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Database migration completed successfully!${NC}"
