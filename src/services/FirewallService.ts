// src/services/FirewallService.ts

import { Device } from '../Device';
import { ApiResponse } from '../interfaces/ApiResponse';
import { AddressObject } from '../objects/AddressObject';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';
import { SessionIdResponse } from '../interfaces/SessionIdResponse';
import { SessionInfoResponse } from '../interfaces/SessionInfoResponse';
import { SessionResponse } from '../interfaces/SessionResponse';
import { TestUrlInfoResponse } from '../interfaces/TestUrlInfoResponse';

/**
 * `FirewallService` is a subclass of `Device` dedicated to providing methods
 * specifically tailored for interacting with firewall functionalities in PAN-OS.
 */
export class FirewallService extends Device {
  /**
   * Fetches resource monitoring data from a PAN-OS firewall. This method is instrumental
   * in retrieving critical performance metrics like CPU usage, memory load, and more.
   *
   * The method simplifies the process of fetching this data by constructing the necessary
   * command in a format understood by PAN-OS devices. It leverages the `executeOperationalCommand`
   * method from `Device` to handle the command execution and response parsing.
   *
   * The returned data conforms to the `ResourceMonitorResponse` interface, ensuring a structured
   * and consistent format for the resource monitoring metrics.
   *
   * @param apiKey - The API key utilized for authenticating the request to the firewall.
   * @returns A promise that resolves to the firewall's resource monitoring data in a structured format.
   * @throws An error if the request to fetch the resource monitoring data fails or if the response format is not as expected.
   */
  public async showResourceMonitor(
    apiKey: string,
  ): Promise<ResourceMonitorResponse> {
    const cmd = 'show running resource-monitor minute';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(apiKey, cmd);
  }

  /**
   * Retrieves routing information from the firewall.
   * This method executes the 'show routing route' command and returns the routing table.
   *
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to the firewall's routing table information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async showRoutingRoute(apiKey: string): Promise<RoutingRouteResponse> {
    const cmd = 'show routing route';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(apiKey, cmd);
  }

  /**
   * Retrieves a list of all active sessions on the PAN-OS device.
   * This method executes the 'show session all' command and returns detailed session information.
   *
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to the active session information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async showSessionAll(apiKey: string): Promise<SessionAllResponse> {
    const cmd = 'show session all';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(apiKey, cmd);
  }

  /**
   * Retrieves detailed information about flows on the PAN-OS device that match a filter pattern.
   * This method executes the 'show session all filter source x.x.x.x destination x.x.x.x' command
   * and returns detailed information for the specified session.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param destinationIp - The destination IP of the session to retrieve information for.
   * @param sourceIp - The source IP of the session to retrieve information for.
   * @returns A promise resolving to the session information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async showSessionAllFilter(
    apiKey: string,
    destinationIp: string,
    sourceIp: string,
  ): Promise<SessionResponse> {
    const xmlCmd = `<show><session><all><filter><source>${sourceIp}</source><destination>${destinationIp}</destination></filter></all></session></show>`;
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  /**
   * Retrieves detailed information about a specific session on the PAN-OS device by its session ID.
   * This method executes the 'show session id' command and returns detailed information for the specified session.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param sessionId - The ID of the session to retrieve information for.
   * @returns A promise resolving to the session information.
   * @throws An error if the request fails or the response format is unexpected.
   */
  public async showSessionId(
    apiKey: string,
    sessionId: string,
  ): Promise<SessionIdResponse> {
    const xmlCmd = `<show><session><id>${sessionId}</id></session></show>`;
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
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
   * @param apiKey - The API key used for authentication with the PAN-OS device.
   * @returns A promise that resolves to detailed session information from the firewall.
   * @throws An error if the command execution fails or if the response format is unexpected.
   */
  public async showSessionInfo(apiKey: string): Promise<SessionInfoResponse> {
    const cmd = 'show session info';

    // Using executeOperationalCommand from Device to handle the command execution.
    return this.executeOperationalCommand(apiKey, cmd);
  }

  /**
   * Retrieves category information about a specific URL.
   * This method executes the 'test url-info-cloud' command on PAN-OS and returns category information
   * for the specified URL. It provides insights such as risk levels, categorization, and other relevant metadata.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param url - The URL to retrieve categorization information for.
   * @returns A promise resolving to the URL categorization information.
   * @throws An error if the request fails or if the response format is unexpected.
   */
  public async testUrlInfo(
    apiKey: string,
    url: string,
  ): Promise<TestUrlInfoResponse> {
    const xmlCmd = `<test><url-info-cloud>${url}</url-info-cloud></test>`;
    const response = await this.executeOperationalCommand(apiKey, xmlCmd);
    return response;
  }

  public async createAddressObject(
    apiKey: string,
    addressObject: AddressObject,
  ): Promise<ApiResponse> {
    const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address`;
    const element = addressObject.toXml();
    const responseXml = await this.sendConfigRequest(
      apiKey,
      xpath,
      element,
      'set',
    );

    // Parse and return response as ApiResponse
    return this.parseApiResponse(responseXml);
  }
}
