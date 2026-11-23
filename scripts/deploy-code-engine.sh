#!/usr/bin/env bash
set -euo pipefail

: "${IBM_CLOUD_API_KEY:?IBM_CLOUD_API_KEY is required}"
: "${IBM_CODE_ENGINE_PROJECT:?IBM_CODE_ENGINE_PROJECT is required}"

REGION="${IBM_CLOUD_REGION:-eu-es}"
RESOURCE_GROUP="${IBM_CLOUD_RESOURCE_GROUP:-Default}"
APP_NAME="${SENTIMENT_APP_NAME:-sentiment-analyzer}"
IMAGE="${SENTIMENT_IMAGE:-icr.io/codeengine/sentiment-analyzer:latest}"

ibmcloud login --apikey "$IBM_CLOUD_API_KEY" -r "$REGION" -g "$RESOURCE_GROUP"
ibmcloud plugin install code-engine -f
ibmcloud ce project select --name "$IBM_CODE_ENGINE_PROJECT"

if ibmcloud ce application get --name "$APP_NAME" >/dev/null 2>&1; then
  ibmcloud ce application update --name "$APP_NAME" --image "$IMAGE" --port 5050 --cpu 0.25 --memory 0.5G
else
  ibmcloud ce application create --name "$APP_NAME" --image "$IMAGE" --port 5050 --cpu 0.25 --memory 0.5G
fi

ibmcloud ce application get --name "$APP_NAME" --output url
