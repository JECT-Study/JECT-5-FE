import type { AdminReport } from "@/entities/report/model/types"

const gameNames = [
  "퀴즈 마스터",
  "두뇌 게임",
  "상식 퀴즈",
  "역사 퀴즈",
  "과학 퀴즈",
  "스포츠 퀴즈",
  "음악 퀴즈",
  "영화 퀴즈",
  "문학 퀴즈",
  "지리 퀴즈",
]

const creatorNames = [
  "홍길동",
  "김철수",
  "이영희",
  "박민수",
  "정수진",
  "최동현",
  "강미영",
  "윤태준",
  "임지은",
  "한소연",
]

const reporterNames = [
  "신고자1",
  "신고자2",
  "신고자3",
  "신고자4",
  "신고자5",
  "신고자6",
  "신고자7",
  "신고자8",
  "신고자9",
  "신고자10",
]

export const generateMockAdminReports = (
  count: number,
  seed?: number,
): AdminReport[] => {
  let originalRandom: (() => number) | undefined

  if (seed !== undefined) {
    originalRandom = Math.random
    let currentSeed = seed
    Math.random = () => {
      const x = Math.sin(currentSeed++) * 10000
      return x - Math.floor(x)
    }
  }

  const result: AdminReport[] = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * gameNames.length)
    const creatorIndex = Math.floor(Math.random() * creatorNames.length)
    const reporterIndex = Math.floor(Math.random() * reporterNames.length)
    const daysAgo = Math.floor(Math.random() * 30)

    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    result.push({
      reportId: i + 1,
      gameName: gameNames[randomIndex],
      creatorName: creatorNames[creatorIndex],
      reporterName: reporterNames[reporterIndex],
      reportedAt: date.toISOString(),
      status: "PENDING",
    })
  }

  if (originalRandom) {
    Math.random = originalRandom
  }

  return result
}

export const mockAdminReports: AdminReport[] = generateMockAdminReports(21, 456)
