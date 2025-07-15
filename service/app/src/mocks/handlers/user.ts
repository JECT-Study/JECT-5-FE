import { http,HttpResponse } from 'msw';

export const userHandlers = [
  http.get('https://api.example.com/api/user', () => {
    return HttpResponse.json({
      data: {
        name: 'testUser',
        age: 10,
      },
    });
  }),
]; 