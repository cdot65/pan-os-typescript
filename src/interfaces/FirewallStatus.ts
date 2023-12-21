// src/interfaces/FirewallStatus.ts

/**
 * `FirewallStatus` defines the structure for the response containing
 * status information about a firewall device. This includes operational
 * status, uptime, software version, and other relevant details.
 */
export interface FirewallStatus {
  status: string; // Operational status of the firewall.
  uptime: string; // Uptime of the firewall device.
  version: string; // Software version of the firewall.
  // Additional fields can be added as necessary.
}
