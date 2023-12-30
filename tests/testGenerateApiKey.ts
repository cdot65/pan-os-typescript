import { Firewall } from '../src/index';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

// Load environment configuration based on the NODE_ENV setting
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
 * A test function to generate an API key for a PAN-OS device.
 * It uses environment variables for configuration and credential details,
 * and demonstrates generating an API key using the Firewall class.
 */
async function testGenerateApiKey() {
  // Retrieve PAN-OS hostname, username, and password from environment variables
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const username = process.env.PANOS_USERNAME || '';
  const password = process.env.PANOS_PASSWORD || '';

  // Ensure username and password are provided; otherwise, throw an error
  if (!username || !password) {
    throw new Error(
      'Username or password is not set in environment variables.',
    );
  }

  // Initialize the Firewall class without an initial API key
  const firewall = new Firewall(hostname, '');

  try {
    // Attempt to generate an API key using the provided credentials
    const apiKeyResponse = await firewall.generateApiKey(username, password);

    // Extract the API key from the response
    const apiKey = apiKeyResponse.key;

    // Log the generated API key to the console
    logger.info(apiKey);
  } catch (error) {
    // Handle and log any errors that occur during the API key generation
    console.error('Error:', error);
  }
}

// Execute the test function to generate an API key
testGenerateApiKey();
