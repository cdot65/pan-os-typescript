// src/services/FirewallService.ts

import { DeviceService } from './DeviceService';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';

/**
 * `FirewallService` is a subclass of `DeviceService` dedicated to providing methods
 * specifically tailored for interacting with firewall functionalities in PAN-OS.
 */
export class FirewallService extends DeviceService {
  /**
   * Fetches resource monitoring data from a PAN-OS firewall. This method is instrumental
   * in retrieving critical performance metrics like CPU usage, memory load, and more.
   *
   * The method simplifies the process of fetching this data by constructing the necessary
   * command in a format understood by PAN-OS devices. It leverages the `executeOperationalCommand`
   * method from `DeviceService` to handle the command execution and response parsing.
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

    // Using executeOperationalCommand from DeviceService to handle the command execution.
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

    // Using executeOperationalCommand from DeviceService to handle the command execution.
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

    // Using executeOperationalCommand from DeviceService to handle the command execution.
    return this.executeOperationalCommand(apiKey, cmd);
  }
}
