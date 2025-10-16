"use client"

import { create, useStore } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { useCreateGameStoreContext } from "./createGameProvider"
import type { CreateGameActions, CreateGameState, Question } from "./types"
import { createInitialQuestion } from "./utils"

const DEFAULT_QUESTIONS: Question[] = [createInitialQuestion(0)]

export const createGameStore = (
  gameId: string,
  initialGameName: string = "새 게임",
) =>
  create<CreateGameState & CreateGameActions>()(
    persist(
      immer((set) => ({
        gameName: initialGameName,
        questions: DEFAULT_QUESTIONS,
        selectedQuestionId: DEFAULT_QUESTIONS[0].id,

        setGameName: (name) =>
          set((state) => {
            state.gameName = name
          }),
        setSelectedQuestionId: (id) =>
          set((state) => {
            state.selectedQuestionId = id
          }),
        addQuestion: () =>
          set((state) => {
            const selectedIndex = state.questions.findIndex(
              (q) => q.id === state.selectedQuestionId,
            )
            const insertIndex =
              selectedIndex !== -1 ? selectedIndex + 1 : state.questions.length

            const newQuestion = createInitialQuestion(insertIndex)

            state.questions.splice(insertIndex, 0, newQuestion)

            state.questions = state.questions.map((q, index) => ({
              ...q,
              order: index,
            }))

            state.selectedQuestionId = newQuestion.id
          }),
        deleteQuestion: (id) =>
          set((state) => {
            if (state.questions.length <= 1) {
              return
            }

            const questionToDelete = state.questions.find((q) => q.id === id)
            if (questionToDelete?.previewImageUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(questionToDelete.previewImageUrl)
            }

            state.questions = state.questions
              .filter((q) => q.id !== id)
              .map((q, index) => ({
                ...q,
                order: index,
              }))

            if (state.selectedQuestionId === id) {
              state.selectedQuestionId = state.questions[0]?.id || ""
            }
          }),
        moveQuestion: (id, direction) =>
          set((state) => {
            const index = state.questions.findIndex((q) => q.id === id)
            if (index !== -1) {
              const newIndex = direction === "up" ? index - 1 : index + 1
              state.questions.splice(
                newIndex,
                0,
                state.questions.splice(index, 1)[0],
              )
            }
          }),
        uploadImage: (id, file, previewUrl) =>
          set((state) => {
            const questionIndex = state.questions.findIndex((q) => q.id === id)
            if (questionIndex !== -1) {
              const existingPreviewUrl =
                state.questions[questionIndex].previewImageUrl
              if (existingPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(existingPreviewUrl)
              }

              state.questions[questionIndex].imageFile = file
              state.questions[questionIndex].previewImageUrl = previewUrl
              state.questions[questionIndex].imageUrl = null
            }
          }),
        deleteImage: (id) =>
          set((state) => {
            const questionIndex = state.questions.findIndex((q) => q.id === id)
            if (questionIndex !== -1) {
              const previewUrl = state.questions[questionIndex].previewImageUrl
              if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
              }

              state.questions[questionIndex].imageFile = null
              state.questions[questionIndex].previewImageUrl = null
              state.questions[questionIndex].imageUrl = null
            }
          }),
        updateQuestion: (id, updates) =>
          set((state) => {
            const questionIndex = state.questions.findIndex((q) => q.id === id)
            if (questionIndex !== -1) {
              state.questions[questionIndex] = {
                ...state.questions[questionIndex],
                ...updates,
              }
            }
          }),
        reset: () =>
          set((state) => {
            state.gameName = initialGameName
            state.questions = DEFAULT_QUESTIONS
            state.selectedQuestionId = DEFAULT_QUESTIONS[0].id
          }),
      })),
      {
        name: `create-game-store-${gameId}`,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          gameName: state.gameName,
          questions: state.questions.map((q) => ({
            ...q,
            imageFile: null,
            previewImageUrl: null,
          })),
          selectedQuestionId: state.selectedQuestionId,
        }),
      },
    ),
  )

export type CreateGameStoreApi = ReturnType<typeof createGameStore>

export const useCreateGameStore = <T,>(
  selector: (store: CreateGameState & CreateGameActions) => T,
): T => {
  const createGameStoreApi = useCreateGameStoreContext()
  return useStore(createGameStoreApi, selector)
}
