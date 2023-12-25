// src/interfaces/TestUrlInfoResponse.ts

/**
 * Represents the structure of the URL information response from the PAN-OS API.
 */
export interface TestUrlInfoResponse {
  response: {
    cmd: string;
    status: string;
    result: string;
  };
}
