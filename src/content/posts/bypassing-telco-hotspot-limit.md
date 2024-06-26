---
title: Bypass Telco Hotspot Limit
description: Screw Up Your Telco
tags: ['linux']
image:
publishedDate: Aug 12 2023
updatedDate: June 2 2024
---

### Setup

First, connect your wifi

#### Windows

Then open your Command Prompt as Administrator, run the following

```shell
netsh int ipv4 set glob defaultcurhoplimit=65
netsh int ipv6 set glob defaultcurhoplimit=65
```

#### MacOS

Then open your Terminal, run the following

```shell
sysctl net.inet.ip.ttl=65
```

> Default TTL and Hop Limit values vary between different operating systems 
> 1. Linux kernel 2.4 (circa 2001): 255
> 2. Linux kernel 4.10 (2015): 64
> 3. Windows XP (2001): 128
> 4. Windows 10 (2015): 128
> 5. Windows Server 2008: 128
> 6. Windows Server 2019 (2018): 128
> 7. MacOS (2001): 64

