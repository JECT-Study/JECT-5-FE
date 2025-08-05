import { Question } from "./state"

export type GameCreationAction =
  | { type: "SET_GAME_NAME"; payload: string }
  | { type: "SET_GAME_NAME_FOCUS"; payload: boolean }
  | { type: "SET_GAME_NAME_EDITING"; payload: boolean }
  | { type: "ADD_QUESTION"; payload?: string }
  | { type: "DELETE_QUESTION"; payload: string }
  | {
      type: "UPDATE_QUESTION"
      payload: { id: string; updates: Partial<Question> }
    }
  | { type: "SELECT_QUESTION"; payload: string }
  | { type: "MOVE_QUESTION"; payload: { id: string; direction: "up" | "down" } }
  | {
      type: "UPLOAD_IMAGE_START"
      payload: { questionId: string; file: File; previewUrl: string }
    }
  | { type: "SHOW_POPUP"; payload: keyof PopupState }
  | { type: "HIDE_POPUP"; payload: keyof PopupState }
  | { type: "SAVE_GAME_START" }
  | { type: "SAVE_GAME_SUCCESS" }
  | { type: "SAVE_GAME_ERROR"; payload: string }

interface PopupState {
  showExitConfirmation: boolean
  showSaveConfirmation: boolean
  showFileUploadError: boolean
}

export const gameCreationActions = {
  setGameName: (name: string): GameCreationAction => ({
    type: "SET_GAME_NAME",
    payload: name,
  }),

  setGameNameFocus: (isFocused: boolean): GameCreationAction => ({
    type: "SET_GAME_NAME_FOCUS",
    payload: isFocused,
  }),

  setGameNameEditing: (isEditing: boolean): GameCreationAction => ({
    type: "SET_GAME_NAME_EDITING",
    payload: isEditing,
  }),

  addQuestion: (afterQuestionId?: string): GameCreationAction => ({
    type: "ADD_QUESTION",
    payload: afterQuestionId,
  }),

  deleteQuestion: (questionId: string): GameCreationAction => ({
    type: "DELETE_QUESTION",
    payload: questionId,
  }),

  updateQuestion: (
    id: string,
    updates: Partial<Question>,
  ): GameCreationAction => ({
    type: "UPDATE_QUESTION",
    payload: { id, updates },
  }),

  selectQuestion: (questionId: string): GameCreationAction => ({
    type: "SELECT_QUESTION",
    payload: questionId,
  }),

  moveQuestion: (id: string, direction: "up" | "down"): GameCreationAction => ({
    type: "MOVE_QUESTION",
    payload: { id, direction },
  }),

  uploadImageStart: (
    questionId: string,
    file: File,
    previewUrl: string,
  ): GameCreationAction => ({
    type: "UPLOAD_IMAGE_START",
    payload: { questionId, file, previewUrl },
  }),

  showPopup: (popupType: keyof PopupState): GameCreationAction => ({
    type: "SHOW_POPUP",
    payload: popupType,
  }),

  hidePopup: (popupType: keyof PopupState): GameCreationAction => ({
    type: "HIDE_POPUP",
    payload: popupType,
  }),

  saveGameStart: (): GameCreationAction => ({
    type: "SAVE_GAME_START",
  }),

  saveGameSuccess: (): GameCreationAction => ({
    type: "SAVE_GAME_SUCCESS",
  }),

  saveGameError: (error: string): GameCreationAction => ({
    type: "SAVE_GAME_ERROR",
    payload: error,
  }),
}
