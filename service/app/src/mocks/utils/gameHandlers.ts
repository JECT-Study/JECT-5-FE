import { UUID } from '@shared/types/common';

import { GameCreateQuestion, GameCreateRequest, GameListItem, GameQuestion, GameUpdateQuestion, GameUpdateRequest } from '@/entities/game';

import { mockGameList } from '../data/common';

export const findGameById = (gameId: UUID): GameListItem | undefined => {
  return mockGameList.find(g => g.gameId === gameId);
};

export const validateSessionCookie = (cookieHeader: string | null): boolean => {
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  return cookies.some(cookie => cookie.startsWith('JSESSIONID='));
};

export const validateGameCreateFields = (body: GameCreateRequest): boolean => {
  const { gameId, gameTitle, gameCreatorEmail, gameThumbnailUrl, questions } = body;
  return !!(gameId && gameTitle && gameCreatorEmail && gameThumbnailUrl && questions);
};

export const validateGameUpdateFields = (body: GameUpdateRequest): boolean => {
  const { gameTitle, gameCreatorEmail, gameThumbnailUrl, questions, version } = body;
  return !!(gameTitle && gameCreatorEmail && gameThumbnailUrl && questions && version !== undefined);
};

export const validateQuestionsArray = (questions: Array<GameQuestion | GameUpdateQuestion | GameCreateQuestion>): boolean => {
  return Array.isArray(questions) && questions.length > 0;
};

export const validateQuestionFormat = (questions: Array<GameQuestion | GameUpdateQuestion | GameCreateQuestion>): boolean => {
  return questions.every(question => 
    question.questionText && 
    question.questionAnswer && 
    question.questionOrder >= 0
  );
};

export const updateGameFields = (game: GameListItem, updates: Partial<GameListItem>): void => {
  Object.assign(game, updates);
  game.updatedAt = new Date().toISOString();
};

export const softDeleteGame = (game: GameListItem): void => {
  game.deletedAt = new Date().toISOString();
  game.updatedAt = new Date().toISOString();
};

export const toggleGameShare = (game: GameListItem, isShared: boolean): void => {
  game.isShared = isShared;
  game.updatedAt = new Date().toISOString();
};

export const incrementGamePlayCount = (game: GameListItem): void => {
  game.playCount += 1;
  game.updatedAt = new Date().toISOString();
}; 