// src/Device.ts

import { BaseClient } from './BaseClient';
import { ApiKeyResponse } from './interfaces/ApiKeyResponse';
import { JobsResponse } from './interfaces/JobsResponse';
import { LicenseInfoResponse } from './interfaces/LicenseInfoResponse';
import { SystemInfoResponse } from './interfaces/SystemInfoResponse';
import { parseStringPromise } from 'xml2js';

export abstract class Device {
  protected baseClient: BaseClient;

  constructor(baseClient: BaseClient) {
    this.baseClient = baseClient;
  }

  /**
   * Performs an API request with automated XML parsing.
   * This method is intended to be used by subclassing services for API interactions.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param endpoint - The API endpoint to send the request to.
   * @param params - Optional parameters for the request.
   * @returns A promise resolving to the parsed response in JSON format.
   * @throws An error if the API request or XML parsing fails.
   */
  protected async makeApiRequest(
    apiKey: string,
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // Retrieve XML response from the API
    const responseXml = await this.baseClient.getWithApiKey(
      endpoint,
      apiKey,
      params,
    );

    // Parse the XML response into JSON format
    const parsedResponse = await parseStringPromise(responseXml);
    return parsedResponse;
  }

  /**
   * Generates an API key using provided credentials or defaults to environment variables.
   * This method is crucial for authentication in subsequent API interactions with PAN-OS devices.
   *
   * @param username - Optional. Username for the PAN-OS user account, defaults to the environment variable PANOS_USERNAME.
   * @param password - Optional. Password for the PAN-OS user account, defaults to the environment variable PANOS_PASSWORD.
   * @returns A promise resolving to an ApiKeyResponse object containing the newly generated API key.
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
   * Converts a command in CLI format to an XML string format.
   * This utility method allows for easier interaction with the PAN-OS API by converting user-friendly
   * CLI commands into the required XML format for API requests.
   *
   * @param cliCmd - The command in CLI format.
   * @returns The command converted to XML format.
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
   * Executes an operational command on a PAN-OS device. It supports commands in both XML and CLI-like formats,
   * converting the latter into XML using the convertCliToXml method.
   *
   * @param apiKey - The API key used for authentication.
   * @param command - The command to execute, either in XML or CLI-like format.
   * @returns A promise resolving to the response from the device.
   * @throws An error if executing the command fails.
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
   * Requests license information from the PAN-OS device.
   * This method executes the 'request license info' command and returns detailed license information.
   *
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to the device's license information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async requestLicenseInfo(
    apiKey: string,
  ): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves all jobs from the PAN-OS device.
   *
   * This method sends a command to the PAN-OS device to retrieve details of all jobs.
   * It parses the XML response and returns a structured representation of job details.
   *
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to a structured representation of all jobs.
   * @throws An error if the request or parsing fails.
   */
  public async showJobsAll(apiKey: string): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves all jobs from the PAN-OS device.
   *
   * This method sends a command to the PAN-OS device to retrieve details of all jobs.
   * It parses the XML response and returns a structured representation of job details.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param jobId - The ID of the job for the request.
   * @returns A promise resolving to a structured representation of all jobs.
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
   * Retrieves system information from a PAN-OS device, such as hostname, IP address, and software version.
   * This method abstracts the details of sending a system information request and processing the response.
   *
   * @param apiKey - The API key for authentication.
   * @returns A promise resolving to the system information in a structured format.
   * @throws An error if retrieving the information fails.
   */
  public async showSystemInfoResponse(
    apiKey: string,
  ): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }
}
