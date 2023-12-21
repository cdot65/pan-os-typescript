// src/services/FirewallService.ts

import { DeviceService } from './DeviceService';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';

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
}
