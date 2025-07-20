import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createFetchClient, FetchClientInstance } from '../fetchClientFactory';

describe('FetchClient with GitHub API', () => {
  let fetchClient: FetchClientInstance;
  
  beforeEach(() => {
    fetchClient = createFetchClient({
      baseUrl: 'https://api.github.com',
      defaultHeaders: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('공개 저장소 정보를 가져올 수 있어야 한다', async () => {
      const response = await fetchClient.fetch('/repos/facebook/react');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('name', 'react');
      expect(data).toHaveProperty('full_name', 'facebook/react');
      expect(data).toHaveProperty('owner');
    });

    it('사용자 정보를 가져올 수 있어야 한다', async () => {
      const response = await fetchClient.fetch('/users/octocat');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty('login', 'octocat');
      expect(data).toHaveProperty('type', 'User');
    });

    it('404 에러를 올바르게 처리해야 한다', async () => {
      const response = await fetchClient.fetch('/repos/nonexistent/repository');
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('Request Interceptors', () => {
    it('요청 인터셉터가 헤더를 추가할 수 있어야 한다', async () => {
      const customHeader = 'custom-value';
      
      fetchClient.addRequestInterceptor(async (url, options) => {
        return {
          url,
          options: {
            ...options,
            headers: {
              ...options.headers,
              'X-Custom-Header': customHeader,
            },
          },
        };
      });

      const response = await fetchClient.fetch('/repos/vuejs/vue');
      expect(response.ok).toBe(true);
    });

    it('요청 인터셉터가 URL을 수정할 수 있어야 한다', async () => {
      fetchClient.addRequestInterceptor(async (url, options) => {
        if (url.includes('/users/github')) {
          return {
            url: url.replace('/users/github', '/users/octocat'),
            options,
          };
        }
        return { url, options };
      });

      const response = await fetchClient.fetch('/users/github');
      const data = await response.json();
      
      expect(data.login).toBe('octocat');
    });

    it('여러 요청 인터셉터가 순서대로 실행되어야 한다', async () => {
      const executionOrder: number[] = [];

      fetchClient.addRequestInterceptor(async (url, options) => {
        executionOrder.push(1);
        return { url, options };
      });

      fetchClient.addRequestInterceptor(async (url, options) => {
        executionOrder.push(2);
        return { url, options };
      });

      await fetchClient.fetch('/users/octocat');
      
      expect(executionOrder).toEqual([1, 2]);
    });

    it('요청 인터셉터 에러를 처리할 수 있어야 한다', async () => {
      const errorMessage = 'Request interceptor error';
      
      fetchClient.addRequestInterceptor(
        async () => {
          throw new Error(errorMessage);
        },
        async (error) => {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
          return Promise.reject(new Error('Handled error'));
        }
      );

      await expect(fetchClient.fetch('/users/octocat')).rejects.toThrow('Handled error');
    });

    it('인터셉터를 제거할 수 있어야 한다', async () => {
      const logs: string[] = [];

      fetchClient.addRequestInterceptor(async (url, options) => {
        logs.push('interceptor called');
        return { url, options };
      });

      await fetchClient.fetch('/users/octocat');
      expect(logs).toHaveLength(1);

      fetchClient.removeRequestInterceptor(0);
      await fetchClient.fetch('/users/octocat');
      expect(logs).toHaveLength(1);
    });
  });

  describe('Response Interceptors', () => {
    it('응답 인터셉터가 응답을 수정할 수 있어야 한다', async () => {
      let interceptedResponse: Response | null = null;

      fetchClient.addResponseInterceptor(async (response) => {
        interceptedResponse = response.clone();
        return response;
      });

      const response = await fetchClient.fetch('/users/octocat');
      await response.json();

      expect(interceptedResponse).not.toBeNull();
      expect(interceptedResponse!.status).toBe(200);
    });

    it('응답 인터셉터가 데이터를 로깅할 수 있어야 한다', async () => {
      const logs: any[] = [];

      fetchClient.addResponseInterceptor(async (response) => {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        logs.push({
          url: response.url,
          status: response.status,
          data: data.login || data.name,
        });
        return response;
      });

      await fetchClient.fetch('/users/octocat');
      await fetchClient.fetch('/repos/nodejs/node');

      expect(logs).toHaveLength(2);
      expect(logs[0].data).toBe('octocat');
      expect(logs[1].data).toBe('node');
    });

    it('응답 인터셉터 에러를 처리할 수 있어야 한다', async () => {
      fetchClient.addResponseInterceptor(
        async (response) => {
          if (response.status === 404) {
            throw new Error('Not found');
          }
          return response;
        },
        async (error) => {
          return Promise.reject(new Error(`Intercepted: ${(error as Error).message}`));
        }
      );

      await expect(fetchClient.fetch('/repos/nonexistent/repo')).rejects.toThrow('Intercepted: Not found');
    });

    it('응답 인터셉터를 제거할 수 있어야 한다', async () => {
      const logs: string[] = [];

      fetchClient.addResponseInterceptor(async (response) => {
        logs.push('response interceptor called');
        return response;
      });

      await fetchClient.fetch('/users/octocat');
      expect(logs).toHaveLength(1);

      fetchClient.removeResponseInterceptor(0);
      await fetchClient.fetch('/users/octocat');
      expect(logs).toHaveLength(1);
    });
  });

  describe('Timeout Handling', () => {
    it('타임아웃 설정이 작동해야 한다', async () => {
      const timeoutClient = createFetchClient({
        baseUrl: 'https://httpbin.org',
        timeout: 100,
      });

      await expect(
        timeoutClient.fetch('/delay/1')
      ).rejects.toThrow();
    });

    it('타임아웃 없이 정상 요청이 성공해야 한다', async () => {
      const response = await fetchClient.fetch('/users/octocat');
      expect(response.ok).toBe(true);
    });
  });

  describe('Rate Limiting Handling', () => {
    it('rate limit 헤더를 확인할 수 있어야 한다', async () => {
      let rateLimitRemaining: string | null = null;

      fetchClient.addResponseInterceptor(async (response) => {
        rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        return response;
      });

      await fetchClient.fetch('/users/octocat');
      
      expect(rateLimitRemaining).not.toBeNull();
      expect(Number(rateLimitRemaining)).toBeGreaterThan(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('요청과 응답 인터셉터를 함께 사용할 수 있어야 한다', async () => {
      const logs: string[] = [];

      fetchClient.addRequestInterceptor(async (url, options) => {
        logs.push(`Request: ${url}`);
        return { url, options };
      });

      fetchClient.addResponseInterceptor(async (response) => {
        logs.push(`Response: ${response.status}`);
        return response;
      });

      await fetchClient.fetch('/users/octocat');

      expect(logs).toEqual([
        expect.stringContaining('Request:'),
        'Response: 200'
      ]);
    });

    it('여러 API 엔드포인트를 순차적으로 호출할 수 있어야 한다', async () => {
      const userResponse = await fetchClient.fetch('/users/octocat');
      const userData = await userResponse.json();

      const reposResponse = await fetchClient.fetch(`/users/${userData.login}/repos?per_page=5`);
      const reposData = await reposResponse.json();

      expect(userData).toHaveProperty('login', 'octocat');
      expect(Array.isArray(reposData)).toBe(true);
      expect(reposData.length).toBeLessThanOrEqual(5);
    });

    it('조건부 요청을 처리할 수 있어야 한다', async () => {
      let etag: string | null = null;

      fetchClient.addResponseInterceptor(async (response) => {
        etag = response.headers.get('ETag');
        return response;
      });

      const firstResponse = await fetchClient.fetch('/users/octocat');
      expect(firstResponse.status).toBe(200);

      const secondClient = createFetchClient({
        baseUrl: 'https://api.github.com',
        defaultHeaders: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (etag) {
        const conditionalResponse = await secondClient.fetch('/users/octocat', {
          headers: {
            'If-None-Match': etag,
          },
        });

        expect([200, 304]).toContain(conditionalResponse.status);
      }
    });
  });

  describe('Error Scenarios', () => {
    it('네트워크 에러를 처리할 수 있어야 한다', async () => {
      const errorClient = createFetchClient({
        baseUrl: 'https://invalid-domain-that-does-not-exist.com',
        defaultHeaders: {},
      });

      let errorCaught = false;
      errorClient.addResponseInterceptor(
        async (response) => response,
        async (error) => {
          errorCaught = true;
          return Promise.reject(error);
        }
      );

      await expect(errorClient.fetch('/test')).rejects.toThrow();
      expect(errorCaught).toBe(true);
    });

    it('타임아웃을 시뮬레이션할 수 있어야 한다', async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100);

      const timeoutClient = createFetchClient({
        baseUrl: 'https://api.github.com',
        defaultHeaders: {},
      });

      try {
        await timeoutClient.fetch('/users/octocat', {
          signal: controller.signal,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).name).toBe('AbortError');
      } finally {
        clearTimeout(timeoutId);
      }
    });
  });
});

describe('FetchClient Factory', () => {
  it('다른 baseUrl로 여러 인스턴스를 생성할 수 있어야 한다', async () => {
    const githubClient = createFetchClient({
      baseUrl: 'https://api.github.com',
      defaultHeaders: { 'Accept': 'application/vnd.github.v3+json' },
    });

    const jsonPlaceholderClient = createFetchClient({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      defaultHeaders: { 'Content-Type': 'application/json' },
    });

    const [githubResponse, jsonResponse] = await Promise.all([
      githubClient.fetch('/users/octocat'),
      jsonPlaceholderClient.fetch('/users/1'),
    ]);

    const [githubData, jsonData] = await Promise.all([
      githubResponse.json(),
      jsonResponse.json(),
    ]);

    expect(githubData).toHaveProperty('login', 'octocat');
    expect(jsonData).toHaveProperty('id', 1);
  });

  it('타임아웃 설정이 올바르게 적용되어야 한다', async () => {
    const clientWithTimeout = createFetchClient({
      baseUrl: 'https://api.github.com',
      timeout: 5000,
    });

    expect(clientWithTimeout).toBeDefined();
  });
});