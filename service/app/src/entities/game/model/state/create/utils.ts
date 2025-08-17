import { v4 as uuidv4 } from "uuid"

import { GameCreationState, Question } from "./state"

const STORAGE_KEY = "game-creation-draft"

export interface StoredGameCreationData {
  gameName: string
  questions: Array<{
    id: string
    text: string
    answer: string
    imageUrl: string | null
    order: number
  }>
  gameVersion?: number
  lastSaved: number
}

export const createInitialQuestion = (order: number): Question => ({
  id: `question-${order}`,
  text: "",
  answer: "",
  imageFile: null,
  imageUrl: null,
  previewImageUrl: null,
  order,
})

export function createInitialState(): GameCreationState {
  return {
    gameName: "게임1",
    questions: [createInitialQuestion(0)],
    selectedQuestionId: "question-0",
    gameVersion: undefined,
    popups: {
      showExitConfirmation: false,
      showSaveConfirmation: false,
      showFileUploadError: false,
    },
    loading: {
      isSaving: false,
      isUploading: false,
    },
    errors: {
      gameNameError: null,
    },
    isGameNameEditing: false,
    isGameNameFocused: false,
  }
}

export function loadGameCreationFromStorage(): GameCreationState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const data: StoredGameCreationData = JSON.parse(stored)
    
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    if (now - data.lastSaved > oneDay) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    const questions: Question[] = data.questions.map(q => ({
      id: q.id,
      text: q.text,
      answer: q.answer,
      imageFile: null,
      imageUrl: q.imageUrl,
      previewImageUrl: q.imageUrl,
      order: q.order,
    }))

    return {
      gameName: data.gameName,
      questions,
      selectedQuestionId: questions.length > 0 ? questions[0].id : null,
      gameVersion: data.gameVersion,
      popups: {
        showExitConfirmation: false,
        showSaveConfirmation: false,
        showFileUploadError: false,
      },
      loading: {
        isSaving: false,
        isUploading: false,
      },
      errors: {
        gameNameError: null,
      },
      isGameNameEditing: false,
      isGameNameFocused: false,
    }
  } catch (error) {
    console.error("Failed to load game creation data from storage:", error)
    return null
  }
}

export function saveGameCreationToStorage(state: GameCreationState): void {
  try {
    const data: StoredGameCreationData = {
      gameName: state.gameName,
      questions: state.questions.map(q => ({
        id: q.id,
        text: q.text,
        answer: q.answer,
        imageUrl: q.imageUrl,
        order: q.order,
      })),
      gameVersion: state.gameVersion,
      lastSaved: Date.now(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save game creation data to storage:", error)
  }
}

export function clearGameCreationFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear game creation data from storage:", error)
  }
}

export const moveQuestionInArray = (
  questions: Question[],
  questionId: string,
  direction: "up" | "down",
): Question[] => {
  const questionIndex = questions.findIndex((q) => q.id === questionId)
  if (questionIndex === -1) return questions

  const newQuestions = [...questions]
  const targetIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1

  if (targetIndex < 0 || targetIndex >= questions.length) return questions
  ;[newQuestions[questionIndex], newQuestions[targetIndex]] = [
    newQuestions[targetIndex],
    newQuestions[questionIndex],
  ]

  return newQuestions.map((question, index) => ({
    ...question,
    order: index,
  }))
}

export const updateQuestionOrder = (questions: Question[]): Question[] => {
  return questions.map((question, index) => ({
    ...question,
    order: index,
  }))
}

export const createImageUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

export const removeImageUrl = (url: string): void => {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

export const generateGameName = (existingNames: string[]): string => {
  const baseName = "게임"
  let counter = 1
  let newName = `${baseName}${counter}`

  while (existingNames.includes(newName)) {
    counter++
    newName = `${baseName}${counter}`
  }

  return newName
}

export const updateQuestion = (
  questions: Question[],
  questionId: string,
  updates: Partial<Question>,
): Question[] => {
  return questions.map((question) =>
    question.id === questionId ? { ...question, ...updates } : question,
  )
}

export const deleteQuestion = (
  questions: Question[],
  questionId: string,
): Question[] => {
  if (questions.length <= 1) {
    return questions
  }

  return updateQuestionOrder(questions.filter((q) => q.id !== questionId))
}

export const addQuestion = (
  questions: Question[],
  afterQuestionId?: string,
): Question[] => {
  const newQuestion = {
    ...createInitialQuestion(questions.length),
    id: uuidv4(),
  }

  if (!afterQuestionId) {
    return [...questions, newQuestion]
  }

  const insertIndex = questions.findIndex((q) => q.id === afterQuestionId)
  if (insertIndex === -1) {
    return [...questions, newQuestion]
  }

  const newQuestions = [...questions]
  newQuestions.splice(insertIndex + 1, 0, newQuestion)

  return updateQuestionOrder(newQuestions)
}
