/* eslint-disable @typescript-eslint/no-explicit-any */
// src/models/Firewall.ts

import { ApiClient } from '../services/ApiClient';
import { PanDevice } from './PanDevice';
import { parseStringPromise } from 'xml2js';

/**
 * Represents a Palo Alto Networks Firewall, extending {@link PanDevice}.
 * Provides methods to interact with various firewall features such as
 * resource monitoring, session management, routing information, URL categorization, and address objects.
 */
export class Firewall extends PanDevice {
  /**
   * Creates a new `Firewall` instance.
   *
   * @param hostname The hostname or IP address of the PAN-OS firewall.
   * @param apiKey The API key for PAN-OS authentication
   */
  constructor(hostname: string, apiKey: string) {
    let apiClient;
    if (apiKey) {
      apiClient = new ApiClient(hostname, apiKey);
    }
    super(hostname, apiClient);
    this.hostname = hostname;
  }

  /**
   * Retrieves system resource monitoring data from the firewall.
   *
   * @returns A promise that resolves with the resource monitoring data including CPU and memory usage statistics.
   */
  public async showResourceMonitor(): Promise<any> {
    const cmd = 'show running resource-monitor minute';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves the routing table information from the firewall.
   *
   * @returns A promise that resolves with the details of the firewall's routing table.
   */
  public async showRoutingRoute(): Promise<any> {
    const cmd = 'show routing route';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves a list of all active sessions on the firewall.
   *
   * @returns A promise that resolves with details of all active sessions.
   */
  public async showSessionAll(): Promise<any> {
    const cmd = 'show session all';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves detailed information about firewall sessions based on source and destination IP filtering.
   *
   * @param destinationIp The destination IP address to filter sessions by.
   * @param sourceIp The source IP address to filter sessions by.
   * @returns A promise that resolves with session information filtered by the specified criteria.
   */
  public async showSessionAllFilter(
    destinationIp: string,
    sourceIp: string,
  ): Promise<any> {
    const xmlCmd = `<show><session><all><filter><source>${sourceIp}</source><destination>${destinationIp}</destination></filter></all></session></show>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Retrieves information about a specific session on the firewall using its session ID.
   *
   * @param sessionId The unique identifier of the session.
   * @returns A promise that resolves with details about the specified session.
   */
  public async showSessionId(sessionId: string): Promise<any> {
    const xmlCmd = `<show><session><id>${sessionId}</id></session></show>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Retrieves general information about the firewall's session states, configurations, and statistics.
   *
   * @returns A promise that resolves with general session information from the firewall.
   */
  public async showSessionInfo(): Promise<any> {
    const cmd = 'show session info';
    return this.apiClient.op(cmd);
  }

  /**
   * Retrieves categorization information for a specified URL from the firewall.
   *
   * @param url The URL to test categorization for.
   * @returns A promise that resolves with the category information of the specified URL.
   */
  public async testUrlInfo(url: string): Promise<any> {
    const xmlCmd = `<test><url-info-cloud>${url}</url-info-cloud></test>`;
    return this.apiClient.op(xmlCmd);
  }

  /**
   * Retrieves a list of all address objects configured on the firewall.
   *
   * @returns A promise that resolves with an array of address objects, each containing relevant details.
   */
  public async addressObjectGetList(): Promise<any[]> {
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
