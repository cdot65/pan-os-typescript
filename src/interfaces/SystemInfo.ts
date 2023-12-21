// src/interfaces/SystemInfo.ts

/**
 * `SystemInfo` provides a structured representation of the system information
 * response from a PAN-OS device. It includes basic details like hostname, IP
 * configuration, serial number, and other relevant system-level information.
 */
export interface SystemInfo {
  hostname: string; // Hostname of the PAN-OS device.
  ipAddress: string; // IP address of the device.
  netmask: string; // Subnet mask of the device's network.
  defaultGateway: string; // Default gateway for the device.
  serialNumber: string; // Serial number of the PAN-OS device.
  // Additional system information fields can be included.
}
