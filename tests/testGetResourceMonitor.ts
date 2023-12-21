// tests/testGetResourceMonitor.ts

// Import dotenv for environment variable management
import dotenv from 'dotenv';

// Configure dotenv based on the current environment
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Import the necessary classes from the SDK
import { BaseClient } from '../src/index';
import { FirewallService } from '../src/index';

/**
 * Test script for retrieving resource monitor information using the SDK's FirewallService.
 * This script demonstrates the use of the SDK to fetch resource monitoring data from a PAN-OS device.
 */
async function testGetResourceMonitor() {
  // Retrieve the API key from the environment variables
  const apiKey = process.env.PANOS_API_KEY || '';
  // Initialize BaseClient with the PAN-OS device's base URL and the API key
  const baseClient = new BaseClient('https://datacenter.cdot.io', apiKey);
  // Create an instance of FirewallService with the configured BaseClient
  const firewallService = new FirewallService(baseClient);

  try {
    // Check if the API key is available
    if (!apiKey) {
      throw new Error('API key is not set in environment variables.');
    }

    // Fetch resource monitor information using FirewallService
    const resourceMonitorInfo =
      await firewallService.getResourceMonitor(apiKey);

    // Log the resource monitor information, formatted for readability
    console.log(
      'Resource Monitor Info:',
      JSON.stringify(resourceMonitorInfo, null, 2),
    );
  } catch (error) {
    // Handle and log any errors encountered during the retrieval of resource monitor information
    console.error('Error:', error);
  }
}

// Execute the test function
testGetResourceMonitor();
