// src/services/ApiKeyGenerator.ts

import axios, { AxiosResponse } from 'axios';

/**
 * Service class for generating API keys for Palo Alto Networks devices.
 * Handles the communication with the PAN-OS API to retrieve an API key using given credentials.
 */
export class ApiKeyGenerator {
  private hostname: string;

  /**
   * Creates a new instance of `ApiKeyGenerator`.
   * @param hostname The hostname or IP address of the PAN-OS device.
   */
  constructor(hostname: string) {
    this.hostname = hostname;
  }

  /**
   * Generates an API key for the PAN-OS device using the provided username and password.
   * @param username The username for the PAN-OS device.
   * @param password The password for the PAN-OS device.
   * @returns A promise that resolves to the generated API key.
   * @throws An error if the API key could not be extracted from the response or if an error occurs in the request.
   */
  public async generateApiKey(
    username: string,
    password: string,
  ): Promise<string> {
    const endpoint = `https://${
      this.hostname
    }/api/?type=keygen&user=${encodeURIComponent(
      username,
    )}&password=${encodeURIComponent(password)}`;

    try {
      const response: AxiosResponse = await axios.get(endpoint, {
        responseType: 'text',
      });
      // Parse the response to extract the API key
      // Assuming the response is XML and contains an element <key> with the API key
      const keyMatch = response.data.match(/<key>([^<]+)<\/key>/);
      if (keyMatch && keyMatch[1]) {
        return keyMatch[1];
      }
      throw new Error('API key could not be extracted from the response.');
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  }
}
