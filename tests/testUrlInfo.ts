// tests/testUrlInfo.ts

import dotenv from 'dotenv';

// Load environment variables from the .env file based on the current NODE_ENV environment variable.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Fetches and logs the URL information from a PAN-OS device for a given or default URL.
 * Utilizes the Firewall class to demonstrate how to issue a URL information test command,
 * handling both the response and any errors that may occur.
 *
 * @async
 * @function testUrlInfo
 * @throws {Error} When API key is not set in environment variables or when executing the
 * operational command fails due to API interaction issues.
 */
async function testUrlInfo() {
  // Retrieve the PAN-OS hostname and API key from environment variables.
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is present, or throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  const firewall = new Firewall(hostname, apiKey);

  try {
    // Use a URL provided by a command line argument or a default value.
    const url = process.argv[2] || 'www.example.com';

    // Request URL information from the PAN-OS device using the provided URL or the default one.
    const urlInfoResponse = await firewall.testUrlInfo(url);

    // Log the fetched URL information to the console for inspection.
    console.log(
      `URL Info for ${url}:`,
      JSON.stringify(urlInfoResponse, null, 2),
    );
  } catch (error) {
    // Log an error message if there is a failure in executing the operational command.
    console.error('Error executing URL info command:', error);
  }
}

// Run the URL information test function.
testUrlInfo();
