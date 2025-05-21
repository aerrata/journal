---
title: Setup MariaDB Galera Cluster with MariaDB MaxScale on Ubuntu
description: Setup and configure a multi-primary node MariaDB Galera Cluster and MaxScale for read/write splitting on Ubuntu
tags: ['devops']
image:
createdDate: Jan 01 2024
updatedDate:
draft: true
---

MariaDB Galera Cluster is a synchronous multi-master database cluster solution that provides MariaDB high availability and data consistency. MariaDB MaxScale is a database proxy that can be used to improve the performance, scalability, and security of MariaDB Galera Cluster.

Using MariaDB MaxScale with MariaDB Galera Cluster offers several key benefits, including improved read throughput, deadlock avoidance on commit, and high availability guarantees. This means that your database will be more resilient to failures and will be able to handle more traffic.

---

### Prerequisites

| Type           | IP Address    |
| -------------- | ------------- |
| MariaDB node 1 | 172.31.33.60  |
| MariaDB node 2 | 172.31.35.42  |
| MariaDB node 3 | 172.31.39.145 |
| MaxScale proxy | 172.31.44.231 |

### Step 1: Lorem ipsum dolor sit amet

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, ipsum.

1. Lorem ipsum dolor

```bash
lorem ipsum
```

### Conclusion

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, ipsum.

### References

[https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split/](https://galeracluster.com/2024/12/mariadb-galera-cluster-with-mariadb-maxscale-getting-started-with-read-write-split/)
