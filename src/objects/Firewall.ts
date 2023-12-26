// src/objects/Firewall.ts

import { PanDevice } from './PanDevice';
import { ApiResponse } from '../interfaces/ApiResponse';
import { AddressObject } from './AddressObject';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';
import { SessionIdResponse } from '../interfaces/SessionIdResponse';
import { SessionInfoResponse } from '../interfaces/SessionInfoResponse';
import { SessionResponse } from '../interfaces/SessionResponse';
import { TestUrlInfoResponse } from '../interfaces/TestUrlInfoResponse';

/**
 * Extends the `PanDevice` class to provide functionality specific to firewall operations within PAN-OS.
 * It includes methods for monitoring resources, routing information, session details, and more,
 * offering a convenient interface for these operations.
 */
export class Firewall extends PanDevice {
  /**
   * Initializes a new instance of a Firewall with the specified hostname and API key for PAN-OS.
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

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(cmd);
  }

  /**
   * Retrieves routing table information from the firewall, showing the routing entries.
   *
   * @returns A promise that resolves to a `RoutingRouteResponse` containing routing table details.
   * @throws When the request fails or if the response format is unexpected.
   */
  public async showRoutingRoute(): Promise<RoutingRouteResponse> {
    const cmd = 'show routing route';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(cmd);
  }

  /**
   * Retrieves a list of all the active sessions on the firewall.
   *
   * @returns A promise that resolves to a `SessionAllResponse` containing details on active sessions.
   * @throws When the request to retrieve session info fails or if the response format differs from expectations.
   */
  public async showSessionAll(): Promise<SessionAllResponse> {
    const cmd = 'show session all';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(cmd);
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
    const response = await this.executeOperationalCommand(xmlCmd);
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
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Retrieves session information from a PAN-OS device.
   * This method executes the 'show session info' command on the firewall and returns detailed session configuration and statistics.
   *
   * The method simplifies the interaction with the PAN-OS API by abstracting the command details. It leverages the `executeOperationalCommand`
   * method from `Device` for command execution and handling the response.
   *
   * The returned data conforms to the `SessionInfoResponse` interface, ensuring a structured and consistent format for session information.
   *
   * @returns A promise that resolves to detailed session information from the firewall.
   * @throws An error if the command execution fails or if the response format is unexpected.
   */
  public async showSessionInfo(): Promise<SessionInfoResponse> {
    const cmd = 'show session info';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(cmd);
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
    const response = await this.executeOperationalCommand(xmlCmd);
    return response;
  }

  /**
   * Creates a new address object on the firewall by posting the XML configuration.
   *
   * @param addressObject - An instance of `AddressObject` representing the network address to create.
   * @returns A promise that resolves to an `ApiResponse` indicating the result of the operation.
   * @throws When address object creation request fails or response does not match expected format.
   */
  public async createAddressObject(
    addressObject: AddressObject,
  ): Promise<ApiResponse> {
    const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address`;
    const element = addressObject.toXml();
    const responseXml = await this.sendConfigRequest(
      this.apiKey, // use the apiKey from the class instance
      xpath,
      element,
      'set',
    );

    return this.parseApiResponse(responseXml);
  }
}
