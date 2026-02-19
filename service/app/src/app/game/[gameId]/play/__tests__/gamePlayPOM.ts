import { expect, type Locator, type Page } from "@playwright/test"

/**
 * 게임 진행 페이지(Page: /game/[gameId]/play) POM
 * - 테스트 컨벤션: guides/test-convention.mdc를 따름
 * - 가능한 한 접근성 셀렉터(getByRole, getByAltText 등)를 우선 사용
 * - 접근성 속성이 없는 요소는 구조 기반 셀렉터로 보완
 *
 * 키보드 조작:
 * - Enter / ArrowRight: 정답 숨김 → 정답 공개, 정답 공개 → 다음 문제
 * - ArrowLeft: 이전 문제로 이동 (1번 문제에서는 무반응)
 */
export class GamePlayPOM {
  readonly page: Page

  // 헤더 영역
  readonly homeLogoImage: Locator
  readonly exitIconButton: Locator
  readonly progressbar: Locator

  // 점수판 토글 버튼
  readonly scoreboardToggleButton: Locator

  // 메인 콘텐츠
  readonly questionHeading: Locator
  readonly questionImage: Locator
  readonly answerArea: Locator

  // 액션 버튼 ("정답은?" 또는 "다음")
  readonly showAnswerButton: Locator
  readonly nextQuestionButton: Locator

  // 나가기 다이얼로그
  readonly exitDialogConfirmButton: Locator
  readonly exitDialogCancelButton: Locator

  constructor(page: Page) {
    this.page = page

    // 헤더
    this.homeLogoImage = page.getByAltText("홈 로고")
    this.exitIconButton = page.getByRole("button", { name: "게임 종료" })

    // Progress
    this.progressbar = page.getByRole("progressbar")

    // 점수판 토글
    this.scoreboardToggleButton = page.getByRole("button", {
      name: "점수판 토글",
    })

    // 메인 콘텐츠
    this.questionHeading = page.getByRole("heading", { level: 1 })
    this.questionImage = page.getByAltText("문제 이미지")
    this.answerArea = page.locator("[data-testid='answer-area']")

    // 액션 버튼
    this.showAnswerButton = page.getByRole("button", { name: "정답은?" })
    this.nextQuestionButton = page.getByRole("button", { name: "다음" })

    // 나가기 다이얼로그 버튼
    this.exitDialogConfirmButton = page.getByRole("button", { name: "네" })
    this.exitDialogCancelButton = page.getByRole("button", { name: "아니요" })
  }

  async goto(gameId: string = "1", round?: number, showAnswer?: boolean) {
    let search = round ? `?q=${round}` : ""
    if (showAnswer) search += "&answer=true"
    await this.page.goto(`game/${gameId}/play${search}`)
  }

  async clickHomeLogo() {
    await this.homeLogoImage.click()
  }

  async clickExitIcon() {
    await this.exitIconButton.click()
  }

  async getProgressValue() {
    const value = await this.progressbar.getAttribute("aria-valuenow")
    return value ? Number(value) : null
  }

  async toggleScoreboard() {
    await this.scoreboardToggleButton.click()
  }

  // 정답 공개 버튼 클릭
  async clickShowAnswer() {
    await this.showAnswerButton.click()
  }

  // 다음 버튼 클릭 (정답 공개 상태에서)
  async clickNext() {
    await this.nextQuestionButton.click()
  }

  // 키보드 조작: Enter 키
  async pressEnter() {
    await this.page.locator("body").press("Enter")
  }

  // 키보드 조작: → 키
  async pressArrowRight() {
    await this.page.locator("body").press("ArrowRight")
  }

  // 키보드 조작: ← 키
  async pressArrowLeft() {
    await this.page.locator("body").press("ArrowLeft")
  }

  // 정답 공개 (버튼 또는 키보드)
  async showAnswer() {
    await this.pressEnter()
  }

  // 다음 문제로 이동 (정답 공개 상태에서)
  async goToNextQuestion() {
    await expect(this.nextQuestionButton).toBeVisible()
    await this.pressEnter()
  }

  // 이전 문제로 이동 (키보드)
  async goToPrevQuestion() {
    await this.pressArrowLeft()
  }

  // 현재 정답 공개 상태인지 확인
  async isAnswerVisible() {
    return await this.nextQuestionButton.isVisible()
  }

  // 팀 관련 접근성 셀렉터 기반
  teamCard(teamName: string) {
    return this.page.getByRole("group", { name: `${teamName} 점수 카드` })
  }

  teamDecreaseButton(teamName: string) {
    return this.page.getByRole("button", { name: `${teamName} 점수 감소` })
  }

  teamIncreaseButton(teamName: string) {
    return this.page.getByRole("button", { name: `${teamName} 점수 증가` })
  }

  async increaseScore(teamName: string, times: number = 1) {
    const inc = this.teamIncreaseButton(teamName)
    for (let i = 0; i < times; i++) {
      await inc.click()
    }
  }

  async decreaseScore(teamName: string, times: number = 1) {
    const dec = this.teamDecreaseButton(teamName)
    for (let i = 0; i < times; i++) {
      await dec.click()
    }
  }

  async expectTeamScore(teamName: string, expectedText: string) {
    const scoreButton = this.teamIncreaseButton(teamName)
    await expect(scoreButton).toContainText(expectedText)
  }

  async getQuestionText() {
    return (await this.questionHeading.textContent())?.trim() ?? ""
  }

  async isQuestionImageVisible() {
    return await this.questionImage.isVisible()
  }

  async confirmExit() {
    await this.exitDialogConfirmButton.click()
  }

  async cancelExit() {
    await this.exitDialogCancelButton.click()
  }
}
