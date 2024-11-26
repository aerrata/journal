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

Setting up SSH aliases can make accessing your remote servers much simpler and quicker. Instead of remembering and typing out lengthy commands, you can create short, easy-to-remember aliases.

### Open your SSH configuration file

```shell
nano ~/.ssh/config
```

### Add your SSH aliases

In the SSH configuration file, add aliases for your remote servers. Each alias should include the hostname or IP address of the server, the username you use to connect, and any other configuration options.

```
Host phone
    HostName 192.168.1.100
    User username
    Port 2222
```

### Test

```shell
ssh phone
```
