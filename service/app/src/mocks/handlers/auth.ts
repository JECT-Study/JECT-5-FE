import { http, HttpResponse } from 'msw';

import { KakaoLoginRequest } from '@/entities/auth/model/authRequest';

import { kakaoLoginSuccess } from '../data/auth';

export const authHandlers = [
  http.post('/login/kakao', async ({ request }) => {
    const body = (await request.json()) as KakaoLoginRequest;
    const { code, type } = body;

    if (code === 'someValidCode' && type === 'kakao') {
      return new HttpResponse(
        JSON.stringify(kakaoLoginSuccess),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'JSESSIONID=test-session-123',
          },
        }
      );
    }
  }),
];
