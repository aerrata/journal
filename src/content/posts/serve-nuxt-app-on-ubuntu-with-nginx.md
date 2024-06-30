---
title: Serve Nuxt App on Ubuntu with Nginx
description: Use Nginx to server your Nuxt app
tags: ['linux', 'nginx', 'pm2', 'nuxt']
image:
publishedDate: Mar 22 2024
# updatedDate:
---

#### Instal Node.js via NVM [^1]

[^1]: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_VERSION=22
nvm install $NODE_VERSION
node -v
```

### Install PM2 [^2]

[^2]: [https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

```bash
sudo npm install -g pm2
```

### Install Nuxt App

```bash
cd
git clone https://user@bitbucket.org/org/nuxt-app.git nuxt-app
sudo mv nuxt-app /var/www
cd /var/www/nuxt-app
nano .env
```

Add this environment variables in your `.env` file

```
HOST=0.0.0.0
PORT=3000
```

```bash
npm ci
npm run build
```

Create a new `ecosystem.config.cjs` file in yor project root directory. You should commit this file.

```js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
}
```

```bash
pm2 start ecosystem.config.cjs
pm2 save # Save the process lists
pm2 startup systemd # Ensure to start the daemon on reboot
pm2 list # See all processes
```

### Setup NGINX

```bash
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

```bash
sudo ln -s /etc/nginx/sites-available/nuxt-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
```

#### Set Up SSL (Optional)

To secure your site with HTTPS, you can use Let's Encrypt to obtain an SSL certificate:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

### Verify

Verify by accessing your site using domain or ip address in the web browser.
