#!/bin/bash

# Commands to run in the VPS terminal to enable SSH access

# 1. Ensure SSH is installed and running
apt update
apt install -y openssh-server

# 2. Add the SSH key
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICNaI48/crsZD3TLYZC4XLgVQ0f3uERlKcsH6lQLXDL0 claude-deployment-key" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 3. Configure SSH to allow root login with key
sed -i 's/#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/#AuthorizedKeysFile.*/AuthorizedKeysFile .ssh\/authorized_keys/' /etc/ssh/sshd_config

# 4. Restart SSH service
systemctl restart ssh
systemctl enable ssh

# 5. Check firewall
ufw allow 22/tcp 2>/dev/null || echo "Firewall not active"

# 6. Show SSH status
echo "SSH Status:"
systemctl status ssh --no-pager

echo ""
echo "SSH should now be accessible!"
echo "Testing from outside: ssh root@168.231.78.49"