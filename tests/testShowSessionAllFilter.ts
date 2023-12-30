// tests/testShowSessionAllFilter.ts

import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

// Load configuration variables based on the NODE_ENV setting.
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
 * Retrieves and logs the filtered session information based on source and destination IP addresses from a PAN-OS device.
 * Uses the FirewallService to execute a 'show session all filter' command filtered by source and destination IPs.
 * This script demonstrates SDK usage for advanced session query capabilities.
 * Command line arguments can be provided for custom source and destination IPs; otherwise, default values are used.
 *
 * @async
 * @function testShowSessionAllFilter
 * @throws {Error} When the API key is missing or fetching session information fails.
 */
async function testShowSessionAllFilter() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Throw an error if the API key is not set in the environment.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  const firewall = new Firewall(hostname, apiKey);

  try {
    // Command line arguments override for source and destination IPs, with fallback to defaults.
    const srcIp = process.argv[2] || '192.168.255.1';
    const dstIp = process.argv[3] || '1.1.1.1';

    // Execute the session filter command using the provided IP addresses.
    const sessionAllFilterResponse = await firewall.showSessionAllFilter(
      dstIp,
      srcIp,
    );

    // Output the results of the session filter query.
    logger.debug(
      `Filtered Session Info (source: ${srcIp}, destination: ${dstIp}):`,
      JSON.stringify(sessionAllFilterResponse, null, 2),
    );
  } catch (error) {
    // Error handler for any issues encountered while fetching session data.
    console.error('Error fetching filtered session info:', error);
  }
}

testShowSessionAllFilter();
