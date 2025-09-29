#!/bin/bash

# Domain Migration Setup Script for leah.coach
# This script configures Nginx and SSL for the new domain structure

echo "🚀 Starting Domain Migration Setup for leah.coach"
echo "================================================"

# Step 1: Create Nginx configuration
echo ""
echo "📝 Step 1: Creating Nginx configuration..."

cat > /tmp/leah-coach-nginx.conf << 'EOF'
# Redirect all HTTP traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name leah.coach www.leah.coach strengthpt.co.uk www.strengthpt.co.uk aphroditefitness.co.uk www.aphroditefitness.co.uk;

    # ACME challenge for SSL certificates
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Redirect old domains to new primary domain (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name strengthpt.co.uk www.strengthpt.co.uk;

    # SSL Configuration (will be updated after cert generation)
    ssl_certificate /etc/letsencrypt/live/strengthpt.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/strengthpt.co.uk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Permanent redirect to new domain
    return 301 https://leah.coach$request_uri;
}

# Redirect aphrodite domain to new primary domain (HTTPS)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name aphroditefitness.co.uk www.aphroditefitness.co.uk;

    # SSL Configuration (will be updated after cert generation)
    ssl_certificate /etc/letsencrypt/live/aphroditefitness.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aphroditefitness.co.uk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Permanent redirect to new domain
    return 301 https://leah.coach$request_uri;
}

# Redirect www.leah.coach to leah.coach (canonical)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.leah.coach;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/leah.coach/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/leah.coach/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Redirect to non-www
    return 301 https://leah.coach$request_uri;
}

# Primary server block for leah.coach
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name leah.coach;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/leah.coach/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/leah.coach/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;

    # Proxy to Next.js application
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
        proxy_read_timeout 86400;
    }

    # Static file caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=604800";
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "✅ Nginx configuration created"

# Step 2: Test DNS propagation
echo ""
echo "🔍 Step 2: Testing DNS propagation..."
echo ""
echo "Checking leah.coach..."
dig +short leah.coach
echo ""
echo "Checking strengthpt.co.uk..."
dig +short strengthpt.co.uk
echo ""
echo "Checking aphroditefitness.co.uk..."
dig +short aphroditefitness.co.uk

echo ""
echo "📋 Next Steps:"
echo "1. Copy this configuration to VPS: /etc/nginx/sites-available/leah-coach"
echo "2. Install SSL certificates with Certbot"
echo "3. Enable the site and reload Nginx"
echo "4. Update Next.js environment variables"
echo ""
echo "Ready to deploy to VPS? Run:"
echo "scp /tmp/leah-coach-nginx.conf root@168.231.78.49:/etc/nginx/sites-available/leah-coach"