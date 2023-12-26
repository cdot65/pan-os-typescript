// tests/testShowResourceMonitor.ts

import dotenv from 'dotenv';

// Load environment variables from the appropriate .env file, depending on the NODE_ENV value.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

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
    console.log(
      'Resource Monitor Info:',
      JSON.stringify(resourceMonitorInfo, null, 2),
    );
  } catch (error) {
    console.error('Error fetching resource monitor info:', error);
  }
}

testShowResourceMonitor();
