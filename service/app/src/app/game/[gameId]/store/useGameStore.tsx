import { create, useStore } from "zustand"
import { persist } from "zustand/middleware"
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
  score: number
  members: string[]
}

interface GameState {
  gameDetail: GameDetailData | null
  teams: Team[]
  gameStatus: "setup" | "playing" | "paused" | "finished"
  currentRound: number
  totalRounds: number
}

interface GameActions {
  // 팀 관리 - 플랫 구조
  addTeam: (team: Omit<Team, "score">) => void
  removeTeam: (teamId: string) => void
  updateTeamName: (teamId: string, name: string) => void
  updateTeamScore: (teamId: string, score: number) => void
  addTeamScore: (teamId: string, points: number) => void

  // 게임 진행
  setGameStatus: (status: GameState["gameStatus"]) => void
  setRound: (round: number) => void
  nextRound: () => void
  prevRound: () => void

  // 초기화
  resetGame: () => void
}

// 헬퍼 함수들
const findTeamIndex = (teams: Team[], teamId: string): number => {
  return teams.findIndex((team) => team.id === teamId)
}

export const createGameStore = (
  initialGameDetail?: GameDetailData,
  gameId?: string,
) =>
  create<GameState & GameActions>()(
    persist(
      immer((set) => ({
        gameDetail: initialGameDetail || null,
        teams: DEFAULT_TEAMS.map((team) => ({ ...team, score: 0 })),
        gameStatus: "setup",
        currentRound: 1,
        totalRounds: initialGameDetail?.questionCount || 1,

        addTeam: (team) =>
          set((state) => {
            state.teams.push({ ...team, score: 0 })
          }),

        removeTeam: (teamId) =>
          set((state) => {
            const index = findTeamIndex(state.teams, teamId)
            if (index !== -1) {
              state.teams.splice(index, 1)
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
            const index = findTeamIndex(state.teams, teamId)
            if (index !== -1) {
              state.teams[index].score = score
            }
          }),

        addTeamScore: (teamId, points) =>
          set((state) => {
            const index = findTeamIndex(state.teams, teamId)
            if (index !== -1) {
              state.teams[index].score += points
            }
          }),

        // 게임 진행 액션들
        setGameStatus: (gameStatus) => set({ gameStatus }),

        setRound: (round) =>
          set((state) => {
            state.currentRound = Math.max(1, Math.min(round, state.totalRounds))
          }),

        nextRound: () =>
          set((state) => {
            if (state.currentRound < state.totalRounds) {
              state.currentRound += 1
            }
          }),

        prevRound: () =>
          set((state) => {
            if (state.currentRound > 1) {
              state.currentRound -= 1
            }
          }),

        resetGame: () =>
          set((state) => {
            state.teams = DEFAULT_TEAMS.map((team) => ({ ...team, score: 0 }))
            state.gameStatus = "setup"
            state.currentRound = 1
          }),
      })),
      {
        name: `game-store-${gameId || "default"}`,
        partialize: (state) => ({
          gameStatus: state.gameStatus,
          currentRound: state.currentRound,
          totalRounds: state.totalRounds,
          gameDetail: state.gameDetail,
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
