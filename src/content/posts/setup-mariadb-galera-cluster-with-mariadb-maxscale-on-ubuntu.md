---
title: Setup MariaDB Galera Cluster with MariaDB MaxScale on Ubuntu
description: Setup and configure a multi-primary MariaDB Galera Cluster and MaxScale for read/write splitting on Ubuntu
tags: ['devops']
image:
createdDate: May 21 2025
updatedDate:
draft: false
---

MariaDB Galera Cluster is a synchronous multi-master database cluster solution that provides MariaDB high availability and data consistency. MariaDB MaxScale is a database proxy that can be used to improve the performance, scalability, and security of MariaDB Galera Cluster.

Using MariaDB MaxScale with MariaDB Galera Cluster offers several key benefits, including improved read throughput, deadlock avoidance on commit, and high availability guarantees. This means that your database will be more resilient to failures and will be able to handle more traffic.

---

## Prerequisites

| Name     | Description    | IP address      | Allowed ports          |
| -------- | -------------- | --------------- | ---------------------- |
| `proxy1` | MaxScale proxy | `172.31.33.100` | 3306, 8989             |
| `node1`  | MariaDB node 1 | `172.31.33.101` | 3306, 4567, 4568, 4444 |
| `node3`  | MariaDB node 2 | `172.31.33.102` | 3306, 4567, 4568, 4444 |
| `node3`  | MariaDB node 3 | `172.31.33.103` | 3306, 4567, 4568, 4444 |

## Setup MariaDB Galera Cluster Nodes

### 1. Install MariaDB

On `node1`, `node2`, and `node3`, run:

```bash
sudo apt update
```

```bash
sudo apt install mariadb-client mariadb-server rsync
sudo mysql_secure_installation
```

### 2. Configure Galera

On `node1`, `node2`, and `node3`, edit `/etc/mysql/mariadb.conf.d/60-galera.cnf` and adjust like so:

```ini
[galera]
wsrep_on                 = ON
wsrep_cluster_name       = "MariaDB Galera Cluster"
wsrep_cluster_address    = gcomm://172.31.33.101,172.31.33.102,172.31.33.103
binlog_format            = row
default_storage_engine   = InnoDB
innodb_autoinc_lock_mode = 2

bind-address = 0.0.0.0

wsrep_sst_method=rsync
wsrep_sst_auth="sst_user:sst_password"

wsrep_node_name="node1"
wsrep_node_address="172.31.33.101"

wsrep_provider=/usr/lib/libgalera_smm.so
```

### 3. Configure User

```sql
CREATE USER 'sst_user'@'%' IDENTIFIED BY 'sst_password';
GRANT RELOAD, LOCK TABLES, PROCESS, REPLICATION CLIENT ON *.* TO 'sst_user'@'%';
FLUSH PRIVILEGES;
```

### 4. Enable Replication

Then on `node1`, you can bootstrap the nodes with:

```ini
sudo galera_new_cluster
```

Now, when can bring up `node2` and `node3` as simply as;

```sql
sudo systemctl restart mariadb
```

### 5. Configure Firewall

| Port | Purpose                          | Description                                       |
| ---- | -------------------------------- | ------------------------------------------------- |
| 3306 | MySQL client connections         | Handles connections from MySQL clients.           |
| 4567 | Galera replication               | Used for cluster node communication and writes.   |
| 4568 | Incremental state transfer (IST) | Transfers recent data changes to a joining node.  |
| 4444 | State snapshot transfer (SST)    | Sends a full data copy to a new or desynced node. |

### 6. Verify

Verify the cluster status with:

```sql
SHOW GLOBAL STATUS LIKE 'wsrep_cluster_size';
SHOW GLOBAL STATUS LIKE 'wsrep_cluster_status';
SHOW GLOBAL STATUS LIKE 'wsrep_local_state_comment';
```

You can test the replication by creating a database and table on one node, and see that the replication is happening in real time.

```sql
CREATE DATABASE foods;
USE foods;
CREATE TABLE foods (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
INSERT INTO foods (name) VALUES ('Nasi lemak'), ('Aglio olio'), ('Chicken chop');
```

Then you can verify the table contents in the other nodes:

```sql
USE foods;
SELECT * FROM foods;
```

## Setup MariaDB MaxScale

### 1. Install MaxScale

On `proxy1`, install maxscale using:

```bash
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash
sudo apt install maxscale
```

### 2. Configure User

Switch to `node1`, create a user account for the Monitor

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
FLUSH PRIVILEGES;
```

And a client user account for your app to connect to MaxScale

```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

### 3. Configure MaxScale

Back to the `proxy1`, edit the MaxScale config file located at `/etc/maxscale.cnf`. You need to configure the `servers`, `monitor`, `services` and `listeners` as follows:

```ini
[maxscale]
threads=auto

[server1]
type=server
address=172.31.33.101
port=3306

[server2]
type=server
address=172.31.33.102
port=3306

[server3]
type=server
address=172.31.33.103
port=3306

[Galera-Monitor]
type=monitor
module=galeramon
servers=server1,server2,server3
user=monitor_user
password=monitor_password
monitor_interval=2000ms

[Splitter-Service]
type=service
router=readwritesplit
servers=server1,server2,server3
user=maxscale_user
password=maxscale_password

[Splitter-Listener]
type=listener
service=Splitter-Service
port=3306
```

> You can check the config with:
>
> ```bash
> maxscale --config-check
> ```

Start MaxScale service
Start MaxScale service

```bash
sudo systemctl start maxscale
```

Check MaxScale status with MaxCtrl

```bash
sudo maxctrl show maxscale
sudo maxctrl list services
sudo maxctrl list servers
sudo maxctrl list listeners
```

### 3. Enable MaxScale MaxGUI (Optional)

Edit `/etc/maxscale.cnf`:

```ini
[maxscale]
admin_host=0.0.0.0
admin_secure_gui=false
...
```

You can access the MaxGUI monitoring dashboard using port `8989`. Eg: [http://172.31.33.100:8989]()

MaxGUI uses the same credentials as `maxctrl`. The default username is `admin` with `mariadb` as the password.

### 4. Configure Firewall

| Port | Purpose                     |
| ---- | --------------------------- |
| 3306 | MySQL client connections    |
| 8989 | MaxGUI monitoring dashboard |

### 5. Verify

You can connect to the nodes via the proxy with:

```bash
mariadb -h 172.31.33.100 -u app_user -p
```

## Conclusion

Congrats! You have setup a working multi-primary MariaDB Galera Cluster and MaxScale for read/write splitting.

Please remember to harden your setup for production workloads.

## References

- [https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-setting-up-mariadb-maxscale](https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-setting-up-mariadb-maxscale/)
- [https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-read-write-splitting-with-mariadb-maxscale](https://mariadb.com/kb/en/mariadb-maxscale-2501-maxscale-2501-read-write-splitting-with-mariadb-maxscale/)
- [https://mariadb.com/kb/en/mariadb-maxscale-25-01-getting-started](https://mariadb.com/kb/en/mariadb-maxscale-25-01-getting-started/)
- [https://mariadb.com/kb/en/mariadb-maxscale-25-01-tutorials](https://mariadb.com/kb/en/mariadb-maxscale-25-01-tutorials/)
- [https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split](https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split/)
