#!/bin/bash

# Define variables
SERVER_IP="185.252.86.66"
SERVER_USER="root"  # Change this if you're using a different user
SERVER_PATH="/root/front"  # Change this to the path on your server

# Parse command line arguments
BUILD_FLAG=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -b|--build)
      BUILD_FLAG=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -b, --build    Build the application before deployment"
      echo "  -h, --help     Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      echo "Use -h or --help for usage information"
      exit 1
      ;;
  esac
done

# Display information
echo "Deploying to server at $SERVER_IP..."
echo "Local path: $(pwd)/.app/.output"
echo "Server path: $SERVER_PATH"
echo "Build flag: $BUILD_FLAG"

# Build the application if flag is set
if [ "$BUILD_FLAG" = true ]; then
    echo "Building the application..."
    cd .app && pnpm build && cd ..
    if [ $? -ne 0 ]; then
        echo "Build failed! Exiting..."
        exit 1
    fi
else
    echo "Skipping build (use -b or --build to enable building)"
    # Check if output directory exists
    if [ ! -d ".app/.output" ]; then
        echo "Error: .app/.output directory not found. Please build first or use -b flag."
        exit 1
    fi
fi

# Ensure the output directory exists on the server
echo "Stopping PM2 process..."
ssh $SERVER_USER@$SERVER_IP "pm2 stop front || echo \"No PM2 process to stop\""

echo "Cleaning up old output directory..."
ssh $SERVER_USER@$SERVER_IP "rm -rf $SERVER_PATH/.output"

echo "Creating output directory on server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_PATH/.output/server $SERVER_PATH/.output/public"

# Copy files in parallel for better performance
echo "Starting parallel file transfers..."

# Copy the build output to the server (server directory) in background
echo "Copying server directory..."
scp -r .app/.output/server/* $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/server/ &
SERVER_PID=$!

# Copy the build output to the server (public directory) in background
echo "Copying public directory..."
scp -r .app/.output/public/* $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/public/ &
PUBLIC_PID=$!

# Copy nitro.json in background
echo "Copying nitro.json..."
scp .app/.output/nitro.json $SERVER_USER@$SERVER_IP:$SERVER_PATH/.output/ &
NITRO_PID=$!

# Wait for all transfers to complete
echo "Waiting for file transfers to complete..."
wait $SERVER_PID
if [ $? -ne 0 ]; then
    echo "Error: Server directory transfer failed"
    exit 1
fi
echo "✓ Server directory transferred successfully"

wait $PUBLIC_PID
if [ $? -ne 0 ]; then
    echo "Error: Public directory transfer failed"
    exit 1
fi
echo "✓ Public directory transferred successfully"

wait $NITRO_PID
if [ $? -ne 0 ]; then
    echo "Error: nitro.json transfer failed"
    exit 1
fi
echo "✓ nitro.json transferred successfully"

echo "All file transfers completed successfully!"

# Create a restart script on the server
echo "Creating restart script on server..."
ssh $SERVER_USER@$SERVER_IP "cat > /root/restart_app.sh << 'EOL'
#!/bin/bash
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"  # This loads nvm
cd $SERVER_PATH
pm2 restart front || echo \"Failed to restart PM2 process\"
EOL
chmod +x /root/restart_app.sh"

# Execute the restart script
echo "Restarting PM2 process..."
ssh $SERVER_USER@$SERVER_IP "/root/restart_app.sh"

echo "Deployment completed successfully!"
