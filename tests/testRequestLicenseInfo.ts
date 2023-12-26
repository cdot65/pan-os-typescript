import dotenv from 'dotenv';

// Load environment configurations based on the execution context.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Tests the retrieval of license information for a PAN-OS device.
 * This function demonstrates how to fetch and log license information using the Firewall class from the SDK.
 *
 * @async
 * @function testRequestLicenseInfo
 * @throws Will throw an error if the API key is not found in the environment variables, or if the request fails.
 */
async function testRequestLicenseInfo() {
  // Retrieve the hostname and API key from environment variables.
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is provided; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Instantiate the Firewall class with the provided hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Perform the license information request using the Firewall instance.
    const licenseInfo = await firewall.requestLicenseInfo();

    // Output the license information to the console.
    console.log('Licenses:', JSON.stringify(licenseInfo, null, 2));
  } catch (error) {
    // Handle and log any errors that occur while fetching license information.
    console.error('Error:', error);
  }
}

// Execute the test function to request the license information.
testRequestLicenseInfo();
