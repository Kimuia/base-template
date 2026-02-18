export interface FetcherConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
}

export interface RequestConfig {
  params?: Record<string, string | number | undefined>;
  tags?: string | string[];
  headers?: Record<string, string>;
  cache?: RequestCache;
  signal?: AbortSignal;
}

export interface InterceptorContext {
  headers: Record<string, string>;
  url: string;
  init: RequestInit;
}

export type RequestInterceptor = (
  ctx: InterceptorContext,
) => InterceptorContext | Promise<InterceptorContext>;

export type ResponseInterceptor = (
  response: Response,
) => Response | Promise<Response>;

export interface FetcherInstance {
  get: <T>(endpoint: string, options?: RequestConfig) => Promise<T>;
  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig,
  ) => Promise<T>;
  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig,
  ) => Promise<T>;
  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig,
  ) => Promise<T>;
  delete: <T>(endpoint: string, options?: RequestConfig) => Promise<T>;

  setAuth: (token: string, scheme?: string) => FetcherInstance;
  clearAuth: () => FetcherInstance;

  addRequestInterceptor: (fn: RequestInterceptor) => FetcherInstance;
  addResponseInterceptor: (fn: ResponseInterceptor) => FetcherInstance;

  extend: (overrides: Partial<FetcherConfig>) => FetcherInstance;
}
