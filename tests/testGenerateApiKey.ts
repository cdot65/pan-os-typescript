// tests/testGenerateApiKey.ts

// Import dotenv for managing environment variables
import dotenv from 'dotenv';

// Configure dotenv to load environment variables based on the current environment
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Import necessary classes from the SDK
import { BaseClient } from '../src/index';
import { FirewallService } from '../src/index';

/**
 * Test script for generating an API key using the SDK's FirewallService.
 * This script demonstrates how to use the SDK to programmatically generate
 * an API key required for authenticating further API requests.
 */
async function testGenerateApiKey() {
  // Retrieve PAN-OS username and password from environment variables
  const username = process.env.PANOS_USERNAME || '';
  const password = process.env.PANOS_PASSWORD || '';

  // Initialize BaseClient with the PAN-OS device's base URL
  const baseClient = new BaseClient('https://datacenter.cdot.io');
  // Create an instance of FirewallService with the configured BaseClient
  const firewallService = new FirewallService(baseClient);

  try {
    // Check if username and password are set
    if (!username || !password) {
      throw new Error(
        'Username or password is not set in environment variables.',
      );
    }

    // Use the FirewallService instance to generate an API key
    const apiKey = await firewallService.generateApiKey(username, password);

    // Log the generated API key
    console.log('Generated API Key:', apiKey);
  } catch (error) {
    // Handle and log any errors encountered during API key generation
    console.error('Error:', error);
  }
}

// Execute the test function
testGenerateApiKey();
