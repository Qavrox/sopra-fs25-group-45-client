// types/error.ts
export interface ErrorResponse {
  error: string;
}

export interface ApplicationError extends Error {
  info?: string;
  status?: number;
}