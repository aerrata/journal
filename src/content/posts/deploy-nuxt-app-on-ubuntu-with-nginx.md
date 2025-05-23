---
title: Deploy Next.js App on Ubuntu with Nginx and PM2
description: Use Nginx to server your Next.js app
image:
tags:
  - linux
  - nginx
  - pm2
  - nextjs
createdDate: June 30 2024
updatedDate:
draft: false
---

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

---

## Setup

### 1. Install Node.js

We'll use `nvm` to install Node.js.

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
```

Install `bun`.

```shell
sudo npm install -g bun
```

### 2. Setup Next.js App

Install PM2.

```shell
sudo npm install -g pm2
```

Create a new `ecosystem.config.js` file in your project root directory. You should commit this file.

```js
module.exports = {
  apps: [
    {
      name: 'next-app',
      port: '3000',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'development',
        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        // Add your env variables here
      },
    },
  ],
}
```

Clone and build the app.

```shell
cd
git clone git@github.com:user/next-app.git next-app
mv next-app /var/www/next-app/
cd /var/www/next-app
```

```shell
bun install --frozen-lockfile
bun run build
```

Start the app in background via PM2.

```shell
pm2 start ecosystem.config.js
pm2 save  # Save the process lists
pm2 startup
pm2 startup systemd -u ubuntu --hp /home/ubuntu  # Ensure to start the daemon on reboot
pm2 list  # See all processes
```

> If you update your app, you can reload PM2 with:
> 
> ```shell
> pm2 reload ecosystem.config.js
> ```

### 3. Configure NGINX

Install NGINX

```shell
sudo apt install nginx
```

Create a new file `/etc/nginx/sites-available/next-app`, and add:

```nginx
server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
```

Enable the site

```shell
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/next-app /etc/nginx/sites-enabled/
```

Reload NGINX and PM2

```shell
pm2 reload 'next-app'
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 4. Setup Firewall

```shell
sudo ufw allow 80,443/tcp
```

### 5. Set Up SSL (Optional)

To secure your site with HTTPS, you can use Let's Encrypt to obtain an SSL certificate:

```shell
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## References

1. [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)
2. [https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)