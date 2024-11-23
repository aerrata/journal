---
title: Installing MySQL Enterprise on Ubuntu 24.04
description: Downloading MySQL Enterprise with wget script
tags: ['linux', 'mysql']
image: 
publishedDate: Nov 23 2024
updatedDate: 
---

MySQL Enterprise packages are not available in Ubuntu's default repositories. You need to download them directly from the MySQL website. For this guide we will download the package via wget script instead of direct download.

### Prerequisites

1. Ubuntu 24.04 server
2. Sudo privileges
3. Access to the Oracle account

### Step 1: Download the wget script

1. Visit the [Oracle Software Delivery Cloud](https://edelivery.oracle.com/osdc/faces/SoftwareDelivery) page.
2. Log in with your Oracle account credentials (required for Enterprise editions).
3. Get the wget downloader script (refer screenshots below)

TO BE CONTINUE

### Step 2: Running the wget script

Once the wget script is downloaded, use the following commands to use it:

1. On the server, create a new directory

```shell
mkdir mysql-enterprise && cd $_
```

2. Create a new file & make it executable

```shell
touch downloader.sh && chmod +x $_
```

3. Paste the wget script content retrieved from the website earlier

```shell
nano downloader.sh
```

4. Run the script, you will be prompted with sign in credentials

```shell
./downloader.sh
```

The script will download .zip chunk files, make sure to check the wget log for any error

### Step 3: Installing the downloaded package

1. Unzip all the .zip chunk files

```shell
unzip -o *.zip
```

2. Install the .deb file

```shell
sudo dpkg -i *.deb
```

Here, your installation will be interrupted due to an unmet dependencies error

3. Fix broken dependencies

```shell
sudo apt install -f
```

This will scans the system for packages with missing or broken dependencies

### Verify

```shell
mysql --version
```

You should see "MySQL Enterprise Server - Commercial" in the output