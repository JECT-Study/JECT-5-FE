export interface Question {
  id: string
  text: string
  answer: string
  imageFile: File | null
  imageUrl: string | null
  previewImageUrl: string | null
  order: number
}

export interface CreateGameState {
  gameName: string
  questions: Question[]
  selectedQuestionId: string
}

export interface CreateGameActions {
  setGameName: (name: string) => void
  setSelectedQuestionId: (id: string) => void
  addQuestion: () => void
  deleteQuestion: (id: string) => void
  moveQuestion: (id: string, direction: "up" | "down") => void
  uploadImage: (id: string, file: File, previewUrl: string) => void
  deleteImage: (id: string) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  reset: () => void
}
