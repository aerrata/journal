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

### **Prerequisites**

1. A Linux or macOS terminal
2. Git installed
3. A GitHub account

### **Step 1: Initializing the Repository**

1. Initialize a bare Git repository in your home directory

   ```shell
   cd
   git init --bare $HOME/.dotfiles
   ```

   This will creates a hidden Git config directory `.dotfiles`

2. Create an alias for working with dotfiles

   ```shell
   alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
   config config --local status.showUntrackedFiles no
   ```

   - **`alias config`**: Allows you to use the `config` alias instead of `git` to work specifically with dotfiles.
   - **`status.showUntrackedFiles no`**: Hides untracked files to keep your `config status` output clean.

3. Persist the alias by adding it to your shell configuration file (e.g., `.zshrc` or `.bashrc`)

   ```shell
   echo "alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'" >> $HOME/.zshrc
   ```

4. Reload the shell configuration

   ```shell
   source $HOME/.zshrc
   ```

### **Step 2: Connecting to a Remote Repository**

1. Create a new repository on GitHub
2. Link the local repository to the remote

   ```shell
   config remote add origin YOUR_REPO_URL
   ```

3. Push the repository to GitHub and set the default branch

   ```shell
   config push -u origin main
   ```

### **Step 3: Managing Dotfiles**

With the setup complete, you can now use the `config` alias to track files in your `$HOME` directory

1. Check the repository's status

   ```shell
   config status
   ```

2. Add and commit a file:

   ```shell
   config add .zshrc
   config commit -m "Add zshrc configuration"
   ```

3. Push changes to the remote repository:

   ```shell
   config push
   ```

   Repeat these steps for any additional configuration files you want to track

### **Conclusion**

Using a bare Git repository for dotfiles is a simple yet powerful way to manage and share your configurations. By following this guide, you ensure that your environment remains consistent and reproducible across devices.
