---
title: Setting Up Dotfiles
description: By using bare git repository
tags: ['linux']
image:
publishedDate: Jan 20 2022
# updatedDate:
# isDraft:
---

### #1 Initial Setup

Starts with this commands

```shell
git init --bare $HOME/.dotfiles
alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
config config --local status.showUntrackedFiles no
echo "alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'" >> $HOME/.zshrc
```

Setup your repo on Github, then

```shell
config remote add origin YOUR_REPO_URL
config push -u origin main
```

### #2 Usage

After you've executed the setup any file within the `$HOME` folder can be versioned with normal commands, replacing git with your newly created config alias, like:

```shell
config status
config add .config/kitty.conf
config commit -m 'Add kitty'
config add .zshrc
config commit -m 'Add zshrc'
config push
```
