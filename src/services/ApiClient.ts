// src/services/ApiClient.ts

import {
  ApiKeyResult,
  ApiResponse,
  ApiResult,
} from '../interfaces/ApiResponse';
import axios, { AxiosInstance } from 'axios';

import logger from '../utils/logger';
import { parseStringPromise } from 'xml2js';

/**
 * Client for interacting with the Palo Alto Networks XML API.
 * Encapsulates methods for performing HTTP GET and POST requests with XML data and conversion utilities for API operations.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string;

  /**
   * Constructs a new instance of `ApiClient`.
   *
   * @param hostname The hostname or IP address of the target PAN-OS device.
   * @param apiKey The API key for authenticating requests to the PAN-OS device.
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
   * Performs an HTTP GET request to the specified endpoint on the PAN-OS device.
   *
   * @param endpoint The API endpoint to send the request to.
   * @param params Optional parameters to include in the request.
   * @returns A promise that resolves to a string containing the raw XML response.
   */
  public async get(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<string> {
    logger.debug(
      `Sending the GET request to '${endpoint}' with params: ${params}`,
    );
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      logger.debug(
        `Response from GET request to '${endpoint}': ${response.data}`,
      );
      return response.data;
    } catch (error) {
      logger.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Performs an HTTP POST request to the specified endpoint on the PAN-OS device.
   *
   * @param endpoint The API endpoint to send the request to.
   * @param data The XML string to be sent as the request body.
   * @returns A promise that resolves to a string containing the raw XML response.
   */
  public async post(endpoint: string, data: string): Promise<string> {
    logger.debug(
      `Sending the POST request to '${endpoint}' with data: ${data}`,
    );
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-PAN-KEY': this.apiKey,
        },
        responseType: 'text',
      });
      logger.debug(
        `Response from POST request to '${endpoint}': ${response.data}`,
      );
      return response.data;
    } catch (error) {
      logger.error('Error in POST request:', error);
      throw error;
    }
  }

  /**
   * Generates an API key for the PAN-OS device.
   *
   * @param endpoint The API endpoint for key generation.
   * @param params The parameters for the API key generation request.
   * @returns A promise that resolves to the generated API key.
   * @throws An error if the API key generation fails.
   */
  public async generateApiKey(
    endpoint: string,
    params: Record<string, unknown>,
  ): Promise<string> {
    try {
      const responseXml = await this.get(endpoint, params);
      const parsedXml: ApiResponse<ApiKeyResult> =
        await this.parseXml(responseXml);

      if (parsedXml.result && typeof parsedXml.result.key === 'string') {
        return parsedXml.result.key;
      } else {
        throw new Error('API Key could not be generated or parsed correctly.');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('Error in generateApiKey:', errorMessage);
      throw error;
    }
  }

  /**
   * Retrieves and optionally parses data from the PAN-OS API.
   *
   * @typeparam T The expected type of the API result.
   * @param endpoint The API endpoint to send the request to.
   * @param params Optional parameters to include in the request.
   * @returns A promise that resolves to the response data, either as a raw XML string or as an `ApiResponse<T>`.
   */
  public async getData<T extends ApiResult>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const responseXml = await this.get(endpoint, params);
    const parsedXml: ApiResponse<T> = await this.parseXml(responseXml);
    return parsedXml;
  }

  /**
   * Retrieves raw data from the PAN-OS API.
   *
   * @param endpoint The API endpoint to send the request to.
   * @param params Optional parameters to include in the request.
   * @returns A promise that resolves to a string containing the raw XML response.
   */
  public async getRawData(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<string> {
    const responseXml = await this.get(endpoint, params);
    return responseXml;
  }

  /**
   * Sends a configuration change to the PAN-OS device via an API POST request.
   *
   * @param xpath The XPath of the configuration to be updated.
   * @param element The configuration's XML representation.
   * @param action The configuration action to perform (set, edit, or delete).
   * @returns A promise that resolves to a string containing the raw XML response.
   */
  public async postConfig(
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
  ): Promise<string> {
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
   * Creates a configuration entity on the PAN-OS device.
   *
   * @param xpath The XPath of the configuration to be created.
   * @param element The configuration's XML representation.
   * @returns A promise that resolves to a string containing the raw XML response from the configuration creation API call.
   */
  public async setConfig(xpath: string, element: string): Promise<string> {
    return this.postConfig(xpath, element, 'set');
  }

  /**
   * Edits a configuration entity on the PAN-OS device.
   *
   * @param xpath The XPath of the configuration to be edited.
   * @param element The configuration's XML representation.
   * @param entryName Optional. The name of the configuration entry to be edited.
   * @returns A promise that resolves to a string containing the raw XML response from the configuration edit API call.
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

  /**
   * Retrieves a specified configuration from the PAN-OS device, with options to parse the response.
   *
   * @param xpath The XPath of the configuration to be retrieved.
   * @param parse Optional. Whether to parse the XML response into a JavaScript object. Defaults to `true`.
   * @returns The configuration data, either as a raw XML string or as an `ApiResponse<ApiResult>`.
   */
  public async getConfig(
    xpath: string,
    parse: boolean = true,
  ): Promise<ApiResponse<ApiResult> | string> {
    const params = {
      type: 'config',
      action: 'get',
      xpath,
      key: this.apiKey,
    };

    try {
      const responseXml = await this.get('/api/', params);
      if (!parse) {
        return responseXml.trim();
      }

      const trimmedResponseXml = responseXml.trim();
      return await this.parseXml<ApiResult>(trimmedResponseXml);
    } catch (error) {
      logger.error('Error in getConfig:', error);
      throw error;
    }
  }

  /**
   * Parses an XML string into a JavaScript object structure.
   *
   * @typeparam T The expected type of the API result structure.
   * @param xml The XML string to parse.
   * @param explicitArray Optional. Forces arrays for child elements if set to true. Defaults to `false`.
   * @param ignoreAttrs Optional. Ignores XML attributes and only creates text nodes if set to true. Defaults to `true`.
   * @returns A promise resolved with the parsed object structure.
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

      return parsedObject as ApiResponse<T>; // Ensuring the return type matches the expected ApiResponse<T>
    } catch (error) {
      logger.error('Error parsing XML:', error);
      throw error;
    }
  }

  /**
   * Executes an operational command on the PAN-OS device and retrieves the result.
   *
   * @typeparam T The expected type of the API result structure.
   * @param command The command string or XML to execute.
   * @param parse Optional. Whether to parse the command response into a JavaScript object. Defaults to `true`.
   * @returns The response from the operational command, either as raw XML or an object.
   */
  public async op<T extends ApiResult>(
    command: string,
    parse: boolean = true,
  ): Promise<ApiResponse<T> | string> {
    let xmlCmd: string = command;
    if (!command.startsWith('<') || !command.endsWith('>')) {
      xmlCmd = this.convertCliToXml(command);
    }

    logger.debug(
      `Sending the raw xml operational command of ${xmlCmd} to the API`,
    );
    const encodedCmd = encodeURIComponent(xmlCmd);

    logger.debug(
      `Sending the encodeURIComponent command of ${encodedCmd} to the API`,
    );
    if (parse) {
      const apiResponse = await this.getData<T>(
        `/api/?type=op&cmd=${encodedCmd}`,
        {
          key: this.apiKey,
        },
      );
      return apiResponse;
    } else {
      const apiResponse = await this.getRawData(
        `/api/?type=op&cmd=${encodedCmd}`,
        {
          key: this.apiKey,
        },
      );
      return apiResponse;
    }
  }

  /**
   * Converts a CLI command to the XML format required by the PAN-OS API.
   *
   * @param cliCmd The CLI command to convert to XML.
   * @returns The XML representation of the CLI command.
   */
  private convertCliToXml(cliCmd: string): string {
    const quote = '"';
    const parts = cliCmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    if (parts.length === 0) {
      return '';
    }

    let xmlCmd = '';
    const openTags: string[] = [];
    parts.forEach((part) => {
      if (part.startsWith(quote) && part.endsWith(quote)) {
        xmlCmd += part.slice(1, -1);
      } else {
        openTags.push(part);
        xmlCmd += `<${part}>`;
      }
    });

    while (openTags.length) {
      const tag = openTags.pop();
      xmlCmd += `</${tag}>`;
    }

    return xmlCmd;
  }
}
