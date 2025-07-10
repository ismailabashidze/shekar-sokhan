#!/bin/bash

# Optimized build script for faster builds
echo "🚀 Starting optimized build process..."

# Set production environment
export NODE_ENV=production

# Increase memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=6144 --no-deprecation"

# Enable parallel processing
export UV_THREADPOOL_SIZE=128

# Clean previous builds
echo "🧹 Cleaning previous builds..."
pnpm run clean

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install --frozen-lockfile
fi

# Pre-build optimization
echo "⚡ Pre-optimizing dependencies..."
pnpm nuxt prepare

# Run the build
echo "🔨 Building application..."
time pnpm nuxt build

echo "✅ Build completed successfully!" 