export const MIN_TEAMS = 2
export const MAX_TEAMS = 10
export const MAX_TEAM_NAME_LENGTH = 30

import type { Team } from "../store/useGameStore"

export const validateTeamName = (
  teamId: string,
  name: string,
  teams: Team[],
): string => {
  if (name.length === 0) {
    return "팀명을 비워둘 수 없어요."
  }
  if (name.length > MAX_TEAM_NAME_LENGTH) {
    return `팀명은 ${MAX_TEAM_NAME_LENGTH}자까지만 가능해요.`
  }
  if (teams.some((team) => team.id !== teamId && team.name === name)) {
    return "이미 사용중인 팀명이에요."
  }
  return ""
}
//teamId별로 유효성검사의 에러 메시지를 담는 객체
export const getTeamErrors = (teams: Team[]): { [teamId: string]: string } => {
  return teams.reduce<{ [teamId: string]: string }>((errors, team) => {
    const error = validateTeamName(team.id, team.name, teams)
    if (error) {
      errors[team.id] = error
    }
    return errors
  }, {})
}

export const canStartGame = (teams: Team[]) => {
  if (teams.length < MIN_TEAMS) return false
  const errors = getTeamErrors(teams)
  return Object.keys(errors).length === 0
}
