# Leah Fowler Performance - VPS Deployment Guide

## Server Access Required

To deploy the application, you need SSH access to the server at `168.231.78.49`.

### Option 1: Password Authentication
```bash
ssh root@168.231.78.49
# Enter root password when prompted
```

### Option 2: SSH Key Authentication
```bash
# Add your SSH key to the server first
ssh-copy-id root@168.231.78.49
# Then connect
ssh root@168.231.78.49
```

## Automated Deployment

Once you have SSH access, run the deployment script:

```bash
# 1. Copy the deployment script to the server
scp deploy-to-vps.sh root@168.231.78.49:/root/

# 2. Connect to the server
ssh root@168.231.78.49

# 3. Make the script executable
chmod +x /root/deploy-to-vps.sh

# 4. Run the deployment
/root/deploy-to-vps.sh
```

## Manual Deployment Steps

If you prefer manual deployment or need to troubleshoot:

### 1. Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential
```

### 2. Security Configuration

```bash
# Setup firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Install and configure fail2ban
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Install Node.js

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node -v
npm -v
```

### 4. Install Nginx

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx
```

### 5. Install PM2

```bash
npm install -g pm2
```

### 6. Create Application User

```bash
# Create user
useradd -m -s /bin/bash leahfowler
usermod -aG sudo leahfowler

# Setup SSH for user (copy root's authorized_keys)
mkdir -p /home/leahfowler/.ssh
cp /root/.ssh/authorized_keys /home/leahfowler/.ssh/
chown -R leahfowler:leahfowler /home/leahfowler/.ssh
chmod 700 /home/leahfowler/.ssh
chmod 600 /home/leahfowler/.ssh/authorized_keys
```

### 7. Clone and Setup Application

```bash
# Switch to app user
su - leahfowler

# Clone repository
git clone https://github.com/SamFowlerFWD/LeahFowlerPerformance.git leah-fowler-performance
cd leah-fowler-performance

# Install dependencies
npm ci --production=false

# Create environment file (see below for contents)
nano .env.local

# Build the application
npm run build

# Exit back to root
exit
```

### 8. Configure Nginx

Create `/etc/nginx/sites-available/leahfowlerperformance.com`:

```nginx
server {
    listen 80;
    server_name leahfowlerperformance.com www.leahfowlerperformance.com;

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
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/leahfowlerperformance.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 9. Setup PM2

```bash
# As app user
su - leahfowler
cd leah-fowler-performance

# Start with PM2
pm2 start npm --name "leah-fowler-performance" -- start
pm2 save

# Setup startup script (as root)
pm2 startup systemd -u leahfowler --hp /home/leahfowler
```

### 10. SSL Certificate

```bash
certbot --nginx -d leahfowlerperformance.com -d www.leahfowlerperformance.com
```

## Environment Variables

Create `/home/leahfowler/leah-fowler-performance/.env.local`:

```env
# Supabase Configuration (REQUIRED - Get from Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[...]
SUPABASE_SERVICE_ROLE_KEY=eyJ[...]

# Application Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Domain Configuration
NEXT_PUBLIC_DOMAIN=https://leahfowlerperformance.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@leahfowlerperformance.com
```

## Post-Deployment Checklist

- [ ] SSH access configured and tested
- [ ] Firewall rules active (ports 22, 80, 443)
- [ ] Fail2ban monitoring SSH attempts
- [ ] Node.js 20+ installed
- [ ] Nginx configured and running
- [ ] PM2 managing application process
- [ ] Application building successfully
- [ ] Environment variables configured
- [ ] Domain pointing to server IP
- [ ] SSL certificate installed
- [ ] Application accessible via HTTPS
- [ ] Performance <2 second page loads
- [ ] Monitoring scripts in place
- [ ] Backup strategy configured
- [ ] GDPR compliance measures active

## Monitoring Commands

```bash
# Check application status
sudo -u leahfowler pm2 status

# View application logs
sudo -u leahfowler pm2 logs

# Check Nginx status
systemctl status nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log

# Check system resources
htop

# Run health check
/home/leahfowler/monitor.sh
```

## Troubleshooting

### Application Won't Start
```bash
# Check logs
sudo -u leahfowler pm2 logs
# Check environment variables
sudo -u leahfowler cat /home/leahfowler/leah-fowler-performance/.env.local
```

### Nginx 502 Bad Gateway
```bash
# Ensure app is running
sudo -u leahfowler pm2 status
# Check if port 3000 is listening
netstat -tulpn | grep 3000
```

### SSL Certificate Issues
```bash
# Test certificate renewal
certbot renew --dry-run
# Force renewal
certbot renew --force-renewal
```

## Security Notes

1. **SSH Security**: Only key-based authentication after initial setup
2. **Firewall**: UFW configured with minimal open ports
3. **Fail2ban**: Monitoring and blocking suspicious activity
4. **HTTPS**: Enforced via Nginx redirect
5. **Headers**: Security headers configured in Nginx
6. **Updates**: Unattended-upgrades for security patches

## Performance Optimizations

1. **PM2 Cluster Mode**: Multiple Node.js processes
2. **Nginx Caching**: Static assets cached
3. **Gzip Compression**: Enabled for all text content
4. **HTTP/2**: Enabled for faster multiplexing
5. **Redis**: Available for application caching

## GDPR Compliance

1. **Data Minimization**: Only collect necessary data
2. **Encryption**: TLS for all communications
3. **Logging**: Anonymized IP addresses in logs
4. **Retention**: Automated log rotation
5. **Access Control**: Strict file permissions

## Support

For issues or questions:
- Application logs: `/home/leahfowler/leah-fowler-performance/logs/`
- System logs: `/var/log/`
- PM2 logs: `sudo -u leahfowler pm2 logs`
- Nginx logs: `/var/log/nginx/`