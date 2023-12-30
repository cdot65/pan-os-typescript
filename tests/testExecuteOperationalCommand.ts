// tests/testExecuteOperationalCommand.ts

import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

import { Firewall } from '../src/index'; // Importing Firewall from the index

// Configure environment variables
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
 * Executes an operational command on the Firewall and logs the response.
 * The command to be executed is the second command-line argument or defaults to showing the "management" interface.
 */
async function testExecuteOperationalCommand() {
  // Define the PAN-OS hostname and API key from environment variables
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Throw an error if the API key is not provided.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Create an instance of the Firewall class with the specified hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Get the CLI command from the command-line arguments or use a default command.
    const cliCmd = process.argv[2] || 'show interface "management"';

    // Execute the operational CLI command on the PAN-OS device.
    const cliCommandResponse = await firewall.apiClient.op(cliCmd);

    // Log the CLI command and its response.
    logger.debug(
      'CLI Command: ' + cliCmd,
      '\n',
      JSON.stringify(cliCommandResponse, null, 2),
    );
  } catch (error) {
    // Catch and log any errors that occur during the execution of the operational command.
    console.error('Error executing operational command:', error);
  }
}

// Invoke the test function to execute the operational command.
testExecuteOperationalCommand();
