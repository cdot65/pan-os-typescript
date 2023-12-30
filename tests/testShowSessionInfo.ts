// tests/testShowSessionInfo.ts

import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

// Load environment variables depending on the execution environment.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';
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
 * Retrieves and logs detailed session information from a PAN-OS device using the SDK's Firewall class.
 * The function expects the device's hostname and API key to be available in environment variables
 * and logs the information or throws an error if the API key is not provided or the retrieval fails.
 *
 * @async
 * @function testShowSessionInfo
 * @throws {Error} When the API key is missing or fetching session information fails.
 */
async function testShowSessionInfo() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Throw an error if the API key is not available in environment variables.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  const firewall = new Firewall(hostname, apiKey);

  try {
    // Fetch session information using the Firewall instance's method.
    const showSessionInfoResponse = await firewall.showSessionInfo();

    // Output detailed session information to the console.
    logger.debug(
      'Session Info:',
      JSON.stringify(showSessionInfoResponse, null, 2),
    );
  } catch (error) {
    // Capture and log any errors that occur during the retrieval of session information.
    console.error('Error fetching session info:', error);
  }
}

// Invoke the function to perform the session information retrieval.
testShowSessionInfo();
