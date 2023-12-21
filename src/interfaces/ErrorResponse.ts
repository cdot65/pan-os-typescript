// src/interfaces/ErrorResponse.ts

/**
 * `ErrorResponse` represents the structure of an error response received from
 * the API. It includes error code and a descriptive error message.
 */
export interface ErrorResponse {
  errorCode: number; // Numeric code representing the type of error.
  errorMessage: string; // Detailed description of the error.
}
