// src/PanDevice.ts

import { PanObject } from './PanObject';
import { ApiClient } from '../services/ApiClient';
import { ApiKeyResult } from '../interfaces/ApiResponse';
import { JobsResponse } from '../interfaces/JobsResponse';
import { ApiKeyResponse } from '../interfaces/ApiKeyResponse';
import { SystemInfoResponse } from '../interfaces/SystemInfoResponse';
import { LicenseInfoResponse } from '../interfaces/LicenseInfoResponse';

/**
 * Base class for interaction with Palo Alto Networks devices.
 * It offers methods to generate API keys, execute operational commands,
 * and gather system and license information.
 */
export class PanDevice extends PanObject {
  protected hostname: string;

  /**
   * Initializes a new instance of the `PanDevice` class.
   *
   * @param hostname  - The hostname or IP address of the device.
   * @param apiClient - An optional pre-configured `ApiClient` instance.
   */
  constructor(hostname: string, apiClient?: ApiClient) {
    super(hostname, apiClient);
    this.hostname = hostname;
  }

  /**
   * Generates an API key for the device using the given credentials.
   *
   * @param username - The device username.
   * @param password - The device password.
   * @throws Will throw an error if API key generation fails.
   * @returns A promise resolving to an object containing the generated API key.
   */
  public async generateApiKey(
    username: string,
    password: string,
  ): Promise<ApiKeyResponse> {
    try {
      const tempApiClient = new ApiClient(this.hostname, '');
      const apiKeyResult = await tempApiClient.getData<ApiKeyResult>('/api/', {
        type: 'keygen',
        user: username,
        password: password,
      });

      if (
        typeof apiKeyResult !== 'string' &&
        apiKeyResult.result &&
        'key' in apiKeyResult.result
      ) {
        return {
          key: apiKeyResult.result.key,
        };
      } else {
        throw new Error('API key generation failed');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  }

  /**
   * Retrieves configuration data for this object type from the device.
   *
   * @param xpath - The XPath query specific to the object type.
   * @returns A promise resolving to the device's configuration data as a parsed object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fetchConfig(xpath: string): Promise<any> {
    const apiClient = this.apiClient; // Retrieve the ApiClient instance
    return apiClient.getConfig(xpath);
  }

  /**
   * Retrieves license information from the PAN-OS device.
   *
   * @returns A promise resolving to the license information from the device.
   */
  public async requestLicenseInfo(): Promise<LicenseInfoResponse> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of all jobs processed by the PAN-OS device.
   *
   * @returns A promise resolving to the details of all jobs on the device.
   */
  public async showJobsAll(): Promise<JobsResponse> {
    const xmlCmd = '<show><jobs><all/></jobs></show>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of a specific job using its unique identifier.
   *
   * @param jobId - The ID of the job to query.
   * @returns A promise resolving to the details of the specified job.
   */
  public async showJobsId(jobId: string): Promise<JobsResponse> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information and status from the PAN-OS device.
   *
   * @returns A promise resolving to the system information and status.
   */
  public async showSystemInfoResponse(): Promise<SystemInfoResponse> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }
}
