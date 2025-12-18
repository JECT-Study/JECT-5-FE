"use client"
import { create, useStore } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import type { GameDetailData } from "@/entities/game/model"

import { useGameStoreContext } from "./gameProvider"

const DEFAULT_TEAMS = [
  { id: "1", name: "A팀", members: [] },
  { id: "2", name: "B팀", members: [] },
]

export interface Team {
  id: string
  name: string
  members: string[]
}

interface GameState {
  gameDetail: GameDetailData
  teams: Team[]
  gameStatus: "setup" | "playing" | "paused" | "finished"
  totalRounds: number
  scores: Record<string, number>
}

interface GameActions {
  addTeam: (team: Team) => void
  removeTeam: (teamId: string) => void
  updateTeamName: (teamId: string, name: string) => void
  updateTeamScore: (teamId: string, score: number) => void
  addTeamScore: (teamId: string, points: number) => void

  // 게임 진행
  setGameStatus: (status: GameState["gameStatus"]) => void

  resetScores: () => void
}

// 헬퍼 함수들
const findTeamIndex = (teams: Team[], teamId: string): number => {
  return teams.findIndex((team) => team.id === teamId)
}

export const createGameStore = (initialGameDetail: GameDetailData) =>
  create<GameState & GameActions>()(
    persist(
      immer((set) => ({
        gameDetail: initialGameDetail,
        teams: DEFAULT_TEAMS.map((team) => ({ ...team })),
        scores: Object.fromEntries(DEFAULT_TEAMS.map((t) => [t.id, 0])),
        gameStatus: "setup",
        totalRounds: initialGameDetail.questionCount,

        addTeam: (team) =>
          set((state) => {
            state.teams.push({ ...team })
            state.scores[team.id] = 0
          }),

        removeTeam: (teamId) =>
          set((state) => {
            const index = findTeamIndex(state.teams, teamId)
            if (index !== -1) {
              state.teams.splice(index, 1)
              delete state.scores[teamId]
            }
          }),

        updateTeamName: (teamId, name) =>
          set((state) => {
            const index = findTeamIndex(state.teams, teamId)
            if (index !== -1) {
              state.teams[index].name = name
            }
          }),

        updateTeamScore: (teamId, score) =>
          set((state) => {
            state.scores[teamId] = score
          }),

        addTeamScore: (teamId, points) =>
          set((state) => {
            state.scores[teamId] = (state.scores[teamId] ?? 0) + points
          }),

        // 게임 진행 액션들
        setGameStatus: (gameStatus) => set({ gameStatus }),

        resetScores: () =>
          set((state) => {
            state.scores = Object.fromEntries(state.teams.map((t) => [t.id, 0]))
          }),
      })),
      {
        name: "game-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          teams: state.teams,
        }),
      },
    ),
  )

export type GameStoreApi = ReturnType<typeof createGameStore>

export const useGameStore = <T,>(
  selector: (store: GameState & GameActions) => T,
): T => {
  const gameStoreApi = useGameStoreContext()
  return useStore(gameStoreApi, selector)
}
