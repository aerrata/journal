---
title: Resetting UFW
description: Reset your UFW settings
tags: ['linux']
image:
publishedDate: Jan 5 2024
# updatedDate:
# isDraft:
---

## Intro

Ubuntu 16.x and 18.x use `ufw` (Uncomplicated Firewall) by default.

If you encounter SSH login issues or can't access your website or application, your server firewall might be causing the problem. Resetting it to default and allowing connections might helps.

### #1: Disable UFW

```shell
sudo ufw --force disable
```

### #2: Reset UFW

```shell
sudo ufw --force reset
```

### #3: Deny Incoming Connections

```shell
sudo ufw default deny incoming
```

### #4: Allow Outgoing Connections

```shell
sudo ufw default allow outgoing
```

### #5: Define Allowed Ports

- SSH `sudo ufw allow 22/tcp`
- HTTP `sudo ufw allow 80/tcp`
- HTTPS `sudo ufw allow 443/tcp`
- MongoDB: `sudo ufw allow 27017/tcp`
- MySQL: `sudo ufw allow 3306/tcp`
- PostgreSQL: `sudo ufw allow 5432/tcp`
- Redis: `sudo ufw allow 6379/tcp`

### #6: Enable UFW

```shell
sudo ufw --force enable
```
