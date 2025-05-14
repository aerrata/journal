---
title: Multipass Command Cheatsheet
description: Quick reference guide for common Multipass commands to manage Ubuntu VMs efficiently.
tags: ['linux']
image: 
createdDate: May 10 2025
updatedDate: May 10 2025
draft: false
---

A quick and handy cheatsheet for working with Multipass – a lightweight VM manager for Ubuntu.

---

### Launching Instances

Start new Ubuntu VMs with custom configurations.

```bash
multipass launch --name my-vm                                  # Launch default Ubuntu VM
multipass launch 22.04 --name jammy-vm                         # Launch Ubuntu 22.04
multipass launch -c 2 -m 2G -d 10G --name custom-vm            # Launch with 2 CPU, 2GB RAM, 10GB disk
multipass launch --cloud-init config.yaml --name cloudinit-vm  # Launch with cloud-init config
```

### Managing Instances

Start, stop, delete, and inspect VMs.

```bash
multipass list           # List all instances
multipass stop my-vm     # Stop an instance
multipass start my-vm    # Start an instance
multipass restart my-vm  # Restart an instance
multipass delete my-vm   # Mark instance for deletion
multipass purge          # Remove deleted instances
multipass info my-vm     # Show detailed info
multipass find           # List available Ubuntu images
multipass image purge    # Remove unused images
```

### Access and Commands

Shell access or run commands inside a VM.

```bash
multipass shell my-vm                                        # Open interactive shell
multipass exec my-vm -- uname -a                             # Run command and print kernel info
multipass exec my-vm -- bash -c 'echo Hello from inside VM'  # Run custom inline shell script
```

### File Transfers

Upload and download files between host and VM.

```bash
multipass transfer ./file.txt my-vm:/home/ubuntu/file.txt  # Copy file to VM
multipass transfer my-vm:/home/ubuntu/file.txt ./file.txt  # Copy file from VM
```

### Mounting Local Folders

Mount host directories into the VM.

```bash
multipass mount ./my-folder my-vm:/home/ubuntu/mounted-folder  # Mount local folder to VM
multipass umount my-vm:/home/ubuntu/mounted-folder             # Unmount folder from VM
```

### Aliases

Create and manage shortcuts for commands.

```bash
multipass alias my-vm.ls ls-vm          # Create alias for a VM command
multipass alias                         # List all aliases
multipass unalias ls-vm                 # Remove alias
multipass set local.primary-name=my-vm  # Set default instance
```

### Conclusion

Multipass is perfect for quickly spinning up and managing Ubuntu environments. Whether you're developing, testing, or experimenting, this cheatsheet should save you time.
