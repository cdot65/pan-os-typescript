// tests/testConfigureAddressObject.ts

// Import dotenv for environment variable management.
import dotenv from 'dotenv';

// Configure dotenv based on the current environment.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Import necessary classes from the SDK.
import { BaseClient } from '../src/index';
import { FirewallService } from '../src/index';
import { AddressObject } from '../src/objects/AddressObject';

/**
 * Test script for retrieving system information using the SDK's FirewallService.
 * Demonstrates how to use the SDK to fetch system information from a PAN-OS device.
 */
async function testShowJobsId() {
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

    // Retrieve the command line argument or use a default jobId
    const jobId = process.argv[2] || '45';

    // Fetch job result by using FirewallService and passing a job id.
    const jobsIdResult = await firewallService.showJobsId(apiKey, jobId);

    // Log the retrieved job result, formatted for readability.
    console.log('Job Result:', JSON.stringify(jobsIdResult, null, 2));
  } catch (error) {
    // Handle and log any errors encountered during the retrieval of job status.
    console.error('Error:', error);
  }
}

// Execute the test function.
testShowJobsId();
