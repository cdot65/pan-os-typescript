// src/interfaces/LicenseInfoResponse.ts

/**
 * Represents a single license entry as returned by the PAN-OS API.
 */
export interface LicenseEntry {
  feature: string;
  description: string;
  serial: string;
  issued: string;
  expires: string;
  expired: string;
  authcode: string;
  custom?: Record<string, string>; // Optional custom fields
}

/**
 * Represents the structure of the license info response from the PAN-OS API.
 */
export interface LicenseInfoResponse {
  response: {
    status: string;
    result: {
      licenses: {
        entry: LicenseEntry[];
      };
    };
  };
}
