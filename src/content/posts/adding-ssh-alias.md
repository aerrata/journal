---
title: Adding SSH Alias
description: Set up SSH aliases for easier remote server access
image:
tags:
  - linux
createdDate: Aug 12 2023
updatedDate:
draft: false
---

Create SSH aliases for quick and easy remote server access, reducing the need to remember lengthy commands.

---

### Add new SSH alias

1. Open the SSH config file

   ```shell
   nano ~/.ssh/config
   ```

2. Add the alias for your remote server

   ```
   Host forge
       HostName 192.168.1.99
       User forge
       # Port 2222
   ```

### Test the alias

To connect using the alias

```shell
ssh forge
```

Now you can access your server with just the alias `forge`, simplifying the connection process.
