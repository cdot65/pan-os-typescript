// src/BaseClient.ts

import axios, { AxiosInstance } from 'axios';

/**
 * `BaseClient` provides foundational functionalities for HTTP interactions with APIs,
 * especially those requiring XML format handling and API key authentication.
 * It encapsulates common behaviors needed across different parts of the SDK.
 */
export class BaseClient {
  private axiosInstance: AxiosInstance;

  /**
   * Constructs a `BaseClient` instance with a specific base URL and an optional API key.
   * This setup is crucial for initializing the Axios client with appropriate
   * configurations for subsequent API requests.
   *
   * @param baseUrl - The base URL to be used for all API requests, ensuring consistency
   *                  and reusability.
   * @param apiKey - An optional API key for authenticating requests. If provided,
   *                 it will be automatically included in the headers of all requests.
   */
  constructor(baseUrl: string, apiKey?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml',
        ...(apiKey && { 'X-PAN-KEY': apiKey }), // Conditional inclusion of API key in headers
      },
    });
  }

  /**
   * Executes a GET request to a specified API endpoint using the provided API key for authentication.
   * This method is designed to simplify the process of making authenticated GET requests,
   * ensuring that the necessary headers are included and handling the response appropriately.
   *
   * @param endpoint - The specific endpoint to which the GET request is made.
   * @param apiKey - The API key used for authenticating the request, ensuring authorized access.
   * @param params - Optional query parameters that can be included in the request for additional
   *                 specification and filtering.
   * @returns A promise that resolves to the raw response data as a string, typically in XML format.
   * @throws An error is thrown if the request encounters any issues, providing insight into what went wrong.
   */
  public async get(
    endpoint: string,
    apiKey: string,
    params?: object,
  ): Promise<string> {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        headers: { 'X-PAN-KEY': apiKey },
        params: params,
        responseType: 'text', // Response is expected in XML format
      });

      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Executes a POST request to a specified API endpoint using the provided API key for authentication.
   * This method is designed for sending XML data to the PAN-OS API, with the API key included in the request headers.
   *
   * @param endpoint - The specific endpoint to which the POST request is made.
   * @param apiKey - The API key used for authenticating the request.
   * @param data - The XML data to be sent in the request body.
   * @returns A promise that resolves to the raw response data as a string.
   * @throws An error is thrown if the request encounters any issues.
   */
  public async post(
    endpoint: string,
    apiKey: string,
    data: string,
  ): Promise<string> {
    try {
      // Sending POST request using axiosInstance
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: {
          'X-PAN-KEY': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'text', // Expecting response in text format
      });

      // Returning the response data as a string
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }
}
