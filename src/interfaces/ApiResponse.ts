// src/interfaces/ApiResponse.ts

export interface ApiResult {
  [key: string]: unknown;
}

export interface ApiResponse<T extends ApiResult> {
  result: T;
}

export interface ApiKeyResult extends ApiResult {
  key: string;
}
