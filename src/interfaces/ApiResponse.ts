// src/interfaces/ApiResponse.ts

/**
 * Represents a generic response from the PAN-OS API, capturing the overall status and potential error messaging.
 */
export interface ApiResponse {
  /**
   * The status of the API response, typically indicated as either 'success' or 'error'.
   */
  status: string;

  /**
   * The numerical response code provided by the API, which may be useful for programmatically handling different scenarios.
   */
  code?: number;

  /**
   * A descriptive message accompanying the API response, which may provide additional context or information about the result or any encountered errors.
   */
  message?: string;
}
