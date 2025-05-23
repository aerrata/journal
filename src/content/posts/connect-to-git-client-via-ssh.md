---
title: Connect to Github via SSH
description: Set up SSH to connect to your Github repository
image:
tags:
  - linux
createdDate: Oct 09 2023
updatedDate: June 2 2024
draft: false
---

**Secure Shell Protocol (SSH)** is a cryptographic network protocol that provides a secure channel over an unsecured network. In the context of Git and GitHub, SSH offers an efficient and secure method to authenticate and interact with repositories, bypassing the need to repeatedly input passwords. By configuring an SSH key pair, you can establish a trust-based connection between your local machine and GitHub.

---

### Prerequisites

- Linux or macOS
- GitHub account (or other Git hosting service, minor adjustment needed)

### Step 1: Check for existing SSH keys

Check if you already have SSH keys

```shell
ls -al ~/.ssh
```

If `~/.ssh` doesn't exist, proceed to Step 2. Otherwise, skip to Step 4

### Step 2: Generate a new SSH key pairs

Generate a new SSH key

```shell
ssh-keygen -t ed25519 -C "user@example.com"
```

Follow the prompts

```
Enter file in which to save the key (/home/user/.ssh/id_ed25519): [ENTER]
Enter passphrase (empty for no passphrase): [ENTER]
Enter same passphrase again: [ENTER]
```

### Step 3: Add the private SSH key to the SSH Agent

1. Start the SSH agent

   ```shell
   eval "$(ssh-agent -s)"
   ```

2. Add your SSH key

   ```shell
   ssh-add ~/.ssh/id_ed25519
   ```

> For macOS Sierra 10.12.2 or later, add the following to `~/.ssh/config`
>
> ```shell
> Host github.com
>   AddKeysToAgent yes
>   IdentityFile ~/.ssh/id_ed25519
> ```

### Step 4: Add your public SSH key to GitHub

1. Copy your public key to the clipboard

   ```shell
   cat ~/.ssh/id_ed25519.pub
   ```

2. Visit [Github](https://github.com)

3. Navigate to **Settings** > **SSH and GPG keys** > **New SSH key**, and paste the key

### Step 5: Test the SSH Connection

Test the connection with

```shell
ssh -T git@github.com
```

If prompted, type `yes` to confirm the connection. You'll see a success message if everything is set up correctly.
