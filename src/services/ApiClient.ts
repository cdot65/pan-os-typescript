// src/services/ApiClient.ts

import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';
import { ApiResponse, ApiResult } from '../interfaces/ApiResponse';
import logger from '../utils/logger';

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
  public async get(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<string> {
    logger.debug('Sending GET request to with params:', params);
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      // logger.info(
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
      // logger.info(
      //   `Sending POST request to '${endpoint}' with data:`, data:`,
      // );
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-PAN-KEY': this.apiKey,
        },
        responseType: 'text',
      });
      // logger.info(
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
  public async getData<T extends ApiResult>(
    endpoint: string,
    params?: Record<string, unknown>,
    parse: boolean = true,
  ): Promise<ApiResponse<T> | string> {
    const responseXml = await this.get(endpoint, params);
    if (!parse) {
      return responseXml;
    }
    const parsedXml: ApiResponse<T> = await this.parseXml(responseXml);
    return parsedXml;
  }

  /**
   * This is a high-level API abstraction that uses the low-level method of `post()`
   * @param xpath string of the xpath to be used
   * @param element string representation of the xml element to be pushed
   * @param action can be 'set', 'edit', or 'delete'. Higher level abstractions will differ on this argument value
   * @param apiKey the API key to be used. Defaults to the API key provided during instantiation
   */
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

  public async getConfig(
    xpath: string,
    parse: boolean = true,
  ): Promise<ApiResponse<ApiResult> | string> {
    // logger.info(`Fetching config for '${xpath}'`);
    const params = {
      type: 'config',
      action: 'get',
      xpath: xpath,
      key: this.apiKey,
    };

    try {
      // Use the existing get() method to perform the API call
      const responseXml = await this.get('/api/', params);

      // If we do not need to parse the XML, return the response text trimmed
      if (!parse) {
        return responseXml.trim();
      }

      // Extract the data from the response and trim it
      const trimmedResponseXml = responseXml.trim();
      logger.info('Trimmed API response:', trimmedResponseXml); // Log the trimmed response

      // Parse the XML and return it as ApiResponse<ApiResult>
      return await this.parseXml<ApiResult>(trimmedResponseXml);
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
  public async parseXml<T extends ApiResult>(
    xml: string,
    explicitArray: boolean = false,
    ignoreAttrs: boolean = true,
  ): Promise<ApiResponse<T>> {
    try {
      const parsedObject = await parseStringPromise(xml, {
        explicitArray: explicitArray,
        ignoreAttrs: ignoreAttrs,
        explicitRoot: false,
      });

      // Since the root element is 'response', parsedObject should directly correspond to ApiResponse<T>
      return parsedObject as ApiResponse<T>; // Cast it directly
    } catch (error) {
      console.error('Error parsing XML:', error);
      throw error;
    }
  }

  public async op(
    command: string,
    parse: boolean = true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    let xmlCmd: string;

    if (command.startsWith('<') && command.endsWith('>')) {
      xmlCmd = command;
    } else {
      xmlCmd = this.convertCliToXml(command);
    }

    const encodedCmd = encodeURIComponent(xmlCmd);
    const response = await this.getData(
      `/api/?type=op&cmd=${encodedCmd}`,
      { key: this.apiKey },
      parse,
    );
    return response;
  }

  /**
   * Converts a CLI-like command string into its XML representation.
   * This method is invoked when an operational command is specified in
   * a format other than XML and needs to be converted.
   * @param cliCmd - The CLI command string to convert.
   * @private
   * @returns The XML representation of the command string.
   */
  private convertCliToXml(cliCmd: string): string {
    const quote = '"';
    const parts = cliCmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    if (parts.length === 0) {
      return '';
    }

    let xmlCmd = '';
    const openTags: string[] = [];

    for (const part of parts) {
      if (part.startsWith(quote) && part.endsWith(quote)) {
        xmlCmd += part.slice(1, -1);
      } else {
        xmlCmd += `<${part}>`;
        openTags.push(part);
      }
    }

    while (openTags.length) {
      const tag = openTags.pop();
      xmlCmd += `</${tag}>`;
    }

    return xmlCmd;
  }
}
