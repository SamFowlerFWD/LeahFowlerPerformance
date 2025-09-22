#!/bin/bash

#################################################################
# Leah Fowler Performance - Server Health Check & Monitoring
# Run this script to verify deployment status and performance
#################################################################

# Colours
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SERVER_IP="168.231.78.49"
DOMAIN="leahfowlerperformance.com"
EXPECTED_STATUS_CODE="200"
MAX_RESPONSE_TIME=2000  # milliseconds

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Leah Fowler Performance - Health Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check URL response
check_url() {
    local url=$1
    local description=$2

    echo -e "${BLUE}Testing: ${description}${NC}"

    # Check response time and status code
    response=$(curl -o /dev/null -s -w "%{http_code} %{time_total}" "$url" 2>/dev/null)
    status_code=$(echo $response | awk '{print $1}')
    response_time=$(echo $response | awk '{print $2}' | awk '{printf "%.0f", $1 * 1000}')

    if [ "$status_code" = "$EXPECTED_STATUS_CODE" ] || [ "$status_code" = "301" ] || [ "$status_code" = "302" ]; then
        if [ "$response_time" -le "$MAX_RESPONSE_TIME" ]; then
            echo -e "${GREEN}✓${NC} Status: $status_code | Response time: ${response_time}ms"
        else
            echo -e "${YELLOW}⚠${NC} Status: $status_code | Response time: ${response_time}ms (>2s warning)"
        fi
    else
        echo -e "${RED}✗${NC} Status: $status_code | Response time: ${response_time}ms"
    fi
}

# Function to check port
check_port() {
    local host=$1
    local port=$2
    local service=$3

    nc -z -w1 "$host" "$port" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Port $port ($service) is open"
    else
        echo -e "${RED}✗${NC} Port $port ($service) is closed"
    fi
}

# Function to check SSL certificate
check_ssl() {
    local domain=$1

    echo -e "\n${BLUE}SSL Certificate Status:${NC}"

    # Check if certificate exists and get expiry
    expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)

    if [ -n "$expiry" ]; then
        echo -e "${GREEN}✓${NC} SSL certificate valid until: $expiry"

        # Check days until expiry
        expiry_epoch=$(date -j -f "%b %d %T %Y %Z" "$expiry" +%s 2>/dev/null || date -d "$expiry" +%s 2>/dev/null)
        current_epoch=$(date +%s)
        days_left=$(( ($expiry_epoch - $current_epoch) / 86400 ))

        if [ $days_left -lt 30 ]; then
            echo -e "${YELLOW}⚠${NC} Certificate expires in $days_left days - consider renewal"
        else
            echo -e "${GREEN}✓${NC} Certificate valid for $days_left more days"
        fi
    else
        echo -e "${YELLOW}⚠${NC} No SSL certificate found or not accessible"
    fi
}

# Function to run performance test
performance_test() {
    local url=$1

    echo -e "\n${BLUE}Performance Test (5 requests):${NC}"

    total_time=0
    for i in {1..5}; do
        response_time=$(curl -o /dev/null -s -w "%{time_total}" "$url" 2>/dev/null)
        response_time_ms=$(echo "$response_time" | awk '{printf "%.0f", $1 * 1000}')
        total_time=$(echo "$total_time + $response_time_ms" | bc)
        echo "Request $i: ${response_time_ms}ms"
    done

    avg_time=$(echo "$total_time / 5" | bc)
    echo -e "Average response time: ${avg_time}ms"

    if [ "$avg_time" -le 1000 ]; then
        echo -e "${GREEN}✓${NC} Excellent performance (<1s average)"
    elif [ "$avg_time" -le 2000 ]; then
        echo -e "${GREEN}✓${NC} Good performance (<2s average)"
    else
        echo -e "${YELLOW}⚠${NC} Performance needs optimization (>2s average)"
    fi
}

# Function to check Core Web Vitals hints
check_web_vitals() {
    echo -e "\n${BLUE}Core Web Vitals Checklist:${NC}"

    # These are checks that can be done server-side
    echo "Server-side optimizations to verify:"

    # Check if Gzip is enabled
    gzip_enabled=$(curl -H "Accept-Encoding: gzip" -I "http://$1" 2>/dev/null | grep -i "content-encoding: gzip")
    if [ -n "$gzip_enabled" ]; then
        echo -e "${GREEN}✓${NC} Gzip compression enabled"
    else
        echo -e "${YELLOW}⚠${NC} Gzip compression not detected"
    fi

    # Check for HTTP/2
    http2_enabled=$(curl -I --http2 "https://$1" 2>/dev/null | grep -i "HTTP/2")
    if [ -n "$http2_enabled" ]; then
        echo -e "${GREEN}✓${NC} HTTP/2 enabled"
    else
        echo -e "${YELLOW}⚠${NC} HTTP/2 not detected"
    fi

    # Check cache headers
    cache_headers=$(curl -I "https://$1" 2>/dev/null | grep -i "cache-control")
    if [ -n "$cache_headers" ]; then
        echo -e "${GREEN}✓${NC} Cache headers present: $cache_headers"
    else
        echo -e "${YELLOW}⚠${NC} Cache headers not detected"
    fi
}

# Function to check security headers
check_security_headers() {
    echo -e "\n${BLUE}Security Headers Check:${NC}"

    headers=$(curl -I "https://$1" 2>/dev/null)

    # Check for important security headers
    security_headers=(
        "Strict-Transport-Security"
        "X-Frame-Options"
        "X-Content-Type-Options"
        "Content-Security-Policy"
        "Referrer-Policy"
        "Permissions-Policy"
    )

    for header in "${security_headers[@]}"; do
        if echo "$headers" | grep -qi "$header"; then
            value=$(echo "$headers" | grep -i "$header" | cut -d: -f2- | xargs)
            echo -e "${GREEN}✓${NC} $header: $value"
        else
            echo -e "${YELLOW}⚠${NC} $header: Missing"
        fi
    done
}

echo "======================================"
echo "1. CONNECTIVITY TESTS"
echo "======================================"

# Check server connectivity
echo -e "\n${BLUE}Server Connectivity:${NC}"
check_port "$SERVER_IP" 22 "SSH"
check_port "$SERVER_IP" 80 "HTTP"
check_port "$SERVER_IP" 443 "HTTPS"
check_port "$SERVER_IP" 3000 "Next.js"

echo ""
echo "======================================"
echo "2. APPLICATION AVAILABILITY"
echo "======================================"

# Check HTTP endpoints
check_url "http://$SERVER_IP" "HTTP via IP"
check_url "http://$DOMAIN" "HTTP via domain"
check_url "https://$DOMAIN" "HTTPS via domain"
check_url "https://$DOMAIN/api/health" "Health check endpoint"

echo ""
echo "======================================"
echo "3. SSL CERTIFICATE"
echo "======================================"

check_ssl "$DOMAIN"

echo ""
echo "======================================"
echo "4. PERFORMANCE METRICS"
echo "======================================"

performance_test "https://$DOMAIN"

echo ""
echo "======================================"
echo "5. WEB VITALS & OPTIMIZATION"
echo "======================================"

check_web_vitals "$DOMAIN"

echo ""
echo "======================================"
echo "6. SECURITY HEADERS"
echo "======================================"

check_security_headers "$DOMAIN"

echo ""
echo "======================================"
echo "7. RECOMMENDED EXTERNAL TESTS"
echo "======================================"

echo -e "\n${BLUE}Run these external tests for comprehensive analysis:${NC}"
echo ""
echo "1. Google PageSpeed Insights:"
echo "   https://pagespeed.web.dev/report?url=https://$DOMAIN"
echo ""
echo "2. GTmetrix Performance:"
echo "   https://gtmetrix.com/?url=https://$DOMAIN"
echo ""
echo "3. Security Headers:"
echo "   https://securityheaders.com/?q=$DOMAIN"
echo ""
echo "4. SSL Labs Test:"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
echo "5. WAVE Accessibility:"
echo "   https://wave.webaim.org/report#/$DOMAIN"
echo ""
echo "6. Mobile-Friendly Test:"
echo "   https://search.google.com/test/mobile-friendly?url=https://$DOMAIN"

echo ""
echo "======================================"
echo "8. MONITORING COMMANDS"
echo "======================================"

echo -e "\n${BLUE}Useful monitoring commands to run on server:${NC}"
echo ""
echo "# Application logs:"
echo "ssh root@$SERVER_IP 'sudo -u leahfowler pm2 logs'"
echo ""
echo "# Application status:"
echo "ssh root@$SERVER_IP 'sudo -u leahfowler pm2 status'"
echo ""
echo "# Nginx error logs:"
echo "ssh root@$SERVER_IP 'tail -n 50 /var/log/nginx/error.log'"
echo ""
echo "# System resources:"
echo "ssh root@$SERVER_IP 'htop'"
echo ""
echo "# Disk usage:"
echo "ssh root@$SERVER_IP 'df -h'"
echo ""
echo "# Service status:"
echo "ssh root@$SERVER_IP 'systemctl status nginx pm2-leahfowler'"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Health Check Complete${NC}"
echo -e "${BLUE}========================================${NC}"