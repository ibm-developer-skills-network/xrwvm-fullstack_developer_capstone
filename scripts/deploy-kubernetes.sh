#!/usr/bin/env bash
set -euo pipefail

kubectl apply -f deployment.yml
kubectl rollout status deployment/mongo-db --timeout=300s
kubectl rollout status deployment/dealership-api --timeout=300s
kubectl rollout status deployment/sentiment-analyzer --timeout=300s
kubectl rollout status deployment/dealership-web --timeout=300s
