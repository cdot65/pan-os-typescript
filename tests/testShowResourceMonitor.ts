// tests/testShowResourceMonitor.ts

import { Firewall } from '../src/index';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';
import yargs from 'yargs';

// Load environment variables from the appropriate .env file, depending on the NODE_ENV value.
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
 * Executes the process of retrieving resource monitor information from a PAN-OS device using the SDK's Firewall class.
 * The function demonstrates how to use the SDK for communication with the PAN-OS API to fetch resource utilization data.
 * It prints out the resource monitor information to console or throws an error if API key is not set or request fails.
 *
 * @async
 * @function testShowResourceMonitor
 * @throws {Error} When the API key is not provided or the request to the firewall fails.
 */
async function testShowResourceMonitor() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is present, otherwise throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  const firewall = new Firewall(hostname, apiKey);

  try {
    const resourceMonitorInfo = await firewall.showResourceMonitor();
    logger.debug(
      'Resource Monitor Info:',
      JSON.stringify(resourceMonitorInfo, null, 2),
    );
  } catch (error) {
    console.error('Error fetching resource monitor info:', error);
  }
}

testShowResourceMonitor();
