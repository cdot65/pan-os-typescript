// src/PanDevice.ts

import { PanObject } from './PanObject';
import { parseStringPromise } from 'xml2js';
import { ApiClient } from '../services/ApiClient';
import { ApiResponse } from '../interfaces/ApiResponse';
import { JobsResponse } from '../interfaces/JobsResponse';
import { ApiKeyResponse } from '../interfaces/ApiKeyResponse';
import { SystemInfoResponse } from '../interfaces/SystemInfoResponse';
import { LicenseInfoResponse } from '../interfaces/LicenseInfoResponse';

/**
 * The PanDevice class is the base class for interacting with Palo Alto Networks devices,
 * providing methods for operations like generating API keys, executing operational commands,
 * and retrieving system and license information.
 */
export class PanDevice extends PanObject {
  protected hostname: string;

  /**
   * Constructs a PanDevice instance for interacting with a Palo Alto Networks device.
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiClient - An optional instance of ApiClient.
   */
  constructor(hostname: string, apiClient?: ApiClient) {
    super(hostname, apiClient); // Correctly pass the arguments
    this.hostname = hostname;
  }

  /**
   * Retrieves the API key used by the API client.
   * @protected
   * @returns The API key as a string.
   */
  protected getApiKey(): string {
    return this.apiClient.getApiKey(); // Assuming getApiKey() is a method in ApiClient
  }

  public getXpath(): string {
    // Implement the getXpath logic specific to PanDevice
    // Return a string representing the XPath
    return '';
  }

  public toXml(): string {
    // Implement the toXml logic specific to PanDevice
    // Return a string representing the XML
    return '';
  }

  /**
   * Generates an API key using the provided credentials.
   * @param username - The username for the PAN-OS device.
   * @param password - The password for the PAN-OS device.
   * @returns A promise resolving to the KeyResponse with the generated API key.
   */
  public async generateApiKey(
    username: string,
    password: string,
  ): Promise<ApiKeyResponse> {
    // Create a temporary ApiClient instance for API key generation
    const tempApiClient = new ApiClient(this.hostname, '');
    const response = await tempApiClient.getData('/api/', {
      type: 'keygen',
      user: username,
      password: password,
    });

    // Extract and return the API key from the response
    return {
      key: response?.response?.result?.[0]?.key?.[0],
    };
  }

  /**
   * Parses an XML response into a structured ApiResponse object.
   * @param responseXml - The XML string to parse.
   * @protected
   * @returns A promise resolved with the parsed ApiResponse object.
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

  /**
   * Provides access to the ApiClient instance used by the PanDevice.
   * @returns The ApiClient currently associated with the PanDevice.
   */
  public getApiClient(): ApiClient {
    return this.apiClient;
  }

  /**
   * Executes an operational command on the PAN-OS device and optionally parses the response.
   * @param command - The operational command in XML or CLI-like format.
   * @param parse - Optionally parse the response into object format. Default is true.
   * @returns The response from executing the operational command.
   */
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
    const response = await this.apiClient.getData(
      `/api/?type=op&cmd=${encodedCmd}`,
      { key: this.getApiKey() }, // Use getApiKey()
      parse,
    );
    return response;
  }

  /**
   * Requests and retrieves license information from the PAN-OS device.
   * @returns A promise resolved with license information from the device.
   */
  public async requestLicenseInfo(): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves information about all jobs processed by the PAN-OS device.
   * @returns A promise resolved with details of all jobs.
   */
  public async showJobsAll(): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves information about a specific job based on its ID.
   * @param jobId - The unique identifier of the job.
   * @returns A promise resolved with the details of the specified job.
   */
  public async showJobsId(jobId: string): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information and status from the PAN-OS device.
   * @returns A promise resolved with system information and status.
   */
  public async showSystemInfoResponse(): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.op(xmlCmd);
    return response;
  }
}
