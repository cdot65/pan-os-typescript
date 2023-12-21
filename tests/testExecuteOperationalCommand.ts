// tests/testExecuteOperationalCommand.ts

// Importing dotenv to manage environment variables
import dotenv from 'dotenv';

// Configuring environment variables based on the environment (production or development)
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Importing necessary classes from the SDK
import { BaseClient } from '../src/BaseClient';
import { FirewallService } from '../src/index'; // Importing FirewallService from the index

/**
 * Test script to execute operational commands on a PAN-OS device.
 * This script demonstrates how to use the SDK's FirewallService to execute
 * operational commands and handle responses.
 */
async function testExecuteOperationalCommand() {
  // Retrieve the API key from environment variables
  const apiKey = process.env.PANOS_API_KEY || '';
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize BaseClient with the base URL and API key
  const baseClient = new BaseClient('https://datacenter.cdot.io', apiKey);

  // Instantiate FirewallService with the configured BaseClient
  const firewallService = new FirewallService(baseClient);

  try {
    // Retrieve the command line argument or use a default command
    const cliCmd = process.argv[2] || 'show interface "management"';

    // Execute the operational command using FirewallService
    const cliCommandResponse = await firewallService.executeOperationalCommand(
      apiKey,
      cliCmd,
    );

    // Log the command and its response for verification
    console.log(
      'CLI Command: ' + cliCmd,
      '\n',
      JSON.stringify(cliCommandResponse, null, 2),
    );
  } catch (error) {
    // Handle and log any errors during command execution
    console.error('Error executing operational command:', error);
  }
}

// Execute the test function
testExecuteOperationalCommand();
