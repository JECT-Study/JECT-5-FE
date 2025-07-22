import { createFetchClient } from '@shared/lib/fetchClientFactory';
import { describe, expect,it } from 'vitest';

import type { KakaoLoginRequest } from '@/entities/auth/model/authRequest';

const testFetchClient = createFetchClient({
  baseUrl: process.env.MSW_BASE_URL || 'http://localhost:3000',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  credentials: 'include',
});

describe('Auth API Handlers', () => {
  describe('POST /login/kakao', () => {
    const mockKakaoLoginRequest: KakaoLoginRequest = {
      code: 'someValidCode',
      type: 'kakao',
    };

    it('유효한 카카오 로그인 요청을 처리할 수 있어야 한다', async () => {
      const response = await testFetchClient.fetch('/login/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockKakaoLoginRequest),
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(data.result).toBe('SUCCESS');
      expect(data.data).toHaveProperty('profileImageUrl');
      expect(data.data).toHaveProperty('nickname');
      expect(data.data).toHaveProperty('email');
      expect(data.data.nickname).toBe('testUser');
      expect(data.data.email).toBe('test@example.com');
    });

    it('세션 쿠키가 응답 헤더에 포함되어야 한다', async () => {
      const response = await testFetchClient.fetch('/login/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockKakaoLoginRequest),
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('Set-Cookie')).toContain('JSESSIONID=');
    });
  });
});
