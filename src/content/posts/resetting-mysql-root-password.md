---
title: Resetting MySQL Root Password
description: Easily reset your MySQL root password
image:
tags:
  - mysql
createdDate: Dec 17 2023
updatedDate:
draft: false
---

MySQL safe mode allows you to start the MySQL server without loading the user privilege tables. This is helpful for recovery tasks like resetting the root password or addressing user authentication issues.

When MySQL is in safe mode, access to the database is unrestricted, enabling direct modification of user data without needing authentication.

---

### Step 1: Stop MySQL Service

```bash
sudo systemctl stop mysql
```

### Step 2: Start MySQL in Safe Mode

Start MySQL in safe mode with the `--skip-grant-tables` option to bypass authentication.

```bash
sudo mysqld_safe --skip-grant-tables --skip-networking &
```

If you encounter an error about `Directory '/var/run/mysqld' for UNIX socket file don't exists`, run the following:

```bash
sudo mkdir -p /var/run/mysqld
sudo chown mysql:mysql /var/run/mysqld
sudo chmod 755 /var/run/mysqld
```

### Step 3: Access MySQL

Open a new terminal window and log into the MySQL prompt as the root user without a password.

```bash
mysql -u root
```

### Step 4: Set the Root Password

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'new_password';
EXIT;
```

### Step 5: Restart MySQL Service

Restart the MySQL service to apply the new password and disable safe mode.

```bash
ps aux | grep mysql # Select the mysql PID
sudo kill MYSQL_PID
```

### Step 6: Verify the New Password

Finally, log into MySQL with the new password to verify that the root password has been updated.

```bash
mysql -u root -p
```
