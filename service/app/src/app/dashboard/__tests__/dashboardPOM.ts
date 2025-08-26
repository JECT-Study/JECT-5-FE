import { expect, Locator, Page } from "@playwright/test"

export class DashboardPage {
  readonly page: Page
  readonly myGamesButton: Locator
  readonly createGameButton: Locator
  readonly avatarButton: Locator
  readonly logoutButton: Locator
  readonly gameCards: Locator
  readonly myGameCards: Locator
  readonly gameOptionsButtons: Locator
  readonly gameOptionsMenus: Locator
  readonly gamePreviewDialog: Locator
  readonly gameStartButton: Locator

  constructor(page: Page) {
    this.page = page

    // 네비게이션 버튼들
    this.myGamesButton = page.getByRole("button", { name: "내 게임" })
    this.createGameButton = page
      .getByRole("navigation")
      .getByRole("button", { name: "게임 만들기" })
    this.avatarButton = page.getByRole("button", { name: /사용자 메뉴/ })
    this.logoutButton = page.getByRole("button", { name: "로그아웃" })

    // 게임 카드 관련
    this.gameCards = page.getByRole("article", { name: /게임 카드:/ })
    this.myGameCards = page.getByRole("article", { name: /내 게임 카드:/ })
    this.gameOptionsButtons = page.getByRole("button", {
      name: "게임 옵션 메뉴 열기",
    })
    this.gameOptionsMenus = page.getByRole("menu")

    // 게임 미리보기 팝업 관련
    this.gamePreviewDialog = page.getByTestId("game-preview-dialog")
    this.gameStartButton = page.getByTestId("game-start-button")
  }

  // 네비게이션 메서드
  async goto() {
    await this.page.goto("/dashboard")
    await this.page.waitForLoadState("networkidle")
  }

  // 네비게이션 액션 메서드
  async clickMyGames() {
    await expect(this.myGamesButton).toBeEnabled()
    await this.myGamesButton.click()
  }

  async clickCreateGame() {
    await expect(this.createGameButton).toBeEnabled()
    await this.createGameButton.click()
  }

  async clickAvatar() {
    await expect(this.avatarButton).toBeEnabled()
    await this.avatarButton.click()
  }

  async clickLogout() {
    await expect(this.logoutButton).toBeEnabled()
    await this.logoutButton.click()
  }

  // 게임 카드 관련 메서드
  async getGameCardCount(): Promise<number> {
    return await this.myGameCards.count()
  }

  async clickGameCard(index: number = 0) {
    const gameCard = this.myGameCards.nth(index)
    await expect(gameCard).toBeVisible()
    await gameCard.click()
  }

  async clickGameOptions(index: number = 0) {
    const optionsButton = this.gameOptionsButtons.nth(index)
    await expect(optionsButton).toBeVisible()
    await optionsButton.click()
    // 메뉴가 열렸는지 확인
    await expect(this.gameOptionsMenus).toBeVisible()
  }

  // 게임 옵션 메뉴 액션 메서드
  async clickGameEdit() {
    await this.page.getByRole("menuitem", { name: "게임 수정" }).click()
  }

  async clickGameShare() {
    await this.page.getByRole("menuitem", { name: "게임 공유" }).click()
  }

  async clickGameUnshare() {
    await this.page.getByRole("menuitem", { name: "게임 공유 취소" }).click()
  }

  async clickGameDelete() {
    await this.page.getByRole("menuitem", { name: "게임 삭제" }).click()
  }

  // 게임 카드 정보 조회 메서드
  async getGameTitle(index: number = 0): Promise<string> {
    const gameCard = this.myGameCards.nth(index)
    const title = gameCard.getByRole("heading", { level: 3 })
    return (await title.textContent()) || ""
  }

  async getQuestionCount(index: number = 0): Promise<string> {
    const gameCard = this.myGameCards.nth(index)
    const badge = gameCard.getByRole("status")
    return (await badge.textContent()) || ""
  }

  async isGameShared(index: number = 0): Promise<boolean> {
    const gameCard = this.myGameCards.nth(index)
    const sharedBadge = gameCard.getByRole("status", { name: "공유된 게임" })
    return await sharedBadge.isVisible()
  }

  // 확인 다이얼로그 관련 메서드
  async confirmDialog() {
    const confirmButton = this.page.getByRole("button", { name: "네" })
    await expect(confirmButton).toBeVisible()
    await confirmButton.click()
  }

  async cancelDialog() {
    const cancelButton = this.page.getByRole("button", { name: "아니오" })
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()
  }

  async closeDialogByClickingOutside() {
    // 다이얼로그 외부 클릭 (모달 오버레이 클릭)
    await this.page.click("body", { position: { x: 0, y: 0 } })
  }

  // 다이얼로그 확인 메서드
  async expectShareDialogVisible() {
    await expect(
      this.page.getByRole("dialog", { name: /게임 공유/ }),
    ).toBeVisible()
  }

  async expectUnshareDialogVisible() {
    await expect(
      this.page.getByRole("dialog", { name: /게임 공유 취소/ }),
    ).toBeVisible()
  }

  async expectDeleteDialogVisible() {
    await expect(
      this.page.getByRole("dialog", { name: /게임 삭제/ }),
    ).toBeVisible()
  }

  // 상태 확인 메서드
  async expectGameCardsVisible() {
    await expect(this.myGameCards.first()).toBeVisible()
  }

  async expectGameOptionsMenuVisible() {
    await expect(this.gameOptionsMenus).toBeVisible()
  }

  async expectGameOptionsMenuHidden() {
    await expect(this.gameOptionsMenus).not.toBeVisible()
  }

  async expectGameCardCount(expectedCount: number) {
    const actualCount = await this.getGameCardCount()
    expect(actualCount).toBe(expectedCount)
  }

  // 복합 액션 메서드 (테스트 시나리오 기반)
  async shareGame(index: number = 0) {
    await this.clickGameOptions(index)
    await this.clickGameShare()
    await this.expectShareDialogVisible()
    await this.confirmDialog()
  }

  async unshareGame(index: number = 0) {
    await this.clickGameOptions(index)
    await this.clickGameUnshare()
    await this.expectUnshareDialogVisible()
    await this.confirmDialog()
  }

  async deleteGame(index: number = 0) {
    await this.clickGameOptions(index)
    await this.clickGameDelete()
    await this.expectDeleteDialogVisible()
    await this.confirmDialog()
  }

  async editGame(index: number = 0) {
    await this.clickGameOptions(index)
    await this.clickGameEdit()
  }

  // 로그아웃 플로우
  async logout() {
    await this.clickAvatar()
    await this.clickLogout()
  }

  // 게임 미리보기 관련 메서드
  async expectGamePreviewDialogVisible() {
    await expect(this.gamePreviewDialog).toBeVisible()
  }

  async expectGamePreviewDialogHidden() {
    await expect(this.gamePreviewDialog).not.toBeVisible()
  }

  async clickGameStart() {
    await expect(this.gameStartButton).toBeEnabled()
    await this.gameStartButton.click()
  }

  async closeGamePreviewByClickingOutside() {
    // 팝업 외부 클릭으로 닫기
    await this.page.click("body", { position: { x: 0, y: 0 } })
  }

  async openGamePreview(index: number = 0) {
    await this.clickGameCard(index)
    await this.expectGamePreviewDialogVisible()
  }

  async startGameFromPreview(index: number = 0) {
    await this.openGamePreview(index)
    await this.clickGameStart()
  }

  async closeGamePreview() {
    // 팝업 외부 클릭으로 닫기
    await this.closeGamePreviewByClickingOutside()
  }

  // URL 확인 메서드
  async expectToBeOnDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard/)
  }

  async expectToBeOnCreateGame() {
    await expect(this.page).toHaveURL(/\/create/)
  }

  async expectToBeOnGameSetup() {
    await this.page.waitForURL(/\/game\/.*(\/setup)?/, { timeout: 10000 })
    await expect(this.page).toHaveURL(/\/game\/.*(\/setup)?/)
  }
}
