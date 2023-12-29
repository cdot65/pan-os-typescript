// tests/testAddressObjectApply.ts

import dotenv from 'dotenv';
import { Firewall, AddressObject, AddressType } from '../src/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Load environment variables.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

interface Arguments {
  name: string;
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];
}

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

async function testAddressObjectApply() {
  console.log('Initializing test for applying an address object...');

  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  console.log(`Creating a Firewall instance with hostname: ${hostname}`);
  const firewall = new Firewall(hostname, apiKey);

  console.log(`Creating an AddressObject with name: ${argv.name}`);
  const addressObject = new AddressObject(
    argv.name,
    argv.value,
    argv.type,
    argv.description,
    argv.tag ? argv.tag.filter((t) => t !== undefined) : undefined,
  );

  console.log('Adding AddressObject to the Firewall object...');
  firewall.addChild(addressObject);

  // Verifying if the AddressObject is successfully added
  if (firewall.hasChild(addressObject)) {
    console.log(`AddressObject '${argv.name}' added to Firewall.`);
  } else {
    throw new Error(`Failed to add AddressObject '${argv.name}' to Firewall.`);
  }

  try {
    console.log('Attempting to apply AddressObject on the PAN-OS device...');
    await addressObject.apply();
    console.log(
      `Address Object '${argv.name}' applied successfully on PAN-OS device.`,
    );
  } catch (error) {
    console.error('Error in applying address object on PAN-OS device:', error);
  }
}

testAddressObjectApply();
