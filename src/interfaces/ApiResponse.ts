// src/interfaces/ApiResponse.ts

export interface ApiResponse {
  status: string; // 'success' or 'error'
  code?: number; // API response code
  message?: string; // Message from the API
}
