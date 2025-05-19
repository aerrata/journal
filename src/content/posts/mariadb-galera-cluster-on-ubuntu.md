---
title: Setup MariaDB Galera Cluster on Ubuntu
description: Setup and configure a multi-primary node MariaDB Galera Cluster on Ubuntu
tags: ['ubuntu']
image:
createdDate: May 14 2025
updatedDate:
draft: false
---

This guide outlines the steps to install and configure a 3-node multi-primary MariaDB Galera Cluster on Ubuntu 24.04.

---

### Prerequisites

| Type   | IP Address    |
| ------ | ------------- |
| Node 1 | 172.19.92.23  |
| Node 2 | 172.19.85.98  |
| Node 3 | 172.19.89.215 |

### Installing MariaDB and rsync

```bash
sudo apt update -y && sudo apt upgrade -y
```

```bash
sudo apt install mariadb-server mariadb-client rsync -y

sudo mysql_secure_installation
```

### Configure Galera Cluster

Edit mariadb config at `/etc/mysql/mariadb.conf.d/60-galera.cnf` on each node

```ini
[galera]
binlog_format=row
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so
wsrep_cluster_address="gcomm://172.31.33.60,172.31.35.42,172.31.39.145" # specify all nodes in cluster
wsrep_cluster_name="mariadb_cluster" # any cluster name
wsrep_node_address="172.31.33.60" # specify this host's IP address
wsrep_node_name="node_1"
wsrep_sst_method="rsync"
wsrep_sst_auth="sstuser:sstpassword"
```

Run this once on any node

```sql
CREATE USER 'sstuser'@'%' IDENTIFIED BY 'sstpassword';
GRANT RELOAD, LOCK TABLES, PROCESS, REPLICATION CLIENT ON *.* TO 'sstuser'@'%';
FLUSH PRIVILEGES;
```

### Enabling Replication

Start MariaDB:

```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

On first node only:

```bash
sudo galera_new_cluster
```

Then start on other nodes:

```bash
sudo systemctl start mariadb
```

### Configure Firewall Settings

In addition to standard MariaDB port 3306, Galera Cluster replication also uses ports 4567, 4568, and 4444.

| Port | Protocol | Purpose                          |
| ---- | -------- | -------------------------------- |
| 3306 | TCP      | MySQL client connections         |
| 4567 | TCP/UDP  | Galera replication               |
| 4568 | TCP/UDP  | Incremental state transfer (IST) |
| 4444 | TCP      | State snapshot transfer (SST)    |

1. Allow SSH:

```bash
sudo ufw allow ssh
```

2. Allow TCP/UDP on ports 3306, 4567, 4568, 4444 from other nodes, eg: on node 1:

```bash
sudo ufw allow from 172.19.85.98 to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from 172.19.85.98 to any port 3306,4567,4568,4444 proto udp

sudo ufw allow from 172.19.89.215 to any port 3306,4567,4568,4444 proto tcp
sudo ufw allow from 172.19.89.215 to any port 3306,4567,4568,4444 proto udp
```

3. Repeat for all nodes.

4. Enable and check UFW:

```bash
sudo ufw enable
sudo ufw status
```

### Verify

Check cluster status:

```sql
SHOW STATUS LIKE 'wsrep_cluster_size';
SHOW STATUS LIKE 'wsrep_local_state_comment';
```

Create a test table from any node

```sql
CREATE TABLE cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cats (name) VALUES
('Cat 1 Test'),
('Cat 2 Test'),
('Cat 3 Test');
```

Check replication across nodes

```sql
SELECT * FROM cats;
```
