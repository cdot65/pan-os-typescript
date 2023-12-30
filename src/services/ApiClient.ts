// src/services/ApiClient.ts

import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';

/**
 * A class for interacting with the Palo Alto Networks XML API.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string;

  /**
   * Constructs a new ApiClient instance for interacting with the Palo Alto Networks XML API.
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - The API key for device authentication.
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

  // NOTE: this is the low-level API communication that uses the Axios instance
  public async get(endpoint: string, params?: object): Promise<string> {
    // console.log(`Sending GET request to '${endpoint}' with params:`, params); // Log request details
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      // console.log(
      //   `Response from GET request to '${endpoint}':`,
      //   response.data,
      // );
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  // NOTE: this is the low-level API communication that uses the Axios instance
  public async post(endpoint: string, data: string): Promise<string> {
    try {
      // console.log(
      //   `Sending POST request to '${endpoint}' with data:`, data:`,
      // );
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-PAN-KEY': this.apiKey,
        },
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

  /**This is the high-level API communication that uses the low-level methods
   * to get data from the API and parse it into a JavaScript object.
   * Currently used by the `op()` and `generateApiKey()` methods in PanDevice.
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
    return this.parseXml(responseXml);
  }

  /**
   * This is a high-level API abstraction that uses the low-level method of `post()`
   * @param xpath string of the xpath to be used
   * @param element string representation of the xml element to be pushed
   * @param action can be 'set', 'edit', or 'delete'. Higher level abstractions will differ on this argument value
   * @param apiKey the API key to be used. Defaults to the API key provided during instantiation
   */
  // TODO: can we nix the `apiKey` argument and just use the instance property?
  public async postConfig(
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
  ): Promise<string> {
    /**
     * The API expects the following format:
     * type=config&action=set&key=<api_key>&xpath=<xpath>&element=<element>
     * so here we are using URLSearchParams to build the query string
     */
    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', action);
    data.append('xpath', xpath);
    if (action !== 'delete') {
      data.append('element', element);
    }

    return this.post('/api/', data.toString());
  }

  /**
   * This is a high-level API abstraction that uses the low-level method of `postConfig()`
   * This method is called by the `create()` method in VersionedPanObject.
   * Since the objective here is to create configuration, we are using the 'set' action.
   * @param xpath string of the xpath to be used
   * @param element string representation of the xml element to be pushed
   */
  // TODO: can we nix the `apiKey` argument and just use the instance property?
  public async setConfig(xpath: string, element: string): Promise<string> {
    return this.postConfig(xpath, element, 'set');
  }

  /**
   * This is a high-level API abstraction that uses the low-level method of `postConfig()`
   * This method is called by the `apply()` method in VersionedPanObject.
   * Since the objective here is to edit configuration, we are using the 'edit' action.
   * @param xpath string of the xpath to be used
   * @param element string representation of the xml element to be pushed
   * @param entryName string name of the entry to be edited
   */
  // TODO: can we nix the `apiKey` argument and just use the instance property?
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
    data.append('xpath', fullPath);
    data.append('element', element);

    return this.post('/api/', data.toString());
  }

  // TODO: can we use the `get` method to perform the API call?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getConfig(xpath: string, parse: boolean = true): Promise<any> {
    // console.log(`Fetching config for '${xpath}'`);
    const params = {
      type: 'config',
      action: 'get',
      xpath: xpath,
    };

    try {
      const response = await this.axiosInstance.get('/api/', {
        params,
        responseType: 'text',
      });

      // Extract the data from the response and trim it
      const responseXml = response.data.trim();
      console.log('Trimmed API response:', responseXml); // Log the trimmed response

      if (!parse) {
        return responseXml;
      }
      return await this.parseXml(responseXml);
    } catch (error) {
      console.error('Error in getConfig:', error);
      throw error;
    }
  }

  /**
   * Parses an XML string into a JavaScript object.
   * @param xml - The XML string to be parsed.
   * @returns A promise resolved with the parsed object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async parseXml(
    xml: string,
    explicitArray: boolean = false,
    ignoreAttrs: boolean = true,
  ): Promise<string> {
    try {
      // console.log('Parsing XML:', xml); // Log the XML string
      const parsedXml = await parseStringPromise(xml, {
        explicitArray: explicitArray,
        ignoreAttrs: ignoreAttrs,
      });
      // console.log('Parsed XML:', parsedXml); // Log the parsed object
      return parsedXml;
    } catch (error) {
      console.error('Error parsing XML:', error);
      throw error;
    }
  }

  // TODO: this is currently only used by the `op()` method in PanDevice
  public getApiKey(): string {
    return this.apiKey;
  }
}
