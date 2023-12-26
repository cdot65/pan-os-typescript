// src/interfaces/ApiKeyResponse.ts

/**
 * Defines the structure for the response received from PAN-OS after
 * successfully generating an API key.
 */
export interface ApiKeyResponse {
  /**
   * The generated API key as a string. This key is used to authenticate subsequent
   * requests to the PAN-OS API.
   */
  key: string;
}
