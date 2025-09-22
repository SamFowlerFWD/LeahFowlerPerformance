# Quick Deployment Steps for Leah Fowler Performance

## Step 1: Login to your VPS
```bash
ssh root@168.231.78.49
```
Enter your password when prompted.

## Step 2: Create and run the deployment script

Copy and paste these commands ONE AT A TIME:

```bash
# Download the deployment script
cat > deploy.sh << 'SCRIPT_END'
#!/bin/bash
set -e

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git build-essential

echo "Installing PM2..."
npm install -g pm2

echo "Creating application user..."
useradd -m -s /bin/bash leahfowler 2>/dev/null || echo "User exists"

echo "Cloning repository..."
su - leahfowler -c "git clone https://github.com/SamFowlerFWD/LeahFowlerPerformance.git ~/app"

echo "Installing dependencies..."
su - leahfowler -c "cd ~/app/leah-fowler-performance && npm install"

echo "Building application..."
su - leahfowler -c "cd ~/app/leah-fowler-performance && npm run build"

echo "Setting up Nginx..."
cat > /etc/nginx/sites-available/leahfowler << 'NGINX_END'
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
    }
}
NGINX_END

ln -sf /etc/nginx/sites-available/leahfowler /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

echo "Starting application..."
su - leahfowler -c "cd ~/app/leah-fowler-performance && pm2 start npm --name leah-app -- start"
su - leahfowler -c "pm2 save"

echo "DEPLOYMENT COMPLETE!"
echo "Your site is running at: http://168.231.78.49"
echo ""
echo "IMPORTANT: You need to add Supabase credentials!"
echo "Edit: /home/leahfowler/app/leah-fowler-performance/.env.local"
SCRIPT_END
```

## Step 3: Run the script
```bash
chmod +x deploy.sh
./deploy.sh
```

## Step 4: Add Supabase credentials

After deployment completes, create the environment file:

```bash
cat > /home/leahfowler/app/leah-fowler-performance/.env.local << 'ENV_END'
# Add your Supabase credentials here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site configuration
NEXT_PUBLIC_SITE_URL=http://168.231.78.49
NODE_ENV=production
ENV_END
```

Then edit it with your actual Supabase credentials:
```bash
nano /home/leahfowler/app/leah-fowler-performance/.env.local
```

## Step 5: Restart the application
```bash
su - leahfowler -c "cd ~/app/leah-fowler-performance && pm2 restart leah-app"
```

## Step 6: Check if everything is working
```bash
# Check if app is running
su - leahfowler -c "pm2 status"

# Check Nginx status
systemctl status nginx

# Check app logs
su - leahfowler -c "pm2 logs leah-app --lines 20"
```

## Troubleshooting

If you see any errors:

1. **Port already in use:**
   ```bash
   lsof -i :3000
   kill -9 [PID]
   ```

2. **Nginx errors:**
   ```bash
   nginx -t
   journalctl -u nginx -n 50
   ```

3. **App not starting:**
   ```bash
   su - leahfowler -c "cd ~/app/leah-fowler-performance && pm2 logs leah-app"
   ```

## Success!
Once running, your site will be available at:
- http://168.231.78.49

To point your domain later:
1. Update DNS A record to point to 168.231.78.49
2. Install SSL with: `certbot --nginx -d leahfowlerperformance.com`