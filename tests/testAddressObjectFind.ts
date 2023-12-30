// tests/testAddressObjectFind.ts

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

async function testAddressObjectFind() {
  logger.debug('Initializing test for finding an address object...');

  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  logger.debug(`Creating a Firewall instance with hostname: ${hostname}`);
  const firewall = new Firewall(hostname, apiKey);

  logger.debug(`Creating an AddressObject with name: ${argv.name}`);
  const addressObject = new AddressObject(
    argv.name,
    argv.value,
    argv.type,
    argv.description,
    argv.tag,
  );

  logger.debug('Adding AddressObject to the Firewall object...');
  firewall.addChild(addressObject);

  logger.debug('Attempting to find AddressObject by name...');
  const foundObject = firewall.find(argv.name, AddressObject);

  if (foundObject) {
    logger.debug(`Found AddressObject '${argv.name}'.`);
    logger.debug('AddressObject Details:', {
      name: foundObject.name,
      value: foundObject.value,
      type: foundObject.type,
      description: foundObject.description,
      tag: foundObject.tag,
    });
  } else {
    console.error(`AddressObject '${argv.name}' not found.`);
  }
}

testAddressObjectFind();
