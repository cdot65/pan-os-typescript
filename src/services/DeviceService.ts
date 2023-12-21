// src/services/DeviceService.ts

import { BaseService } from './BaseService';
import { SystemInfo } from '../interfaces/SystemInfo';
import { ApiKeyResponse } from '../interfaces/ApiKeyResponse';

/**
 * `DeviceService` is a specialized service class extending `BaseService`.
 * It focuses on PAN-OS device-specific operations, providing methods to interact
 * with various device functionalities such as API key generation and system information retrieval.
 */
export class DeviceService extends BaseService {
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
   * Retrieves system information from a PAN-OS device, such as hostname, IP address, and software version.
   * This method abstracts the details of sending a system information request and processing the response.
   *
   * @param apiKey - The API key for authentication.
   * @returns A promise resolving to the system information in a structured format.
   * @throws An error if retrieving the information fails.
   */
  public async getSystemInfo(apiKey: string): Promise<SystemInfo> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }
}
