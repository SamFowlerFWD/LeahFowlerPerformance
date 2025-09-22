#!/bin/bash

# Simple deployment script for Leah Fowler Performance
# Run this after SSH'ing into your server as root

echo "Starting deployment..."

# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install required packages
apt install -y nginx git build-essential

# 4. Install PM2 globally
npm install -g pm2

# 5. Create app user
useradd -m -s /bin/bash leahfowler || echo "User exists"
usermod -aG sudo leahfowler

# 6. Clone repository as app user
su - leahfowler -c "git clone https://github.com/SamFowlerFWD/LeahFowlerPerformance.git ~/app"

# 7. Install dependencies
su - leahfowler -c "cd ~/app/leah-fowler-performance && npm install"

# 8. Build the application
su - leahfowler -c "cd ~/app/leah-fowler-performance && npm run build"

# 9. Create Nginx config
cat > /etc/nginx/sites-available/leahfowler <<'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 10. Enable site
ln -sf /etc/nginx/sites-available/leahfowler /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 11. Start application with PM2
su - leahfowler -c "cd ~/app/leah-fowler-performance && pm2 start npm --name 'leah-app' -- start"
su - leahfowler -c "pm2 save"
su - leahfowler -c "pm2 startup" | tail -1 | bash

echo "Deployment complete! Your app should be running on http://$HOSTNAME"
echo "Next steps:"
echo "1. Add your Supabase credentials to /home/leahfowler/app/leah-fowler-performance/.env.local"
echo "2. Restart the app: pm2 restart leah-app"