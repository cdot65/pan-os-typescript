// src/interfaces/ApiResponse.ts

export interface ApiResult {
  [key: string]: unknown;
}

export interface ApiKeyResult extends ApiResult {
  key: string;
}

export interface ApiResponse<T extends ApiResult> {
  result: T;
}
