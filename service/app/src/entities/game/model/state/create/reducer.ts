import { GameCreationAction } from "./actions"
import { GameCreationState } from "./state"
import {
  addQuestion,
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
      const afterQuestionId = action.payload
      const newQuestions = addQuestion(state.questions, afterQuestionId)

      const newQuestion = newQuestions.find(
        (q) => !state.questions.some((existingQ) => existingQ.id === q.id),
      )

      return {
        ...state,
        questions: newQuestions,
        selectedQuestionId:
          newQuestion?.id || newQuestions[newQuestions.length - 1].id,
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
      const { questionId, file, previewUrl } = action.payload

      return {
        ...state,
        loading: {
          ...state.loading,
          isUploading: true,
        },
        questions: updateQuestion(state.questions, questionId, {
          imageFile: file,
          previewImageUrl: previewUrl,
        }),
      }
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
      }

    default:
      return state
  }
}
