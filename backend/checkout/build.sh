#!/bin/bash
set -e

CHECKOUT_DIR="$(pwd)"

# Build the checkout frontend
cd ../../frontend/paygo/
yarn build
cd $CHECKOUT_DIR

# Cleanup previous build folder and copy new one over
mkdir -p app/public/ && rm -rf app/public/*
cp -R ../../frontend/paygo/build/* app/public/

# Build the checkout app
go build .
