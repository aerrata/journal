---
title: Setup MariaDB Galera Cluster with MariaDB MaxScale on Ubuntu
description: Setup and configure a multi-primary node MariaDB Galera Cluster and MaxScale for read/write splitting on Ubuntu
tags: ['devops']
image:
createdDate: May 21 2025
updatedDate:
draft: true
---

MariaDB Galera Cluster is a synchronous multi-master database cluster solution that provides MariaDB high availability and data consistency. MariaDB MaxScale is a database proxy that can be used to improve the performance, scalability, and security of MariaDB Galera Cluster.

Using MariaDB MaxScale with MariaDB Galera Cluster offers several key benefits, including improved read throughput, deadlock avoidance on commit, and high availability guarantees. This means that your database will be more resilient to failures and will be able to handle more traffic.

---

## Prerequisites

| Description    | IP Address    | Allowed ports          |
| -------------- | ------------- | ---------------------- |
| MaxScale proxy | 172.31.33.100 | 3307, 8989             |
| MariaDB node 1 | 172.31.33.101 | 3306, 4567, 4568, 4444 |
| MariaDB node 2 | 172.31.33.102 | 3306, 4567, 4568, 4444 |
| MariaDB node 3 | 172.31.33.103 | 3306, 4567, 4568, 4444 |

## Setup MariaDB Galera Cluster Nodes

### 1. Install MariaDB

We will work on the first node

```bash
sudo apt update
```

```bash
sudo apt install mariadb-client mariadb-server rsync
sudo mysql_secure_installation
```

### 2. Configure Galera

```ini

```

### 3. Enable Replication

### 4. Configure Firewall

| Port | Purpose                          |
| ---- | -------------------------------- |
| 3306 | MySQL client connections         |
| 4567 | Galera replication               |
| 4568 | Incremental state transfer (IST) |
| 4444 | State snapshot transfer (SST)    |

### 5. Verify

## Setup MariaDB MaxScale

### 1. Install MaxScale

```bash
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash
sudo apt install maxscale
```

### 2. Configure MaxScale

Edit the MaxScale config file which is located at `/etc/maxscale.cnf`. You need to configure the `servers`, `monitor`, `services` and `listeners`. 

```ini
[maxscale]
threads=auto

[node1]
type=server
address=172.31.33.101
port=3306

[node2]
type=server
address=172.31.33.102
port=3306

[node3]
type=server
address=172.31.33.103
port=3306

[Galera-Monitor]
type=monitor
module=galeramon
servers=node1,node2,node3
user=monitor_user
password=monitor_password
monitor_interval=2000ms

[Splitter-Service]
type=service
router=readwritesplit
servers=node1,node2,node3
user=maxscale_user
password=maxscale_password

[Splitter-Listener]
type=listener
service=Splitter-Service
port=3306
```

You can check the config with:

```bash
maxscale --config-check
```

Create a user account for the Monitor

```sql
CREATE USER 'monitor_user'@'%' IDENTIFIED BY 'monitor_password';
```

Create a user account for MaxScale

```sql
CREATE USER 'maxscale_user'@'%' IDENTIFIED BY 'maxscale_password';
GRANT SELECT ON mysql.user TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.db TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.tables_priv TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.columns_priv TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.procs_priv TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.proxies_priv TO 'maxscale_user'@'%';
GRANT SELECT ON mysql.roles_mapping TO 'maxscale_user'@'%';
GRANT SHOW DATABASES ON *.* TO 'maxscale_user'@'%';
```

Create client user account. Your app will use this user to connect to MaxScale

```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'app_password';
```

Start MaxScale

```bash
sudo systemctl start maxscale
```

Checking MaxScale status with MaxCtrl

```bash
sudo maxctrl list services
sudo maxctrl list servers
sudo maxctrl list listeners
```

### 3. Enable MaxScale MaxGUI

```ini
[maxscale]
admin_host=0.0.0.0
admin_secure_gui=false
```

You can access the MaxGUI monitoring dashboard with the port `8989`. Eg: [http://172.31.33.100:8989]()

MaxGUI uses the same credentials as `maxctrl`. The default username is `admin` with `mariadb` as the password.

### 4. Configure Firewall

| Port | Purpose                     |
| ---- | --------------------------- |
| 8989 | MaxGUI monitoring dashboard |

### 5. Verify

You can connect to the proxy with:

```sql
mariadb -h 172.31.33.100 -u app_user -p
```

## Conclusion

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, ipsum.

## References

- [https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-read-write-splitting-with-mariadb-maxscale](https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-read-write-splitting-with-mariadb-maxscale/)
- [https://mariadb.com/kb/en/mariadb-maxscale-25-01-getting-started](https://mariadb.com/kb/en/mariadb-maxscale-25-01-getting-started/)
- [https://mariadb.com/kb/en/mariadb-maxscale-25-01-tutorials](https://mariadb.com/kb/en/mariadb-maxscale-25-01-tutorials/)
- [https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split](https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split/)
