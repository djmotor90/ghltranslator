#!/bin/bash

# GHL Translator Integration - Quick Setup Script
# This script automates the setup process

set -e

echo "🚀 GHL Translator Integration - Setup Script"
echo "=============================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION found"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm $NPM_VERSION found"
echo ""

# Check if .env exists
echo "✓ Checking configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "✓ Created .env - Please edit with your credentials"
    echo ""
    echo "You need to:"
    echo "1. Get GHL OAuth credentials from: https://app.gohighlevel.com/settings/api"
    echo "2. Edit .env file with GHL_CLIENT_ID and GHL_CLIENT_SECRET"
    echo "3. Set up MongoDB (local or MongoDB Atlas)"
    echo ""
    exit 1
fi

echo "✓ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Build project
echo "🔨 Building project..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Summary
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your GHL credentials"
echo "2. Make sure MongoDB is running"
echo "3. Run: npm run dev"
echo ""
echo "For more information, see:"
echo "  - GETTING_STARTED.md (quick start guide)"
echo "  - README.md (project overview)"
echo "  - MARKETPLACE.md (API documentation)"
echo ""
