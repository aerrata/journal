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

Why adjust TTL? Setting TTL to 65 masks hotspot activity, making packets look like they're from a single device, bypassing restrictions.

### Prerequisites

1. Administrative privileges
2. Connected to your phone mobile hotspot

### Step A: macOS

1. Open Terminal
2. Run the following command

   ```shell
   sudo sysctl net.inet.ip.ttl=65
   ```

### Step B: Linux

1. Open Terminal
2. Run the following command

   ```shell
   sudo sysctl -w net.ipv4.ip_default_ttl=65
   ```

### Step C: Windows

1. Open Command Prompt as Administrator
2. Run the following command

   ```shell
   netsh int ipv4 set glob defaultcurhoplimit=65
   ```

   ```shell
   netsh int ipv6 set glob defaultcurhoplimit=65
   ```

### Default TTL/Hop Limit Values

Default values vary across operating systems

| Operating System             | Default TTL |
| ---------------------------- | ----------- |
| Linux Kernel 5.x (2024)      | 64          |
| MacOS (2024, latest version) | 64          |
| Windows 11 (2024)            | 128         |
| Windows Server 2022 (2024)   | 128         |
