import { fetchClient } from '@shared/lib/fetchClient';

import type { GameListResponse,GameQueryParams } from '../model';

export const getGameList = async (params: GameQueryParams): Promise<GameListResponse> => {
  const searchParams = new URLSearchParams();
  
  searchParams.append('limit', params.limit.toString());
  
  if (params.cursorGameId) {
    searchParams.append('cursorGameId', params.cursorGameId);
  }
  
  if (params.cursorPlayCount !== undefined) {
    searchParams.append('cursorPlayCount', params.cursorPlayCount.toString());
  }
  
  if (params.cursorUpdatedAt) {
    searchParams.append('cursorUpdatedAt', params.cursorUpdatedAt);
  }
  
  if (params.query) {
    searchParams.append('query', params.query);
  }
  
  const url = `/games?${searchParams.toString()}`;
  
  const response = await fetchClient.fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      result: 'ERROR',
      error: {
        code: `E${response.status}`,
        message: `HTTP ${response.status}: ${response.statusText}`,
      },
    }));
    
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};