---
title: Configure UFW
description: Configure your UFW settings
tags: ['linux']
image:
publishedDate: Jan 5 2024
# updatedDate:
---

Ubuntu use `ufw` (Uncomplicated Firewall) by default.

If you encounter SSH login issues or can't access your website or application, your server firewall might be causing the problem. Resetting it to default and allowing connections might helps.

### Disable UFW

```shell
sudo ufw --force disable
```

### Reset UFW

```shell
sudo ufw --force reset
```

### Deny Incoming Connections

```shell
sudo ufw default deny incoming
```

### Allow Outgoing Connections

```shell
sudo ufw default allow outgoing
```

### Define Allowed Ports

- SSH `sudo ufw allow 22/tcp`
- HTTP `sudo ufw allow 80/tcp`
- HTTPS `sudo ufw allow 443/tcp`
- MongoDB: `sudo ufw allow 27017/tcp`
- MySQL: `sudo ufw allow 3306/tcp`
- PostgreSQL: `sudo ufw allow 5432/tcp`
- Redis: `sudo ufw allow 6379/tcp`

### Enable UFW

```shell
sudo ufw --force enable
```
