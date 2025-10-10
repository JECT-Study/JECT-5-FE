import { type Locator, type Page } from "@playwright/test"

export class HomePOM {
  readonly page: Page

  // 네비게이션 영역 (비로그인 상태)
  readonly homeLogoImage: Locator
  readonly themeToggleButton: Locator
  readonly kakaoLoginButton: Locator

  // 네비게이션 영역 (로그인 상태)
  readonly myGamesButton: Locator
  readonly createGameButton: Locator
  readonly userAvatar: Locator
  readonly userDropdownMenu: Locator
  readonly logoutButton: Locator

  // 히어로 섹션
  readonly heroTitle: Locator

  // 게임 섹션
  readonly gameSectionTitle: Locator
  readonly viewMoreGamesButton: Locator
  readonly gameSectionCard: Locator
  readonly gameSectionCards: Locator

  // 미리보기 팝업
  readonly gamePreview: Locator
  readonly gamePreviewCloseButton: Locator
  readonly gamePreviewStartButton: Locator
  readonly gamePreviewGameTitle: Locator
  readonly gamePreviewCreatorName: Locator
  readonly gamePreviewQuestionCount: Locator
  readonly gamePreviewQuestions: Locator

  constructor(page: Page) {
    this.page = page

    // 네비게이션 영역 (비로그인 상태)
    this.homeLogoImage = page.getByAltText("홈 로고")
    this.themeToggleButton = page.getByTestId("theme-toggle-button")
    this.kakaoLoginButton = page.getByRole("button", {
      name: "간편로그인해서 게임 만들기",
    })

    // 네비게이션 영역 (로그인 상태)
    this.myGamesButton = page.getByRole("button", { name: "내 게임" })
    this.createGameButton = page.getByRole("button", {
      name: "게임 만들기",
      exact: true,
    })
    this.userAvatar = page.getByAltText("사용자 프로필 사진")
    this.userDropdownMenu = page.getByRole("menu")
    this.logoutButton = page.getByRole("menuitem", { name: "로그아웃" })

    // 히어로 섹션
    this.heroTitle = page.getByRole("heading", { level: 1 })

    // 게임 섹션
    this.gameSectionTitle = page.getByRole("heading", { level: 2 })
    this.viewMoreGamesButton = page.getByRole("button", {
      name: "게임 더 보기",
    })
    this.gameSectionCard = page.getByRole("group", { name: "게임 카드" })
    this.gameSectionCards = page.getByTestId("game-section-cards")

    // 미리보기 팝업
    this.gamePreview = page.getByRole("dialog")
    this.gamePreviewStartButton = page.getByRole("button", {
      name: "게임 시작",
    })
    this.gamePreviewCloseButton = page.getByRole("button", {
      name: "게임 미리보기 닫기",
    })
    this.gamePreviewQuestions = page.getByTestId("game-preview-questions")
    this.gamePreviewGameTitle = page.getByTestId("game-preview-game-title")
    this.gamePreviewCreatorName = page.getByTestId("game-preview-creator-name")
    this.gamePreviewQuestionCount = page.getByTestId(
      "game-preview-question-count",
    )
  }

  async clickHomeLogo() {
    await this.homeLogoImage.click()
  }

  async clickThemeToggle() {
    await this.themeToggleButton.click()
  }

  async clickKakaoLoginButton() {
    await this.kakaoLoginButton.click()
  }

  async clickMyGamesButton() {
    await this.myGamesButton.click()
  }

  async clickCreateGameButton() {
    await this.createGameButton.click()
  }

  async clickUserAvatar() {
    await this.userAvatar.click()
  }

  async clickLogoutButton() {
    await this.logoutButton.click()
  }

  async clickViewMoreGamesButton() {
    await this.viewMoreGamesButton.click()
  }

  async clickThemeToggleButton() {
    await this.themeToggleButton.click()
  }

  async clickGameSectionCard() {
    await this.gameSectionCard.first().click()
  }

  async clickGamePreviewCloseButton() {
    await this.gamePreviewCloseButton.click()
  }

  async clickGamePreviewStartButton() {
    await this.gamePreviewStartButton.click()
  }
}
