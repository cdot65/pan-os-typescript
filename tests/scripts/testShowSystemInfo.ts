// tests/testShowSystemInfoResponse.ts

import { Firewall } from '../../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../../src/utils/logger';
import yargs from 'yargs';

/**
 * Script for testing the retrieval of system information from a PAN-OS device.
 * Demonstrates the use of the Firewall class to fetch system details.
 * Utilizes environment variables for configuration and command-line arguments to set the logging level.
 */

// Load and configure environment variables based on the current environment setting.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Defines the structure for command-line arguments used in the script.
 */
interface Arguments {
  logLevel: string;
}

// Parse command-line arguments to configure the script's runtime settings.
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
 * Test function to retrieve and log system information from a PAN-OS device.
 * Validates the SDK's ability to interact with the device API and process the data.
 * @async
 * @throws An error if the API key is not set in the environment variables or if there is a failure in fetching the information.
 */
async function testShowSystemInfoResponse() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is present before attempting the operation; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize a new instance of the Firewall class with API key and hostname.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Fetch the system information from the PAN-OS device using the Firewall class's method.
    const systemInfo = await firewall.showSystemInfoResponse();

    // Log the retrieved system information to the console for verification.
    logger.info('System Info:', systemInfo);
  } catch (error) {
    // Log any errors encountered during the retrieval process.
    console.error('Error retrieving system info:', error);
  }
}

// Run the function to test system information retrieval.
testShowSystemInfoResponse();
