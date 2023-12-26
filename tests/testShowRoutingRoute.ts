// tests/testShowRoutingRoute.ts

import dotenv from 'dotenv';

// Load and configure environment variables from the .env file based on the current environment.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Fetches and logs the routing table information from a PAN-OS device.
 * This script demonstrates how to utilize the Firewall class from the SDK for retrieving routing route details.
 * It uses the environment variables for the device's hostname and API key and expects successful log output
 * of routing information or throws an error if the API key is not configured or the retrieval fails.
 *
 * @async
 * @function testShowRoutingRoute
 * @throws Will throw an error if the API key is not found in the environment variables or if an error occurs during
 * the request to the PAN-OS device for routing route information.
 */
async function testShowRoutingRoute() {
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the API key is set in the environment before attempting the request.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  const firewall = new Firewall(hostname, apiKey);

  try {
    const routingRouteInfo = await firewall.showRoutingRoute();
    console.log('Route Table:', JSON.stringify(routingRouteInfo, null, 2));
  } catch (error) {
    // Log an error if the API call was unsuccessful.
    console.error('Error fetching route table:', error);
  }
}

testShowRoutingRoute();
