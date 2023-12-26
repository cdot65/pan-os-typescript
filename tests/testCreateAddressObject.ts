// tests/testCreateAddressObject.ts

import dotenv from 'dotenv';
import { BaseClient, FirewallService, AddressObject } from '../src/index';
import { AddressType } from '../src/objects/AddressObject';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'; // Required to help with parsing arguments passed via the command line

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

// Update the `Arguments` interface's `type` property to use `AddressType`
interface Arguments {
  name: string;
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];
}

// Use 'yargs' to parse command line arguments
const argv = yargs(hideBin(process.argv))
  .options({
    name: { type: 'string', demandOption: true, alias: 'n' },
    value: { type: 'string', demandOption: true, alias: 'v' },
    type: { type: 'string', demandOption: true, alias: 't' },
    description: { type: 'string', alias: 'd', default: undefined },
    tag: { type: 'array', alias: 'g', default: undefined },
  })
  .parseSync() as Arguments;

async function testCreateAddressObject() {
  const apiKey = process.env.PANOS_API_KEY || '';
  const baseClient = new BaseClient('https://datacenter.cdot.io', apiKey);
  const firewallService = new FirewallService(baseClient);

  try {
    if (!apiKey) {
      throw new Error('API key is not set in environment variables.');
    }

    // Create the Address Object based on the provided arguments
    const addressObject = new AddressObject(argv.name, argv.value, argv.type);
    addressObject.description = argv.description;
    if (argv.tag) addressObject.tag = argv.tag;

    // Create the Address Object using FirewallService
    const response = await firewallService.createAddressObject(
      apiKey,
      addressObject,
    );

    // Log the response
    console.log(
      'Create Address Object Response:',
      JSON.stringify(response, null, 2),
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

testCreateAddressObject();
