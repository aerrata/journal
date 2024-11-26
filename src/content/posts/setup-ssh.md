---
title: Setup SSH
description: Set up SSH to connect to a Linux server
image:
tags:
  - linux
createdDate: Oct 09 2023
updatedDate: June 2 2024
draft: false
---

Using the SSH protocol, you can connect and authenticate to remote servers and services.

### Prerequisites

1. Linux or macOS

### Step 1: Checking for existing SSH keys

Before you generate a new SSH key, you should check your local machine for existing keys in `~/.ssh` directory.

```shell
ls -al ~/.ssh
```

Check the directory listing to see if you already have a public SSH key.

- id_rsa.pub
- id_ecdsa.pub
- id_ed25519.pub

> If you receive an error that ~/.ssh doesn't exist, you do not have an existing SSH key pair in the default location. You can create a new SSH key pair in the next step.

### Step 2: Generating a new SSH key

```shell
ssh-keygen -t ed25519 -C "user@example.com"
```

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519): [ENTER]
Enter passphrase (empty for no passphrase): [ENTER]
Enter same passphrase again: [ENTER]
```

### Step 3: Adding your SSH key to the ssh-agent

1. Start the ssh-agent in the background

   ```shell
   eval "$(ssh-agent -s)"
   ```

2. Add your SSH private key to the ssh-agent

   ```shell
   ssh-add ~/.ssh/id_ed25519
   ```

> If you're using macOS Sierra 10.12.2 or later, you will need to modify your ~/.ssh/config file to automatically load keys into the ssh-agent and store passphrases in your keychain
>
> 1. Open the SSH config file, create if doesn't exist
>
>    ```shell
>    nano ~/.ssh/config
>    ```
>
> 2. Modify the file to contain the following lines. If your SSH key file has a different name or path, modify to match your current setup
>
>    ```
>    Host github.com
>    AddKeysToAgent yes
>    IdentityFile ~/.ssh/id_ed25519
>    ```

### Step 4: Add your public SSH key to the server

Copy the key content to your clipboard

```shell
pbcopy < ~/.ssh/id_ed25519.pub # Or copy cat output
```

Add the public SSH key on the remote server or your git client settings page. This may differ based on what service you use

- On Github, go to **Settings** > **SSH and GPG keys** > **New SSH key**
- On Bitbucket, go to **Personal Bitbucket settings** > **SSH keys** > **Add key**

### Conclusion

To verify the setup, simply connect to the remote server or the git repository.
