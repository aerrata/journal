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
sudo apt-cache policy <PACKAGE> # Check the version of installable packages
```

#### Create a Non Root User

```bash
adduser foo
usermod -aG sudo foo
```

#### Setup ZSH

[Source](https://github.com/ohmyzsh/ohmyzsh)

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

```
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

### Install Node.js

[Source](https://nodejs.org/en/download/package-manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
node -v
```

[Source](https://bun.sh/docs/installation)

```bash
curl -fsSL https://bun.sh/install | bash
bun install --frozen-lockfile
```

### Install Laravel App Source Code

```bash
git clone https://user@bitbucket.org/org/laravel.git laravel
sudo chown -R foo:foo /var/www/laravel
sudo chmod -R 755 /var/www/laravel
sudo chown -R www-data:www-data /var/www/laravel/storage
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