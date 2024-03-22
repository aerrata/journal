---
title: Securing Laravel app with NGINX SSL on Ubuntu
description: Installing SSL certificate to secure your Laravel app.
tags: ['linux', 'nginx']
image:
publishedDate: Mar 22 2024
# updatedDate:
---

## Introduction

Securing your Laravel application with SSL (Secure Sockets Layer) via NGINX on an Ubuntu server is essential for safeguarding sensitive data and ensuring encrypted communication between clients and your server.

### Prepare Certificate Files

Once obtained, you'll typically receive;

1. Certificate file (often with a `.crt` extension)
2. Private key file (usually with a `.key` extension)
3. Intermediate certificate file (optional)

### Upload The Certificate Files

Transfer the certificate files to your server. Common destinations for these files include `/etc/ssl/certs/` (for .cert file) and `/etc/ssl/private/` (for .key file).

Copy the file to the server using `scp` command

```bash
scp /path/to/your_certificate.crt /path/to/your_private_key.key user@host:/etc/ssl/
```

Next, move the files to the specified directory

```bash
mv /etc/ssl/your_certificate.key /etc/ssl/certs/
mv /etc/ssl/your_private_key.key /etc/ssl/private/
```

### Install NGINX

If NGINX isn't already installed on your Ubuntu server, install it via the package manager.

```bash
sudo apt update
sudo apt install nginx
```

### Configure NGINX

Navigate to the NGINX configuration directory. The main configuration file is typically located at `/etc/nginx/nginx.conf`, while server block configurations reside in `/etc/nginx/sites-available/`, open your sites config file, eg: `/etc/nginx/sites-available/foo.conf`.

### Create Server Block Configuration

Edit the default server block configuration or create a new one for your Laravel application. Below is a sample configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name foo.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name foo.com; # Update this
    root /var/www/foo/public; # Update this

    ssl_certificate /etc/ssl/certs/your_certificate.crt; # Update this
    ssl_certificate_key /etc/ssl/private/your_private_key.key; # Update this

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Update this
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Test Configuration

Before restarting NGINX, validate the configuration for syntax errors:

```bash
sudo nginx -t
```

### Restart NGINX

If the test is successful, restart NGINX to apply the changes:

```bash
sudo systemctl restart nginx
```

Verify by accessing your site using `https://` in a web browser.
