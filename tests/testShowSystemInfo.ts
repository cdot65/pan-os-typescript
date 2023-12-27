// tests/testShowSystemInfoResponse.ts

import dotenv from 'dotenv';

// Load and configure environment variables from the .env file based on the current environment (development or production).
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Retrieves and logs the system information from a PAN-OS device.
 * This script demonstrates the use of the `Firewall` class from the SDK to obtain system-related details,
 * validating the SDK's ability to interact with the device API and handle the returned data.
 * Errors are thrown if the API key is not set in environment variables or if there is a failure in fetching the information.
 *
 * @async
 * @function testShowSystemInfoResponse
 * @throws {Error} When the API key is not provided in environment variables or if the request to retrieve system information fails.
 */
async function testShowSystemInfoResponse() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is present before attempting the operation; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize a new instance of the Firewall class with API key and hostname.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Fetch the system information from the PAN-OS device using the Firewall class's method.
    const systemInfo = await firewall.refreshSystemInfo();

    // Log the retrieved system information to the console for verification.
    console.log('System Info:', JSON.stringify(systemInfo, null, 2));
  } catch (error) {
    // Log any errors encountered during the retrieval process.
    console.error('Error retrieving system info:', error);
  }
}

// Run the function to test system information retrieval.
testShowSystemInfoResponse();
