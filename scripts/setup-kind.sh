#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${KIND_CLUSTER_NAME:-dealership-cluster}"

if ! kind get clusters | grep -qx "$CLUSTER_NAME"; then
  kind create cluster --name "$CLUSTER_NAME"
fi

kubectl cluster-info --context "kind-$CLUSTER_NAME"

docker build -t nodeapp:latest ./server/database
docker build -t sentiment-analyzer:latest ./server/djangoapp/microservices
docker build -t dealership-web:latest ./server

kind load docker-image nodeapp:latest --name "$CLUSTER_NAME"
kind load docker-image sentiment-analyzer:latest --name "$CLUSTER_NAME"
kind load docker-image dealership-web:latest --name "$CLUSTER_NAME"
