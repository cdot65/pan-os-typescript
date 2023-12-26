// src/Device.ts

import { BaseClient } from './BaseClient';
import { ApiResponse } from './interfaces/ApiResponse';
import { ApiKeyResponse } from './interfaces/ApiKeyResponse';
import { JobsResponse } from './interfaces/JobsResponse';
import { LicenseInfoResponse } from './interfaces/LicenseInfoResponse';
import { SystemInfoResponse } from './interfaces/SystemInfoResponse';
import { parseStringPromise } from 'xml2js';

/**
 * Abstract base class representing a PAN-OS device providing common API request methods.
 */
export abstract class Device {
  /**
   * HTTP client handling low-level API interactions.
   * @protected
   */
  protected baseClient: BaseClient;

  /**
   * Initializes a new instance of the Device class with a given BaseClient.
   * @param baseClient - The BaseClient instance for HTTP communication.
   */
  constructor(baseClient: BaseClient) {
    this.baseClient = baseClient;
  }

  /**
   * Performs an API request and automatically parses the XML response.
   * Designed to be used by derived services for API interactions.
   * @protected
   * @param apiKey - The API key for request authentication.
   * @param endpoint - The API endpoint for the request.
   * @param params - Optional parameters for the request.
   * @returns A promise resolving to the parsed response in JSON format.
   * @throws An error if the request or XML parsing fails.
   */
  protected async makeApiRequest(
    apiKey: string,
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const responseXml = await this.baseClient.get(endpoint, apiKey, params);
    const parsedResponse = await parseStringPromise(responseXml);
    return parsedResponse;
  }

  /**
   * Parses an API response from XML to a formatted ApiResponse object.
   * @protected
   * @param responseXml - The XML string to be parsed.
   * @returns A promise resolving to the ApiResponse object.
   * @throws An error if the parsing fails.
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
   * Generates an API key using provided credentials or defaults from environment variables.
   * This key is essential for authenticating future API requests to PAN-OS devices.
   * @param username - Optional username for the PAN-OS user account (defaults to PANOS_USERNAME env var).
   * @param password - Optional password for the PAN-OS user account (defaults to PANOS_PASSWORD env var).
   * @returns A promise resolving to an object containing the new API key.
   * @throws An error if the API key generation request fails.
   */
  public async generateApiKey(
    username: string = process.env.PANOS_USERNAME || '',
    password: string = process.env.PANOS_PASSWORD || '',
  ): Promise<ApiKeyResponse> {
    const response = await this.makeApiRequest('', '/api/', {
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
   * Converts a command in CLI format to an XML string.
   * This method enables compatibility with the PAN-OS API by converting
   * CLI-formatted commands into the XML format required for API requests.
   * @private
   * @param cliCmd - The command string in CLI format.
   * @returns The converted command string in XML format.
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
   * Executes an operational command on a PAN-OS device.
   * Commands can be in both XML and CLI-like format, and the latter is converted to XML format.
   * @param apiKey - The API key for authentication.
   * @param command - The operational command to be executed (in XML or CLI-like format).
   * @returns A promise resolving to the response from the execution of the command.
   * @throws An error if the execution of the command fails.
   */
  public async executeOperationalCommand(
    apiKey: string,
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
    const response = await this.makeApiRequest(
      apiKey,
      `/api/?type=op&cmd=${encodedCmd}`,
    );
    return response;
  }

  /**
   * Retrieves license information from the PAN-OS device.
   * Sends a command to the device and returns detailed license information.
   * @param apiKey - The API key for request authentication.
   * @returns A promise resolving to the device's license information.
   * @throws An error if the request fails or the response is unexpected.
   */
  public async requestLicenseInfo(
    apiKey: string,
  ): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves the details of all jobs on the PAN-OS device.
   * Sends a command to the device and returns a structured view of all job details.
   * @param apiKey - The API key for request authentication.
   * @returns A promise resolving to a structured representation of all jobs.
   * @throws An error if the request or parsing fails.
   */
  public async showJobsAll(apiKey: string): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves details for a specific job ID from the PAN-OS device.
   * Sends a command to the device and returns structured details for the specified job.
   * @param apiKey - The API key for request authentication.
   * @param jobId - The job ID for which to retrieve details.
   * @returns A promise resolving to the job details.
   * @throws An error if the request or parsing fails.
   */
  public async showJobsId(
    apiKey: string,
    jobId: string,
  ): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves system information from the PAN-OS device, such as hostname and software version.
   * Sends a system information request and processes the structured response.
   * @param apiKey - The API key for authentication.
   * @returns A promise resolving to structured system information.
   * @throws An error if retrieving the information fails.
   */
  public async showSystemInfoResponse(
    apiKey: string,
  ): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Sends a configuration request to the PAN-OS device for actions like set, edit, or delete.
   * @protected
   * @param apiKey - The API key for request authentication.
   * @param xpath - The XPath expression selecting the configuration to manipulate.
   * @param element - The XML element defining the configuration to apply.
   * @param action - The action to perform on the configuration ('set', 'edit', 'delete').
   * @returns A promise resolving to the XML response string.
   * @throws An error if the configuration request fails.
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
      // The post method of BaseClient returns the XML response as a string,
      // so we can return it directly without accessing .data
      return await this.baseClient.post('/api/', apiKey, data.toString());
    } catch (error) {
      console.error('Error in config request:', error);
      throw error;
    }
  }
}
