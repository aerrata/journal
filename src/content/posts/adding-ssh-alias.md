---
title: Adding SSH alias
description: Set up SSH aliases for easier remote server access
tags: ['linux']
image:
publishedDate: Aug 12 2023
# updatedDate:
---

Setting up SSH aliases can make accessing your remote servers much simpler and quicker. Instead of remembering and typing out lengthy commands, you can create short, easy-to-remember aliases. Here's how to do it:

### Step 1: Open your SSH configuration file

First, open your SSH configuration file. This file is typically located at `~/.ssh/config`. You can use any text editor to open it, for example:

```shell
nano ~/.ssh/config
```

### Step 2: Add your SSH aliases

In the SSH configuration file, add aliases for your remote servers. Each alias should include the hostname or IP address of the server, the username you use to connect, and any other relevant configuration options. Here's an example:

```
Host phone
    HostName 192.168.1.100
    User username
    Port 2222
```

Replace with your actual information.

### Step 3: Save and close the file

After adding your aliases, save the SSH configuration file and close the text editor.

### Step 4: Test your aliases

To test your aliases, simply use them in place of the usual SSH command.

```shell
ssh phone
```

This will connect you to the remote server using the settings specified in your SSH configuration file.

Setting up SSH aliases can save you time and effort when managing multiple remote servers. Once configured, you can easily connect to your servers using short, memorable aliases.
