// src/services/ApiClient.ts

import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * The `ApiClient` class provides methods for making API calls to the PAN-OS device.
 * It uses Axios for HTTP requests and xml2js for processing XML data.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string; // API key for authenticating against the PAN-OS device.

  /**
   * Instantiates the `ApiClient` with a specified hostname and API key.
   *
   * @param hostname The hostname or IP address of the PAN-OS device.
   * @param apiKey The API key for authenticating requests.
   */
  constructor(hostname: string, apiKey: string) {
    this.apiKey = apiKey;
    this.axiosInstance = axios.create({
      baseURL: `https://${hostname}`,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml',
        'X-PAN-KEY': apiKey,
      },
    });
  }

  /**
   * Retrieves the API key used for requests.
   *
   * @returns The API key as a string.
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Executes a GET request against a specified API endpoint.
   *
   * @param endpoint The API endpoint for the GET request.
   * @param params Optional query parameters to include in the request.
   * @returns A promise resolving to the response data in raw XML format.
   * @throws An error if the GET request fails.
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
   * Executes a POST request to a specified API endpoint with an XML-formatted request body.
   *
   * @param endpoint The API endpoint for the POST request.
   * @param data The XML-formatted string to be sent in the request body.
   * @returns A promise resolving to the response data in raw XML format.
   * @throws An error if the POST request fails, including incorrect data format.
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
   * Fetches and parses the XML data from an API endpoint into a JavaScript object.
   *
   * @param endpoint The API endpoint to send the GET request to.
   * @param params Optional parameters for the request.
   * @param parse Whether to parse the XML response to JavaScript object. Defaults to true.
   * @returns A promise resolving to the parsed JavaScript object or raw XML string.
   */
  public async getData(
    endpoint: string,
    params?: object,
    parse: boolean = true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // TypeDoc will infer any from the method signature
    const responseXml = await this.get(endpoint, params);
    if (!parse) {
      return responseXml;
    }
    return parseStringPromise(responseXml);
  }

  /**
   * Sends a configuration command to the PAN-OS device such as 'set', 'edit', or 'delete'.
   *
   * @param xpath The XPath expression selecting the configuration context.
   * @param element The XML element defining the configuration change. Required for 'set' and 'edit' actions.
   * @param action The configuration action to perform ('set', 'edit', 'delete').
   * @param apiKey The API key for authenticating the request. Uses the instance's API key by default.
   * @returns A promise resolving to the XML response string from the device.
   */
  public async postConfig(
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
    apiKey: string = this.apiKey,
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

  /**
   * Shortcut for sending a 'set' configuration command to the PAN-OS device.
   *
   * @param xpath The XPath location for where the configuration change should take effect.
   * @param element The XML element describing the configuration to be set.
   * @returns A promise resolving to the response from the device in XML format.
   */
  public async setConfig(xpath: string, element: string): Promise<string> {
    return this.postConfig(xpath, element, 'set', this.apiKey);
  }
}
