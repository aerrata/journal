---
title: Deploy Nuxt App on Ubuntu with Nginx and PM2
description: Use Nginx to server your Nuxt app
image:
tags:
  - linux
  - nginx
  - pm2
  - nuxtjs
createdDate: June 30 2024
updatedDate:
draft: false
---

### Install Node.js

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_VERSION=22
nvm install $NODE_VERSION
node -v
```

### Install PM2

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

```shell
sudo npm install -g pm2
```

### Clone The Nuxt App

```shell
cd
git clone https://user@bitbucket.org/org/nuxt-app.git nuxt-app
sudo mv nuxt-app /var/www
cd /var/www/nuxt-app
```

```shell
npm ci
npm run build
```

Create a new `ecosystem.config.cjs` file in your project root directory. You should commit this file.

```js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'development',
        // Add your env variables here
      },
    },
  ],
}
```

```shell
pm2 start ecosystem.config.cjs
pm2 save # Save the process lists
pm2 startup systemd # Ensure to start the daemon on reboot
pm2 list # See all processes
```

If you update the code, just reload pm2;

```shell
pm2 reload ecosystem.config.cjs
```

### Setup NGINX

```shell
sudo apt install nginx
sudo nano /etc/nginx/sites-available/nuxt-app
```

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```shell
sudo ln -s /etc/nginx/sites-available/nuxt-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup Firewall

```shell
sudo ufw allow 80,443/tcp
```

### Set Up SSL (Optional)

To secure your site with HTTPS, you can use Let's Encrypt to obtain an SSL certificate:

```shell
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

### Verify

Verify by accessing your site using domain or ip address in the web browser.

### References

1. [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)
2. [https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)