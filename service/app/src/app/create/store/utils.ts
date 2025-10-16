import { v4 as uuidv4 } from "uuid"

import type { GameQuestion } from "@/entities/game/model"

import type { Question } from "./types"

export const createInitialQuestion = (order: number): Question => ({
  id: uuidv4(),
  text: "",
  answer: "",
  imageFile: null,
  imageUrl: null,
  previewImageUrl: null,
  order,
})

export const mapGameQuestionToQuestion = (
  gameQuestion: GameQuestion,
): Question => ({
  id: `question-${gameQuestion.questionId}`,
  text: gameQuestion.questionText,
  answer: gameQuestion.questionAnswer,
  imageFile: null,
  imageUrl: gameQuestion.imageUrl,
  previewImageUrl: gameQuestion.imageUrl,
  order: gameQuestion.questionOrder,
})
