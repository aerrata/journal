---
title: Booting Arch Linux with EFISTUB
description: Boot using EFISTUB instead of GRUB bootloader
image: ./arch.jpg
tags:
  - linux
createdDate: Jul 08 2022
updatedDate: June 2 2024
draft: false
---

**UEFI (Unified Extensible Firmware Interface)** is designed to streamline the boot process by allowing the system to boot directly into the operating system without the need for an intermediate bootloader such as GRUB. Using EFISTUB, you can configure your Arch Linux system to boot directly from UEFI by embedding the kernel and its parameters within a UEFI boot entry.

This approach will set up EFISTUB using the `bcfg` command available in UEFI Shell v2, accessible from an Arch Linux live ISO.

---

### Step 1: Access the UEFI Shell

1. Boot from your Arch Linux live USB or installation media.
2. In the boot menu, choose **UEFI Shell x86_64 v2**.
3. When the shell starts, press `ESC` to skip any startup scripts like `startup.nsh`

### Step 2: Locate the EFI System Partition (ESP)

To identify where the EFI System Partition is mounted:

1. Use the `map` command to list all storage devices:

   ```
   map
   ```

   Look for the partition labeled as `FSX:` (e.g., `FS1:`), which corresponds to your EFI System Partition.

2. Verify its contents by listing the files:

   ```
   ls FS1:
   ```

   Replace `FS1:` with the correct identifier for your ESP.

### Step 3: Add a boot entry for Arch Linux

1. Identify the kernel file (`vmlinuz-linux`) and the initramfs file (`initramfs-linux.img`) on the ESP:

   ```
   ls FS1:\boot
   ```

   Adjust the path if the files are not in `\boot`.

2. View the existing UEFI boot entries:

   ```
   bcfg boot dump
   ```

   Note the numbers to avoid conflicts with existing entries.

3. Add a new boot entry pointing to the Arch Linux kernel. For example:

   ```
   bcfg boot add 0 FS1:\boot\vmlinuz-linux "Arch Linux"
   ```

   - `0` is the position in the boot menu. Adjust as needed.
   - Replace `FS1:\boot\vmlinuz-linux` with the correct path to your kernel.

4. Add kernel parameters.

   ```
   bcfg boot -opt 0 "root=/dev/sda2 rw initrd=\boot\initramfs-linux.img"
   ```

   Adjust the root device (`/dev/sda2`) to match your system.

### Step 4: Test your configuration

1. Reboot the system to apply the changes:

   ```
   reset
   ```

2. Remove the live media and verify if the system boots directly into Arch Linux.

### Managing boot entries

- **To remove an existing boot entry:**

  ```
  bcfg boot rm N
  ```

  Replace `N` with the index of the entry you want to remove (from `bcfg boot dump`).

- **To list entries again:**

  ```
  bcfg boot dump
  ```

### Troubleshooting

- **No Boot Entry**: Ensure the kernel and initramfs paths are correct, and the ESP is mounted properly
- **Invalid PARTUUID**: Double-check the UUID of your root partition using `blkid`
- **UEFI Shell Missing**: Some systems don’t include a UEFI Shell by default. Use the Arch Linux live ISO or download the shell separately

### Conclusion

With EFISTUB, you can streamline the boot process by directly booting into Arch Linux from the UEFI firmware, eliminating the need for GRUB or other bootloaders
