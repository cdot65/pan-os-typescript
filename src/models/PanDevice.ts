/* eslint-disable @typescript-eslint/no-explicit-any */
// src/PanDevice.ts

import { ApiClient } from '../services/ApiClient';
import { PanObject } from './PanObject';

/**
 * Represents the base class for interaction with Palo Alto Networks devices.
 * Provides methods to generate API keys, execute operational commands, and gather system and license information.
 */
export class PanDevice extends PanObject {
  protected hostname: string;

  /**
   * Creates a new instance of `PanDevice`.
   *
   * @param hostname The hostname or IP address of the Palo Alto Networks device.
   * @param apiClient A pre-configured `ApiClient` instance.
   */
  constructor(hostname: string, apiClient?: ApiClient) {
    super(hostname, apiClient);
    this.hostname = hostname;
  }

  /**
   * Retrieves configuration data from the device based on an XPath query.
   *
   * @param xpath The XPath query specific to the object type being queried.
   * @returns A promise resolving to the device's configuration data in parsed form.
   */
  public async getConfig(xpath: string): Promise<any> {
    const apiClient = this.apiClient; // Retrieve the ApiClient instance
    return apiClient.getConfig(xpath);
  }

  /**
   * Retrieves license information from the PAN-OS device.
   *
   * @returns A promise resolving to the license information from the device.
   */
  public async requestLicenseInfo(): Promise<any> {
    const xmlCmd = '<request><license><info/></license></request>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves details of all jobs processed by the PAN-OS device.
   *
   * @returns A promise resolving to the details of all jobs on the device.
   */
  public async showJobsAll(): Promise<any> {
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
  public async showJobsId(jobId: string): Promise<any> {
    const xmlCmd = `<show><jobs><id>${jobId}</id></jobs></show>`;
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves system information and status from the PAN-OS device.
   *
   * @returns A promise resolving to the system information and status.
   */
  public async showSystemInfoResponse(): Promise<any> {
    const xmlCmd = '<show><system><info/></system></show>';
    const response = await this.apiClient.op(xmlCmd);
    return response;
  }
}
