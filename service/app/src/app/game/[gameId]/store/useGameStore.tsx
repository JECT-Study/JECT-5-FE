"use client"

import { produce } from "immer"
import { createContext, type ReactNode, useContext, useRef } from "react"
import { create, useStore } from "zustand"

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

  settings: {
    timeLimit?: number
    maxTeams?: number
  }
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
  nextRound: () => void
  resetGame: () => void

  // 설정
  updateSettings: (settings: Partial<GameState["settings"]>) => void
}

const createGameStore = (initialGameDetail?: GameDetailData) =>
  create<GameState & GameActions>((set) => ({
    gameDetail: initialGameDetail || null,
    teams: [],
    gameStatus: "setup",
    currentRound: 1,
    totalRounds: 1,
    settings: {},

    // 액션들
    setGameDetail: (gameDetail) => set({ gameDetail }),

    addTeam: (team) =>
      set(
        produce((state: GameState) => {
          state.teams.push({ ...team, score: 0 })
        }),
      ),

    removeTeam: (teamId) =>
      set(
        produce((state: GameState) => {
          const index = state.teams.findIndex(
            (team: Team) => team.id === teamId,
          )
          if (index !== -1) {
            state.teams.splice(index, 1)
          }
        }),
      ),

    updateTeamScore: (teamId, score) =>
      set(
        produce((state: GameState) => {
          const team = state.teams.find((team: Team) => team.id === teamId)
          if (team) {
            team.score = score
          }
        }),
      ),

    addScoreToTeam: (teamId, points) =>
      set(
        produce((state: GameState) => {
          const team = state.teams.find((team: Team) => team.id === teamId)
          if (team) {
            team.score += points
          }
        }),
      ),

    setGameStatus: (gameStatus) => set({ gameStatus }),

    nextRound: () =>
      set(
        produce((state: GameState) => {
          state.currentRound = Math.min(
            state.currentRound + 1,
            state.totalRounds,
          )
        }),
      ),

    resetGame: () =>
      set({
        teams: [],
        gameStatus: "setup",
        currentRound: 1,
        settings: {},
      }),

    updateSettings: (newSettings) =>
      set(
        produce((state: GameState) => {
          Object.assign(state.settings, newSettings)
        }),
      ),
  }))

export type GameStoreApi = ReturnType<typeof createGameStore>

export const GameStoreContext = createContext<GameStoreApi | undefined>(
  undefined,
)

export interface GameStoreProviderProps {
  children: ReactNode
  initialGameDetail?: GameDetailData
}

export const GameStoreProvider = ({
  children,
  initialGameDetail,
}: GameStoreProviderProps) => {
  const storeRef = useRef<GameStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createGameStore(initialGameDetail)
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
