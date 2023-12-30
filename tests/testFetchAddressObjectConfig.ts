// tests/testFetchAddressObjectConfig.ts

import dotenv from 'dotenv';
import { Firewall, AddressObject } from '../src/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../src/utils/logger';

// Load environment variables.
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

async function testFetchAddressObjectConfig() {
  logger.info(
    'Initializing test for fetching an address object configuration...',
  );

  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  logger.info('Initializing test for fetching address objects...');

  const firewall = new Firewall(hostname, apiKey);

  try {
    logger.info(
      'Attempting to retrieve AddressObject configuration from the PAN-OS device...',
    );
    const xpath = AddressObject.getXpath(); // Static method in AddressObject to get XPath
    const addressObjectConfig = await firewall.fetchConfig(xpath);
    logger.info(
      'AddressObject configuration:',
      JSON.stringify(addressObjectConfig, null, 2),
    );
  } catch (error) {
    console.error('Error during the test:', error);
  }
}

testFetchAddressObjectConfig();
