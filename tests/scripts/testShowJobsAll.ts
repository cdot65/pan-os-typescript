import { Firewall } from '../../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../../src/utils/logger';
import yargs from 'yargs';

// Load the appropriate environment configuration based on the NODE_ENV setting.
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
 * Tests the `showJobsAll` function of the `Firewall` class which fetches all job results
 * from a PAN-OS device. Demonstrates the sequence to instantiate a `Firewall` object,
 * execute the job retrieval function, and handle the response or error.
 *
 * @async
 * @function testShowJobsAll
 * @throws {Error} Throws an error if the API key is not available in the environment variables,
 *                 or if the function fails to retrieve job results.
 */
async function testShowJobsAll() {
  // Define the PAN-OS hostname and API key using environment variables.
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure that the API key is available; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Create an instance of the Firewall class configured with the hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Perform the action to retrieve all job results via the Firewall instance.
    const jobsAll = await firewall.showJobsAll();

    // Output the job results to the console.
    logger.debug('All Job Results:', JSON.stringify(jobsAll, null, 2));
  } catch (error) {
    // Handle any errors that occur during job retrieval and log them.
    console.error('Error:', error);
  }
}

// Invoke the test function to retrieve and display job results.
testShowJobsAll();
