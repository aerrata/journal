---
title: Setup Laravel App on a LEMP Stack with Ubuntu
description: Set up and run Laravel app on Ubuntu
image:
tags:
  - linux
  - laravel
createdDate: June 2 2024
updatedDate:
draft: true
---

### Initial Setup

#### Switch to `root` user

If you are not switched yet, run;

```shell
su -
```

#### Update system

```shell
apt update
apt upgrade
apt dist-upgrade
```

#### Create a Non `root` User

Using `root` user is discouraged, create a new normal user instead.

```shell
adduser foo
usermod -aG sudo foo
su foo # Switch to user 'foo'
```

So, next time you login to the server like this;

```shell
ssh foo@ip
```

#### Setup ZSH [^1]

[^1]: [https://github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
nano ~/.zshrc
```

```
...
echo "Server @ $(hostname -I)"

alias pa="php artisan"
```

```shell
source ~/.zshrc
```

#### Install Essential Tools & Utility

```shell
sudo apt install curl git zsh ranger neofetch
```

### Install PHP & Composer

```shell
sudo add-apt-repository ppa:ondrej/php
sudo apt update
PHP_VERSION=8.3
sudo apt install php$PHP_VERSION php$PHP_VERSION-fpm php$PHP_VERSION-mysql php$PHP_VERSION-xml php$PHP_VERSION-mbstring php$PHP_VERSION-curl php$PHP_VERSION-zip php$PHP_VERSION-bcmath php$PHP_VERSION-gd
sudo update-alternatives --config php # Switch PHP version, in case you have multiple versions
```

```shell
sudo apt install composer
```

### Installing MySQL

```shell
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

```shell
sudo nano /etc/nginx/sites-available/laravel
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

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

```shell
sudo ln -s /etc/nginx/sites-available/laravel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log # Check for errors
sudo tail -f /var/log/nginx/access.log # Check for errors
```

### Install Node.js

#### Node.js via NVM [^2]

[^2]: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_VERSION=22
nvm install $NODE_VERSION
node -v
```

#### Bun [^3]

[^3]: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)

```shell
curl -fsSL https://bun.sh/install | bash
bun install --frozen-lockfile
```

### Install Laravel App Source Code

```shell
cd
git clone https://user@bitbucket.org/org/laravel.git laravel
sudo mv laravel /var/www
```

#### Directory Permissions

Laravel will need to write to the bootstrap/cache and storage directories, so you should ensure the web server process owner has permission to write to these directories.

```shell
sudo chown -R foo:foo /var/www/laravel
sudo chmod -R 755 /var/www/laravel
sudo chown -R www-data:www-data /var/www/laravel/storage /var/www/laravel/bootstrap/cache
```

```shell
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

### Common Linux Commands

```shell
sudo apt-cache policy {package} # Check the version of installable packages
lsb_release -a # Check Ubuntu release version
```

### Troubleshooting

#### MySQL Error

1. `ERROR 1227 (42000) at line ...: Access denied; you need (at least one of) the SUPER privilege(s) for this operation`

#### Nginx Error

1. `[emerg] socket() [::]:80 failed (97: Address family not supported by protocol)`

In `/etc/nginx/sites-enabled/default` file;

```nginx
...
server {
        listen 80 default_server;
        listen [::]:80 default_server; # Comment this line
...
```




To set up and run jobs and the scheduler for your Laravel application on your Ubuntu server, follow these steps:

---

### **1. Configure Laravel Scheduler**

Laravel's scheduler requires a single cron job to run every minute. Here's how to set it up:

1. Open the crontab for the `www-data` user:
   ```bash
   sudo crontab -u www-data -e
   ```

2. Add the following line to run the Laravel scheduler every minute:
   ```bash
   * * * * * php /path/to/laravel/artisan schedule:run >> /dev/null 2>&1
   ```

   Replace `/path/to/laravel` with the full path to your Laravel project.

3. Save and exit the editor.

---

### **2. Run Laravel Queues**

Laravel uses a queue worker to process jobs. Start the queue worker using `artisan`:

1. Test the queue manually:
   ```bash
   php /path/to/laravel/artisan queue:work
   ```

2. To keep the queue running continuously, you should use a process manager like **Supervisor**.

---

### **3. Configure Supervisor for Laravel Queues**

1. Install Supervisor:
   ```bash
   sudo apt update
   sudo apt install supervisor
   ```

2. Create a Supervisor configuration file for your Laravel queue worker:
   ```bash
   sudo nano /etc/supervisor/conf.d/laravel-worker.conf
   ```

3. Add the following configuration (replace paths with your project details):
   ```ini
   [program:laravel-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /var/www/edewan/artisan queue:work --sleep=3 --tries=3 --timeout=90
   autostart=true
   autorestart=true
   user=www-data
   numprocs=1
   redirect_stderr=true
   stdout_logfile=/path/to/laravel/storage/logs/worker.log

   [program:laravel-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /home/forge/app.com/artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600
   autostart=true
   autorestart=true
   stopasgroup=true
   killasgroup=true
   user=forge
   numprocs=8
   redirect_stderr=true
   stdout_logfile=/var/www/edewan/storage/logs/supervisor.log
   stopwaitsecs=3600
   ```

4. Save and exit the editor.

5. Update Supervisor to apply the configuration:
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   sudo supervisorctl start laravel-worker:*
   ```

---

### **4. Verify Everything is Running**

- Check the logs to confirm the scheduler and queue are working:
  - Laravel logs: `/path/to/laravel/storage/logs/laravel.log`
  - Worker logs: `/path/to/laravel/storage/logs/worker.log`

- Use `supervisorctl` to manage the queue worker:
  ```bash
  sudo supervisorctl status
  ```

---

With this setup, the scheduler will run automatically every minute, and the queue worker will continuously process jobs in the background. Let me know if you need any troubleshooting!



-------------------------


### Minimal Steps (If No Permission Issues Exist Already)
If the writable directories already have the correct ownership (`www-data`) and you're fine with being the owner of the rest, you can skip redundant steps:

```bash
sudo chmod -R 775 /path/to/laravel/storage /path/to/laravel/bootstrap/cache
sudo chown -R $USER:www-data /path/to/laravel
```

This will likely suffice. Let me know if you want to further refine the commands!





MYSQL

Your commands are mostly correct, but to improve security and match your two-server setup, you should limit the privileges to only the IP of your application server (`192.223.1.10`). Here's the adjusted command:

```sql
CREATE USER 'images_user'@'192.223.1.10' IDENTIFIED BY 'images_password'; 
GRANT ALL PRIVILEGES ON images.* TO 'images_user'@'192.223.1.10'; 
FLUSH PRIVILEGES;
```

This ensures that the `images_user` can only connect from the application server. Additionally:

1. Make sure your database server (`192.223.1.11`) is configured to allow remote connections.
   - Update the MySQL configuration file (`/etc/mysql/my.cnf` or `/etc/mysql/mysql.conf.d/mysqld.cnf`) and set `bind-address = 192.223.1.11`.

2. Restart MySQL to apply the configuration:
   ```bash
   sudo systemctl restart mysql
   ```

3. Open the appropriate port (default is `3306`) in the firewall of the database server to allow connections from the app server.


------


You can create a database from the app server if:

1. **You have remote access** to the database server (`192.223.1.11`).
2. The MySQL user you are using (e.g., `images_user` or `root`) has sufficient privileges to create databases.

If these conditions are met, follow these steps:

### 1. Connect to the Database Server from the App Server
On the app server (`192.223.1.10`), use the following command to log in to MySQL on the DB server:
```bash
mysql -u root -p -h 192.223.1.11
```

Replace `root` with the appropriate MySQL user and provide the password when prompted.

### 2. Create the Database
Once logged in, create the database:
```sql
CREATE DATABASE images;
```

### 3. Verify
Check if the database was created:
```sql
SHOW DATABASES;
```

### Note:
- Ensure that the database server (`192.223.1.11`) allows connections from the app server IP (`192.223.1.10`) by properly configuring `bind-address` in MySQL and opening the necessary firewall ports.
- If the `images_user` does not have permissions to create a database, use a privileged account like `root`.

Let me know if you encounter any issues!






curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm install-latest-npm
