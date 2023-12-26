// src/BaseClient.ts

import axios, { AxiosInstance } from 'axios';

/**
 * The `BaseClient` class provides foundational functionalities for HTTP interactions with APIs,
 * with a focus on services that require XML format handling and API key authentication.
 * It encapsulates common behaviors such as setting up the axios instance with default headers and baseURL.
 */
export class BaseClient {
  /**
   * An Axios instance configured with baseURL and default headers.
   * @private
   */
  private axiosInstance: AxiosInstance;

  /**
   * Constructs a `BaseClient` instance with a specific base URL and an optional API key.
   * Initializes the Axios instance with configurations for subsequent API requests.
   *
   * @param baseUrl - The base URL used for all API requests.
   * @param apiKey - An optional API key to authenticate requests. If provided, it
   *                 will be included in the headers of all requests.
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
   * Performs a GET request to the specified API endpoint with authentication.
   * Returns the response data in string format, typically XML.
   *
   * @param endpoint - The endpoint for the GET request.
   * @param apiKey - The API key for request authentication.
   * @param params - Optional parameters for the GET request query string.
   *
   * @returns A promise resolving to the raw response data as a string, typically XML.
   * @throws Throws an error if the request fails, bubbling up the axios error details.
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
   * Performs a POST request to the specified API endpoint with authentication.
   * Sends XML data in the request body and returns the response data as a string.
   *
   * @param endpoint - The endpoint for the POST request.
   * @param apiKey - The API key for request authentication.
   * @param data - The XML string to be sent in the request body.
   *
   * @returns A promise resolving to the raw response data in string format.
   * @throws Throws an error if the request fails or if the POST data is not in the expected format.
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
