---
title: Connecting To A Server via SSH
description: Set up SSH to connect to a Linux server
tags: ['linux']
image:
publishedDate: Oct 09 2023
# updatedDate:
# isDraft:
---

### #1 Checking for existing SSH keys

Check the directory listing to see if you already have a public SSH key.

```shell
ls -al ~/.ssh
```

### #2 Generating a new SSH key and adding it to the ssh-agent

After you've checked for existing SSH keys, you can generate a new SSH key to use for authentication, then add it to the ssh-agent.

```shell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### #3 Adding your SSH key to the ssh-agent

Start the ssh-agent in the background

```shell
eval "$(ssh-agent -s)"
```

> If you're using macOS Sierra 10.12.2 or later, you will need to modify your ~/.ssh/config file to automatically load keys into the ssh-agent and store passphrases in your keychain.
>
> ```shell
> Host github.com
>   AddKeysToAgent yes
>   IdentityFile ~/.ssh/id_ed25519
> ```

Add your SSH private key to the ssh-agent

```shell
ssh-add ~/.ssh/id_ed25519
```

### #4 Add your new SSH key to the server
