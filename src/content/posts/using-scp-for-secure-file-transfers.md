---
title: Using SCP for Secure File Transfers
description: Securely transfer files between a servers
image:
tags:
  - linux
createdDate: Nov 24 2024
updatedDate:
draft: false
---

The **Secure Copy Protocol (SCP)** is a simple and efficient way to securely transfer files between a local machine and a remote server, or between two remote systems. SCP uses SSH (Secure Shell) for encryption, ensuring that your data remains secure during transit.

---

### Command syntax

```bash
scp [options] source_file destination
```

- **source_file**: The file you want to transfer. This can be a local file path or a remote file path in the format `user@host:/path/to/file`
- **destination**: The location where you want to copy the file. This can be a local path or a remote path in the same format as above
- **options**: The location where you want to copy the file. This can be a local path or a remote path in the same format as above
  - `-P 2222`: Specify a custom SSH port
  - `-r directory_name`: Recursively copy directories
  - `-i ~/.ssh/private_key.pem`: Use an SSH private key for authentication
  - `-p file.txt`: Preserve file attributes like modification time and permissions
  - `-C large_file.iso`: Enable compression for faster transfers over slow networks

### Copying files from local to remote server

Copying `report.pdf` to the `/home/user/documents/` directory on the remote server

```bash
scp report.pdf user@192.168.1.100:/home/user/documents/
```

### Copying files from remote to local machine

Downloading `report.pdf` from a remote server to your local machine

```bash
scp user@192.168.1.100:/home/user/reports/report.pdf ~/Downloads/
```
