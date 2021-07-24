#!/bin/bash
set -e

CHECKOUT_DIR="$(pwd)"

# Build the checkout app
go build .

# Build the checkout frontend
cd ../../frontend/paygo/
yarn build
cd $CHECKOUT_DIR

# Remove previous build folder
rm -rf build && mkdir -p build/www/

# Copy out the backend binary and the build folder
mv checkout build/
cp -R ../../frontend/paygo/build/* build/www/
