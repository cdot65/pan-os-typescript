// src/models/Firewall.ts

import { PanDevice } from './PanDevice';
import { AddressObject } from './AddressObject';
import { ApiClient } from '../services/ApiClient';
import { ApiResponse } from '../interfaces/ApiResponse';
import { SessionResponse } from '../interfaces/SessionResponse';
import { SessionIdResponse } from '../interfaces/SessionIdResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';
import { SessionInfoResponse } from '../interfaces/SessionInfoResponse';
import { TestUrlInfoResponse } from '../interfaces/TestUrlInfoResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';
import { AddressObjectEntry } from '../interfaces/AddressObjectResponse';
import { parseStringPromise } from 'xml2js';

/**
 * Extends the PanDevice class, providing specialized methods for managing and interacting
 * with a Palo Alto Networks firewall. Functionality includes resource monitoring, session
 * management, routing information retrieval, URL category testing, and address object management.
 */
export class Firewall extends PanDevice {
  /**
   * Constructs a new Firewall instance for managing a PAN-OS firewall.
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - An optional API key for device authentication (if not provided during PanDevice instantiation).
   */
  constructor(hostname: string, apiKey?: string) {
    let apiClient;
    if (apiKey) {
      apiClient = new ApiClient(hostname, apiKey);
    }
    super(hostname, apiClient); // Pass the hostname and apiClient
    this.hostname = hostname;
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
   * Fetches resource monitoring data such as CPU and memory utilization.
   * @returns A promise resolved with resource monitoring data.
   */
  public async showResourceMonitor(): Promise<ResourceMonitorResponse> {
    const cmd = 'show running resource-monitor minute';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves the routing table information from the firewall.
   * @returns A promise resolved with routing table details.
   */
  public async showRoutingRoute(): Promise<RoutingRouteResponse> {
    const cmd = 'show routing route';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves a list of all active sessions on the firewall.
   * @returns A promise resolved with active session details.
   */
  public async showSessionAll(): Promise<SessionAllResponse> {
    const cmd = 'show session all';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves detailed session information filtered by destination and source IP.
   * @param destinationIp - IP address to use as a filter for the destination.
   * @param sourceIp - IP address to use as a filter for the source.
   * @returns A promise resolved with session information based on provided filters.
   */
  public async showSessionAllFilter(
    destinationIp: string,
    sourceIp: string,
  ): Promise<SessionResponse> {
    const xmlCmd = `<show><session><all><filter><source>${sourceIp}</source><destination>${destinationIp}</destination></filter></all></session></show>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves detailed information about a specific session identified by its ID.
   * @param sessionId - The unique session ID to retrieve information for.
   * @returns A promise resolved with detailed session information for the specified ID.
   */
  public async showSessionId(sessionId: string): Promise<SessionIdResponse> {
    const xmlCmd = `<show><session><id>${sessionId}</id></session></show>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves information about sessions from the PAN-OS firewall, including configuration and statistics.
   * @returns A promise resolved with session information.
   **/
  public async showSessionInfo(): Promise<SessionInfoResponse> {
    const cmd = 'show session info';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves category information about a specified URL.
   * @param url - The URL to test for category information.
   * @returns A promise resolved with the category information of the URL.
   */
  public async testUrlInfo(url: string): Promise<TestUrlInfoResponse> {
    const xmlCmd = `<test><url-info-cloud>${url}</url-info-cloud></test>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves a list of all address objects configured on the firewall.
   * @returns A promise resolved with an array of address object entries.
   */
  public async addressObjectGetList(): Promise<AddressObjectEntry[]> {
    const xmlCmd = `<show><config><running><xpath>devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address</xpath></running></config></show>`;
    const responseXml = await this.op(xmlCmd, false);

    // Parse the XML response
    const parsedResponse = await parseStringPromise(responseXml, {
      explicitArray: false,
    });

    // Check if the response is successful
    const addressEntries = parsedResponse?.response?.result?.address?.entry;
    if (!addressEntries) {
      throw new Error(
        'Failed to retrieve address objects or unexpected response format',
      );
    }

    // Normalize the data structure and map to the interface
    const normalizedEntries = Array.isArray(addressEntries)
      ? addressEntries
      : [addressEntries];
    return normalizedEntries.map((entry) => ({
      name: entry.$.name,
      'ip-netmask': entry['ip-netmask'],
      'ip-range': entry['ip-range'],
      fqdn: entry.fqdn,
      description: entry.description,
      tag: entry.tag?.member
        ? Array.isArray(entry.tag.member)
          ? entry.tag.member
          : [entry.tag.member]
        : [],
    }));
  }

  /**
   * Creates a new address object on the PAN-OS firewall.
   * @param addressObject - The AddressObject instance representing the network address to create.
   * @returns A promise resolved with an ApiResponse indicating the result.
   */
  public async createAddressObject(
    addressObject: AddressObject,
  ): Promise<ApiResponse> {
    const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address`;
    const element = addressObject.toXml();

    // Using postConfig from ApiClient through inherited apiClient
    const responseXml = await this.apiClient.postConfig(
      xpath,
      element,
      'set',
      this.getApiKey(),
    );

    return this.parseApiResponse(responseXml);
  }

  /**
   * Edits an existing address object on the PAN-OS firewall.
   * @param addressObject - The AddressObject instance that holds updated properties to be saved.
   * @param fields - Optional array of fields to be updated; when omitted, all fields are updated.
   * @returns A promise resolved with an ApiResponse indicating the result.
   */
  public async editAddressObject(
    addressObject: AddressObject,
    fields: Array<keyof AddressObject> = [],
  ): Promise<ApiResponse> {
    const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='${addressObject.name}']`;
    const element = addressObject.toEditableXml(fields);

    // Send the edit request using the apiClient
    const responseXml = await this.apiClient.postConfig(
      xpath,
      element,
      'edit',
      this.getApiKey(),
    );

    // Parse and return the response
    return this.parseApiResponse(responseXml);
  }

  /**
   * Deletes an existing address object from the PAN-OS firewall.
   * @param addressObjectName - The name of the address object to delete.
   * @returns A promise resolved with an ApiResponse indicating the result.
   */
  public async deleteAddressObject(
    addressObjectName: string,
  ): Promise<ApiResponse> {
    const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='${addressObjectName}']`;

    // Send the delete request using the apiClient
    const responseXml = await this.apiClient.postConfig(
      xpath,
      '',
      'delete',
      this.getApiKey(),
    );

    // Parse and return the response
    return this.parseApiResponse(responseXml);
  }
}
