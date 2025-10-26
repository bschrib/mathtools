#!/bin/bash

# Math Tools Deployment Script
# This script builds and deploys the math tools to Cloudflare Pages

echo "🚀 Starting Math Tools deployment..."

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the static site
echo "🔨 Building static site..."
npm run build:static

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed! No 'out' directory found."
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Static files are ready in the 'out' directory"

# Deploy using Wrangler (if installed)
if command -v wrangler &> /dev/null; then
    echo "🌐 Deploying to Cloudflare Pages..."
    wrangler pages deploy out
else
    echo "⚠️  Wrangler CLI not found. Please install it with:"
    echo "   npm install -g wrangler"
    echo ""
    echo "Or deploy manually:"
    echo "1. Go to Cloudflare Dashboard → Pages"
    echo "2. Create a new project"
    echo "3. Upload the 'out' directory"
fi

echo "🎉 Deployment process completed!"