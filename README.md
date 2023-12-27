# 🌐 Panos TypeScript SDK

![Stage](https://img.shields.io/badge/stage-alpha-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.6-blue.svg)
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
import dotenv from 'dotenv';

// Load environment configuration based on the NODE_ENV setting
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * A test function to generate an API key for a PAN-OS device.
 * It uses environment variables for configuration and credential details,
 * and demonstrates generating an API key using the Firewall class.
 */
async function testGenerateApiKey() {
  // Retrieve PAN-OS hostname, username, and password from environment variables
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const username = process.env.PANOS_USERNAME || '';
  const password = process.env.PANOS_PASSWORD || '';

  // Ensure username and password are provided; otherwise, throw an error
  if (!username || !password) {
    throw new Error(
      'Username or password is not set in environment variables.',
    );
  }

  // Initialize the Firewall class without an initial API key
  const firewall = new Firewall(hostname, '');

  try {
    // Attempt to generate an API key using the provided credentials
    const apiKeyResponse = await firewall.generateApiKey(username, password);

    // Extract the API key from the response
    const apiKey = apiKeyResponse.key;

    // Log the generated API key to the console
    console.log('Generated API Key:', apiKey);
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
ts-node tests/testGenerateApiKey.ts
Generated API Key: LUFRPT0vMGkvbXRlVE82VDM1TitmQmo4a0g5VFVXNDg9N2dxVE1qdUZFM0FROE40Tm9WVFRLSmx5QWRCdnlKRnduQ3dDZUxPek5hMXpJcGJnVVU5R1lMMEUvckdRSHg2d3Y1Z000Q1k4K3RYemNQczlTVVdZTnc9PQ==
```

**Creating an Address Object:**

```typescript
// tests/testCreateAddressObject.ts

import dotenv from 'dotenv';
import { Firewall, AddressObject, AddressType } from '../src/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Load the correct environment variables based on the NODE_ENV value.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Type for the command line arguments accepted by the script.
 */
interface Arguments {
  name: string;
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];
}

// Parse command line arguments using yargs.
const argv = yargs(hideBin(process.argv))
  .options({
    name: {
      type: 'string',
      demandOption: true,
      alias: 'n',
      description: 'Name of the address object',
    },
    value: {
      type: 'string',
      demandOption: true,
      alias: 'v',
      description: 'Value of the address object',
    },
    type: {
      type: 'string',
      demandOption: true,
      choices: ['ip-netmask', 'ip-range', 'ip-wildcard', 'fqdn'],
      alias: 't',
    },
    description: {
      type: 'string',
      alias: 'd',
      default: undefined,
      description: 'Description of the address object',
    },
    tag: {
      type: 'array',
      alias: 'g',
      default: undefined,
      description: 'Tags associated with the address object',
    },
  })
  .parseSync() as Arguments;

/**
 * Test script to create an address object in PAN-OS using values from command line arguments.
 * This test creates an address object by invoking the Firewall SDK methods.
 */
async function testCreateAddressObject() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize the firewall instance.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Create the address object based on command line arguments.
    const addressObject = new AddressObject(argv.name, argv.value, argv.type);
    addressObject.description = argv.description;
    if (argv.tag) addressObject.tag = argv.tag;

    // Attempt to create the address object on the PAN-OS device.
    const response = await firewall.createAddressObject(addressObject);

    // Log the response from the PAN-OS API.
    console.log(
      'Create Address Object Response:',
      JSON.stringify(response, null, 2),
    );
  } catch (error) {
    // Log any errors encountered during address object creation.
    console.error('Error:', error);
  }
}

// Execute the test function.
testCreateAddressObject();
```

Execute with `ts-node`:

```bash
ts-node tests/testCreateAddressObject.ts -n test1 -v 1.1.1.1/32 -t ip-netmask -d 'this is a test' -g 'Automation'
Create Address Object Response: {
  "status": "success",
  "code": 20,
  "message": "command succeeded"
}
```

**Running a 'show' command**

```typescript
// tests/testExecuteOperationalCommand.ts

import dotenv from 'dotenv';

// Configure environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index'; // Importing Firewall from the index

/**
 * Executes an operational command on the Firewall and logs the response.
 * The command to be executed is the second command-line argument or defaults to showing the "management" interface.
 */
async function testExecuteOperationalCommand() {
  // Define the PAN-OS hostname and API key from environment variables
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Throw an error if the API key is not provided.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Create an instance of the Firewall class with the specified hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Get the CLI command from the command-line arguments or use a default command.
    const cliCmd = process.argv[2] || 'show interface "management"';

    // Execute the operational CLI command on the PAN-OS device.
    const cliCommandResponse = await firewall.op(cliCmd);

    // Log the CLI command and its response.
    console.log(
      'CLI Command: ' + cliCmd,
      '\n',
      JSON.stringify(cliCommandResponse, null, 2),
    );
  } catch (error) {
    // Catch and log any errors that occur during the execution of the operational command.
    console.error('Error executing operational command:', error);
  }
}

// Invoke the test function to execute the operational command.
testExecuteOperationalCommand();
```

Execute with `ts-nodes`:

```bash
ts-node tests/testExecuteOperationalCommand.ts '<request><license><info/></license></request>'
CLI Command: <request><license><info/></license></request>
 {
  "response": {
    "$": {
      "status": "success"
    },
    "result": [
      {
        "licenses": [
          {
            "entry": [
              {
                "feature": [
                  "Advanced Threat Prevention"
                ],
                "description": [
                  "Advanced Threat Prevention Subcription"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Advanced URL Filtering"
                ],
                "description": [
                  "Palo Alto Networks Advanced URL License"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Advanced WildFire License"
                ],
                "description": [
                  "Access to Advanced WildFire signatures, logs, API"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "DNS Security"
                ],
                "description": [
                  "Palo Alto Networks DNS Security License"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "GlobalProtect Gateway"
                ],
                "description": [
                  "GlobalProtect Gateway License"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Logging Service"
                ],
                "description": [
                  "Device Logging Service"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "April 04, 2026"
                ],
                "expired": [
                  "no"
                ],
                "custom": [
                  {
                    "_Log_Storage_TB": [
                      "2"
                    ]
                  }
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "PAN-DB URL Filtering"
                ],
                "description": [
                  "Palo Alto Networks URL Filtering License"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "SD WAN"
                ],
                "description": [
                  "License to enable SD WAN feature"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Standard"
                ],
                "description": [
                  "10 x 5 phone support; repair and replace hardware service"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Threat Prevention"
                ],
                "description": [
                  "Threat Prevention"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "Virtual Systems"
                ],
                "description": [
                  "Additional 1 Virtual System Licenses"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "Never"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              },
              {
                "feature": [
                  "WildFire License"
                ],
                "description": [
                  "WildFire signature feed, integrated WildFire logs, WildFire API"
                ],
                "serial": [
                  "010987654321"
                ],
                "issued": [
                  "July 31, 2023"
                ],
                "expires": [
                  "June 04, 2028"
                ],
                "expired": [
                  "no"
                ],
                "authcode": [
                  ""
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

Execute with `ts-nodes`:

```bash
ts-node tests/testExecuteOperationalCommand.ts 'show system info'
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
              "fe80::8e36:7aff:fe02:5485/64"
            ],
            "mac-address": [
              "8c:36:7a:02:54:85"
            ],
            "time": [
              "Tue Dec 26 17:40:35 2023\n"
            ],
            "uptime": [
              "9 days, 11:42:18"
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
              "010987654321"
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
              "107-458"
            ],
            "device-dictionary-release-date": [
              "2023/12/22 17:14:26 CST"
            ],
            "app-version": [
              "8792-8469"
            ],
            "app-release-date": [
              "2023/12/19 16:38:55 CST"
            ],
            "av-version": [
              "4668-5186"
            ],
            "av-release-date": [
              "2023/12/16 06:03:28 CST"
            ],
            "threat-version": [
              "8792-8469"
            ],
            "threat-release-date": [
              "2023/12/19 16:38:55 CST"
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
              "20231226.20355"
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
