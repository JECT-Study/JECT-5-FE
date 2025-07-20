import { GameListItem, GameDetailData, GameQuestion } from "@/entities/game";

export const generateFakeUUID = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomBoolean = (): boolean => {
  return Math.random() < 0.5;
};

export const generateRandomImageUrl = (
  width: number = 20,
  height: number = 300,
  seed?: number
): string => {
  const imageId = seed || Math.floor(Math.random() * 1000);
  return `https://picsum.photos/id/${imageId}/${width}/${height}`;
};

export const generateRandomDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const generateMockGameList = (count: number): GameListItem[] => {
  const result: GameListItem[] = [];
  for (let i = 0; i < count; i++) {
    const id = generateFakeUUID();
    const title = `게임${i + 1}`;
    const questionCount = getRandomNumber(5, 20);
    const playCount = getRandomNumber(0, 200);
    const isShared = getRandomBoolean();
    const updatedAt = generateRandomDate();
    const version = getRandomNumber(1, 5);
    result.push({
      gameId: id,
      gameThumbnailUrl: generateRandomImageUrl(),
      gameTitle: title,
      questionCount,
      playCount,
      isShared,
      updatedAt,
      version,
    });
  }
  return result;
};

export const generateMockQuestions = (count: number, gameVersion: number = 1): GameQuestion[] => {
  const questions: GameQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      questionId: 1000 + i,
      questionOrder: i,
      imageUrl: generateRandomImageUrl(400, 300, i),
      questionText: `문제 ${i + 1}: 이것은 ${i + 1}번째 문제입니다.`,
      questionAnswer: `정답 ${i + 1}`,
      version: gameVersion
    });
  }
  return questions;
};

export const generateGameDetailData = (game: GameListItem): GameDetailData => {
  return {
    gameTitle: game.gameTitle,
    nickname: `Creator_${game.gameId.slice(0, 8)}`,
    questionCount: game.questionCount,
    version: game.version || 1,
    questions: generateMockQuestions(game.questionCount, game.version || 1)
  };
};

export const generatePresignedUrlData = (
  gameId?: string,
  imageCount: number = 1
) => {
  const targetGameId = gameId || generateFakeUUID();
  
  const presignedUrls = Array.from({ length: imageCount }, (_, index) => ({
    imageName: `x${index + 1}.png`,
    questionOrder: index,
    url: generateRandomImageUrl(),
    key: `games/${targetGameId}/x${index + 1}.png`
  }));

  return {
    gameId: targetGameId,
    presignedUrls
  };
};