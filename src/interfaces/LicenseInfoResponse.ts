// src/interfaces/LicenseInfoResponse.ts

/**
 * Describes an individual license's details provided by the PAN-OS API, including its status and metadata.
 */
export interface LicenseEntry {
  /**
   * The unique identifier or name of the licensed feature.
   */
  feature: string;

  /**
   * A human-readable description of the licensed feature.
   */
  description: string;

  /**
   * The serial number associated with the license.
   */
  serial: string;

  /**
   * The issue date of the license.
   */
  issued: string;

  /**
   * The expiration date of the license.
   */
  expires: string;

  /**
   * A status string indicating whether the license has expired.
   */
  expired: string;

  /**
   * The authorization code for the license.
   */
  authcode: string;

  /**
   * Any optional custom fields that may be present for a license, represented as key-value pairs.
   */
  custom?: Record<string, string>;
}

/**
 * Describes the overall structure of the response returned by the PAN-OS API when querying for licensing information.
 * It contains a collection of `LicenseEntry` items representing the individual licenses.
 */
export interface LicenseInfoResponse {
  /**
   * The outer response wrapper containing the status and result of the licensing information request.
   */
  response: {
    /**
     * The status of the response, generally indicating success or failure of the license information request.
     */
    status: string;

    /**
     * Includes the list of all licenses in the `licenses` object, each represented by a `LicenseEntry`.
     */
    result: {
      /**
       * The container for the license entries returned by the API.
       */
      licenses: {
        /**
         * An array of `LicenseEntry` objects, each corresponding to a separate license.
         */
        entry: LicenseEntry[];
      };
    };
  };
}
