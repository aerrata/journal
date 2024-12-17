---
title: Bypass Telco Hotspot Limit
description: Screw Up Your Telco
image:
tags:
  - linux
createdDate: Aug 12 2023
updatedDate: June 2 2024
draft: false
---

**TTL (Time-to-Live)** is a packet value that decreases with each network hop. Telcos monitor TTL to detect and throttle hotspot usage by identifying mismatched values between devices and routers.

Why adjust TTL? Setting TTL to `65` masks hotspot activity, making packets look like they're from a single device, bypassing restrictions.

---

### Connect to your phone mobile hotspot

### macOS

Set the hop limit

```shell
sudo sysctl net.inet.ip.ttl=65
```

### Linux

Set the hop limit

```shell
sudo sysctl -w net.ipv4.ip_default_ttl=65
```

### Windows

1. Open Command Prompt as Administrator
2. Set the hop limit

   ```shell
   netsh int ipv4 set glob defaultcurhoplimit=65
   ```

   ```shell
   netsh int ipv6 set glob defaultcurhoplimit=65
   ```

### Default TTL/Hop Limit Values

Default values vary across OS. Rerun the above with the OS default TTL value

| OS                           | Default TTL |
| ---------------------------- | ----------- |
| Linux Kernel 5.x (2024)      | 64          |
| MacOS (2024, latest version) | 64          |
| Windows 11 (2024)            | 128         |
| Windows Server 2022 (2024)   | 128         |
