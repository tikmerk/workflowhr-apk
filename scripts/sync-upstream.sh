#!/bin/bash
# Sync Workflow HR codebase with upstream GitHub repository: https://github.com/tikmerk/workflowhr
set -e

REPO_URL="https://github.com/tikmerk/workflowhr"
BRANCH="main"

echo "=== Syncing Workflow HR with Upstream GitHub ==="
echo "Target Repo: $REPO_URL"
echo "Branch: $BRANCH"

TEMP_DIR=$(mktemp -d)
echo "Cloning latest commits to temporary directory: $TEMP_DIR"
git clone --depth 1 "$REPO_URL" "$TEMP_DIR"

echo "Syncing updated source and asset files..."
# Sync public/models, src, and config files without overriding server configuration
mkdir -p ./src ./public
cp -a "$TEMP_DIR/src/." ./src/
cp -a "$TEMP_DIR/public/." ./public/

if [ -f "$TEMP_DIR/firebase-blueprint.json" ]; then
  cp "$TEMP_DIR/firebase-blueprint.json" ./
fi

if [ -f "$TEMP_DIR/firestore.rules" ]; then
  cp "$TEMP_DIR/firestore.rules" ./
fi

rm -rf "$TEMP_DIR"

echo "Running type validation..."
npm run lint

echo "=== Sync Completed Successfully! ==="
