import { http, HttpResponse } from 'msw';

import { kakaoLoginSuccess } from '../data/auth';

export const authHandlers = [
  http.post('/login/kakao', async ({ request }) => {
    const body = await request.json();
    const code = typeof body === 'object' && body !== null && 'code' in body ? (body as any).code : undefined;
    const type = typeof body === 'object' && body !== null && 'type' in body ? (body as any).type : undefined;

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