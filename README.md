# 🌐 Panos TypeScript SDK

![Stage](https://img.shields.io/badge/stage-alpha-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Language](https://img.shields.io/github/languages/top/cdot65/pan-os-typescript?color=blue&label=TypeScript)

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

**Generating an API key:**

```typescript
// tests/testGenerateApiKey.ts

// Import dotenv for managing environment variables
import dotenv from 'dotenv';

// Configure dotenv to load environment variables based on the current environment
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Import necessary classes from the SDK
import { BaseClient } from 'pan-os-typescript';
import { FirewallService } from 'pan-os-typescript';

/**
 * Test script for generating an API key using the SDK's FirewallService.
 * This script demonstrates how to use the SDK to programmatically generate
 * an API key required for authenticating further API requests.
 */
async function testGenerateApiKey() {
  // Retrieve PAN-OS username and password from environment variables
  const username = process.env.PANOS_USERNAME || '';
  const password = process.env.PANOS_PASSWORD || '';

  // Initialize BaseClient with the PAN-OS device's base URL
  const baseClient = new BaseClient('https://datacenter.cdot.io');
  // Create an instance of FirewallService with the configured BaseClient
  const firewallService = new FirewallService(baseClient);

  try {
    // Check if username and password are set
    if (!username || !password) {
      throw new Error(
        'Username or password is not set in environment variables.',
      );
    }

    // Use the FirewallService instance to generate an API key
    const apiKey = await firewallService.generateApiKey(username, password);

    // Log the generated API key
    console.log('Generated API Key:', apiKey);
  } catch (error) {
    // Handle and log any errors encountered during API key generation
    console.error('Error:', error);
  }
}

// Execute the test function
testGenerateApiKey();
```

Executing with `ts-node`:

```bash
ts-node testGenerateApiKey.ts
Generated API Key: {
  key: 'LUFRPT1OMERyZmhrbW9HN2ZNMUhRMDhXSm9yL3JEOXc9N2dxVE1qdUZFM0FROE40Tm9WVFRLSmx5QWRCdnlKRnduQ3dDZUxPek5hMXpJcGJnVVU5R1lMMEUvckdRSHg2d215OUE1amd3WTBVRXROeDNvajFHZ1E9PQ=='
}
```

**Executing an operational CLI command:**

```typescript
// tests/testExecuteOperationalCommand.ts

// Importing dotenv to manage environment variables
import dotenv from "dotenv";

// Configuring environment variables based on the environment (production or development)
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

// Importing necessary classes from the SDK
import { BaseClient } from "pan-os-typescript";
import { FirewallService } from "pan-os-typescript";

/**
 * Test script to execute operational commands on a PAN-OS device.
 * This script demonstrates how to use the SDK's FirewallService to execute
 * operational commands and handle responses.
 */
async function testExecuteOperationalCommand() {
  // Retrieve the API key from environment variables
  const apiKey = process.env.PANOS_API_KEY || "";
  if (!apiKey) {
    throw new Error("API key is not set in environment variables.");
  }

  // Initialize BaseClient with the base URL and API key
  const baseClient = new BaseClient("https://datacenter.cdot.io", apiKey);

  // Instantiate FirewallService with the configured BaseClient
  const firewallService = new FirewallService(baseClient);

  try {
    // Retrieve the command line argument or use a default command
    const cliCmd = process.argv[2] || 'show interface "management"';

    // Execute the operational command using FirewallService
    const cliCommandResponse = await firewallService.executeOperationalCommand(
      apiKey,
      cliCmd
    );

    // Log the command and its response for verification
    console.log(
      "CLI Command: " + cliCmd,
      "\n",
      JSON.stringify(cliCommandResponse, null, 2)
    );
  } catch (error) {
    // Handle and log any errors during command execution
    console.error("Error executing operational command:", error);
  }
}

// Execute the test function
testExecuteOperationalCommand();
```

Execute with `ts-node`:

```bash
❯ ts-node testExecuteOperationalCommand.ts 'show system info'
CLI Command: show system info
 {
  "response": {
    "$": {
      "status": "success"
    },
    "result": [
      {
        "system": [
          {
            "hostname": [
              "DataCenter"
            ],
            "ip-address": [
              "10.0.0.3"
            ],
            "public-ip-address": [
              "unknown"
            ],
            "netmask": [
              "255.255.255.0"
            ],
            "default-gateway": [
              "10.0.0.1"
            ],
            "is-dhcp": [
              "no"
            ],
            "ipv6-address": [
              "unknown"
            ],
            "ipv6-link-local-address": [
              "fe80::8e36:7a00:0000:0000/64"
            ],
            "mac-address": [
              "8c:36:7a:00:00:00"
            ],
            "time": [
              "Thu Dec 21 09:09:32 2023\n"
            ],
            "uptime": [
              "4 days, 3:11:15"
            ],
            "devicename": [
              "DataCenter"
            ],
            "family": [
              "400"
            ],
            "model": [
              "PA-440"
            ],
            "serial": [
              "012345678901"
            ],
            "base_mac": [
              "c8:29:c8:49:be:00"
            ],
            "mac_count": [
              "254"
            ],
            "cloud-mode": [
              "non-cloud"
            ],
            "sw-version": [
              "11.0.3"
            ],
            "global-protect-client-package-version": [
              "6.2.2"
            ],
            "device-dictionary-version": [
              "106-456"
            ],
            "device-dictionary-release-date": [
              "2023/12/14 16:38:55 CST"
            ],
            "app-version": [
              "8790-8462"
            ],
            "app-release-date": [
              "2023/12/14 17:07:49 CST"
            ],
            "av-version": [
              "4668-5186"
            ],
            "av-release-date": [
              "2023/12/16 06:03:28 CST"
            ],
            "threat-version": [
              "8790-8462"
            ],
            "threat-release-date": [
              "2023/12/14 17:07:49 CST"
            ],
            "wf-private-version": [
              "0"
            ],
            "wf-private-release-date": [
              "unknown"
            ],
            "url-db": [
              "paloaltonetworks"
            ],
            "wildfire-version": [
              "0"
            ],
            "wildfire-rt": [
              "Disabled"
            ],
            "url-filtering-version": [
              "20231221.20228"
            ],
            "global-protect-datafile-version": [
              "0"
            ],
            "global-protect-datafile-release-date": [
              "unknown"
            ],
            "global-protect-clientless-vpn-version": [
              "0"
            ],
            "logdb-version": [
              "11.0.0"
            ],
            "plugin_versions": [
              {
                "entry": [
                  {
                    "$": {
                      "name": "dlp",
                      "version": "4.0.2"
                    },
                    "pkginfo": [
                      "dlp-4.0.2"
                    ]
                  }
                ]
              }
            ],
            "platform-family": [
              "400"
            ],
            "vpn-disable-mode": [
              "off"
            ],
            "multi-vsys": [
              "off"
            ],
            "ZTP": [
              "Disabled"
            ],
            "operational-mode": [
              "normal"
            ],
            "advanced-routing": [
              "off"
            ],
            "device-certificate-status": [
              "Valid"
            ]
          }
        ]
      }
    ]
  }
}
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
