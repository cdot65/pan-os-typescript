// tests/testShowSessionId.ts

import { Firewall } from '../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';
import yargs from 'yargs';

// Load environment variables from the .env file according to the execution environment (development or production).
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
 * Fetches and logs the information for a specific session on a PAN-OS device using a session ID.
 * The script uses the Firewall class to interact with the device's API and performs error handling
 * if the session information cannot be retrieved due to missing API key or request errors.
 *
 * @async
 * @function testShowSessionId
 * @throws {Error} When the API key is not available in the environment variables or when
 *                 the request for the session ID information fails.
 */
async function testShowSessionId() {
  // Retrieve the hostname and API key for the PAN-OS device from environment variables.
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Throw an error if the API key is missing from environment variables.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize a new instance of the Firewall class using the obtained hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Obtain the session ID from the command line arguments or default to '100'.
    const sessionId = process.argv[2] || '100';

    // Request session information for the provided session ID using the Firewall class.
    const sessionIdResponse = await firewall.showSessionId(sessionId);

    // Log the session information to the console.
    logger.debug(
      `Session ID ${sessionId} Response:`,
      JSON.stringify(sessionIdResponse, null, 2),
    );
  } catch (error) {
    // Log any errors encountered during the retrieval of session information.
    console.error('Error executing operational command for session ID:', error);
  }
}

// Run the test function to attempt retrieval of the session information.
testShowSessionId();
