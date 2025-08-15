"use client"

import { createContext, type ReactNode, useContext, useRef } from "react"
import { create, useStore } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import type { GameDetailData } from "@/entities/game/model"

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
  // 게임 초기화
  setGameDetail: (gameDetail: GameDetailData) => void

  // 팀 관리
  addTeam: (team: Omit<Team, "score">) => void
  removeTeam: (teamId: string) => void
  updateTeamScore: (teamId: string, score: number) => void
  addScoreToTeam: (teamId: string, points: number) => void

  // 게임 진행
  setGameStatus: (status: GameState["gameStatus"]) => void
  setRound: (round: number) => void
  nextRound: () => void
  prevRound: () => void
  resetGame: () => void
}

const createGameStore = (initialGameDetail?: GameDetailData, gameId?: string) =>
  create<GameState & GameActions>()(
    persist(
      immer((set) => ({
        gameDetail: initialGameDetail || null,
        teams: [],
        gameStatus: "setup",
        currentRound: 1,
        totalRounds: initialGameDetail?.questionCount || 1,

        // 액션들
        setGameDetail: (gameDetail) =>
          set({
            gameDetail,
            totalRounds: gameDetail?.questionCount || 1,
          }),

        addTeam: (team) =>
          set((state) => {
            state.teams.push({ ...team, score: 0 })
          }),

        removeTeam: (teamId) =>
          set((state) => {
            const index = state.teams.findIndex(
              (team: Team) => team.id === teamId,
            )
            if (index !== -1) {
              state.teams.splice(index, 1)
            }
          }),

        updateTeamScore: (teamId, score) =>
          set((state) => {
            const team = state.teams.find((team: Team) => team.id === teamId)
            if (team) {
              team.score = score
            }
          }),

        addScoreToTeam: (teamId, points) =>
          set((state) => {
            const team = state.teams.find((team: Team) => team.id === teamId)
            if (team) {
              team.score += points
            }
          }),

        setGameStatus: (gameStatus) => set({ gameStatus }),

        setRound: (round) =>
          set((state) => {
            const boundedRound = Math.max(1, Math.min(round, state.totalRounds))
            state.currentRound = boundedRound
          }),

        nextRound: () =>
          set((state) => {
            state.currentRound = Math.min(
              state.currentRound + 1,
              state.totalRounds,
            )
          }),

        prevRound: () =>
          set((state) => {
            state.currentRound = Math.max(state.currentRound - 1, 1)
          }),

        resetGame: () =>
          set({
            teams: [],
            gameStatus: "setup",
            currentRound: 1,
          }),
      })),
      {
        name: `game-store-${gameId || "default"}`,
        partialize: (state) => ({
          teams: state.teams,
          gameStatus: state.gameStatus,
          currentRound: state.currentRound,
          totalRounds: state.totalRounds,
          gameDetail: state.gameDetail,
        }),
      },
    ),
  )

export type GameStoreApi = ReturnType<typeof createGameStore>

export const GameStoreContext = createContext<GameStoreApi | undefined>(
  undefined,
)

export interface GameStoreProviderProps {
  children: ReactNode
  initialGameDetail?: GameDetailData
  gameId?: string
}

export const GameStoreProvider = ({
  children,
  initialGameDetail,
  gameId,
}: GameStoreProviderProps) => {
  const storeRef = useRef<GameStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createGameStore(initialGameDetail, gameId)
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  )
}

export const useGameStore = <T,>(
  selector: (store: GameState & GameActions) => T,
): T => {
  const gameStoreContext = useContext(GameStoreContext)

  if (!gameStoreContext) {
    throw new Error(`useGameStore must be used within GameStoreProvider`)
  }

  return useStore(gameStoreContext, selector)
}
