// tests/testAddressObjectGetList.ts

import dotenv from 'dotenv';
import { Firewall } from '../src/index';

// Load the correct environment variables based on the NODE_ENV value.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

/**
 * Test script to create an address object in PAN-OS using values from command line arguments.
 * This test creates an address object by invoking the Firewall SDK methods.
 */
async function testAddressObjectGetList() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Initialize the firewall instance.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Attempt to retrieve the list of address objects on the PAN-OS device.
    const response = await firewall.addressObjectGetList();
    console.log('Response:', response);

    // Log the response from the PAN-OS API.
    console.log('List of Address Objects:', JSON.stringify(response, null, 2));
  } catch (error) {
    // Log any errors encountered during address object creation.
    console.error('Error:', error);
  }
}

// Execute the test function.
testAddressObjectGetList();
