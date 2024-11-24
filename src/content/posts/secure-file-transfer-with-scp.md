---
title: Using SCP for Secure File Transfers
description: Securely transfer files between a servers
tags: ['linux']
image:
publishedDate: Nov 24 2024
updatedDate:
---

The **Secure Copy Protocol (SCP)** is a simple and efficient way to securely transfer files between a local system and a remote server, or between two remote systems. SCP uses SSH (Secure Shell) for encryption, ensuring that your data remains secure during transit.

### Prerequisites

1. A Linux, macOS or Windows (with new Windows Terminal)
2. SSH access to the target remote server
3. Sudo privileges, if required for the files or directories

### SCP Command Syntax

```bash
scp [options] source_file destination
```

- **source_file**: The file you want to transfer. This can be a local file path or a remote file path in the format `user@host:/path/to/file`
- **destination**: The location where you want to copy the file. This can be a local path or a remote path in the same format as above

### Copying Files from Local to Remote

To copy a file from your local system to a remote server. Use the `-r` option to copy an entire directory

1. Copying `report.pdf` to the `/home/user/documents/` directory on the remote server

   ```bash
   scp report.pdf user@192.168.1.100:/home/user/documents/
   ```

### Copying Files from Remote to Local

To download a file from a remote server to your local system. Use the `-r` option to copy an entire directory

1. Downloading `report.pdf` from a remote server to your desktop

   ```bash
   scp user@192.168.1.100:/home/user/reports/report.pdf ~/Desktop/
   ```

### Conclusion

SCP is a powerful and straightforward tool for secure file transfers. Once you've mastered its basic usage, you can handle various file transfer scenarios with ease. To verify your SCP setup, test a simple file transfer and check the file's presence and integrity on the destination.
