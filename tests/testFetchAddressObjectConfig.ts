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

  console.log('Initializing test for fetching address objects...');

  const firewall = new Firewall(hostname, apiKey);

  try {
    console.log(
      'Attempting to retrieve AddressObject configuration from the PAN-OS device...',
    );
    const xpath = AddressObject.getXpath(); // Static method in AddressObject to get XPath
    const addressObjectConfig = await firewall.fetchConfig(xpath);
    console.log(
      'AddressObject configuration:',
      JSON.stringify(addressObjectConfig, null, 2),
    );
  } catch (error) {
    console.error('Error during the test:', error);
  }
}

testFetchAddressObjectConfig();
