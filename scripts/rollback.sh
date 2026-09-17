#!/bin/bash

# ================================
# Dental Camp - Rollback Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="${NAMESPACE:-dental-camp}"
DEPLOYMENT="dental-camp-app"

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Dental Camp Rollback Script${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Show rollout history
echo -e "${GREEN}Rollout History:${NC}"
kubectl rollout history deployment/${DEPLOYMENT} -n ${NAMESPACE}
echo ""

# Ask for confirmation
read -p "Do you want to rollback to the previous version? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Rollback cancelled${NC}"
    exit 0
fi

# Perform rollback
echo -e "${YELLOW}Rolling back deployment...${NC}"
kubectl rollout undo deployment/${DEPLOYMENT} -n ${NAMESPACE}

# Wait for rollout to complete
echo -e "${YELLOW}Waiting for rollback to complete...${NC}"
kubectl rollout status deployment/${DEPLOYMENT} -n ${NAMESPACE}

# Show current status
echo ""
echo -e "${GREEN}Current Status:${NC}"
kubectl get pods -n ${NAMESPACE}

echo ""
echo -e "${GREEN}Rollback completed successfully!${NC}"
