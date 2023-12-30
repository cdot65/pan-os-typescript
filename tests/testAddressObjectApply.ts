// tests/testAddressObjectApply.ts

import dotenv from 'dotenv';
import { Firewall, AddressObject, AddressType } from '../src/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

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
  logLevel: string;
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

// Set the logger level based on the argument
logger.level = argv.logLevel;

async function testAddressObjectApply() {
  logger.info('Initializing test for applying an address object...');

  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  logger.info(`Creating a Firewall instance with hostname: ${hostname}`);
  const firewall = new Firewall(hostname, apiKey);

  logger.info(`Creating an AddressObject with name: ${argv.name}`);
  const addressObject = new AddressObject(
    argv.name,
    argv.value,
    argv.type,
    argv.description,
    argv.tag ? argv.tag.filter((t) => t !== undefined) : undefined,
  );

  logger.info('Adding AddressObject to the Firewall object...');
  firewall.addChild(addressObject);

  // Verifying if the AddressObject is successfully added
  if (firewall.hasChild(addressObject)) {
    logger.info(`AddressObject '${argv.name}' added to Firewall.`);
  } else {
    throw new Error(`Failed to add AddressObject '${argv.name}' to Firewall.`);
  }

  try {
    logger.info('Attempting to apply AddressObject on the PAN-OS device...');
    await addressObject.apply();
    logger.info(
      `Address Object '${argv.name}' applied successfully on PAN-OS device.`,
    );
  } catch (error) {
    console.error('Error in applying address object on PAN-OS device:', error);
  }
}

testAddressObjectApply();
