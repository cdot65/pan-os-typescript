// tests/testShowSessionAll.ts

import dotenv from 'dotenv';

// Load and configure environment variables from the .env file based on the NODE_ENV setting.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Fetches and logs the 'show session all' response from a PAN-OS device.
 * This script demonstrates using the `Firewall` class from the SDK to retrieve data about all active sessions.
 * It will log the session information or throw an error if the API key is not configured or the retrieval of information fails.
 *
 * @async
 * @function testShowSessionAllResponse
 * @throws {Error} When the API key is not provided in environment variables or the request to the firewall fails.
 */
async function testShowSessionAllResponse() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is available; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize a `Firewall` instance to interact with the PAN-OS device.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Fetch the 'show session all' response from the device using the `Firewall` instance.
    const showSessionAll = await firewall.showSessionAll();

    // Log the retrieved session data, formatted for better readability.
    console.log('Session Info:', JSON.stringify(showSessionAll, null, 2));
  } catch (error) {
    // Log any errors encountered during the information retrieval.
    console.error('Error fetching session info:', error);
  }
}

// Run the test function to perform the retrieval operation.
testShowSessionAllResponse();
