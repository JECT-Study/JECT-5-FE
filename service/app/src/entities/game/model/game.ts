import type { UUID } from '@shared/types/common';
import type { ApiResponse } from '@shared/types/response';

export interface GameListItem {
  gameId: UUID;
  gameThumbnailUrl: string;
  gameTitle: string;
  questionCount: number;
  playCount: number;
  isShared?: boolean;
  updatedAt?: string;
  deletedAt?: string;
  version?: number;
}

export interface GameListData {
    games: GameListItem[];
}

export interface GameQuestion {
    questionId: number;
    questionOrder: number;
    imageUrl: string;
    questionText: string;
    questionAnswer: string;
    version: number;
}

export interface GameDetailData {
    gameTitle: string;
    nickname: string;
    questionCount: number;
    version: number;
    questions: GameQuestion[];
}

export interface PresignedUrlItem {
    imageName: string;
    questionOrder: number;
    url: string;
    key: string;
}
  
  export interface PresignedUrlData {
    gameId: UUID;
    presignedUrls: PresignedUrlItem[];
}

export type GameListResponse = ApiResponse<GameListData>;
export type GameDetailResponse = ApiResponse<GameDetailData>;
export type PresignedUrlResponse = ApiResponse<PresignedUrlData>;