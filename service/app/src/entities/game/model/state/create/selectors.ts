import { GameCreationState, Question } from './state';

export const validateGameName = (name: string): string | null => {
  if (name.length === 0) return "게임 이름을 입력해주세요.";
  if (name.length > 30) return "게임 이름은 30자를 초과할 수 없습니다.";
  return null;
};

export const validateQuestion = (question: Question): boolean => {
  return question.text.trim().length > 0 && 
         question.text.length <= 50 &&
         question.answer.trim().length > 0 && 
         question.answer.length <= 50;
};

export const validateQuestionText = (text: string): string | null => {
  if (text.trim().length === 0) return "질문을 입력해주세요.";
  if (text.length > 50) return "질문은 50자를 초과할 수 없습니다.";
  return null;
};

export const validateAnswerText = (answer: string): string | null => {
  if (answer.trim().length === 0) return "답안을 입력해주세요.";
  if (answer.length > 50) return "답안은 50자를 초과할 수 없습니다.";
  return null;
};

export const validateImageFile = (file: File): string | null => {
  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (file.size > maxSize) {
    return "파일 크기는 2MB를 초과할 수 없습니다.";
  }
  
  if (!allowedTypes.includes(file.type)) {
    return "JPG, JPEG, PNG 파일만 업로드 가능합니다.";
  }
  
  return null;
};

export const selectors = {
  gameNameError: (state: GameCreationState): string | null => {
    return validateGameName(state.gameName);
  },

  selectedQuestion: (state: GameCreationState): Question | undefined => {
    return state.questions.find(q => q.id === state.selectedQuestionId);
  },

  canAddQuestion: (state: GameCreationState): boolean => {
    return state.questions.length < 50;
  },

  canDeleteQuestion: (state: GameCreationState): boolean => {
    return state.questions.length > 1;
  },

  canMoveQuestionUp: (state: GameCreationState, questionId: string): boolean => {
    const question = state.questions.find(q => q.id === questionId);
    return question ? question.order > 0 : false;
  },

  canMoveQuestionDown: (state: GameCreationState, questionId: string): boolean => {
    const question = state.questions.find(q => q.id === questionId);
    return question ? question.order < state.questions.length - 1 : false;
  },

  canSave: (state: GameCreationState): boolean => {
    const hasValidGameName = !validateGameName(state.gameName);
    const hasValidQuestions = state.questions.length > 0 && 
                             state.questions.every(validateQuestion);
    
    return hasValidGameName && hasValidQuestions;
  },

  questionStatus: (question: Question): 'valid' | 'error' => {
    return validateQuestion(question) ? 'valid' : 'error';
  },

  questionsWithStatus: (state: GameCreationState) => {
    return state.questions.map(question => ({
      ...question,
      status: selectors.questionStatus(question)
    }));
  },

  questionsWithErrors: (state: GameCreationState): Question[] => {
    return state.questions.filter(q => !validateQuestion(q));
  },

  isValid: (state: GameCreationState): boolean => {
    return selectors.canSave(state);
  },

  hasChanges: (state: GameCreationState): boolean => {
    return state.gameName !== '게임1' || state.questions.length > 0;
  }
};

export const questionSelectors = {
  canDelete: (state: GameCreationState): boolean => {
    return state.questions.length > 1;
  },

  canMoveUp: (state: GameCreationState, questionId: string): boolean => {
    return selectors.canMoveQuestionUp(state, questionId);
  },

  canMoveDown: (state: GameCreationState, questionId: string): boolean => {
    return selectors.canMoveQuestionDown(state, questionId);
  },

  isSelected: (state: GameCreationState, questionId: string): boolean => {
    return state.selectedQuestionId === questionId;
  }
}; 