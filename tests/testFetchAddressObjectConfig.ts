// tests/testFetchAddressObjectConfig.ts

import dotenv from 'dotenv';
import { Firewall, AddressObject } from '../src/index';

// Load environment variables.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

async function testFetchAddressObjectConfig() {
  console.log(
    'Initializing test for fetching an address object configuration...',
  );

  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  console.log(`Creating a Firewall instance with hostname: ${hostname}`);
  const firewall = new Firewall(hostname, apiKey);

  // Using a predefined name for the address object for testing purposes.
  const testAddressObjectName = 'TestAddressObject';
  console.log(`Creating an AddressObject with name: ${testAddressObjectName}`);
  const addressObject = new AddressObject(
    testAddressObjectName,
    '192.168.1.0/24', // Example IP range
    'ip-netmask',
  );

  console.log('Adding AddressObject to the Firewall object...');
  firewall.addChild(addressObject);

  try {
    console.log('Attempting to apply AddressObject on the PAN-OS device...');
    await addressObject.apply();
    console.log(
      `AddressObject '${testAddressObjectName}' applied successfully on PAN-OS device.`,
    );

    console.log(
      'Fetching AddressObject configuration from the PAN-OS device...',
    );
    const config = await addressObject.fetchAddressObjectConfig();
    console.log('AddressObject configuration:', config);

    // Add additional logic to validate the fetched configuration, if needed.
    // For example, checking if the fetched configuration matches the expected values.
  } catch (error) {
    console.error('Error during the test:', error);
  }
}

testFetchAddressObjectConfig();
