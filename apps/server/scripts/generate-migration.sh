#!/bin/bash
# Migration Generator Script
# Usage: ./scripts/generate-migration.sh

cd "$(dirname "$0")/.." || exit 1

echo "🔄 Building migration generator..."
go build -o bin/gen-migration ./cmd/gen-migration

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    echo "🚀 Running migration generator..."
    ./bin/gen-migration
else
    echo "❌ Build failed"
    exit 1
fi

