// 65 = 'A' 를 기준으로 팀 이름 생성
// 예시: 0 -> A팀, 1 -> B팀, 2 -> C팀
// 알파벳을 넘어가는 경우는 없음
export const generateTeamName = (index: number) => {
  const letter = String.fromCharCode(65 + index)
  return `${letter}팀`
}
