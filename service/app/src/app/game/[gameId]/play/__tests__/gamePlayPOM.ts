import { expect, type Locator, type Page } from "@playwright/test"

/**
 * 게임 진행 페이지(Page: /game/[gameId]/play) POM
 * - 테스트 컨벤션: guides/test-convention.mdc를 따름
 * - 가능한 한 접근성 셀렉터(getByRole, getByAltText 등)를 우선 사용
 * - 접근성 속성이 없는 요소는 구조 기반 셀렉터로 보완
 */
export class GamePlayPOM {
  readonly page: Page

  // 헤더 영역
  readonly homeLogoImage: Locator
  readonly prevQuestionButton: Locator
  readonly nextQuestionButton: Locator
  readonly exitIconButton: Locator
  readonly progressbar: Locator

  // 점수판 토글 버튼
  readonly scoreboardToggleButton: Locator

  // 메인 콘텐츠
  readonly questionHeading: Locator
  readonly questionImage: Locator
  readonly showAnswerButton: Locator

  // 나가기 다이얼로그
  readonly exitDialogConfirmButton: Locator
  readonly exitDialogCancelButton: Locator

  constructor(page: Page) {
    this.page = page

    // 헤더
    this.homeLogoImage = page.getByAltText("홈 로고")
    this.prevQuestionButton = page.getByRole("button", { name: "이전 문제" })
    this.nextQuestionButton = page.getByRole("button", { name: "다음 문제" })
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
    this.showAnswerButton = page.getByRole("button", { name: "정답 보기" })

    // 나가기 다이얼로그 버튼
    this.exitDialogConfirmButton = page.getByRole("button", { name: "네" })
    this.exitDialogCancelButton = page.getByRole("button", { name: "아니요" })
  }

  async goto(gameId: string = "1", round?: number): Promise<void> {
    const search = round ? `?q=${round}` : ""
    await this.page.goto(`game/${gameId}/play${search}`)
    await this.page.waitForLoadState("networkidle")
  }

  async clickHomeLogo(): Promise<void> {
    await this.homeLogoImage.click()
  }

  async goToPrevQuestion(): Promise<void> {
    await this.prevQuestionButton.click()
  }

  async goToNextQuestion(): Promise<void> {
    await this.nextQuestionButton.click()
  }

  async clickExitIcon(): Promise<void> {
    await this.exitIconButton.click()
  }

  async getProgressValue(): Promise<number | null> {
    const value = await this.progressbar.getAttribute("aria-valuenow")
    return value ? Number(value) : null
  }

  async toggleScoreboard(): Promise<void> {
    await this.scoreboardToggleButton.click()
  }

  // 팀 관련 접근성 셀렉터 기반
  teamCard(teamName: string): Locator {
    return this.page.getByRole("group", { name: `${teamName} 점수 카드` })
  }

  teamScoreLabel(teamName: string): Locator {
    return this.page.getByLabel(`${teamName} 현재 점수`)
  }

  teamDecreaseButton(teamName: string): Locator {
    return this.page.getByRole("button", { name: `${teamName} 점수 감소` })
  }

  teamIncreaseButton(teamName: string): Locator {
    return this.page.getByRole("button", { name: `${teamName} 점수 증가` })
  }

  async increaseScore(teamName: string, times: number = 1): Promise<void> {
    const inc = this.teamIncreaseButton(teamName)
    for (let i = 0; i < times; i++) {
      await inc.click()
    }
  }

  async decreaseScore(teamName: string, times: number = 1): Promise<void> {
    const dec = this.teamDecreaseButton(teamName)
    for (let i = 0; i < times; i++) {
      await dec.click()
    }
  }

  async expectTeamScore(teamName: string, expectedText: string): Promise<void> {
    await expect(this.teamScoreLabel(teamName)).toHaveText(expectedText)
  }

  async getQuestionText(): Promise<string> {
    return (await this.questionHeading.textContent())?.trim() ?? ""
  }

  async isQuestionImageVisible(): Promise<boolean> {
    return await this.questionImage.isVisible()
  }

  async showAnswerAndGetText(): Promise<string> {
    await this.showAnswerButton.click()
    const answerButton = this.page
      .getByRole("button")
      .filter({ hasNotText: "정답 보기" })
      .first()
    await expect(this.showAnswerButton).not.toBeVisible()
    const answerText = (await answerButton.textContent())?.trim() ?? ""
    return answerText
  }

  async hideAnswer(): Promise<void> {
    const answerButton = this.page
      .getByRole("button")
      .filter({ hasNotText: "정답 보기" })
      .first()
    await answerButton.click()
    await expect(this.showAnswerButton).toBeVisible()
  }

  async confirmExit(): Promise<void> {
    await this.exitDialogConfirmButton.click()
  }

  async cancelExit(): Promise<void> {
    await this.exitDialogCancelButton.click()
  }
}
