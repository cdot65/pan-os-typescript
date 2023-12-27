// tests/testEditAddressObject.ts

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
  value?: string;
  type?: AddressType;
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
      description: 'Name of the address object to edit',
    },
    value: {
      type: 'string',
      alias: 'v',
      description: 'New value of the address object (optional)',
    },
    type: {
      type: 'string',
      choices: ['ip-netmask', 'ip-range', 'ip-wildcard', 'fqdn'],
      alias: 't',
      description: 'New type of the address object (optional)',
    },
    description: {
      type: 'string',
      alias: 'd',
      description: 'New description of the address object (optional)',
    },
    tag: {
      type: 'array',
      alias: 'g',
      description: 'New tags for the address object (optional)',
    },
  })
  .parseSync() as Arguments;

/**
 * Test script to edit an address object in PAN-OS using values from command line arguments.
 */
async function testEditAddressObject() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize the firewall instance.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Create the address object with the existing name.
    const addressObject = new AddressObject(
      argv.name,
      `${argv.value}`,
      argv.type,
    );

    // Update fields based on command line arguments.
    if (argv.description) addressObject.description = argv.description;
    if (argv.tag) addressObject.tag = argv.tag;

    console.log('Address Object:', addressObject);

    // Fields to edit
    const fieldsToEdit: Array<keyof AddressObject> = Object.keys(argv).filter(
      (key) => argv[key as keyof Arguments] !== undefined,
    ) as Array<keyof AddressObject>;

    // Attempt to edit the address object on the PAN-OS device.
    const response = await firewall.editAddressObject(
      addressObject,
      fieldsToEdit,
    );

    // Log the response from the PAN-OS API.
    console.log(
      'Edit Address Object Response:',
      JSON.stringify(response, null, 2),
    );
  } catch (error) {
    // Log any errors encountered during address object editing.
    console.error('Error:', error);
  }
}

// Execute the test function.
testEditAddressObject();
