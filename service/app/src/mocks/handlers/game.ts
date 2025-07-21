import { http, HttpResponse } from 'msw';

import { 
  filterGamesByQuery,
  findCursorPosition, 
  GameCreateRequest,
  GameListItem,
  GameUpdateRequest,
  PresignedUrlRequest,
  sortGames} from '@/entities/game';

import { internalServerError, loginRequiredError } from '../data/common';

const MSW_BASE_URL = process.env.MSW_BASE_URL || 'http://localhost:3000';
import { mockGameList } from '../data/common';
import { 
  gameConflictError, 
  gameDetailSuccess,
  gameInvalidQuestionFormatError,
  gameInvalidQuestionsError,
  GameListSuccess, 
  gameMissingFieldsError,
  gameModifiedError,
  gameNotFoundError, 
  gameSuccessResponse,
  presignedUrlDataSuccess} from '../data/game';
import {
  findGameById,
  incrementGamePlayCount,
  softDeleteGame,
  toggleGameShare,
  updateGameFields,
  validateGameCreateFields,
  validateGameUpdateFields,
  validateQuestionFormat,
  validateQuestionsArray,
  validateSessionCookie} from '../utils/gameHandlers';
import { generateFakeUUID, generateGameDetailData } from '../utils/mockGenerators';


export const gameHandlers = [
    http.get(`${MSW_BASE_URL}/games`, ({ request }) => {
        const url = new URL(request.url);
        const { cursorGameId, cursorPlayCount, cursorUpdatedAt, limit, query } = Object.fromEntries(url.searchParams.entries());

        try {
            const filteredGames = filterGamesByQuery(mockGameList, query);
            const sortedGames = sortGames(filteredGames);

            const startIndex = findCursorPosition(
                sortedGames,
                cursorGameId,
                cursorPlayCount,
                cursorUpdatedAt
            )

            if (startIndex === -1) return HttpResponse.json(gameNotFoundError('cursor'), { status: 404 });

            const pageSize = parseInt(limit || '10');
            const endIndex = startIndex + pageSize;
            const paginatedGames = sortedGames.slice(startIndex, endIndex);
            return HttpResponse.json(GameListSuccess(paginatedGames));
        } catch (error) {
            return HttpResponse.json(internalServerError);
        }
    }),
    http.get(`${MSW_BASE_URL}/games/:gameId`, async ({ params }) => {
        try {
            const { gameId } = params;
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(
                    gameNotFoundError(gameId as string),
                    { status: 404 }
                );
            }
            
            const gameDetailData = generateGameDetailData(game);
            return HttpResponse.json(gameDetailSuccess(gameDetailData));
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.post(`${MSW_BASE_URL}/games/:gameId/plays`, async ({ params }) => {
        try {
            const { gameId } = params;
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(
                    gameNotFoundError(gameId as string),
                    { status: 404 }
                );
            }
            
            incrementGamePlayCount(game);
            return HttpResponse.json(gameSuccessResponse());
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.post(`${MSW_BASE_URL}/games`, async ({ request }) => {
        try {
          const body = await request.json() as GameCreateRequest;
          
          if (!validateGameCreateFields(body)) {
            return HttpResponse.json(gameMissingFieldsError(), { status: 400 });
          }
          
          const cookieHeader = request.headers.get('Cookie');
          if (!validateSessionCookie(cookieHeader)) {
            return HttpResponse.json(loginRequiredError, { status: 401 });
          }
          
          const { gameId, gameTitle, gameThumbnailUrl, questions } = body;
          
          const existingGame = findGameById(gameId);
          if (existingGame) {
            return HttpResponse.json(gameConflictError(gameId), { status: 409 });
          }
          
          if (!validateQuestionsArray(questions)) {
            return HttpResponse.json(gameInvalidQuestionsError(), { status: 400 });
          }
          
          const newGame: GameListItem = {
            gameId,
            gameTitle,
            gameThumbnailUrl,
            playCount: 0,
            questionCount: questions.length,
            isShared: false,
            version: 1,
            updatedAt: new Date().toISOString()
          };
          
          mockGameList.push(newGame);
          return HttpResponse.json(gameSuccessResponse());
          
        } catch (error) {
          return HttpResponse.json(internalServerError);
        }
    }),
    http.put(`${MSW_BASE_URL}/games/:gameId`, async ({ request, params }) => {
        try {
            const { gameId } = params;
            const body = await request.json() as GameUpdateRequest;
            
            if (!validateGameUpdateFields(body)) {
                return HttpResponse.json(gameMissingFieldsError(), { status: 400 });
            }
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(gameNotFoundError(gameId as string), { status: 404 });
            }
            
            const { version } = body;
            if (version !== game.version) {
                return HttpResponse.json(gameModifiedError(gameId as string), { status: 409 });
            }
            
            if (!validateQuestionsArray(body.questions)) {
                return HttpResponse.json(gameInvalidQuestionsError(), { status: 400 });
            }
            
            if (!validateQuestionFormat(body.questions)) {
                return HttpResponse.json(gameInvalidQuestionFormatError(), { status: 400 });
            }
            
            updateGameFields(game, {
                gameTitle: body.gameTitle,
                gameThumbnailUrl: body.gameThumbnailUrl,
                questionCount: body.questions.length,
                version: version + 1
            });
            
            return HttpResponse.json(gameSuccessResponse());
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.delete(`${MSW_BASE_URL}/games/:gameId`, async ({ request, params }) => {
        try {
            const { gameId } = params;
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(gameNotFoundError(gameId as string), { status: 404 });
            }

            softDeleteGame(game);
            return HttpResponse.json(gameSuccessResponse());
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.post(`${MSW_BASE_URL}/games/:gameId/share`, async ({ request, params }) => {
        try {
            const { gameId } = params;
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(gameNotFoundError(gameId as string), { status: 404 });
            }

            toggleGameShare(game, true);
            return HttpResponse.json(gameSuccessResponse());
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.post(`${MSW_BASE_URL}/games/:gameId/unshare`, async ({ request, params }) => {
        try {
            const { gameId } = params;
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            const game = findGameById(gameId as string);
            if (!game) {
                return HttpResponse.json(gameNotFoundError(gameId as string), { status: 404 });
            }
            
            toggleGameShare(game, false);
            return HttpResponse.json(gameSuccessResponse());
            
        } catch (error) {
            return HttpResponse.json(internalServerError, { status: 500 });
        }
    }),
    http.post(`${MSW_BASE_URL}/games/uploads/urls`, async ({ request }) => {
        try {
            const body = await request.json() as PresignedUrlRequest;
            const { images } = body;
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            const newGameId = generateFakeUUID();
            return HttpResponse.json(presignedUrlDataSuccess(newGameId, images.length));
            
        } catch (error) {
            return HttpResponse.json(internalServerError);
        }
    }),
    http.post(`${MSW_BASE_URL}/games/:gameId/uploads/urls`, async ({ request, params }) => {
        try {
            const { gameId } = params;
            const body = await request.json() as PresignedUrlRequest;
            const { images } = body;
            
            const cookieHeader = request.headers.get('Cookie');
            if (!validateSessionCookie(cookieHeader)) {
                return HttpResponse.json(loginRequiredError, { status: 401 });
            }
            
            return HttpResponse.json(presignedUrlDataSuccess(gameId as string, images.length));
            
        } catch (error) {
            return HttpResponse.json(internalServerError);
        }
    }),
];