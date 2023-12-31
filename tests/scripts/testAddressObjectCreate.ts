// tests/testAddressObjectCreate.ts

import { AddressObject, AddressType, Firewall } from '../../src/index';

import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../../src/utils/logger';
import yargs from 'yargs';

/**
 * Script for testing the creation of address objects in Palo Alto Networks Operating System (PAN-OS).
 * Loads environment variables and uses command-line arguments to specify the details of the address object.
 */

// Load environment variables.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Defines the structure for command-line arguments used in the script.
 */
interface Arguments {
  name: string;
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];
  logLevel: string;
}

// Parse command-line arguments.
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

/**
 * Test function to create an address object on a PAN-OS device.
 * Utilizes the Firewall and AddressObject classes for this operation.
 */
async function testCreateAddressObject() {
  logger.debug('Initializing test for creating an address object...');

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

  // Verifying if the AddressObject is successfully added
  if (firewall.hasChild(addressObject)) {
    logger.debug(`AddressObject '${argv.name}' added to Firewall.`);
  } else {
    throw new Error(`Failed to add AddressObject '${argv.name}' to Firewall.`);
  }

  try {
    logger.debug('Attempting to create AddressObject on the PAN-OS device...');
    await addressObject.create();
    logger.debug(
      `Address Object '${argv.name}' created successfully on PAN-OS device.`,
    );
  } catch (error) {
    console.error('Error in creating address object on PAN-OS device:', error);
  }
}

testCreateAddressObject();
