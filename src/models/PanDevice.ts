// src/PanDevice.ts

import { ApiClient } from '../services/ApiClient';
import { PanObject } from './PanObject';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ApiKeyResponse } from '../interfaces/ApiKeyResponse';
import { JobsResponse } from '../interfaces/JobsResponse';
import { LicenseInfoResponse } from '../interfaces/LicenseInfoResponse';
import { SystemInfoResponse } from '../interfaces/SystemInfoResponse';
import { parseStringPromise } from 'xml2js';

/**
 * `PanDevice` extends `PanObject` to interact with PAN-OS devices. It encapsulates API key management,
 * command execution, and system information retrieval. Integrated HTTP request methods facilitate direct communication with the device.
 */
export class PanDevice extends PanObject {
  /**
   * The hostname or IP address of the targeted PAN-OS device.
   * @protected
   */
  protected hostname: string;

  /**
   * The API key used for authenticating requests made to the PAN-OS device.
   * @protected
   */
  protected apiKey: string;

  /**
   * Axios instance responsible for sending requests to the PAN-OS device.
   * @protected
   */
  protected apiClient: ApiClient;

  /**
   * Constructs a new `PanDevice` instance.
   *
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - The API key for authenticating requests to the PAN-OS device.
   */
  constructor(hostname: string, apiKey: string) {
    super(hostname);
    this.hostname = hostname;
    this.apiKey = apiKey;
    this.apiClient = new ApiClient(hostname, apiKey);
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
    const response = await this.apiClient.sendApiRequest('/api/', {
      type: 'keygen',
      user: username,
      password: password,
    });
    return {
      key: response?.response?.result?.[0]?.key?.[0],
    };
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
  public async op(
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
    const response = await this.apiClient.sendApiRequest(
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
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of all jobs on the PAN-OS device.
   * @returns Information about all jobs.
   */
  public async showJobsAll(): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of a specific job on the PAN-OS device.
   * @param jobId - The ID of the job to retrieve details for.
   * @returns Detailed information about the specified job.
   */
  public async showJobsId(jobId: string): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information from the PAN-OS device.
   * @returns System information response.
   */
  public async showSystemInfoResponse(): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.op(xmlCmd);
    return response;
  }
}