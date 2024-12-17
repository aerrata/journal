---
title: Setting Up Dotfiles
description: Setup dotfiles with bare git repository
image:
tags:
  - linux
createdDate: Jan 20 2022
updatedDate: June 2 2024
draft: false
---

Easily track and synchronize your machine's config files (dotfiles) using Git

---

### Step 1: Initialize a new Git repository

1. Initialize a bare Git repository in your home directory

   ```shell
   cd
   git init --bare $HOME/.dotfiles
   ```

2. Create an `config` alias instead of `git` to work specifically with dotfiles

   ```shell
   alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
   ```

3. Hides untracked files to keep your `config status` output clean.

   ```shell
   config config --local status.showUntrackedFiles no
   ```

4. Add the alias to your shell config file

   ```shell
   echo "alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'" >> $HOME/.zshrc
   ```

5. Reload your shell

   ```shell
   source $HOME/.zshrc
   ```

### Step 2: Connect to a remote repository

1. Create a new repository on GitHub
2. Link the local repository to the remote

   ```shell
   config remote add origin YOUR_REPO_URL
   ```

3. Push the repository to GitHub and set the default branch

   ```shell
   config push -u origin main
   ```

### Step 3: Manage dotfiles

With the setup complete, you can now use the `config` alias to track files in your `$HOME` directory

1. Check the repository's status

   ```shell
   config status
   ```

2. Add and commit a file:

   ```shell
   config add .zshrc
   config commit -m "feat: add new alias"
   ```

3. Push changes to the remote repository:

   ```shell
   config push
   ```

   Repeat these steps for any additional files you want to track
