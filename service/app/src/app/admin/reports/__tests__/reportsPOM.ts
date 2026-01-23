import { expect, type Locator, type Page } from "@playwright/test"

export class ReportsPOM {
  readonly page: Page

  // 네비게이션 영역
  readonly reportsTab: Locator
  readonly gamesTab: Locator
  readonly usersTab: Locator

  // 메인 콘텐츠 영역
  readonly reportsTable: Locator
  readonly reportedGameRows: Locator

  // 팝업
  readonly reportDetail: Locator
  readonly reportedGameTitle: Locator
  readonly reportDetailCloseButton: Locator
  readonly reportIgnoreButton: Locator
  readonly gameDeleteButton: Locator
  readonly gameQuestionList: Locator
  readonly gameQuestionCount: Locator
  readonly gameReportTable: Locator
  readonly gameCreatorInfo: Locator
  readonly gameReporterInfo: Locator
  readonly reportReasonInfo: Locator
  readonly blockCreatorButton: Locator
  readonly blockReporterButton: Locator
  readonly deletedGameMessage: Locator

  constructor(page: Page) {
    this.page = page

    // 네비게이션 영역
    this.reportsTab = page.getByRole("link", { name: "신고접수" })
    this.gamesTab = page.getByRole("link", { name: "게임관리" })
    this.usersTab = page.getByRole("link", { name: "회원관리" })

    // 메인 콘텐츠 영역
    this.reportsTable = page.getByRole("table", { name: "신고접수 테이블" })
    this.reportedGameRows = this.reportsTable.locator('[tabindex="0"]')

    // 팝업
    this.reportDetail = page.getByRole("dialog")
    this.reportDetailCloseButton = page.getByRole("button", {
      name: "게임 미리보기 닫기",
    })
    this.reportIgnoreButton = page.getByRole("button", { name: "신고 무시" })
    this.gameDeleteButton = page.getByRole("button", { name: "게임 삭제" })
    this.gameQuestionList = page.getByTestId("game-preview-questions")
    this.gameQuestionCount = page.getByTestId("game-preview-question-count")
    this.reportedGameTitle = page.getByTestId("game-preview-game-title")
    this.gameReportTable = page.getByRole("table", {
      name: "게임 신고 정보 테이블",
    })
    this.blockCreatorButton = page.getByRole("button", {
      name: /^제작자.*차단$/,
    })
    this.blockReporterButton = page.getByRole("button", {
      name: /^신고자.*차단$/,
    })
    this.gameCreatorInfo = page.getByRole("cell", {
      name: "제작자 이름과 이메일",
    })
    this.gameReporterInfo = page.getByRole("cell", {
      name: "신고자 이름과 이메일",
    })
    this.reportReasonInfo = page.getByRole("cell", { name: "신고 사유" })
    this.deletedGameMessage = page.getByText("삭제 처리된 게임입니다.")
  }

  async navigateToReports() {
    await this.page.goto("/admin/reports")
  }

  async checkNavigationHighlight() {
    await expect(this.reportsTab).toHaveAttribute("aria-current", "page")
    await expect(this.gamesTab).not.toHaveAttribute("aria-current", "page")
    await expect(this.usersTab).not.toHaveAttribute("aria-current", "page")
  }

  async checkReportedTable() {
    await expect(this.reportsTable).toBeVisible()
  }

  async clickGamesTab() {
    await this.gamesTab.click()
  }

  async clickUsersTab() {
    await this.usersTab.click()
  }

  async checkRowCount() {
    const count = await this.reportedGameRows.count()
    expect(count).toBeLessThanOrEqual(7)
  }

  async checkRowColumns() {
    const headerRow = this.reportsTable.getByRole("row", {
      name: "신고접수 테이블 헤더",
    })
    const headers = headerRow.getByRole("columnheader")
    await expect(headers).toHaveCount(6)

    const headerTexts = await headers.allTextContents()
    expect(headerTexts).toContain("번호")
    expect(headerTexts).toContain("게임명")
    expect(headerTexts).toContain("제작자")
    expect(headerTexts).toContain("신고자")
    expect(headerTexts).toContain("신고일자")
    expect(headerTexts).toContain("처리 여부")
  }

  async clickReportedGameRow(index: number) {
    await this.reportedGameRows.nth(index).click()
  }

  async checkReportDetailPopup() {
    await expect(this.reportDetail).toBeVisible()
  }

  async clickCloseButton() {
    await this.reportDetailCloseButton.click()
  }

  async checkGameInfo() {
    await expect(this.reportedGameTitle).toBeVisible()
    await expect(this.gameQuestionCount).toBeVisible()
    await expect(this.reportReasonInfo).toBeVisible()
  }

  async checkCarousel() {
    await expect(this.gameQuestionList).toBeVisible()
  }

  async checkDeletedGameMessage() {
    await expect(this.deletedGameMessage).toBeVisible()
  }

  async clickIgnoreReport() {
    await this.reportIgnoreButton.click()
  }

  async clickDeleteGame() {
    await this.gameDeleteButton.click()
  }

  async clickBlockCreator() {
    await this.blockCreatorButton.click()
  }

  async clickBlockReporter() {
    await this.blockReporterButton.click()
  }

  async checkButtonDisabled(button: Locator) {
    await expect(button).toBeDisabled()
  }
}
