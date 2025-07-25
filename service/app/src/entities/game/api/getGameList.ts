import { fetchClient } from '@shared/lib/fetchClient';
import { ApiResponse } from '@shared/types/response';

import type { GameListResponse,GameQueryParams } from '../model';
import { mapStatusToErrorResponse } from '../utils';
import { toQueryString } from '../utils/toQueryString';

export const getGameList = async (
  params: GameQueryParams
): Promise<GameListResponse | ApiResponse<null>> => {
  const queryString = toQueryString(params);
  const response = await fetchClient.fetch(`/games?${queryString}`, {
    method: 'GET',
  });

  if (!response.ok) {
    return mapStatusToErrorResponse(response.status);
  }

  return response.json();
};
