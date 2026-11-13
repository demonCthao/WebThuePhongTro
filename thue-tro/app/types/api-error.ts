export class ApiError extends Error {
  statusCode?: number;
  timestamp?: string;
  path?: string;

  constructor(
    message: string,
    statusCode?: number,
    timestamp?: string,
    path?: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.path = path;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiErrorData {
  status: number;
  message: string;
}