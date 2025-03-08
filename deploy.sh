#!/bin/bash

# Define variables
SERVER_IP="185.252.86.66"
SERVER_USER="root"  # Change this if you're using a different user
SERVER_PATH="/root/front"  # Change this to the path on your server

# Display information
echo "Deploying to server at $SERVER_IP..."
echo "Local path: $(pwd)/.app/.output"
echo "Server path: $SERVER_PATH"

# Ensure the output directory exists on the server
echo "Creating output directory on server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_PATH/.output"

# Copy the build output to the server (server directory)
echo "Copying server directory..."
scp -r .app/.output/server/* $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/server/

# Copy the build output to the server (public directory)
echo "Copying public directory..."
scp -r .app/.output/public/* $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/public/

# Copy nitro.json
echo "Copying nitro.json..."
scp .app/.output/nitro.json $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/

# Restart the PM2 process
echo "Restarting PM2 process..."
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && pm2 restart front"

echo "Deployment completed!"
