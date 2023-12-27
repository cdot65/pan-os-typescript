// src/PanDevice.ts

import { PanObject } from './PanObject';
import { ApiClient } from '../ApiClient';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ApiKeyResponse } from '../interfaces/ApiKeyResponse';
import { JobsResponse } from '../interfaces/JobsResponse';
import { LicenseInfoResponse } from '../interfaces/LicenseInfoResponse';
import { SystemInfoResponse } from '../interfaces/SystemInfoResponse';
import { parseStringPromise } from 'xml2js';

/**
 * Represents a PAN-OS device and provides methods to interact with it.
 * This class encapsulates functionalities such as generating API keys,
 * executing operational commands, and retrieving system information.
 */
export class PanDevice extends PanObject {
  /**
   * Hostname or IP address of the PAN-OS device.
   * @protected
   */
  protected hostname: string;

  /**
   * API key for authenticating requests to the PAN-OS device.
   * @protected
   */
  protected apiKey: string;

  /**
   * API client for making requests to the PAN-OS device.
   * @protected
   */
  protected baseClient: ApiClient;

  /**
   * Constructs a PanDevice instance.
   * @param hostname - Hostname or IP address of the PAN-OS device.
   * @param apiKey - API key for authenticating requests.
   */
  constructor(hostname: string, apiKey: string) {
    super(hostname); // Call the constructor of PanObject
    this.hostname = hostname;
    this.apiKey = apiKey;
    this.baseClient = new ApiClient(`https://${hostname}`);
  }

  /**
   * Sends an API request to the PAN-OS device.
   * @protected
   * @param endpoint - The API endpoint to send the request to.
   * @param params - Optional parameters for the request.
   * @returns The parsed response from the device.
   */
  protected async sendApiRequest(
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const responseXml = await this.baseClient.get(
      endpoint,
      this.apiKey,
      params,
    );
    const parsedResponse = await parseStringPromise(responseXml);
    return parsedResponse;
  }

  /**
   * Generates an API key using the provided credentials.
   * @param username - Username for the PAN-OS device. Defaults to the environment variable value.
   * @param password - Password for the PAN-OS device. Defaults to the environment variable value.
   * @returns The generated API key response.
   */
  public async generateApiKey(
    username: string = process.env.PANOS_USERNAME || '',
    password: string = process.env.PANOS_PASSWORD || '',
  ): Promise<ApiKeyResponse> {
    const response = await this.sendApiRequest('/api/', {
      type: 'keygen',
      user: username,
      password: password,
    });
    const apiKeyResponse: ApiKeyResponse = {
      key: response?.response?.result?.[0]?.key?.[0],
    };
    return apiKeyResponse;
  }

  /**
   * Parses an XML response into a structured ApiResponse object.
   * @protected
   * @param responseXml - The XML string to parse.
   * @returns The parsed ApiResponse object.
   */
  protected async parseApiResponse(responseXml: string): Promise<ApiResponse> {
    try {
      const parsedResponse = await parseStringPromise(responseXml, {
        explicitArray: false,
        ignoreAttrs: false,
      });
      const response = parsedResponse.response;
      return {
        status: response.$.status,
        code: parseInt(response.$.code, 10),
        message: response.msg || 'No message',
      };
    } catch (error) {
      console.error('Error parsing API response:', error);
      throw error;
    }
  }

  /**
   * Converts a CLI command string into an XML format suitable for API requests.
   * @private
   * @param cliCmd - The CLI command string.
   * @returns The command string converted into XML format.
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

  /**
   * Executes an operational command on the PAN-OS device.
   * @param command - The operational command in XML or CLI-like format.
   * @returns The response from executing the command.
   */
  public async executeOperationalCommand(
    command: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    let xmlCmd: string;

    if (command.startsWith('<') && command.endsWith('>')) {
      xmlCmd = command;
    } else {
      xmlCmd = this.convertCliToXml(command);
    }

    const encodedCmd = encodeURIComponent(xmlCmd);
    const response = await this.sendApiRequest(
      `/api/?type=op&cmd=${encodedCmd}`,
      { key: this.apiKey }, // Use the stored apiKey
    );
    return response;
  }

  /**
   * Requests license information from the PAN-OS device.
   * @returns License information response.
   */
  public async requestLicenseInfo(): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of all jobs on the PAN-OS device.
   * @returns Information about all jobs.
   */
  public async showJobsAll(): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of a specific job on the PAN-OS device.
   * @param jobId - The ID of the job to retrieve details for.
   * @returns Detailed information about the specified job.
   */
  public async showJobsId(jobId: string): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information from the PAN-OS device.
   * @returns System information response.
   */
  public async showSystemInfoResponse(): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Sends a configuration request to the PAN-OS device.
   * @protected
   * @param xpath - XPath expression selecting the configuration context.
   * @param element - XML element defining the configuration change.
   * @param action - The action to perform ('set', 'edit', 'delete').
   * @returns The XML response string from the device.
   */
  protected async sendConfigRequest(
    apiKey: string,
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
  ): Promise<string> {
    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', action);
    data.append('key', apiKey);
    data.append('xpath', xpath);
    if (action !== 'delete') {
      data.append('element', element);
    }

    try {
      // The post method of ApiClient returns the XML response as a string,
      // so we can return it directly without accessing .data
      return await this.baseClient.post('/api/', apiKey, data.toString());
    } catch (error) {
      console.error('Error in config request:', error);
      throw error;
    }
  }
}
