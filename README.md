# 🌐 Panos TypeScript SDK

![Stage](https://img.shields.io/badge/stage-alpha-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.9-blue.svg)
![Language](https://img.shields.io/github/languages/top/cdot65/pan-os-typescript?color=blue&label=TypeScript)

- [🌐 Panos TypeScript SDK](#-panos-typescript-sdk)
  - [🚀 Introduction](#-introduction)
  - [🌟 Features](#-features)
  - [📦 Installation](#-installation)
  - [📖 Detailed Documentation](#-detailed-documentation)
  - [📚 Quick Examples](#-quick-examples)
    - [Generating an API key](#generating-an-api-key)
    - [Requesting System Info](#requesting-system-info)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [✉️ Contact](#️-contact)

## 🚀 Introduction

Panos TypeScript SDK is a modern library tailored for interacting with Palo Alto Networks firewalls and Panorama appliances. It facilitates task automation, configuration management, and data retrieval from PAN-OS devices with a focus on ease of use and modularity.

## 🌟 Features

- 🔑 Simplified API key generation.
- 🛠️ Convenient methods for PAN-OS operations.
- 🌐 Compatibility with major web frameworks like Angular and React.
- 🧩 Modular and structured service and interface design.

## 📦 Installation

```bash
npm i pan-os-typescript
```

## 📖 Detailed Documentation

For comprehensive API documentation, including usage examples, configuration details, and service descriptions, visit our [GitHub Pages](https://cdot65.github.io/pan-os-typescript/).

## 📚 Quick Examples

Examples can be found in the [tests/](tests/) directory.

### Generating an API key

```typescript
import { ApiKeyGenerator } from '../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';
import yargs from 'yargs';

/**
 * Loads environment configuration based on the NODE_ENV setting.
 * Configures the script to use either production or development environment variables.
 */
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Defines the structure for command-line arguments used in the script.
 */
interface Arguments {
  logLevel: string;
  hostname: string;
  password: string;
  username: string;
}

/**
 * Parses command-line arguments to configure the script's runtime settings.
 * Allows setting of log level, hostname, username, and password.
 */
const argv = yargs(hideBin(process.argv))
  .options({
    logLevel: {
      type: 'string',
      default: 'info',
      choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
      description: 'Set the logging level',
    },
    hostname: {
      type: 'string',
      default: process.env.PANOS_HOSTNAME || 'datacenter.cdot.io', // Provide a default value or handle the absence
      description: 'Set the target device hostname',
    },
    password: {
      type: 'string',
      default: process.env.PANOS_PASSWORD, // Adjusted to PANOS_PASSWORD
      description: 'Set the user password',
      demandOption: true, // Require this option
    },
    username: {
      type: 'string',
      default: process.env.PANOS_USERNAME,
      description: 'Set the user name',
      demandOption: true, // Require this option
    },
  })
  .parseSync() as Arguments;

// Set the logger level based on the argument
logger.level = argv.logLevel;

/**
 * Test function to generate an API key for a PAN-OS device.
 * Utilizes the ApiKeyGenerator to generate an API key based on provided credentials.
 */
async function testGenerateApiKey() {
  // Initialize the ApiKeyGenerator
  const apiClient = new ApiKeyGenerator(argv.hostname);

  try {
    // Generate an API key
    const apiKey = await apiClient.generateApiKey(
      argv.username,
      argv.password,
    );

    // Log the generated API key to the console
    logger.info(`Generated API Key: ${apiKey}`);
  } catch (error) {
    // Handle and log any errors that occur during the API key generation
    console.error('Error:', error);
  }
}

// Execute the test function to generate an API key
testGenerateApiKey();
```

Executing with `ts-node`:

```bash
$ ts-node tests/testGenerateApiKey.ts --username automation --password paloalto#1! --hostname datacenter.cdot.io
info: Generated API Key: LUFRPT1iN2N1M0Z4ZjdrT0IyZlQxUmpDVlRUOXZKVTQ9N2dxVE1qdUZFM0FROE40Tm9WVFRLSmx5QWRCdnlKRnduQ3dDZUxPek5hMXpJcGJnVVU5R1lMMEUvckdRSHg2d2ZsbTc1UzBzclozNGJhakJxYmlPc2c9PQ== {"timestamp":"2023-12-31T14:13:58.052Z"}
```




### Requesting System Info

```typescript
// tests/testShowSystemInfoResponse.ts

import { Firewall } from '../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';
import yargs from 'yargs';

/**
 * Script for testing the retrieval of system information from a PAN-OS device.
 * Demonstrates the use of the Firewall class to fetch system details.
 * Utilizes environment variables for configuration and command-line arguments to set the logging level.
 */

// Load and configure environment variables based on the current environment setting.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Defines the structure for command-line arguments used in the script.
 */
interface Arguments {
  logLevel: string;
}

// Parse command-line arguments to configure the script's runtime settings.
const argv = yargs(hideBin(process.argv))
  .options({
    logLevel: {
      type: 'string',
      default: 'info',
      choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
      description: 'Set the logging level',
    },
  })
  .parseSync() as Arguments;

// Set the logger level based on the argument
logger.level = argv.logLevel;

/**
 * Test function to retrieve and log system information from a PAN-OS device.
 * Validates the SDK's ability to interact with the device API and process the data.
 * @async
 * @throws An error if the API key is not set in the environment variables or if there is a failure in fetching the information.
 */
async function testShowSystemInfoResponse() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is present before attempting the operation; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize a new instance of the Firewall class with API key and hostname.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Fetch the system information from the PAN-OS device using the Firewall class's method.
    const systemInfo = await firewall.showSystemInfoResponse();

    // Log the retrieved system information to the console for verification.
    logger.info('System Info:', systemInfo);
  } catch (error) {
    // Log any errors encountered during the retrieval process.
    console.error('Error retrieving system info:', error);
  }
}

// Run the function to test system information retrieval.
testShowSystemInfoResponse();
```

Executing with ts-node:

```bash
$ts-node tests/testShowSystemInfo.ts
info: System Info: {"result":{"system":{"ZTP":"Disabled","advanced-routing":"off","app-release-date":"2023/12/19 16:38:55 CST","app-version":"8792-8469","av-release-date":"2023/12/16 06:03:28 CST","av-version":"4668-5186","base_mac":"c8:29:c8:49:be:00","cloud-mode":"non-cloud","default-gateway":"10.0.0.1","device-certificate-status":"Valid","device-dictionary-release-date":"2023/12/29 13:37:56 CST","device-dictionary-version":"108-460","devicename":"DataCenter","family":"400","global-protect-client-package-version":"6.2.2","global-protect-clientless-vpn-version":"0","global-protect-datafile-release-date":"unknown","global-protect-datafile-version":"0","hostname":"DataCenter","ip-address":"10.0.0.3","ipv6-address":"unknown","ipv6-link-local-address":"fe80::1f36:7aff:fe02:5485/64","is-dhcp":"no","logdb-version":"11.0.0","mac-address":"1f:36:7a:02:54:85","mac_count":"254","model":"PA-440","multi-vsys":"off","netmask":"255.255.255.0","operational-mode":"normal","platform-family":"400","plugin_versions":{"entry":{"pkginfo":"dlp-4.0.2"}},"public-ip-address":"unknown","serial":"0123456789010","sw-version":"11.0.3","threat-release-date":"2023/12/19 16:38:55 CST","threat-version":"8792-8469","time":"Sun Dec 31 08:16:31 2023\n","uptime":"14 days, 2:18:15","url-db":"paloaltonetworks","url-filtering-version":"20231231.20213","vpn-disable-mode":"off","wf-private-release-date":"unknown","wf-private-version":"0","wildfire-rt":"Disabled","wildfire-version":"0"}},"timestamp":"2023-12-31T14:16:32.437Z"}
```

## 🤝 Contributing

We welcome contributions. Please:

- Write clear and concise code.
- Include tests for new features.
- Adhere to the existing code style.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📄 License

Licensed under the [MIT License](LICENSE).

## ✉️ Contact

For queries or feedback, open an issue on [GitHub Issues](https://github.com/cdot65/pan-os-typescript/issues).
