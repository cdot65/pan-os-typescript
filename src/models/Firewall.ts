// src/models/Firewall.ts

import { AddressObjectEntry } from '../interfaces/AddressObjectResponse';
import { ApiClient } from '../services/ApiClient';
import { PanDevice } from './PanDevice';
import { ResourceMonitorResponse } from '../interfaces/ResourceMonitorResponse';
import { RoutingRouteResponse } from '../interfaces/RoutingRouteResponse';
import { SessionAllResponse } from '../interfaces/SessionAllResponse';
import { SessionIdResponse } from '../interfaces/SessionIdResponse';
import { SessionInfoResponse } from '../interfaces/SessionInfoResponse';
import { SessionResponse } from '../interfaces/SessionResponse';
import { TestUrlInfoResponse } from '../interfaces/TestUrlInfoResponse';
import { parseStringPromise } from 'xml2js';

/**
 * A specialized {@link PanDevice} subclass for interacting with Palo Alto Networks firewalls.
 * Offers capabilities for monitoring resources, managing sessions, retrieving routing information,
 * testing URL categories, and handling address objects.
 */
export class Firewall extends PanDevice {
  /**
   * Initializes a new instance of the `Firewall` class.
   *
   * @param hostname - The hostname or IP of the PAN-OS firewall.
   * @param apiKey   - The API key for PAN-OS authentication (optional if provided during `PanDevice` instantiation).
   */
  constructor(hostname: string, apiKey?: string) {
    let apiClient;
    if (apiKey) {
      apiClient = new ApiClient(hostname, apiKey);
    }
    super(hostname, apiClient);
    this.hostname = hostname;
  }

  /**
   * Retrieves system resource monitoring data, including CPU and memory usage statistics.
   *
   * @returns A `Promise` resolved with the resource monitoring data from the firewall.
   */
  public async showResourceMonitor(): Promise<ResourceMonitorResponse> {
    const cmd = 'show running resource-monitor minute';
    return this.apiClient.op(cmd);
  }

  /**
   * Fetches the routing table from the firewall.
   *
   * @returns A `Promise` resolved with the details of the routing table.
   */
  public async showRoutingRoute(): Promise<RoutingRouteResponse> {
    const cmd = 'show routing route';
    return this.apiClient.op(cmd);
  }

  /**
   * Obtains a list of all active sessions on the firewall.
   *
   * @returns A `Promise` resolved with details of active sessions.
   */
  public async showSessionAll(): Promise<SessionAllResponse> {
    const cmd = 'show session all';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves detailed information about firewall sessions based on source and destination IP filtering.
   *
   * @param destinationIp - The destination IP to filter by.
   * @param sourceIp      - The source IP to filter by.
   * @returns A `Promise` resolved with session information using the specified filter criteria.
   */
  public async showSessionAllFilter(
    destinationIp: string,
    sourceIp: string,
  ): Promise<SessionResponse> {
    const xmlCmd = `<show><session><all><filter><source>${sourceIp}</source><destination>${destinationIp}</destination></filter></all></session></show>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Fetches information about a specific session on the firewall using its session ID.
   *
   * @param sessionId - The unique identifier of the session to retrieve.
   * @returns A `Promise` resolved with details about the specified session.
   */
  public async showSessionId(sessionId: string): Promise<SessionIdResponse> {
    const xmlCmd = `<show><session><id>${sessionId}</id></session></show>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Requests information about the firewall's session states, configurations, and statistics.
   *
   * @returns A `Promise` resolved with general information about firewall sessions.
   **/
  public async showSessionInfo(): Promise<SessionInfoResponse> {
    const cmd = 'show session info';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves the categorization information for a given URL from the firewall.
   *
   * @param url - The URL whose category information is to be tested.
   * @returns A `Promise` resolved with the category information for the specified URL.
   */
  public async testUrlInfo(url: string): Promise<TestUrlInfoResponse> {
    const xmlCmd = `<test><url-info-cloud>${url}</url-info-cloud></test>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Obtains a listing of all address objects currently configured on the firewall.
   *
   * @returns A `Promise` resolved with an array of entries corresponding to each address object.
   */
  public async addressObjectGetList(): Promise<AddressObjectEntry[]> {
    const xmlCmd = `<show><config><running><xpath>devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address</xpath></running></config></show>`;
    const responseXml = await this.apiClient.op(xmlCmd, false);
    const parsedResponse = await parseStringPromise(responseXml, {
      explicitArray: false,
    });

    const addressEntries = parsedResponse?.response?.result?.address?.entry;
    if (!addressEntries) {
      throw new Error(
        'Failed to retrieve address objects or the response format is unexpected.',
      );
    }

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
}
