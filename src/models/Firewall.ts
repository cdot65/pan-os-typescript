// src/models/Firewall.ts

import { PanDevice } from './PanDevice';
import { AddressObject } from './AddressObject';
import { ApiResponse } from '../interfaces/ApiResponse';
import { SessionResponse } from '../interfaces/SessionResponse';
import { SessionIdResponse } from '../interfaces/SessionIdResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';
import { SessionInfoResponse } from '../interfaces/SessionInfoResponse';
import { TestUrlInfoResponse } from '../interfaces/TestUrlInfoResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';

/**
 * The `Firewall` class extends `PanDevice` to specialize in managing PAN-OS firewalls. It provides
 * a suite of methods to interact with firewall-specific functionalities such as resource monitoring,
 * session management, routing information, and URL category testing. This class also enables managing
 * address objects, including creation, editing, and deletion.
 */
export class Firewall extends PanDevice {
  /**
   * Constructs a new instance of a Firewall, initializing with the specified hostname and API key.
   *
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - The API key for authenticating to the PAN-OS device.
   */
  constructor(hostname: string, apiKey: string) {
    super(hostname, apiKey);
  }

  /**
   * Fetches resource monitoring data, such as CPU and memory utilization, from the firewall.
   *
   * @returns A promise that resolves to a `ResourceMonitorResponse` containing the performance metrics.
   * @throws When the request to fetch resource monitoring data fails or if the response is in an unexpected format.
   */
  public async showResourceMonitor(): Promise<ResourceMonitorResponse> {
    const cmd = 'show running resource-monitor minute';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves routing table information from the firewall, showing the routing entries.
   *
   * @returns A promise that resolves to a `RoutingRouteResponse` containing routing table details.
   * @throws When the request fails or if the response format is unexpected.
   */
  public async showRoutingRoute(): Promise<RoutingRouteResponse> {
    const cmd = 'show routing route';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves a list of all the active sessions on the firewall.
   *
   * @returns A promise that resolves to a `SessionAllResponse` containing details on active sessions.
   * @throws When the request to retrieve session info fails or if the response format differs from expectations.
   */
  public async showSessionAll(): Promise<SessionAllResponse> {
    const cmd = 'show session all';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves detailed session information for active sessions that match provided filter criteria.
   *
   * @param destinationIp - The destination IP address to filter sessions on.
   * @param sourceIp - The source IP address to filter sessions on.
   * @returns A promise that resolves to a `SessionResponse` containing detailed session information.
   * @throws When the request fails or if the response formatting is incorrect.
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
   * Retrieves detailed information about a specific session on the PAN-OS device by its session ID.
   * This method executes the 'show session id' command and returns detailed information for the specified session.
   *
   * @param sessionId - The ID of the session to retrieve information for.
   * @returns A promise resolving to the session information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async showSessionId(sessionId: string): Promise<SessionIdResponse> {
    const xmlCmd = `<show><session><id>${sessionId}</id></session></show>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Retrieves session information from a PAN-OS device.
   * This method executes the 'show session info' command on the firewall and returns detailed session configuration and statistics.
   *
   * The method simplifies the interaction with the PAN-OS API by abstracting the command details. It leverages the `op`
   * method from `PanDevice` for command execution and handling the response.
   *
   * The returned data conforms to the `SessionInfoResponse` interface, ensuring a structured and consistent format for session information.
   *
   * @returns A promise that resolves to detailed session information from the firewall.
   * @throws An error if the command execution fails or if the response format is unexpected.
   */
  public async showSessionInfo(): Promise<SessionInfoResponse> {
    const cmd = 'show session info';

    // Using op from PanDevice to handle the command execution.
    return this.op(cmd);
  }

  /**
   * Retrieves category information about a specific URL.
   * This method executes the 'test url-info-cloud' command on PAN-OS and returns category information
   * for the specified URL. It provides insights such as risk levels, categorization, and other relevant metadata.
   *
   * @param url - The URL to retrieve categorization information for.
   * @returns A promise resolving to the URL categorization information.
   * @throws An error if the request fails or if the response format is unexpected.
   */
  public async testUrlInfo(url: string): Promise<TestUrlInfoResponse> {
    const xmlCmd = `<test><url-info-cloud>${url}</url-info-cloud></test>`;
    const response = await this.op(xmlCmd);
    return response;
  }

  /**
   * Creates an address object on the PAN-OS firewall. The method posts the XML configuration
   * of the address object to the device.
   *
   * @param addressObject - An instance of `AddressObject` representing the network address to create.
   * @returns A promise resolving to an ApiResponse indicating the result of the operation.
   * @throws An error if the address object creation request fails or if the response format is unexpected.
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
      this.apiKey,
    );

    return this.parseApiResponse(responseXml);
  }

  /**
   * Edits an existing address object on the PAN-OS firewall. This method allows selective updating
   * of the address object's fields such as value, type, description, and tags.
   *
   * @param addressObject - The `AddressObject` instance with updated properties.
   * @param fields - An array specifying which fields of the address object to edit.
   * @returns A promise resolving to an ApiResponse indicating the result of the operation.
   * @throws An error if the edit request fails or if the response format is unexpected.
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
      this.apiKey, // Use the apiKey from the class instance
    );

    // Parse and return the response
    return this.parseApiResponse(responseXml);
  }

  /**
   * Deletes an address object from the PAN-OS firewall. This method requires only the name of the
   * address object to remove it from the device's configuration.
   *
   * @param addressObjectName - The name of the address object to delete.
   * @returns A promise resolving to the ApiResponse indicating the result of the operation.
   * @throws An error if the deletion request fails or if the response format is unexpected.
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
      this.apiKey, // Use the apiKey from the class instance
    );

    // Parse and return the response
    return this.parseApiResponse(responseXml);
  }
}
