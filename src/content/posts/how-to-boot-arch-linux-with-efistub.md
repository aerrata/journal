---
title: How to Boot Arch Linux with EFISTUB
description: Boot using EFISTUB instead of GRUB bootloader
tags: ['linux']
image: https://images.unsplash.com/photo-1510944406431-1cf21ca0b134?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
publishedDate: Jul 08 2022
# updatedDate:
# isDraft:
---

## Get into the EFI Shell

In the Arch Linux boot menu, choose `UEFI Shell x86_64 v2` to get into the EFI Shell, then press `ESC` to skip the startup.nsh

## Find the boot partition

Issue `map` to see which partition the EFI has recognized, the partition name is something like fs0, fs1, fs2 etc

Use `ls fsX:` (with X is the fs# from the mapping result)

What you’re trying to find here is the partition which contains the kernel files (/boot), it should have the `vmlinuz` and `initramfs`

## Add new boot entry

Add a new boot entry at `0` points to vmlinuz-linux (the `0` is your boot entry)

```shell
bcfg boot add 0 fs0:\vmlinuz-linux "Arch Linux"
```

## Add cmdline file

Create a new text file to store the cmdline for the kernel

```shell
edit fs0:\cmdline.txt
```

## Add your necessary kernel cmdline, here is an example

```shell
root=PARTUUID=0faee253-da44-9e4d-88ce-4658d8320486 rw video=SVIDEO-1:d quiet loglevel=1 vga=current rd.udev.log_priority=1 rd.systemd.show_status=false systemd.show_status=false nowatchdog module_blacklist=iTCO_wdt printk.devkmsg=on i915.fastboot=1 initrd=\intel-ucode.img initrd=\initramfs-linux.img
```

> Add an extra spaces at the beginning of the line in the file. There is a byte order mark at the beginning of the line that will squash any character next to it which will cause an error when booting.

The `root` value can be the PARTUUID of your root partition, check it with `blkid` command in your linux OS

If you use an Intel processor, you can install the `intel-ucode` package with pacman, then you need to add an extra `initrd` before the actual linux initramfs, something like this `root=/dev/sdx ... initrd=\intel-ucode.img initrd=\initramfs-linux.img`

Press F2 to save, F3 to exit

## Add the cmdline to the boot entry `0`

```shell
bcfg boot -opt 0 fs0:\cmdline.txt
```

## Reboot your machine

```shell
reset
```

Remove the bootable media
