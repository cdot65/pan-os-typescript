// tests/testAddressObjectGetList.ts

import dotenv from 'dotenv';
import { Firewall } from '../src/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

// Load the correct environment variables based on the NODE_ENV value.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

interface Arguments {
  logLevel: string;
}

const argv = yargs(hideBin(process.argv))
  .options({
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
 * Test script to create an address object in PAN-OS using values from command line arguments.
 * This test creates an address object by invoking the Firewall SDK methods.
 */
async function testAddressObjectGetList() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize the firewall instance.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Attempt to retrieve the list of address objects on the PAN-OS device.
    const response = await firewall.addressObjectGetList();
    logger.info('Response:', response);

    // Log the response from the PAN-OS API.
    logger.info('List of Address Objects:', JSON.stringify(response, null, 2));
  } catch (error) {
    // Log any errors encountered during address object creation.
    console.error('Error:', error);
  }
}

// Execute the test function.
testAddressObjectGetList();
