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
