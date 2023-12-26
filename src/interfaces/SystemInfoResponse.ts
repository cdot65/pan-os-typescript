// src/interfaces/SystemInfoResponse.ts

/**
 * Represents the system information response structure from a PAN-OS device.
 * It encapsulates key system details such as the hostname, IP configuration,
 * serial number, and other relevant information.
 */
export interface SystemInfoResponse {
  /**
   * The hostname of the PAN-OS device.
   */
  hostname: string;

  /**
   * The IP address of the PAN-OS device.
   */
  ipAddress: string;

  /**
   * The subnet mask of the device's network.
   */
  netmask: string;

  /**
   * The default gateway address for the PAN-OS device.
   */
  defaultGateway: string;

  /**
   * The serial number of the PAN-OS device.
   */
  serialNumber: string;

  // Additional fields can be added here with appropriate documentation.
}
