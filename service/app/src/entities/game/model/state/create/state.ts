export interface Question {
  id: string;
  text: string;
  answer: string;
  imageFile: File | null;
  imageUrl: string | null;
  imageUploadError: string | null;
  isImageHovered: boolean;
  order: number;
}

export interface PopupState {
  showExitConfirmation: boolean;
  showSaveConfirmation: boolean;
  showImageUploadError: boolean;
  showFileSizeError: boolean;
  showFileTypeError: boolean;
}

export interface LoadingState {
  isSaving: boolean;
  isUploading: boolean;
}

export interface ErrorState {
  gameNameError: string | null;
  globalError: string | null;
}

export interface GameCreationState {
  gameName: string;
  questions: Question[];
  selectedQuestionId: string | null;
  
  popups: PopupState;
  loading: LoadingState;
  errors: ErrorState;
  
  isGameNameEditing: boolean;
  isGameNameFocused: boolean;
} 