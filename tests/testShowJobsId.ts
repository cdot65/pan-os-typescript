import dotenv from 'dotenv';

// Load and configure environment variables from the .env file based on the current NODE_ENV setting.
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

import { Firewall } from '../src/index';

/**
 * Demonstrates fetching and logging the status of a job from a PAN-OS device by its job ID.
 * This script uses environment variables for the hostname and API key and accepts a job ID as a command-line argument.
 *
 * @async
 * @function testShowJobsId
 * @throws Throws an error if the API key is not set in the environment variables,
 *         or if there is an issue retrieving the job status.
 */
async function testShowJobsId() {
  // Use environment variables to set up the firewall connection details.
  const hostname = process.env.PANOS_HOSTNAME || 'datacenter.cdot.io';
  const apiKey = process.env.PANOS_API_KEY || '';

  // Ensure the presence of an API key; otherwise, throw an error.
  if (!apiKey) {
    throw new Error('API key is not set in environment variables.');
  }

  // Create an instance of the Firewall class using the hostname and API key.
  const firewall = new Firewall(hostname, apiKey);

  try {
    // Get the job ID either from the command line argument or default to '45'.
    const jobId = process.argv[2] || '45';

    // Use the Firewall instance to fetch the status of the specified job ID.
    const jobsIdResult = await firewall.showJobsId(jobId);

    // Print the job status result.
    console.log('Job Result:', JSON.stringify(jobsIdResult, null, 2));
  } catch (error) {
    // Log any errors encountered when fetching the job status.
    console.error('Error:', error);
  }
}

// Run the function to test job status retrieval.
testShowJobsId();
