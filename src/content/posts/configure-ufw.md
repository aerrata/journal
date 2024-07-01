---
title: Configure UFW
description: Configure your UFW settings
tags: ['linux']
image:
publishedDate: Jan 5 2024
updatedDate: June 2 2024
---

Uncomplicated Firewall (UFW) is a user-friendly interface for managing iptables firewall rules. Below is a cheat sheet of common UFW commands to quickly set up and manage your firewall.

### Enable UFW

```sh
# Enable UFW
sudo ufw --force enable
```

### Disable and Reset UFW

```sh
# Disable UFW
sudo ufw --force disable

# Reset UFW to default settings
sudo ufw --force reset
```

### Default Policies

```sh
# Deny all incoming connections by default
sudo ufw default deny incoming

# Allow all outgoing connections by default
sudo ufw default allow outgoing
```

### Define Allowed Ports

```sh
# Allow incoming connections on port 22 (SSH)
sudo ufw allow 22/tcp

# Allow incoming connections on port 80 (HTTP)
sudo ufw allow 80/tcp

# Allow incoming connections on port 443 (HTTPS)
sudo ufw allow 443/tcp

# Allow incoming connections on port 27017 (MongoDB)
sudo ufw allow 27017/tcp

# Allow incoming connections on port 3306 (MySQL)
sudo ufw allow 3306/tcp

# Allow incoming connections on port 5432 (PostgreSQL)
sudo ufw allow 5432/tcp

# Allow incoming connections on port 6379 (Redis)
sudo ufw allow 6379/tcp
```

### Common UFW Commands

```sh
# Check UFW status
sudo ufw status

# Check detailed status including rules
sudo ufw status verbose

# Allow incoming connections from a specific IP on port 3306 (MySQL)
sudo ufw allow from 192.168.1.100 to any port 3306

# Deny all incoming connections from a specific IP
sudo ufw deny from 192.168.1.100

# Monitor UFW logs
sudo tail -f /var/log/ufw.log

# Reload UFW to apply changes without disabling
sudo ufw reload
```

### Tips

- Always allow SSH before enabling UFW to prevent locking yourself out.
- Use numbered rules for easier management of multiple rules.
- Regularly monitor UFW logs to ensure no unauthorized access attempts.

This cheat sheet provides a quick reference to set up and manage your firewall with UFW. For detailed documentation, visit the [official UFW documentation](https://help.ubuntu.com/community/UFW).
