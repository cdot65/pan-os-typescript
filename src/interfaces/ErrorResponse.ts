// src/interfaces/ErrorResponse.ts

/**
 * Represents the structure of an error response received from the API,
 * including both an error code and a descriptive message.
 */
export interface ErrorResponse {
  /**
   * A numeric code that represents the type of error encountered.
   * This can be used to programmatically identify specific error conditions.
   */
  errorCode: number;

  /**
   * A detailed description of the error, providing additional context
   * and information to the user on what went wrong.
   */
  errorMessage: string;
}
