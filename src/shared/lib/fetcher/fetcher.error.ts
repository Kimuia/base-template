export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly data: unknown,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}
