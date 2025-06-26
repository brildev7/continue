#!/usr/bin/env bash

# Build VS Code extension package and copy it to a debug directory for local installation.
# Usage: ./scripts/build-vscode-package.sh [--install]
#   --install : If supplied, the script will attempt to install the generated .vsix using the `code` CLI.
#
# This script must be run from the repository root.
set -euo pipefail

# Constants
EXTENSION_DIR="extensions/vscode"
OUTPUT_DIR="$EXTENSION_DIR/build"
# DEBUG_DIR="$OUTPUT_DIR/debug"

# Ensure we are in the project root by checking for the extension directory
if [[ ! -d "$EXTENSION_DIR" ]]; then
  echo "Error: Cannot find $EXTENSION_DIR. Please run this script from the project root." >&2
  exit 1
fi

# Install dependencies & build the VSIX
pushd "$EXTENSION_DIR" > /dev/null

# Use npm ci if node_modules is absent, otherwise npm install is a quick no-op update
if [[ ! -d node_modules ]]; then
  echo "Installing dependencies (npm ci)…"
  npm ci
fi

echo "Packaging VS Code extension using vsce…"
# The `package` script places the .vsix inside $OUTPUT_DIR
npm run package

popd > /dev/null

# Find the newest .vsix that was just produced
VSIX_PATH=$(ls -t "$OUTPUT_DIR"/continue-*.vsix | head -n1)

if [[ -z "$VSIX_PATH" ]]; then
  echo "Error: Failed to locate generated .vsix in $OUTPUT_DIR" >&2
  exit 1
fi

echo "Generated VSIX: $VSIX_PATH"

# Create debug directory and copy package there
# mkdir -p "$DEBUG_DIR"
# cp "$VSIX_PATH" "$DEBUG_DIR/"
# DEBUG_VSIX_PATH="$DEBUG_DIR/$(basename "$VSIX_PATH")"

# echo "Copied VSIX to $DEBUG_VSIX_PATH"

echo "Build complete."

# Optional local installation
if [[ "${1:-}" == "--install" ]]; then
  if command -v code >/dev/null 2>&1; then
    echo "Installing extension using 'code --install-extension'…"
    code --install-extension "$DEBUG_VSIX_PATH"
  else
    echo "Warning: VS Code CLI 'code' not found in PATH. Skipping installation." >&2
  fi
fi 