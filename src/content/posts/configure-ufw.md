---
title: Configure UFW
description: Configure your UFW settings
image:
tags:
  - linux
createdDate: Jan 5 2024
updatedDate: June 2 2024
draft: false
---

**Uncomplicated Firewall (UFW)** is a user-friendly interface for managing firewall rules.

---

### Prerequisites

1. UFW installed (default in Ubuntu)
2. Sudo privileges

### Enabling and Disabling UFW

Enable UFW

```bash
sudo ufw --force enable
```

Disable and reset UFW

```bash
sudo ufw --force disable
sudo ufw --force reset
```

### Setting Default Policies

Define default rules

```bash
sudo ufw default deny incoming    # Block all incoming connections
sudo ufw default allow outgoing   # Permit all outgoing connections
```

### Allowing Common Ports

Allow traffic on specific ports

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3306/tcp    # MySQL
sudo ufw allow 5432/tcp    # PostgreSQL
sudo ufw allow 6379/tcp    # Redis
sudo ufw allow 27017/tcp   # MongoDB
```

### Managing Rules and Monitoring

- Check UFW status

  ```bash
  sudo ufw status
  ```

- Allow traffic from a specific IP on a port

  ```bash
  sudo ufw allow from 192.168.1.100 to any port 3306
  ```

- Deny traffic from a specific IP

  ```bash
  sudo ufw deny from 192.168.1.100
  ```

- Monitor logs in real-time

  ```bash
  sudo tail -f /var/log/ufw.log
  ```

- Reload UFW without disabling

  ```bash
  sudo ufw reload
  ```
