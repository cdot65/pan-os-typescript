// src/interfaces/TestUrlInfoResponse.ts

/**
 * Describes the response structure returned by PAN-OS when querying URL categorization information.
 * This response includes the command executed, the status of the request, and the categorization result.
 */
export interface TestUrlInfoResponse {
  /**
   * Contains the status of the request and the result payload with URL categorization details.
   */
  response: {
    /**
     * The command string that was executed to obtain the URL information.
     */
    cmd: string;

    /**
     * Indicates if the request to fetch URL information was successful ('success') or not ('error').
     */
    status: string;

    /**
     * The result of the URL categorization request, typically containing categorization details such as risk levels,
     * URL category, and other relevant metadata.
     */
    result: string;
  };
}
