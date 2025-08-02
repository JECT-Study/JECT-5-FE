import { validateImageFile } from "../../../utils/fileValidation"
import { GameCreationAction } from "./actions"
import { GameCreationState } from "./state"
import {
  addQuestion,
  createInitialState,
  deleteQuestion,
  moveQuestionInArray,
  updateQuestion,
} from "./utils"

export const gameCreationReducer = (
  state: GameCreationState,
  action: GameCreationAction,
): GameCreationState => {
  switch (action.type) {
    case "SET_GAME_NAME":
      return {
        ...state,
        gameName: action.payload,
      }

    case "SET_GAME_NAME_FOCUS":
      return {
        ...state,
        isGameNameFocused: action.payload,
      }

    case "SET_GAME_NAME_EDITING":
      return {
        ...state,
        isGameNameEditing: action.payload,
      }

    case "ADD_QUESTION": {
      const newQuestions = addQuestion(state.questions)
      const newQuestion = newQuestions[newQuestions.length - 1]

      return {
        ...state,
        questions: newQuestions,
        selectedQuestionId: newQuestion.id,
      }
    }

    case "DELETE_QUESTION": {
      const questionId = action.payload
      const updatedQuestions = deleteQuestion(state.questions, questionId)

      let selectedQuestionId = state.selectedQuestionId
      if (selectedQuestionId === questionId) {
        selectedQuestionId =
          updatedQuestions.length > 0 ? updatedQuestions[0].id : null
      }

      return {
        ...state,
        questions: updatedQuestions,
        selectedQuestionId,
      }
    }

    case "UPDATE_QUESTION": {
      const { id, updates } = action.payload
      const updatedQuestions = updateQuestion(state.questions, id, updates)

      return {
        ...state,
        questions: updatedQuestions,
      }
    }

    case "SELECT_QUESTION":
      return {
        ...state,
        selectedQuestionId: action.payload,
      }

    case "MOVE_QUESTION": {
      const { id, direction } = action.payload
      const updatedQuestions = moveQuestionInArray(
        state.questions,
        id,
        direction,
      )

      return {
        ...state,
        questions: updatedQuestions,
      }
    }

    case "UPLOAD_IMAGE_START": {
      const { questionId, file } = action.payload
      const validation = validateImageFile(file)
      const imageError = validation.isValid ? null : validation.error

      if (imageError) {
        return {
          ...state,
          questions: updateQuestion(state.questions, questionId, {
            imageUploadError: imageError,
          }),
        }
      }

      return {
        ...state,
        loading: {
          ...state.loading,
          isUploading: true,
        },
        questions: updateQuestion(state.questions, questionId, {
          imageFile: file,
          imageUploadError: null,
        }),
      }
    }

    case "UPLOAD_IMAGE_SUCCESS": {
      const { questionId, imageUrl } = action.payload

      return {
        ...state,
        loading: {
          ...state.loading,
          isUploading: false,
        },
        questions: updateQuestion(state.questions, questionId, {
          imageUrl,
          imageUploadError: null,
        }),
      }
    }

    case "UPLOAD_IMAGE_ERROR": {
      const { questionId, error } = action.payload

      return {
        ...state,
        loading: {
          ...state.loading,
          isUploading: false,
        },
        questions: updateQuestion(state.questions, questionId, {
          imageUploadError: error,
        }),
      }
    }

    case "SET_IMAGE_HOVER":
      return {
        ...state,
        questions: updateQuestion(state.questions, action.payload.questionId, {
          isImageHovered: action.payload.isHovered,
        }),
      }

    case "SHOW_POPUP": {
      const popupType = action.payload
      return {
        ...state,
        popups: {
          ...state.popups,
          [popupType]: true,
        },
      }
    }

    case "HIDE_POPUP": {
      const popupType = action.payload
      return {
        ...state,
        popups: {
          ...state.popups,
          [popupType]: false,
        },
      }
    }

    case "SAVE_GAME_START":
      return {
        ...state,
        loading: {
          ...state.loading,
          isSaving: true,
        },
      }

    case "SAVE_GAME_SUCCESS":
      return {
        ...state,
        loading: {
          ...state.loading,
          isSaving: false,
        },
      }

    case "SAVE_GAME_ERROR":
      return {
        ...state,
        loading: {
          ...state.loading,
          isSaving: false,
        },
        errors: {
          ...state.errors,
          globalError: action.payload,
        },
      }

    case "SET_GLOBAL_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          globalError: action.payload,
        },
      }

    case "RESET_FORM":
      return createInitialState()

    default:
      return state
  }
}
