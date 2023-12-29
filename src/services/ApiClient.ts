// src/services/ApiClient.ts

import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * Represents an API client for making HTTP requests to a PAN-OS device.
 * Utilizes Axios for HTTP requests and xml2js for XML processing.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string; // API key for authenticating against the PAN-OS device.

  /**
   * Constructs a new ApiClient instance.
   *
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - The API key for authenticating the requests.
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

  // Method for parsing XML
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async parseXml(xml: string): Promise<any> {
    try {
      return await parseStringPromise(xml, {
        explicitArray: false,
        ignoreAttrs: false,
      });
    } catch (error) {
      console.error('Error parsing XML:', error);
      throw error;
    }
  }

  /**
   * Retrieves the API key used for making requests.
   *
   * @returns The API key as a string.
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Performs an HTTP GET request to a specified API endpoint.
   *
   * @param endpoint - The endpoint URL for the GET request.
   * @param params - Optional query parameters to include in the request.
   * @returns A promise that resolves to the response data in raw XML format.
   * @throws An error if the GET request fails.
   */
  public async get(endpoint: string, params?: object): Promise<string> {
    // console.log(`Sending GET request to '${endpoint}' with params:`, params); // Log request details
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      // console.log(`Response from GET request to '${endpoint}':`, response.data); // Log response
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Executes an HTTP POST request to a specified API endpoint with XML-formatted data.
   *
   * @param endpoint - The endpoint URL for the POST request.
   * @param data - The XML-formatted string to be sent in the request body.
   * @returns A promise that resolves to the response data in raw XML format.
   * @throws An error if the POST request fails or if the data format is incorrect.
   */
  public async post(endpoint: string, data: string): Promise<string> {
    // console.log(`Sending POST request to '${endpoint}' with data:`, data);
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      });
      // console.log(
      //   `Response from POST request to '${endpoint}':`,
      //   response.data,
      // );
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }

  /**
   * Fetches data from a PAN-OS API endpoint and optionally parses the XML response.
   *
   * @param endpoint - The API endpoint to send the GET request to.
   * @param params - Optional parameters for the request.
   * @param parse - Flag indicating whether to parse the XML response. Defaults to true.
   * @returns A promise resolving to either the parsed JavaScript object or the raw XML string.
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
   * Sends a configuration command (set, edit, delete) to the PAN-OS device.
   *
   * @param xpath - The XPath expression selecting the configuration context.
   * @param element - The XML element defining the configuration change (required for 'set' and 'edit').
   * @param action - The configuration action to perform (set, edit, delete).
   * @param apiKey - The API key for request authentication. Defaults to the instance's API key.
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
   * Simplified method for sending a 'set' configuration command to the PAN-OS device.
   *
   * @param xpath - The XPath for the configuration change location.
   * @param element - The XML element describing the configuration to set.
   * @returns A promise resolving to the response from the device in XML format.
   */
  public async setConfig(xpath: string, element: string): Promise<string> {
    return this.postConfig(xpath, element, 'set', this.apiKey);
  }

  /**
   * Sends an 'edit' configuration command to the PAN-OS device.
   *
   * @param xpath - The base XPath expression selecting the configuration context.
   * @param entryName - The name of the specific entry to be edited (optional).
   * @param element - The XML element defining the configuration change.
   * @returns A promise resolving to the XML response string from the device.
   */
  public async editConfig(
    xpath: string,
    element: string,
    entryName?: string,
  ): Promise<string> {
    let fullPath = xpath;
    if (entryName) {
      fullPath += `/entry[@name='${entryName}']`;
    }

    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', 'edit');
    data.append('key', this.apiKey);
    data.append('xpath', fullPath);
    data.append('element', element);

    return this.post('/api/', data.toString());
  }

  /**
   * Retrieves the specified configuration section from the PAN-OS device.
   *
   * @param xpath - The XPath expression for the configuration section.
   * @param parse - Flag indicating whether to parse the XML response. Defaults to true.
   * @returns A promise resolving to the configuration data, either as raw XML or a parsed object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getConfig(xpath: string, parse: boolean = true): Promise<any> {
    const params = {
      type: 'config',
      action: 'get',
      key: this.apiKey,
      xpath: encodeURIComponent(xpath),
    };

    try {
      const responseXml = await this.get('/api/', { params });
      if (!parse) {
        return responseXml;
      }
      return parseStringPromise(responseXml, {
        explicitArray: false,
        ignoreAttrs: false,
      });
    } catch (error) {
      console.error('Error in getConfig:', error);
      throw error;
    }
  }
}
