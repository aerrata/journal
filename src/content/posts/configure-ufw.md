```markdown
---
title: Configure UFW
description: Configure your UFW settings
tags: ['linux']
image:
publishedDate: Jan 5 2024
updatedDate: June 2 2024
---

Uncomplicated Firewall (UFW) is a user-friendly interface for managing iptables firewall rules.

### Enable UFW

```sh
sudo ufw --force enable      # Enable UFW
```

### Disable and Reset UFW

```sh
sudo ufw --force disable     # Disable UFW
sudo ufw --force reset       # Reset UFW to default settings
```

### Default Policies

```sh
sudo ufw default deny incoming   # Deny all incoming connections by default
sudo ufw default allow outgoing  # Allow all outgoing connections by default
```

### Define Allowed Ports

```sh
sudo ufw allow 22/tcp      # Allow incoming connections on port 22 (SSH)
sudo ufw allow 80/tcp      # Allow incoming connections on port 80 (HTTP)
sudo ufw allow 443/tcp     # Allow incoming connections on port 443 (HTTPS)
sudo ufw allow 27017/tcp   # Allow incoming connections on port 27017 (MongoDB)
sudo ufw allow 3306/tcp    # Allow incoming connections on port 3306 (MySQL)
sudo ufw allow 5432/tcp    # Allow incoming connections on port 5432 (PostgreSQL)
sudo ufw allow 6379/tcp    # Allow incoming connections on port 6379 (Redis)
```

### Common UFW Commands

```sh
sudo ufw status             # Check UFW status
sudo ufw status verbose     # Check detailed status including rules
sudo ufw allow from 192.168.1.100 to any port 3306  # Allow incoming connections from a specific IP on port 3306 (MySQL)
sudo ufw deny from 192.168.1.100  # Deny all incoming connections from a specific IP
sudo tail -f /var/log/ufw.log     # Monitor UFW logs
sudo ufw reload             # Reload UFW to apply changes without disabling
```

### Tips

- Allow SSH before enabling UFW to prevent lockout.
- Use numbered rules for easier management.
- Regularly monitor UFW logs for unauthorized access.

For detailed documentation, visit the [official UFW documentation](https://help.ubuntu.com/community/UFW).
```