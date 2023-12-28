// src/services/ApiClient.ts

import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string; // Define the apiKey property

  constructor(hostname: string, apiKey: string) {
    this.apiKey = apiKey; // Initialize apiKey
    this.axiosInstance = axios.create({
      baseURL: `https://${hostname}`,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml',
        'X-PAN-KEY': apiKey, // Use apiKey for authentication
      },
    });
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Performs a GET HTTP request to a specified API endpoint. This method is primarily used
   * to retrieve data from the PAN-OS device. It handles XML response formats.
   *
   * @param endpoint - The API endpoint for the GET request.
   * @param params - (Optional) Query parameters to include in the request.
   * @returns A promise resolving to the response data as a raw XML string.
   * @throws An error if the GET request fails, with details of the failure.
   */
  public async get(endpoint: string, params?: object): Promise<string> {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Performs a POST HTTP request to a specified API endpoint. This method is used for operations
   * that require sending data, like creating or updating resources on the PAN-OS device.
   *
   * @param endpoint - The API endpoint for the POST request.
   * @param data - The XML-formatted string to be sent in the request body.
   * @returns A promise resolving to the response data as a raw XML string.
   * @throws An error if the POST request fails or if the body data is incorrectly formatted.
   */
  public async post(endpoint: string, data: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }

  /**
   * Fetches data from a specified API endpoint and parses the XML response into a JavaScript object.
   * This method combines the GET request and XML parsing functionality.
   *
   * @param endpoint - The API endpoint to send the GET request to.
   * @param params - (Optional) Parameters for the request.
   * @returns A promise resolving to the parsed JavaScript object from the XML response.
   */
  public async getData(
    endpoint: string,
    params?: object,
    parse: boolean = true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const responseXml = await this.get(endpoint, params);
    if (!parse) {
      return responseXml;
    }
    return parseStringPromise(responseXml);
  }

  /**
   * Sends a configuration command to the PAN-OS device. This method is used for 'set', 'edit',
   * and 'delete' operations on the device's configuration.
   *
   * @param xpath - The XPath expression selecting the configuration context.
   * @param element - The XML element defining the configuration change. Required for 'set' and 'edit' actions.
   * @param action - The configuration action to perform ('set', 'edit', 'delete').
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to the XML response string from the device.
   */
  public async postConfig(
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
    apiKey: string,
  ): Promise<string> {
    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', action);
    data.append('key', apiKey);
    data.append('xpath', xpath);
    if (action !== 'delete') {
      data.append('element', element);
    }

    return this.post('/api/', data.toString());
  }

  public async setConfig(xpath: string, element: string): Promise<string> {
    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', 'set');
    data.append('key', this.apiKey); // The API key is part of the instance
    data.append('xpath', xpath);
    data.append('element', element);

    return this.post('/api/', data.toString());
  }
}
