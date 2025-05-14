---
title: Install MariaDB Galera Cluster on Ubuntu
description: Setup and configure a multi-primary node MariaDB Galera Cluster on Ubuntu
tags: ['ubuntu']
image: 
createdDate: May 14 2025
updatedDate: 
draft: true
---

This guide outlines the steps to install and configure a 3-node multi-primary MariaDB Galera Cluster on Ubuntu 24.04.

---

### Step 1: Install & Configure MariaDB Galera

Install packages:

```bash
sudo apt update
sudo apt install mariadb-server galera-4 rsync -y
```

Update firewall:

```bash
sudo ufw allow ssh,3306,4567,4568,4444/tcp
```

Edit config on each node (`/etc/mysql/mariadb.conf.d/60-galera.cnf`):

```ini
[galera]
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so
wsrep_cluster_address="gcomm://172.31.33.60,172.31.35.42,172.31.39.145"
binlog_format=row
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0
wsrep_cluster_name="MariaDB_Cluster"
wsrep_node_address="172.31.33.60"  # change per node
wsrep_node_name="node-1"           # change per node
wsrep_sst_method="rsync"
wsrep_sst_auth="sstuser:sstpassword"
```

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

---

### Step 2: Test Replication

Create a test table:

```sql
CREATE TABLE cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cats (name) VALUES 
('Node1 Cat Test'), 
('Node2 Cat Test'), 
('Node3 Cat Test');
```

Check replication across nodes:

```sql
SELECT * FROM cats;
```

---

### Conclusion

MariaDB Galera Cluster is now configured and running across:

* `172.31.33.60`
* `172.31.35.42`
* `172.31.39.145`
