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
PHP_VERSION=8.3
sudo apt install php$PHP_VERSION php$PHP_VERSION-fpm php$PHP_VERSION-mysql php$PHP_VERSION-xml php$PHP_VERSION-mbstring php$PHP_VERSION-curl php$PHP_VERSION-zip php$PHP_VERSION-bcmath php$PHP_VERSION-gd
sudo update-alternatives --config php # Switch PHP version, in case you have multiple versions
```

```bash
sudo apt install composer
```

### Installing MySQL

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl restart mysql
```

```sql
CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database.* TO 'user'@'%';
FLUSH PRIVILEGES;
```

```mysql
mysql -u user -p -D database < database.sql
```

MySQL config file located at `/etc/mysql/mysql.conf.d/mysqld.cnf`

```sql
mysql -u user -p -h ip
```

### Setup NGINX

```bash
sudo nano /etc/nginx/sites-available/laravel
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
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/laravel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### Install Node.js

#### Node.js via NVM [^2]

[^2]: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_VERSION=22
nvm install $NODE_VERSION
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
sudo chown -R www-data:www-data /var/www/laravel/storage /var/www/laravel/bootstrap/cache
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

### Troubleshooting

1. `ERROR 1227 (42000) at line ...: Access denied; you need (at least one of) the SUPER privilege(s) for this operation`
