export interface Question {
  id: string
  text: string
  answer: string
  imageFile: File | null
  imageUrl: string | null
  previewImageUrl: string | null
  order: number
}

export interface PopupState {
  showExitConfirmation: boolean
  showSaveConfirmation: boolean
  showFileSizeError: boolean
  showFileTypeError: boolean
}

export interface LoadingState {
  isSaving: boolean
  isUploading: boolean
}

export interface ErrorState {
  gameNameError: string | null
}

export interface GameCreationState {
  gameName: string
  questions: Question[]
  selectedQuestionId: string | null

  popups: PopupState
  loading: LoadingState
  errors: ErrorState

  isGameNameEditing: boolean
  isGameNameFocused: boolean
}
