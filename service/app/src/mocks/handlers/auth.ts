import { http, HttpResponse } from 'msw';

import { KakaoLoginRequest } from '@/entities/auth/model/authRequest';

import { kakaoLoginSuccess } from '../data/auth';
const MSW_BASE_URL = process.env.MSW_BASE_URL || 'http://localhost:3000';

export const authHandlers = [
  http.post(`${MSW_BASE_URL}/login/kakao`, async ({ request }) => {
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
    return new HttpResponse('Unauthorized', { status: 401 }); // temporary
  }),
];
