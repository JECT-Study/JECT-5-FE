import { expect, Locator, Page } from "@playwright/test"

export class LibraryPage {
  readonly page: Page
  readonly myGamesButton: Locator
  readonly createGameButton: Locator
  readonly homeButton: Locator
  readonly avatarButton: Locator
  readonly logoutButton: Locator
  readonly kakaoLoginButton: Locator
  readonly searchInput: Locator
  readonly gameCards: Locator
  readonly gamePreviewDialog: Locator
  readonly gameStartButton: Locator
  readonly closeButton: Locator
  readonly sortButtons: Locator

  constructor(page: Page) {
    this.page = page

    this.myGamesButton = page.getByRole("button", { name: "내 게임" })
    this.createGameButton = page
      .getByRole("navigation")
      .getByRole("button", { name: "게임 만들기" })
    this.homeButton = page.getByRole("button", { name: "홈" })
    this.avatarButton = page.getByRole("button", { name: /사용자 메뉴/ })
    this.logoutButton = page.getByRole("button", { name: "로그아웃" })
    this.kakaoLoginButton = page.getByRole("button", {
      name: "카카오 간편 로그인",
    })

    // 검색 관련
    this.searchInput = page.getByRole("textbox", { name: "게임 검색" })

    // 게임 카드 관련
    this.gameCards = page.getByRole("article", { name: /게임 카드:/ })

    // 게임 미리보기 팝업 관련
    this.gamePreviewDialog = page.getByTestId("game-preview-dialog")
    this.gameStartButton = page.getByTestId("game-start-button")
    this.closeButton = page.getByRole("button", { name: "팝업 닫기" })

    // 정렬 버튼들
    this.sortButtons = page.getByRole("button", { name: /정렬/ })
  }

  // 네비게이션 메서드
  async goto() {
    await this.page.goto("/games")
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

  async clickHome() {
    await expect(this.homeButton).toBeEnabled()
    await this.homeButton.click()
  }

  async clickAvatar() {
    await expect(this.avatarButton).toBeEnabled()
    await this.avatarButton.click()
  }

  async clickLogout() {
    await expect(this.logoutButton).toBeEnabled()
    await this.logoutButton.click()
  }

  async clickKakaoLogin() {
    await expect(this.kakaoLoginButton).toBeEnabled()
    await this.kakaoLoginButton.click()
  }

  // 검색 관련 메서드
  async searchGame(searchTerm: string) {
    await expect(this.searchInput).toBeVisible()
    await this.searchInput.fill(searchTerm)
    await this.searchInput.press("Enter")
  }

  async clearSearch() {
    await this.searchInput.clear()
  }

  // 게임 카드 관련 메서드
  async getGameCardCount(): Promise<number> {
    return await this.gameCards.count()
  }

  async clickGameCard(index: number = 0) {
    const gameCard = this.gameCards.nth(index)
    await expect(gameCard).toBeVisible()
    await gameCard.click()
  }

  async clickGameCardByTitle(title: string) {
    const gameCard = this.page.getByRole("article", {
      name: `게임 카드: ${title}`,
    })
    await expect(gameCard).toBeVisible()
    await gameCard.click()
  }

  // 게임 카드 정보 조회 메서드
  async getGameTitle(index: number = 0): Promise<string> {
    const gameCard = this.gameCards.nth(index)
    const title = gameCard.getByRole("heading", { level: 3 })
    return (await title.textContent()) || ""
  }

  async getQuestionCount(index: number = 0): Promise<string> {
    const gameCard = this.gameCards.nth(index)
    const badge = gameCard.getByRole("status")
    return (await badge.textContent()) || ""
  }

  async getCreatorName(index: number = 0): Promise<string> {
    const gameCard = this.gameCards.nth(index)
    // 제작자 이름을 표시하는 요소의 셀렉터 (실제 구현에 맞게 수정 필요)
    const creator = gameCard.locator('[data-testid="creator-name"]')
    return (await creator.textContent()) || ""
  }

  // 게임 미리보기 팝업 관련 메서드
  async expectGamePreviewDialogVisible() {
    await expect(this.gamePreviewDialog).toBeVisible()
  }

  async expectGamePreviewDialogHidden() {
    await expect(this.gamePreviewDialog).not.toBeVisible()
  }

  async clickGameStart() {
    await expect(this.gameStartButton).toBeVisible()
    await this.gameStartButton.click()
  }

  async closeGamePreviewByClickingOutside() {
    // 팝업 외부 클릭 (모달 오버레이 클릭)
    await this.page.click("body", { position: { x: 0, y: 0 } })
  }

  // 게임 미리보기 팝업 정보 조회 메서드 (접근성 기반 셀렉터 사용)
  async getGamePreviewTitle(): Promise<string> {
    // aria-labelledby를 통해 연결된 제목 요소 찾기
    const title = this.gamePreviewDialog.locator("#game-preview-title")
    return (await title.textContent()) || ""
  }

  async getGamePreviewCreator(): Promise<string> {
    // 제작자 이름은 aria-label을 통해 찾기
    const creator = this.gamePreviewDialog.locator('[aria-label^="제작자:"]')
    return (await creator.textContent()) || ""
  }

  async getGamePreviewQuestionCountText(): Promise<string> {
    // 문제 수 텍스트는 aria-label을 통해 찾기
    const questionCount = this.gamePreviewDialog.locator('[aria-label*="문제"]')
    return (await questionCount.textContent()) || ""
  }

  async getGamePreviewQuestionCount(): Promise<number> {
    // 문제 목록에서 카드 개수 확인
    const questionCards = this.gamePreviewDialog.locator('[role="listitem"]')
    return await questionCards.count()
  }

  async expectGamePreviewImageVisible() {
    // 게임 내 문제 이미지가 표시되는지 확인
    const images = this.gamePreviewDialog.locator('img[alt*="문제 이미지"]')
    await expect(images.first()).toBeVisible()
  }

  // 상태 확인 메서드
  async expectGameCardsVisible() {
    await expect(this.gameCards.first()).toBeVisible()
  }

  async expectSearchResultsVisible() {
    await expect(this.gameCards.first()).toBeVisible()
  }

  async expectNoSearchResults() {
    await expect(this.gameCards.first()).not.toBeVisible()
  }

  async expectGameCardCount(expectedCount: number) {
    const actualCount = await this.getGameCardCount()
    expect(actualCount).toBe(expectedCount)
  }

  // 복합 액션 메서드 (테스트 시나리오 기반)
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

  async searchAndVerifyGame(searchTerm: string, expectedTitle: string) {
    await this.searchGame(searchTerm)
    await this.expectSearchResultsVisible()
    const firstGameTitle = await this.getGameTitle(0)
    expect(firstGameTitle).toContain(expectedTitle)
  }

  async searchAndVerifyNoResults(searchTerm: string) {
    await this.searchGame(searchTerm)
    await this.expectNoSearchResults()
  }

  async logout() {
    await this.clickAvatar()
    await this.clickLogout()
  }

  // URL 확인 메서드
  async expectToBeOnLibrary() {
    await expect(this.page).toHaveURL(/\/games/)
  }

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

  async expectToBeOnHome() {
    await expect(this.page).toHaveURL("/")
  }
}
