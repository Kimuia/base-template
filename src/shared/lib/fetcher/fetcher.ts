import { ApiError } from './fetcher.error';
import type {
  FetcherConfig,
  FetcherInstance,
  InterceptorContext,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './fetcher.types';

export function createFetcher(initialConfig: FetcherConfig): FetcherInstance {
  let config: FetcherConfig = { ...initialConfig };
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];

  async function request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    options: RequestConfig = {},
  ): Promise<T> {
    const { params, tags, headers: optionHeaders, cache, signal } = options;

    // 1) URL
    const url = new URL(endpoint, config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }

    // 2) Headers (config 기본 → 요청별 오버라이드)
    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
      ...optionHeaders,
    };

    // 3) Init
    const init: RequestInit & { next?: NextFetchRequestConfig } = {
      method,
      headers: mergedHeaders,
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }
    if (cache) init.cache = cache;
    if (signal) init.signal = signal;

    // 4) Next.js cache tags
    const nextConfig: NextFetchRequestConfig = { ...config.next };
    if (tags) {
      nextConfig.tags = Array.isArray(tags) ? tags : [tags];
    }
    init.next = nextConfig;

    // 5) Request interceptors
    let ctx: InterceptorContext = {
      headers: mergedHeaders,
      url: url.toString(),
      init,
    };
    for (const interceptor of requestInterceptors) {
      ctx = await interceptor(ctx);
    }

    // 6) Fetch
    let response = await fetch(ctx.url, ctx.init);

    // 7) Response interceptors
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    // 8) Error
    if (!response.ok) {
      let data: unknown = null;
      try {
        data = await response.clone().json();
      } catch {
        /* non-JSON error body */
      }
      throw new ApiError(response.status, response.statusText, data);
    }

    // 9) 204 No Content
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
  }

  const instance: FetcherInstance = {
    get: <T>(ep: string, opts?: RequestConfig) =>
      request<T>(ep, 'GET', undefined, opts),

    post: <T>(ep: string, body?: unknown, opts?: RequestConfig) =>
      request<T>(ep, 'POST', body, opts),

    put: <T>(ep: string, body?: unknown, opts?: RequestConfig) =>
      request<T>(ep, 'PUT', body, opts),

    patch: <T>(ep: string, body?: unknown, opts?: RequestConfig) =>
      request<T>(ep, 'PATCH', body, opts),

    delete: <T>(ep: string, opts?: RequestConfig) =>
      request<T>(ep, 'DELETE', undefined, opts),

    setAuth(token: string, scheme = 'Bearer') {
      config = {
        ...config,
        headers: { ...config.headers, Authorization: `${scheme} ${token}` },
      };
      return instance;
    },

    clearAuth() {
      if (config.headers) {
        const { ['Authorization']: _removed, ...rest } = config.headers;
        void _removed;
        config = { ...config, headers: rest };
      }
      return instance;
    },

    addRequestInterceptor(fn: RequestInterceptor) {
      requestInterceptors.push(fn);
      return instance;
    },

    addResponseInterceptor(fn: ResponseInterceptor) {
      responseInterceptors.push(fn);
      return instance;
    },

    extend(overrides: Partial<FetcherConfig>) {
      const child = createFetcher({
        ...config,
        ...overrides,
        headers: { ...config.headers, ...overrides.headers },
      });
      requestInterceptors.forEach((fn) => child.addRequestInterceptor(fn));
      responseInterceptors.forEach((fn) => child.addResponseInterceptor(fn));
      return child;
    },
  };

  return instance;
}

export const api = createFetcher({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
});
