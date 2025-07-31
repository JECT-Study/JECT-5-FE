"use client"

import { useCallback, useReducer } from 'react';

import { GameCreationAction, gameCreationActions } from './gameCreationActions';
import { gameCreationReducer } from './gameCreationReducer';
import { questionSelectors, selectors } from './gameCreationSelectors';
import { GameCreationState, Question } from './gameCreationState';
import { createInitialState } from './gameCreationUtils';

export const useGameCreation = () => {
  const [state, dispatch] = useReducer<React.Reducer<GameCreationState, GameCreationAction>>(
    gameCreationReducer,
    createInitialState()
  );

  const setGameName = useCallback((name: string) => {
    dispatch(gameCreationActions.setGameName(name));
  }, []);

  const setGameNameFocus = useCallback((isFocused: boolean) => {
    dispatch(gameCreationActions.setGameNameFocus(isFocused));
  }, []);

  const setGameNameEditing = useCallback((isEditing: boolean) => {
    dispatch(gameCreationActions.setGameNameEditing(isEditing));
  }, []);

  const addQuestion = useCallback(() => {
    dispatch(gameCreationActions.addQuestion());
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    dispatch(gameCreationActions.deleteQuestion(questionId));
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    dispatch(gameCreationActions.updateQuestion(id, updates));
  }, []);

  const selectQuestion = useCallback((questionId: string) => {
    dispatch(gameCreationActions.selectQuestion(questionId));
  }, []);

  const moveQuestion = useCallback((id: string, direction: 'up' | 'down') => {
    dispatch(gameCreationActions.moveQuestion(id, direction));
  }, []);

  const uploadImageStart = useCallback((questionId: string, file: File) => {
    dispatch(gameCreationActions.uploadImageStart(questionId, file));
  }, []);

  const uploadImageSuccess = useCallback((questionId: string, imageUrl: string) => {
    dispatch(gameCreationActions.uploadImageSuccess(questionId, imageUrl));
  }, []);

  const uploadImageError = useCallback((questionId: string, error: string) => {
    dispatch(gameCreationActions.uploadImageError(questionId, error));
  }, []);

  const setImageHover = useCallback((questionId: string, isHovered: boolean) => {
    dispatch(gameCreationActions.setImageHover(questionId, isHovered));
  }, []);

  const showPopup = useCallback((popupType: keyof GameCreationState['popups']) => {
    dispatch(gameCreationActions.showPopup(popupType));
  }, []);

  const hidePopup = useCallback((popupType: keyof GameCreationState['popups']) => {
    dispatch(gameCreationActions.hidePopup(popupType));
  }, []);

  const saveGameStart = useCallback(() => {
    dispatch(gameCreationActions.saveGameStart());
  }, []);

  const saveGameSuccess = useCallback(() => {
    dispatch(gameCreationActions.saveGameSuccess());
  }, []);

  const saveGameError = useCallback((error: string) => {
    dispatch(gameCreationActions.saveGameError(error));
  }, []);

  const setGlobalError = useCallback((error: string | null) => {
    dispatch(gameCreationActions.setGlobalError(error));
  }, []);

  const resetForm = useCallback(() => {
    dispatch(gameCreationActions.resetForm());
  }, []);

  const derivedState = {
    gameNameError: selectors.gameNameError(state),
    
    selectedQuestion: selectors.selectedQuestion(state),
    canAddQuestion: selectors.canAddQuestion(state),
    canDeleteQuestion: selectors.canDeleteQuestion(state),
    
    canSave: selectors.canSave(state),
    isValid: selectors.isValid(state),
    hasChanges: selectors.hasChanges(state),
    
    questionsWithStatus: selectors.questionsWithStatus(state),
    questionsWithErrors: selectors.questionsWithErrors(state)
  };

  const getQuestionSelectors = (questionId: string) => ({
    canDelete: questionSelectors.canDelete(state),
    canMoveUp: questionSelectors.canMoveUp(state, questionId),
    canMoveDown: questionSelectors.canMoveDown(state, questionId),
    isSelected: questionSelectors.isSelected(state, questionId)
  });

  return {
    state,
    
    actions: {
      setGameName,
      setGameNameFocus,
      setGameNameEditing,
      addQuestion,
      deleteQuestion,
      updateQuestion,
      selectQuestion,
      moveQuestion,
      uploadImageStart,
      uploadImageSuccess,
      uploadImageError,
      setImageHover,
      showPopup,
      hidePopup,
      saveGameStart,
      saveGameSuccess,
      saveGameError,
      setGlobalError,
      resetForm
    },
    
    selectors: derivedState,
    
    getQuestionSelectors
  };
}; 