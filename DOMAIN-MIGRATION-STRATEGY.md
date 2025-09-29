# Domain Migration Strategy: leah.coach
## Comprehensive Migration Plan from Multiple Domains

### Executive Summary
This document provides a complete strategy for migrating from strengthpt.co.uk and aphroditefitness.co.uk to the new primary domain leah.coach, ensuring SEO preservation and zero downtime.

---

## 1. DNS Configuration Strategy

### A. Primary Domain: leah.coach

```dns
# DNS Records for leah.coach (at your DNS provider)
Type    Name    Value                   TTL     Priority
A       @       168.231.78.49          3600    -
A       www     168.231.78.49          3600    -
AAAA    @       [IPv6 if available]    3600    -
AAAA    www     [IPv6 if available]    3600    -

# Optional but recommended
TXT     @       "v=spf1 ip4:168.231.78.49 ~all"    3600    -
CAA     @       0 issue "letsencrypt.org"          3600    -
```

### B. Redirect Domain: strengthpt.co.uk

```dns
# DNS Records for strengthpt.co.uk
Type    Name    Value                   TTL     Priority
A       @       168.231.78.49          3600    -
A       www     168.231.78.49          3600    -
AAAA    @       [IPv6 if available]    3600    -
AAAA    www     [IPv6 if available]    3600    -
```

### C. Redirect Domain: aphroditefitness.co.uk

```dns
# DNS Records for aphroditefitness.co.uk
Type    Name    Value                   TTL     Priority
A       @       168.231.78.49          3600    -
A       www     168.231.78.49          3600    -
AAAA    @       [IPv6 if available]    3600    -
AAAA    www     [IPv6 if available]    3600    -
```

### DNS Provider Instructions

1. **Lower TTL Before Migration** (24-48 hours before):
   - Set TTL to 300 seconds for all A records
   - This allows faster propagation during migration

2. **Update DNS Records**:
   - Point all domains to VPS IP: 168.231.78.49
   - Ensure both @ and www records exist

3. **After Migration**:
   - Increase TTL back to 3600 seconds

---

## 2. Nginx Server Configuration

### A. Main Configuration File
Create/update: `/etc/nginx/sites-available/leah-coach`

```nginx
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
    server_name strengthpt.co.uk www.strengthpt.co.uk aphroditefitness.co.uk www.aphroditefitness.co.uk;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/strengthpt.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/strengthpt.co.uk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Permanent redirect to new domain
    return 301 https://leah.coach$request_uri;
}

# Redirect www to non-www for primary domain
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

# Main server block for leah.coach
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
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" always;

    # HSTS (uncomment after testing)
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Root directory
    root /var/www/leah-coach;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    gzip_disable "MSIE [1-6]\.";

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js specific
    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### B. Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/leah-coach /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 3. SSL Certificate Setup

### A. Install Certbot

```bash
# Update package list
sudo apt update

# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

### B. Obtain SSL Certificates

```bash
# Primary domain
sudo certbot certonly --nginx -d leah.coach -d www.leah.coach \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Old domain 1
sudo certbot certonly --nginx -d strengthpt.co.uk -d www.strengthpt.co.uk \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Old domain 2
sudo certbot certonly --nginx -d aphroditefitness.co.uk -d www.aphroditefitness.co.uk \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

### C. Auto-renewal Setup

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e
# Add this line:
0 3 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

## 4. Next.js Application Updates

### A. Update next.config.js

```javascript
// next.config.js
module.exports = {
  // ... existing config

  // Update allowed hosts
  images: {
    domains: ['leah.coach', 'www.leah.coach'],
  },

  // Set production URL
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://leah.coach',
    NEXT_PUBLIC_CANONICAL_URL: 'https://leah.coach',
  },

  // Add redirect rules
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.leah.coach',
          },
        ],
        destination: 'https://leah.coach/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'strengthpt.co.uk',
          },
        ],
        destination: 'https://leah.coach/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'aphroditefitness.co.uk',
          },
        ],
        destination: 'https://leah.coach/:path*',
        permanent: true,
      },
    ];
  },
};
```

### B. Update Environment Variables

```env
# .env.production
NEXT_PUBLIC_SITE_URL=https://leah.coach
NEXT_PUBLIC_CANONICAL_URL=https://leah.coach
NEXT_PUBLIC_SITE_NAME="Leah Fowler Performance Coach"
NEXT_PUBLIC_DEFAULT_DOMAIN=leah.coach
```

### C. Update SEO Components

```typescript
// components/SEO.tsx or similar
export const SEO = ({ title, description, path = '' }) => {
  const canonicalUrl = `https://leah.coach${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Leah Fowler Performance Coach" />

      {/* Twitter */}
      <meta name="twitter:url" content={canonicalUrl} />
    </Head>
  );
};
```

### D. Update Internal Links

```bash
# Search and replace in codebase
grep -r "strengthpt.co.uk" . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
grep -r "aphroditefitness.co.uk" . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"

# Update all instances to use relative URLs or leah.coach
```

---

## 5. SEO Migration Best Practices

### A. Pre-Migration Checklist

- [ ] **Create full site backup**
- [ ] **Document all existing URLs** (use Screaming Frog or similar)
- [ ] **Export current Google Search Console data**
- [ ] **Note current rankings for key pages**
- [ ] **Create 301 redirect map** (old URL → new URL)

### B. Google Search Console Setup

1. **Add new property** for leah.coach
2. **Verify ownership** using DNS TXT record
3. **Submit new sitemap**: https://leah.coach/sitemap.xml
4. **Use Change of Address tool** (for each old domain):
   - Go to old property in Search Console
   - Settings → Change of address
   - Select leah.coach as new site
   - Follow verification steps

### C. Update External References

- [ ] **Google My Business**: Update website URL
- [ ] **Social Media Profiles**: Update all links
- [ ] **Directory Listings**: Update business directories
- [ ] **Backlinks**: Contact high-value sites for link updates
- [ ] **Email Signatures**: Update all team signatures
- [ ] **Marketing Materials**: Update any printed/digital materials

### D. Sitemap and Robots.txt

**robots.txt** (at root of site):
```txt
User-agent: *
Allow: /
Sitemap: https://leah.coach/sitemap.xml

# Block old domains from indexing
User-agent: *
Disallow: /
Host: leah.coach
```

**sitemap.xml** updates:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://leah.coach/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- All URLs should use leah.coach -->
</urlset>
```

---

## 6. Implementation Timeline

### Phase 1: Preparation (Day 1-2)
1. Lower DNS TTL values
2. Backup everything
3. Document current setup
4. Prepare Nginx configurations

### Phase 2: DNS Updates (Day 3)
1. Update DNS records for all domains
2. Wait for propagation (2-24 hours)
3. Monitor DNS propagation

### Phase 3: SSL Setup (Day 3-4)
1. Install SSL certificates
2. Test HTTPS access
3. Verify certificate auto-renewal

### Phase 4: Application Updates (Day 4-5)
1. Deploy updated Next.js configuration
2. Update environment variables
3. Test all functionality

### Phase 5: SEO Migration (Day 5-7)
1. Submit to Google Search Console
2. Update external links
3. Monitor traffic and rankings

### Phase 6: Monitoring (Day 7-30)
1. Daily traffic monitoring
2. Check for 404 errors
3. Monitor search rankings
4. Fix any issues

---

## 7. Testing Checklist

### DNS Verification
```bash
# Check DNS propagation
dig leah.coach +short
dig strengthpt.co.uk +short
dig aphroditefitness.co.uk +short

# Check www variants
dig www.leah.coach +short
```

### Redirect Testing
```bash
# Test HTTP to HTTPS redirect
curl -I http://leah.coach
curl -I http://strengthpt.co.uk
curl -I http://aphroditefitness.co.uk

# Test old domain to new domain redirect
curl -I https://strengthpt.co.uk
curl -I https://aphroditefitness.co.uk

# Test www to non-www redirect
curl -I https://www.leah.coach
```

### SSL Certificate Verification
```bash
# Check SSL certificate
openssl s_client -connect leah.coach:443 -servername leah.coach < /dev/null

# Check certificate expiry
echo | openssl s_client -connect leah.coach:443 -servername leah.coach 2>/dev/null | openssl x509 -noout -dates
```

### Application Testing
- [ ] Homepage loads correctly
- [ ] All internal links work
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] No mixed content warnings
- [ ] Mobile responsive works
- [ ] Payment systems function
- [ ] API endpoints accessible

### SEO Verification
- [ ] Canonical tags point to leah.coach
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt properly configured
- [ ] Meta tags updated
- [ ] Open Graph tags correct
- [ ] Schema markup valid

### Performance Testing
```bash
# Test page load speed
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://leah.coach

# Check response headers
curl -I https://leah.coach
```

---

## 8. Rollback Plan

If issues arise:

1. **DNS Rollback**: Point domains back to original IPs
2. **Nginx Rollback**: Restore previous configuration
   ```bash
   sudo cp /etc/nginx/sites-available/backup-config /etc/nginx/sites-available/leah-coach
   sudo nginx -t && sudo systemctl reload nginx
   ```
3. **Application Rollback**: Restore previous deployment
4. **Monitor**: Check error logs and fix issues

---

## 9. Post-Migration Monitoring

### Week 1
- Daily traffic analysis
- 404 error monitoring
- Search Console coverage reports
- User feedback collection

### Month 1
- Weekly ranking reports
- Backlink profile monitoring
- Page speed optimization
- Conversion rate tracking

### Ongoing
- Monthly SEO audits
- Regular backup verification
- SSL certificate monitoring
- Security updates

---

## 10. Important Commands Reference

```bash
# Nginx commands
sudo nginx -t                    # Test configuration
sudo systemctl reload nginx       # Reload configuration
sudo systemctl status nginx       # Check status
sudo tail -f /var/log/nginx/error.log  # Monitor errors

# SSL certificate commands
sudo certbot certificates        # List certificates
sudo certbot renew --dry-run     # Test renewal
sudo certbot delete --cert-name domain.com  # Delete certificate

# DNS testing
nslookup leah.coach
host leah.coach
dig leah.coach ANY

# Application commands
pm2 restart all                  # Restart Next.js app
pm2 logs                         # View application logs
npm run build && npm run start   # Rebuild and start
```

---

## Support Resources

- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Google Search Console**: https://search.google.com/search-console/
- **DNS Propagation Check**: https://www.whatsmydns.net/
- **SSL Test**: https://www.ssllabs.com/ssltest/

---

## Emergency Contacts

Keep these handy during migration:
- DNS Provider Support
- Hosting Provider Support
- Domain Registrar Support
- Development Team Contacts

---

**Migration Checklist Summary**

- [ ] DNS records configured for all domains
- [ ] SSL certificates installed and working
- [ ] Nginx redirects properly configured
- [ ] Application updated with new domain
- [ ] Google Search Console migration initiated
- [ ] All external links updated
- [ ] Testing completed successfully
- [ ] Monitoring in place

**Remember**: Take backups before each step and test thoroughly!