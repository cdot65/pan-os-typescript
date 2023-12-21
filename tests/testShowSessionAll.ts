// tests/testShowSessionAll.ts

// Import dotenv for environment variable management.
import dotenv from 'dotenv';

// Configure dotenv based on the current environment.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Import necessary classes from the SDK.
import { BaseClient } from '../src/index';
import { FirewallService } from '../src/index';

/**
 * Test script for retrieving system information using the SDK's FirewallService.
 * Demonstrates how to use the SDK to fetch system information from a PAN-OS device.
 */
async function testShowSessionAllResponse() {
  // Retrieve API key from environment variables.
  const apiKey = process.env.PANOS_API_KEY || '';
  // Initialize BaseClient with the base URL of the PAN-OS device and the API key.
  const baseClient = new BaseClient('https://datacenter.cdot.io', apiKey);
  // Create an instance of FirewallService using the configured BaseClient.
  const firewallService = new FirewallService(baseClient);

  try {
    // Verify that the API key is set.
    if (!apiKey) {
      throw new Error('API key is not set in environment variables.');
    }

    // Fetch session information using FirewallService.
    const showSessionAll = await firewallService.showSessionAll(apiKey);

    // Log the retrieved `show session all output`, formatted for readability.
    console.log('System Info:', JSON.stringify(showSessionAll, null, 2));
  } catch (error) {
    // Handle and log any errors encountered during the retrieval of system information.
    console.error('Error:', error);
  }
}

// Execute the test function.
testShowSessionAllResponse();
