import { ApiKeyGenerator } from '../../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../../src/utils/logger';
import yargs from 'yargs';

/**
 * Loads environment configuration based on the NODE_ENV setting.
 * Configures the script to use either production or development environment variables.
 */
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Defines the structure for command-line arguments used in the script.
 */
interface Arguments {
  logLevel: string;
  hostname: string;
  password: string;
  username: string;
}

/**
 * Parses command-line arguments to configure the script's runtime settings.
 * Allows setting of log level, hostname, username, and password.
 */
const argv = yargs(hideBin(process.argv))
  .options({
    logLevel: {
      type: 'string',
      default: 'info',
      choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
      description: 'Set the logging level',
    },
    hostname: {
      type: 'string',
      default: process.env.PANOS_HOSTNAME || 'datacenter.cdot.io', // Provide a default value or handle the absence
      description: 'Set the target device hostname',
    },
    password: {
      type: 'string',
      default: process.env.PANOS_PASSWORD, // Adjusted to PANOS_PASSWORD
      description: 'Set the user password',
      demandOption: true, // Require this option
    },
    username: {
      type: 'string',
      default: process.env.PANOS_USERNAME,
      description: 'Set the user name',
      demandOption: true, // Require this option
    },
  })
  .parseSync() as Arguments;

// Set the logger level based on the argument
logger.level = argv.logLevel;

/**
 * Test function to generate an API key for a PAN-OS device.
 * Utilizes the ApiKeyGenerator to generate an API key based on provided credentials.
 */
async function testGenerateApiKey() {
  // Initialize the ApiKeyGenerator
  const apiKeyGenerator = new ApiKeyGenerator(argv.hostname);

  try {
    // Generate an API key
    const apiKey = await apiKeyGenerator.generateApiKey(
      argv.username,
      argv.password,
    );

    // Log the generated API key to the console
    logger.info(`Generated API Key: ${apiKey}`);
  } catch (error) {
    // Handle and log any errors that occur during the API key generation
    console.error('Error:', error);
  }
}

// Execute the test function to generate an API key
testGenerateApiKey();
