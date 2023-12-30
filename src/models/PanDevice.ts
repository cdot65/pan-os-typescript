// src/PanDevice.ts

import { PanObject } from './PanObject';
import { ApiClient } from '../services/ApiClient';
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
   * Generates an API key using the provided credentials.
   * @param username - The username for the PAN-OS device.
   * @param password - The password for the PAN-OS device.
   * @returns A promise resolving to the ApiKeyResponse with the generated API key.
   */
  public async generateApiKey(
    username: string,
    password: string,
  ): Promise<ApiKeyResponse> {
    try {
      const tempApiClient = new ApiClient(this.hostname, '');
      const apiKeyResponse = await tempApiClient.getData('/api/', {
        type: 'keygen',
        user: username,
        password: password,
      });

      if (!apiKeyResponse?.response?.result?.key) {
        throw new Error('API key generation failed');
      }

      /**
       * the result of the API key generation looks like this:
       * {response: {result: {key: 'mykey123=='}}}
       * so we need to return the key from the result object
       */
      return {
        key: apiKeyResponse.response.result.key,
      };
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  }

  /**
   * Fetches the configuration for this object type from the device.
   *
   * @param xpath - The XPath specific to the object type.
   * @returns A promise resolving to the configuration data as a parsed object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fetchConfig(xpath: string): Promise<any> {
    const apiClient = this.apiClient; // Retrieve the ApiClient instance
    return apiClient.getConfig(xpath);
  }

  /**
   * Requests and retrieves license information from the PAN-OS device.
   * @returns A promise resolved with license information from the device.
   */
  public async requestLicenseInfo(): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves information about all jobs processed by the PAN-OS device.
   * @returns A promise resolved with details of all jobs.
   */
  public async showJobsAll(): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves information about a specific job based on its ID.
   * @param jobId - The unique identifier of the job.
   * @returns A promise resolved with the details of the specified job.
   */
  public async showJobsId(jobId: string): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information and status from the PAN-OS device.
   * @returns A promise resolved with system information and status.
   */
  public async showSystemInfoResponse(): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }
}
