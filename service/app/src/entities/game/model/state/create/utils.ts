import { GameCreationState, Question } from "./state"

export const createInitialQuestion = (order: number): Question => ({
  id: `question-${order}`,
  text: "",
  answer: "",
  imageFile: null,
  imageUrl: null,
  imageUploadError: null,
  isImageHovered: false,
  order,
})

export const createInitialState = (): GameCreationState => ({
  gameName: "게임1",
  questions: [createInitialQuestion(0)],
  selectedQuestionId: "question-0",
  popups: {
    showExitConfirmation: false,
    showSaveConfirmation: false,
    showImageUploadError: false,
    showFileSizeError: false,
    showFileTypeError: false,
  },
  loading: {
    isSaving: false,
    isUploading: false,
  },
  errors: {
    gameNameError: null,
    globalError: null,
  },
  isGameNameEditing: false,
  isGameNameFocused: false,
})

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

export const addQuestion = (questions: Question[]): Question[] => {
  const newQuestion = {
    ...createInitialQuestion(questions.length),
    id: `question-${Date.now()}-${Math.random()}`,
  }
  return [...questions, newQuestion]
}
