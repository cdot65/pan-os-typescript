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

  console.log('Attempting to find existing AddressObject by name...');
  const existingObject = firewall.find('test123', AddressObject);

  if (!existingObject || !(existingObject instanceof AddressObject)) {
    console.error(
      `AddressObject '${argv.name}' not found or is of incorrect type.`,
    );
    return;
  }

  console.log(`Updating AddressObject '${argv.name}' with new values...`);
  existingObject.value = argv.value;
  existingObject.type = argv.type;
  existingObject.description = argv.description;
  existingObject.tag = argv.tag
    ? argv.tag.filter((t) => t !== undefined)
    : undefined;

  try {
    console.log(
      'Attempting to apply changes to the AddressObject on the PAN-OS device...',
    );
    await existingObject.apply();
    console.log(
      `AddressObject '${argv.name}' updated successfully on PAN-OS device.`,
    );
  } catch (error) {
    console.error(
      'Error in applying changes to address object on PAN-OS device:',
      error,
    );
  }
}

testAddressObjectApply();
