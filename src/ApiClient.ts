// src/ApiClient.ts

import axios, { AxiosInstance } from 'axios';

/**
 * The `ApiClient` class serves as a foundation for HTTP interactions with APIs that require XML handling and API key authentication.
 * It provides an abstraction over the Axios library, setting default headers and base URL to simplify API interactions.
 */
export class ApiClient {
  /**
   * Axios instance configured with default options for all HTTP requests.
   * @private
   */
  private axiosInstance: AxiosInstance;

  /**
   * Initializes the `ApiClient` with base URL and default headers, including an optional API key for requests.
   * This configuration sets up the client for making authenticated HTTP requests to the API.
   *
   * @param baseUrl The base URL for all outgoing API requests.
   * @param apiKey An optional API key for inclusion in request headers for authentication.
   */
  constructor(baseUrl: string, apiKey?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml',
        ...(apiKey && { 'X-PAN-KEY': apiKey }), // Conditional inclusion of API key if present
      },
    });
  }

  /**
   * Executes an authenticated GET HTTP request to an API endpoint and returns the response as a string.
   * This generic method can be used to fetch data from various API endpoints that return XML responses.
   *
   * @param endpoint The specific API endpoint to target in the GET request.
   * @param apiKey The API key used to authenticate the request.
   * @param params Optional query parameters to include in the request URL.
   * @returns A promise that resolves to the response data as a raw string, which is expected to be in XML format.
   * @throws An error when the GET request fails, including axios-related error information.
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
        responseType: 'text', // Handles the response as a text string (XML data)
      });

      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Sends an authenticated POST HTTP request to an API endpoint with XML data in the request body.
   * This method is suited for operations that require sending data to the API, such as creating or updating resources.
   *
   * @param endpoint The specific API endpoint to target in the POST request.
   * @param apiKey The API key for authenticating the request.
   * @param data The XML-formatted string to send in the body of the POST request.
   * @returns A promise that resolves to the response data as a raw string.
   * @throws An error if the POST request fails or the body data is not formatted correctly.
   */
  public async post(
    endpoint: string,
    apiKey: string,
    data: string,
  ): Promise<string> {
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: {
          'X-PAN-KEY': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'text', // Expects the response to be in text format (not JSON)
      });

      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error; // Re-throw the error to let calling functions handle it
    }
  }
}
