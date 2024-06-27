---
title: Setup Laravel App on a LEMP Stack with Ubuntu
description: Set up and run Laravel app on Ubuntu
tags: ['linux', 'laravel']
image:
publishedDate: June 2 2024
# updatedDate:
---

### Initial Setup

```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt-cache policy {package} # Check the version of installable packages
```

#### Create a Non Root User

```bash
adduser foo
usermod -aG sudo foo
```

#### Setup ZSH [^1]

[^1]: [https://github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```bash
nano ~/.zshrc
source ~/.zshrc
```

```
...

echo "Server @ $(hostname -I)"

alias pa="php artisan"

...
```

#### Install Essential Tools & Utility

```bash
sudo apt install curl git zsh ranger neofetch
```

### Install PHP & Composer

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd
sudo update-alternatives --config php # In case you have multiple PHP versions
```

```bash
sudo apt install composer
```

### Installing MySQL

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

```sql
CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON 'database.*' TO 'user'@'%';
FLUSH PRIVILEGES;
```

MySQL config file located at `/etc/mysql/mysql.conf.d/mysqld.cnf`

### Setup NGINX

```bash
sudo nano /etc/nginx/sites-available/laravel
sudo ln -s /etc/nginx/sites-available/laravel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    root /srv/example.com/public;

    # ssl_certificate /etc/ssl/certs/cert_bundle.crt; # Update this
    # ssl_certificate_key /etc/ssl/private/your_private_key.key; # Update this
 
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
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
 
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Install Node.js

#### Node.js via NVM [^2]

[^2]: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
node -v
```

#### Bun [^3]

[^3]: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)

```bash
curl -fsSL https://bun.sh/install | bash
bun install --frozen-lockfile
```

### Install Laravel App Source Code

```bash
git clone https://user@bitbucket.org/org/laravel.git laravel
```

#### Directory Permissions

Laravel will need to write to the bootstrap/cache and storage directories, so you should ensure the web server process owner has permission to write to these directories.

```bash
sudo chown -R foo:foo /var/www/laravel
sudo chmod -R 755 /var/www/laravel
sudo chown -R www-data:www-data /var/www/laravel/storage
sudo chown -R www-data:www-data /var/www/laravel/bootstrap/cache
```

```bash
composer install
npm ci
npm run build
cp .env.example .env
# Update your .env with proper info and credentials
pa key:generate
pa migrate:fresh --seed
```

### Verify

Verify by accessing your site using domain or ip address in the web browser.
