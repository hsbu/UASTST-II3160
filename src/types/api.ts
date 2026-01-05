// Common API types

export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: ApiError;
    status?: number;
  };
  message: string;
}
