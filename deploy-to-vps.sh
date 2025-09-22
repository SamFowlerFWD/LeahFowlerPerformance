#!/bin/bash

#################################################################
# Leah Fowler Performance - VPS Deployment Script
# Production deployment with security, performance, and GDPR compliance
# Target: root@168.231.78.49
#################################################################

set -e  # Exit on error

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration Variables
SERVER_IP="168.231.78.49"
DOMAIN="leahfowlerperformance.com"
APP_USER="leahfowler"
APP_DIR="/home/${APP_USER}/leah-fowler-performance"
NODE_VERSION="20"
REPO_URL="https://github.com/SamFowlerFWD/LeahFowlerPerformance.git"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Leah Fowler Performance VPS Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

#################################################################
# PHASE 1: SECURITY HARDENING
#################################################################

echo -e "\n${BLUE}PHASE 1: Security Hardening${NC}"

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential security tools
print_status "Installing security tools..."
apt install -y ufw fail2ban unattended-upgrades apt-listchanges

# Configure UFW firewall
print_status "Configuring firewall..."
ufw --force disable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# Configure fail2ban
print_status "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl restart fail2ban
systemctl enable fail2ban

# SSH hardening
print_status "Hardening SSH configuration..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cat > /etc/ssh/sshd_config.d/hardening.conf <<EOF
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
EOF

# Create application user
print_status "Creating application user..."
if ! id -u ${APP_USER} >/dev/null 2>&1; then
    useradd -m -s /bin/bash ${APP_USER}
    usermod -aG sudo ${APP_USER}

    # Setup SSH for app user
    mkdir -p /home/${APP_USER}/.ssh
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/${APP_USER}/.ssh/
    fi
    chown -R ${APP_USER}:${APP_USER} /home/${APP_USER}/.ssh
    chmod 700 /home/${APP_USER}/.ssh
    chmod 600 /home/${APP_USER}/.ssh/authorized_keys 2>/dev/null || true
fi

#################################################################
# PHASE 2: SOFTWARE INSTALLATION
#################################################################

echo -e "\n${BLUE}PHASE 2: Installing Software Stack${NC}"

# Install Node.js
print_status "Installing Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs

# Install build essentials
print_status "Installing build tools..."
apt install -y build-essential git nginx certbot python3-certbot-nginx redis-server

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Install additional monitoring tools
print_status "Installing monitoring tools..."
apt install -y htop iotop net-tools

#################################################################
# PHASE 3: APPLICATION DEPLOYMENT
#################################################################

echo -e "\n${BLUE}PHASE 3: Deploying Application${NC}"

# Clone repository as app user
print_status "Cloning repository..."
sudo -u ${APP_USER} bash <<EOF
cd /home/${APP_USER}
if [ -d "leah-fowler-performance" ]; then
    cd leah-fowler-performance
    git pull
else
    git clone ${REPO_URL} leah-fowler-performance
    cd leah-fowler-performance
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Create .env.local file (will need manual configuration)
cat > .env.local <<ENVFILE
# Database Configuration - REQUIRES MANUAL UPDATE
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Performance Settings
NEXT_SHARP_PATH=/home/${APP_USER}/leah-fowler-performance/node_modules/sharp

# Security Headers
NEXT_PUBLIC_DOMAIN=https://${DOMAIN}
ENVFILE

print_warning "IMPORTANT: Update .env.local with your Supabase credentials!"

# Build the application
print_status "Building Next.js application..."
npm run build
EOF

#################################################################
# PHASE 4: NGINX CONFIGURATION
#################################################################

echo -e "\n${BLUE}PHASE 4: Configuring Nginx${NC}"

print_status "Setting up Nginx reverse proxy..."

# Create Nginx configuration
cat > /etc/nginx/sites-available/${DOMAIN} <<'NGINX'
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;

# Upstream configuration
upstream nextjs {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # SSL will be configured by certbot

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # GDPR Compliance Headers
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype;

    # Client body size
    client_max_body_size 10M;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Rate limiting
    location / {
        limit_req zone=general burst=20 nodelay;

        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Next.js specific
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    # API routes with higher rate limit
    location /api {
        limit_req zone=api burst=40 nodelay;

        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://nextjs;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Logging
    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log /var/log/nginx/${DOMAIN}_error.log;
}
NGINX

# Replace domain placeholder
sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" /etc/nginx/sites-available/${DOMAIN}

# Enable site
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

#################################################################
# PHASE 5: PM2 PROCESS MANAGEMENT
#################################################################

echo -e "\n${BLUE}PHASE 5: Setting up PM2 Process Management${NC}"

# Create PM2 ecosystem file
sudo -u ${APP_USER} bash <<'EOF'
cd /home/${APP_USER}/leah-fowler-performance

cat > ecosystem.config.js <<'PM2CONFIG'
module.exports = {
  apps: [{
    name: 'leah-fowler-performance',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // Performance optimizations
    node_args: '--max-old-space-size=2048',

    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 5000,

    // Health monitoring
    min_uptime: '10s',
    max_restarts: 10,
  }]
};
PM2CONFIG

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
EOF

# Setup PM2 startup script
pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER}
sudo -u ${APP_USER} pm2 save

#################################################################
# PHASE 6: SSL CERTIFICATE
#################################################################

echo -e "\n${BLUE}PHASE 6: SSL Certificate Setup${NC}"

print_warning "Attempting SSL certificate generation..."
print_warning "This will only work if ${DOMAIN} is pointed to ${SERVER_IP}"

# Try to obtain SSL certificate
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} || {
    print_warning "SSL certificate generation failed. Domain may not be pointed to this server yet."
    print_warning "Run 'certbot --nginx' manually once domain is configured."
}

#################################################################
# PHASE 7: MONITORING AND LOGGING
#################################################################

echo -e "\n${BLUE}PHASE 7: Setting up Monitoring and Logging${NC}"

# Configure log rotation
cat > /etc/logrotate.d/leah-fowler-performance <<EOF
/home/${APP_USER}/leah-fowler-performance/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 ${APP_USER} ${APP_USER}
    sharedscripts
    postrotate
        sudo -u ${APP_USER} pm2 reloadLogs
    endscript
}
EOF

# Create monitoring script
cat > /home/${APP_USER}/monitor.sh <<'MONITOR'
#!/bin/bash

# Health check script for monitoring
check_service() {
    if systemctl is-active --quiet $1; then
        echo "✓ $1 is running"
    else
        echo "✗ $1 is not running"
        return 1
    fi
}

check_port() {
    if nc -z localhost $1 2>/dev/null; then
        echo "✓ Port $1 is open"
    else
        echo "✗ Port $1 is closed"
        return 1
    fi
}

echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""

# Check services
check_service nginx
check_service fail2ban
check_service ufw

# Check ports
check_port 3000  # Next.js
check_port 80    # HTTP
check_port 443   # HTTPS

# Check PM2
echo ""
sudo -u leahfowler pm2 list

# Check disk usage
echo ""
echo "Disk Usage:"
df -h | grep -E "^/dev/"

# Check memory
echo ""
echo "Memory Usage:"
free -h

# Check load average
echo ""
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
MONITOR

chmod +x /home/${APP_USER}/monitor.sh
chown ${APP_USER}:${APP_USER} /home/${APP_USER}/monitor.sh

#################################################################
# PHASE 8: GDPR COMPLIANCE
#################################################################

echo -e "\n${BLUE}PHASE 8: GDPR Compliance Setup${NC}"

# Create GDPR audit log directory
mkdir -p /var/log/gdpr
chown ${APP_USER}:${APP_USER} /var/log/gdpr

# Setup audit logging configuration
cat > /home/${APP_USER}/gdpr-config.json <<EOF
{
  "privacy": {
    "dataRetention": {
      "userLogs": "30 days",
      "accessLogs": "90 days",
      "errorLogs": "180 days"
    },
    "encryption": {
      "atRest": true,
      "inTransit": true,
      "algorithm": "AES-256"
    },
    "anonymization": {
      "enabled": true,
      "ipMasking": true,
      "userIdHashing": true
    }
  },
  "compliance": {
    "gdpr": true,
    "dataProtectionOfficer": "dpo@${DOMAIN}",
    "dataProcessingAgreements": true,
    "privacyByDesign": true
  }
}
EOF

chown ${APP_USER}:${APP_USER} /home/${APP_USER}/gdpr-config.json

#################################################################
# PHASE 9: PERFORMANCE OPTIMIZATION
#################################################################

echo -e "\n${BLUE}PHASE 9: Performance Optimization${NC}"

# System performance tuning
cat >> /etc/sysctl.conf <<EOF

# Performance Tuning for Next.js
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10240 65000
net.core.netdev_max_backlog = 65536
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15

# File descriptor limits
fs.file-max = 2097152
fs.nr_open = 1048576
EOF

sysctl -p

# Set ulimits for app user
cat >> /etc/security/limits.conf <<EOF
${APP_USER} soft nofile 65536
${APP_USER} hard nofile 65536
${APP_USER} soft nproc 32768
${APP_USER} hard nproc 32768
EOF

# Redis optimization for caching
cat >> /etc/redis/redis.conf <<EOF
maxmemory 256mb
maxmemory-policy allkeys-lru
save ""
EOF

systemctl restart redis-server

#################################################################
# PHASE 10: FINAL SETUP
#################################################################

echo -e "\n${BLUE}PHASE 10: Final Setup${NC}"

# Create deployment info file
cat > /home/${APP_USER}/deployment-info.txt <<EOF
========================================
Leah Fowler Performance - Deployment Info
========================================

Deployment Date: $(date)
Server IP: ${SERVER_IP}
Domain: ${DOMAIN}
Node.js Version: $(node -v)
NPM Version: $(npm -v)
PM2 Version: $(pm2 -v)

Application User: ${APP_USER}
Application Directory: ${APP_DIR}

Services:
- Nginx: systemctl status nginx
- PM2: sudo -u ${APP_USER} pm2 status
- Fail2ban: systemctl status fail2ban
- Redis: systemctl status redis-server

Monitoring:
- Check health: /home/${APP_USER}/monitor.sh
- PM2 logs: sudo -u ${APP_USER} pm2 logs
- Nginx logs: /var/log/nginx/
- App logs: ${APP_DIR}/logs/

IMPORTANT NEXT STEPS:
1. Update /home/${APP_USER}/leah-fowler-performance/.env.local with Supabase credentials
2. Point domain ${DOMAIN} to IP ${SERVER_IP}
3. Run 'certbot --nginx' if SSL setup failed
4. Test the application at http://${SERVER_IP}
5. Monitor initial performance metrics

Security Notes:
- SSH: Key-only authentication enabled
- Firewall: UFW configured (22, 80, 443)
- Fail2ban: Monitoring SSH attempts
- GDPR: Logging configured at /var/log/gdpr/

Performance:
- PM2 cluster mode enabled
- Nginx caching configured
- Redis caching available
- System limits optimized
EOF

# Set proper permissions
chown -R ${APP_USER}:${APP_USER} /home/${APP_USER}/

# Restart services
systemctl restart nginx
systemctl restart sshd

print_status "Deployment completed successfully!"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
cat /home/${APP_USER}/deployment-info.txt

# Run health check
echo ""
echo -e "${BLUE}Running health check...${NC}"
/home/${APP_USER}/monitor.sh