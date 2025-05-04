#!/bin/bash

set -e

echo "📥 Pulling latest code..."
cd ~/Barter/barter-web
git pull origin main

cd ~/Barter/barter-api
git pull origin main

echo "🛠️ Rebuilding frontend (optional)..."
cd ~/Barter/barter-web
npm install
npm run build

echo "🛠️ Rebuilding backend (optional)..."
cd ~/Barter/barter-api
npm install
npm run build

echo "✅ Done at $(date)"
