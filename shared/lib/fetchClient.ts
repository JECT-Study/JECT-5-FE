import { createFetchClient, FetchClientInstance } from './fetchClientFactory';

export const fetchClient: FetchClientInstance = createFetchClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    credentials: 'include',
});

fetchClient.addRequestInterceptor(async (url, options) => {
    return { url, options };
}, async (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

fetchClient.addResponseInterceptor(async (response) => {
    if (response.status === 401) {
        console.log('401 Unauthorized');
    }
    return response;
}, async (error) => {
    console.error('Response interceptor error:', error);
    return Promise.reject(error);
});

if (process.env.NODE_ENV === 'development') {
    fetchClient.addRequestInterceptor(async (url, options) => {
        console.log('🚀 Request:', url, options);
        return { url, options };
    });

    fetchClient.addResponseInterceptor(async (response) => {
        console.log('📥 Response:', response.status, response.url);
        return response;
    });
}