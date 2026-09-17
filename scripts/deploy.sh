#!/bin/bash

# ================================
# Dental Camp - Deployment Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="${NAMESPACE:-dental-camp}"
ENVIRONMENT="${ENVIRONMENT:-production}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Dental Camp Deployment Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Namespace: ${YELLOW}${NAMESPACE}${NC}"
echo -e "Image Tag: ${YELLOW}${IMAGE_TAG}${NC}"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check if cluster is accessible
echo -e "${YELLOW}Checking cluster connection...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected to cluster${NC}"

# Create namespace if it doesn't exist
echo -e "${YELLOW}Creating namespace...${NC}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace ready${NC}"

# Apply ConfigMap
echo -e "${YELLOW}Applying ConfigMap...${NC}"
kubectl apply -f k8s/configmap.yaml -n ${NAMESPACE}
echo -e "${GREEN}✓ ConfigMap applied${NC}"

# Apply Secrets (make sure to create secrets first)
if [ -f "k8s/secrets-sealed.yaml" ]; then
    echo -e "${YELLOW}Applying Secrets...${NC}"
    kubectl apply -f k8s/secrets-sealed.yaml -n ${NAMESPACE}
    echo -e "${GREEN}✓ Secrets applied${NC}"
else
    echo -e "${YELLOW}⚠ No sealed secrets found, make sure secrets are configured manually${NC}"
fi

# Apply Deployment
echo -e "${YELLOW}Applying Deployment...${NC}"
kubectl apply -f k8s/deployment.yaml -n ${NAMESPACE}
echo -e "${GREEN}✓ Deployment applied${NC}"

# Apply Service
echo -e "${YELLOW}Applying Service...${NC}"
kubectl apply -f k8s/service.yaml -n ${NAMESPACE}
echo -e "${GREEN}✓ Service applied${NC}"

# Apply Ingress
echo -e "${YELLOW}Applying Ingress...${NC}"
kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}
echo -e "${GREEN}✓ Ingress applied${NC}"

# Apply HPA
echo -e "${YELLOW}Applying HorizontalPodAutoscaler...${NC}"
kubectl apply -f k8s/hpa.yaml -n ${NAMESPACE}
echo -e "${GREEN}✓ HPA applied${NC}"

# Wait for deployment to be ready
echo -e "${YELLOW}Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/dental-camp-app -n ${NAMESPACE}
echo -e "${GREEN}✓ Deployment is ready${NC}"

# Get deployment status
echo ""
echo -e "${GREEN}Deployment Status:${NC}"
kubectl get pods -n ${NAMESPACE}
echo ""
kubectl get services -n ${NAMESPACE}
echo ""
kubectl get ingress -n ${NAMESPACE}

# Run health check
echo ""
echo -e "${YELLOW}Running health check...${NC}"
INGRESS_IP=$(kubectl get ingress dental-camp-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -z "$INGRESS_IP" ]; then
    INGRESS_IP=$(kubectl get ingress dental-camp-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
fi

if [ -n "$INGRESS_IP" ]; then
    echo -e "Ingress IP/Hostname: ${GREEN}${INGRESS_IP}${NC}"
    if curl -f "http://${INGRESS_IP}/api/health" &> /dev/null; then
        echo -e "${GREEN}✓ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠ Health check failed, but deployment continued${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Could not determine ingress IP${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
