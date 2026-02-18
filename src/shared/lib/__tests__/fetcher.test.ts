/**
 * @jest-environment node
 */
import { createFetcher } from '../fetcher/fetcher';
import { ApiError } from '../fetcher/fetcher.error';
import type { FetcherInstance } from '../fetcher/fetcher.types';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function jsonResponse(data: unknown, status = 200, statusText = 'OK') {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('createFetcher', () => {
  let api: FetcherInstance;

  beforeEach(() => {
    mockFetch.mockReset();
    api = createFetcher({ baseUrl: 'https://api.example.com' });
  });

  it('returns instance with all HTTP methods', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.patch).toBeDefined();
    expect(api.delete).toBeDefined();
  });

  it('get() calls fetch with GET method', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }));
    await api.get('/users/1');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/users/1');
    expect(init.method).toBe('GET');
  });

  it('post() serializes body as JSON', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }));
    await api.post('/users', { name: 'John' });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"name":"John"}');
  });

  it('appends query params from options.params', async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    await api.get('/users', {
      params: { page: 1, limit: 20, empty: undefined },
    });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=1');
    expect(url).toContain('limit=20');
    expect(url).not.toContain('empty');
  });

  it('passes tags to next config', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    await api.get('/users', { tags: ['users'] });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.next).toEqual({ tags: ['users'] });
  });

  it('throws ApiError on non-ok response', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ message: 'Not Found' }, 404, 'Not Found'),
    );

    await expect(api.get('/missing')).rejects.toThrow(ApiError);
    await expect(api.get('/missing')).rejects.toMatchObject({
      status: 404,
      statusText: 'Not Found',
    });
  });

  it('ApiError includes response body data', async () => {
    const errorBody = { code: 'USER_NOT_FOUND', message: 'User not found' };
    mockFetch.mockResolvedValue(jsonResponse(errorBody, 404, 'Not Found'));

    try {
      await api.get('/users/999');
      fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).data).toEqual(errorBody);
    }
  });

  it('returns undefined for 204 responses', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 204 }));
    const result = await api.delete('/users/1');
    expect(result).toBeUndefined();
  });

  it('setAuth() adds Authorization header', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    api.setAuth('my-token');
    await api.get('/me');

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer my-token');
  });

  it('clearAuth() removes Authorization header', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    api.setAuth('token').clearAuth();
    await api.get('/me');

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('addRequestInterceptor() modifies request', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    api.addRequestInterceptor((ctx) => ({
      ...ctx,
      init: { ...ctx.init, headers: { ...ctx.headers, 'X-Custom': 'test' } },
    }));
    await api.get('/test');

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers['X-Custom']).toBe('test');
  });

  it('addResponseInterceptor() processes response', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ original: true }));

    api.addResponseInterceptor(() => {
      return jsonResponse({ intercepted: true });
    });

    const result = await api.get('/test');
    expect(result).toEqual({ intercepted: true });
  });

  it('interceptors run in registration order', async () => {
    const order: number[] = [];
    mockFetch.mockResolvedValue(jsonResponse({}));

    api.addRequestInterceptor((ctx) => {
      order.push(1);
      return ctx;
    });
    api.addRequestInterceptor((ctx) => {
      order.push(2);
      return ctx;
    });
    await api.get('/test');

    expect(order).toEqual([1, 2]);
  });

  it('extend() creates new instance with merged config', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    const adminApi = api.extend({
      baseUrl: 'https://admin.example.com',
      headers: { 'X-Admin': 'true' },
    });
    await adminApi.get('/dashboard');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://admin.example.com/dashboard');
    expect(init.headers['X-Admin']).toBe('true');
  });

  it('extend() copies existing interceptors', async () => {
    const called: string[] = [];
    mockFetch.mockResolvedValue(jsonResponse({}));

    api.addRequestInterceptor((ctx) => {
      called.push('parent');
      return ctx;
    });
    const child = api.extend({ baseUrl: 'https://child.example.com' });
    await child.get('/test');

    expect(called).toContain('parent');
  });
});
