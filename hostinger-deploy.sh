#!/bin/bash

# Hostinger VPS Deployment Script
# This will deploy the Leah Fowler Performance app to your Hostinger VPS

echo "==================================="
echo "Leah Fowler Performance Deployment"
echo "==================================="

# Test connection first
echo "Testing SSH connection..."
SSH_PORT="${SSH_PORT:-22}"
SSH_HOST="${SSH_HOST:-168.231.78.49}"
SSH_USER="${SSH_USER:-root}"

echo "Connecting to $SSH_USER@$SSH_HOST:$SSH_PORT"

# Function to run commands on remote server
remote_exec() {
    ssh -i /Users/samfowler/.ssh/leah-deployment-key -p $SSH_PORT $SSH_USER@$SSH_HOST "$1"
}

# Test connection
if remote_exec "echo 'Connection successful!'"; then
    echo "✓ SSH connection established"
else
    echo "✗ Failed to connect. Please check:"
    echo "  - SSH_PORT=$SSH_PORT"
    echo "  - SSH_HOST=$SSH_HOST"
    echo "  - SSH_USER=$SSH_USER"
    exit 1
fi

echo ""
echo "Starting deployment..."
echo ""

# Update system
echo "1. Updating system packages..."
remote_exec "apt-get update && apt-get upgrade -y"

# Install Node.js 20
echo "2. Installing Node.js 20..."
remote_exec "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"

# Install required packages
echo "3. Installing nginx, git, PM2..."
remote_exec "apt-get install -y nginx git build-essential && npm install -g pm2"

# Create application user
echo "4. Creating application user..."
remote_exec "useradd -m -s /bin/bash leahfowler 2>/dev/null || echo 'User exists'"

# Clone repository
echo "5. Cloning repository..."
remote_exec "su - leahfowler -c 'git clone https://github.com/SamFowlerFWD/LeahFowlerPerformance.git ~/app'"

# Install dependencies
echo "6. Installing dependencies..."
remote_exec "su - leahfowler -c 'cd ~/app/leah-fowler-performance && npm install'"

# Build application
echo "7. Building application..."
remote_exec "su - leahfowler -c 'cd ~/app/leah-fowler-performance && npm run build'"

# Configure nginx
echo "8. Configuring nginx..."
remote_exec "cat > /etc/nginx/sites-available/leahfowler << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

# Enable site
remote_exec "ln -sf /etc/nginx/sites-available/leahfowler /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && systemctl restart nginx"

# Start application with PM2
echo "9. Starting application with PM2..."
remote_exec "su - leahfowler -c 'cd ~/app/leah-fowler-performance && pm2 start npm --name leah-app -- start && pm2 save'"

# Setup PM2 startup
echo "10. Configuring PM2 startup..."
remote_exec "su - leahfowler -c 'pm2 startup' | tail -1 | bash -"

echo ""
echo "==================================="
echo "✓ DEPLOYMENT COMPLETE!"
echo "==================================="
echo ""
echo "Your application is now running at:"
echo "http://$SSH_HOST"
echo ""
echo "Next steps:"
echo "1. Add Supabase credentials to /home/leahfowler/app/leah-fowler-performance/.env.local"
echo "2. Restart the app: pm2 restart leah-app"
echo ""