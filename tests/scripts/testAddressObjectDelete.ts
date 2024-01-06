// tests/testAddressObjectDelete.ts

import { Firewall } from '../../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../../src/utils/logger';
import yargs from 'yargs';

// Load the correct environment variables based on the NODE_ENV value.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Type for the command line arguments accepted by the script.
 */
interface Arguments {
  name: string; // Only the name is needed for deletion
  logLevel: string;
}

// Parse command line arguments using yargs.
const argv = yargs(hideBin(process.argv))
  .options({
    name: {
      type: 'string',
      demandOption: true,
      alias: 'n',
      description: 'Name of the address object to delete',
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
 * Test script to delete an address object in PAN-OS using the name from command line arguments.
 */
async function testDeleteAddressObject() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize the firewall instance.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Attempt to delete the address object on the PAN-OS device.
    const response = await firewall.deleteAddressObject(argv.name);

    // Log the response from the PAN-OS API.
    logger.debug(
      'Delete Address Object Response:',
      JSON.stringify(response, null, 2),
    );
  } catch (error) {
    // Log any errors encountered during address object deletion.
    console.error('Error:', error);
  }
}

// Execute the test function.
testDeleteAddressObject();
