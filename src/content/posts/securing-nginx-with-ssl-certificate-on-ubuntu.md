---
title: Securing Laravel App with NGINX SSL on Ubuntu
description: Installing SSL certificate to secure your Laravel app.
tags: ['linux', 'nginx']
image:
publishedDate: Mar 22 2024
updatedDate: June 2 2024
---

Securing your Laravel application with SSL (Secure Sockets Layer) via NGINX on an Ubuntu server is essential for safeguarding sensitive data and ensuring encrypted communication between clients and your server.

### Install NGINX

If NGINX isn't already installed on your Ubuntu server, install it via the package manager.

```bash
sudo apt update
sudo apt install nginx
```

### Prepare The Certificate Files

Once obtained, you'll typically receive;

1. Certificate file (often with a `.crt` extension)
2. Intermediate certificate file (often with a `.crt` extension)
3. Private key file (usually with a `.key` extension)

Transfer the certificate files to your server. Common destinations for these files include `/etc/ssl/certs/` (for .cert file) and `/etc/ssl/private/` (for .key file).

Copy the file to the server using `scp` command

```bash
scp  /path/to/your_certificate.crt /path/to/your_intermediate_certificate.crt /path/to/your_private_key.key user@host:/etc/ssl/
```

Next, move the files to the specified directory

```bash
mv /etc/ssl/your_certificate.key /etc/ssl/your_intermediate_certificate.key /etc/ssl/certs/
mv /etc/ssl/your_private_key.key /etc/ssl/private/
```

### Prepare The Intermediate Certificate

The intermediate certificate (sometimes referred to as the chain certificate or CA bundle) should be included along with your server certificate in the NGINX configuration. This ensures that clients can properly validate the SSL certificate chain.

```bash
cat your_certificate.crt your_intermediate_certificate.crt > cert_bundle.crt
```

This will create a `cert_bundle.crt` file that contains both your server certificate and the intermediate certificate.

### Configure NGINX

Navigate to the NGINX configuration directory. The main configuration file is typically located at `/etc/nginx/nginx.conf`, while server block configurations reside in `/etc/nginx/sites-available/`. In this case, open the sites config file, for example: `/etc/nginx/sites-available/foo.conf`.

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

    ssl_certificate /etc/ssl/certs/cert_bundle.crt; # Update this
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
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Update this based on your current PHP version
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Test NGINX Configuration

Before restarting NGINX, validate the configuration for syntax errors:

```bash
sudo nginx -t
```

### Restart NGINX

If the test is successful, restart NGINX to apply the changes:

```bash
sudo systemctl restart nginx
```

### Verify

Verify by accessing your site using `https://foo.com` in a web browser.
