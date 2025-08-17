import { expect, type Locator, type Page, test } from "@playwright/test"

/**
 * 홈페이지 E2E 테스트
 *
 * Figma: "101. 홈 화면 - 비로그인", "102. 홈 화면 - 로그인", "103. 홈 화면 - 게임 미리보기" 기준
 * 테스트 시나리오:
 * - 홈 화면 진입 시 기본 UI 요소 표시 확인
 * - 네비게이션 요소 확인
 * - 게임 섹션 요소 확인
 * - 기본 버튼 동작 확인
 * - 로그인/비로그인 상태별 UI 및 동작 확인
 * - 테마 토글 기능 확인
 */

// Page Object Model: 홈페이지 클래스
class HomePage {
  readonly page: Page
  readonly logo: Locator
  readonly kakaoLoginButton: Locator
  readonly viewMoreGamesButton: Locator
  readonly gameSectionTitle: Locator
  readonly gameCards: Locator
  readonly heroTitle: Locator
  readonly themeToggleButton: Locator

  // 로그인 상태에서 추가되는 요소들
  readonly myGamesButton: Locator
  readonly createGameButton: Locator
  readonly avatarButton: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page

    // 공통 네비게이션 요소들
    this.logo = page.getByRole("img", { name: "홈 로고" })
    this.kakaoLoginButton = page.getByRole("button", {
      name: /간편로그인해서 게임 만들기/,
    })
    this.themeToggleButton = page.getByRole("button", {
      name: /(라이트|다크) 모드 전환/,
    })

    // 게임 섹션 요소들
    this.viewMoreGamesButton = page.getByRole("button", {
      name: "게임 더 보기",
    })
    this.gameSectionTitle = page.getByText("어떤 게임으로 시작해 볼까요?")
    this.gameCards = page.locator('[data-testid="game-card"]')

    // 히어로 섹션
    this.heroTitle = page.locator('[data-testid="hero-title"]')

    // 로그인 상태에서 추가되는 요소들
    this.myGamesButton = page.getByRole("button", { name: "내 게임" })
    this.createGameButton = page
      .getByRole("button", { name: "게임 만들기" })
      .filter({ hasText: /^게임 만들기$/ })
    this.avatarButton = page.getByRole("button", { name: "사용자 메뉴 열기" })
    this.logoutButton = page.getByRole("menuitem", { name: "로그아웃" })
  }

  // 페이지 이동 메서드
  async goto() {
    await this.page.goto("http://localhost:3000")
    await this.page.waitForLoadState("networkidle")
  }

  // 공통 네비게이션 액션 메서드들
  async clickLogo() {
    await this.logo.click()
  }

  async clickKakaoLogin() {
    await this.kakaoLoginButton.click()
  }

  async clickThemeToggle() {
    await this.themeToggleButton.click()
  }

  async clickViewMoreGames() {
    await this.viewMoreGamesButton.click()
  }

  // 로그인 상태에서 추가되는 액션 메서드들
  async clickMyGames() {
    await this.myGamesButton.click()
  }

  async clickCreateGame() {
    await this.createGameButton.click()
  }

  async clickAvatar() {
    await this.avatarButton.click()
  }

  async clickLogout() {
    await this.logoutButton.click()
  }

  // 검증 메서드들
  async expectToBeOnHomePage() {
    await this.page.waitForURL("http://localhost:3000/", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/")
  }

  async expectToBeOnGamesPage() {
    await this.page.waitForURL("http://localhost:3000/games", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/games")
  }

  async expectToBeOnDashboardPage() {
    await this.page.waitForURL("http://localhost:3000/dashboard", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/dashboard")
  }

  async expectToBeOnCreatePage() {
    await this.page.waitForURL("http://localhost:3000/create", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/create")
  }

  async expectDarkModeToBeActive() {
    await expect(this.page.locator("html")).toHaveClass(/dark/)
  }

  async expectLightModeToBeActive() {
    await expect(this.page.locator("html")).not.toHaveClass(/dark/)
  }

  // 로그인 상태 확인 메서드들
  async expectLoggedInState() {
    await expect(this.myGamesButton).toBeVisible()
    await expect(this.createGameButton).toBeVisible()
    await expect(this.avatarButton).toBeVisible()
    await expect(this.kakaoLoginButton).not.toBeVisible()
  }

  async expectLoggedOutState() {
    await expect(this.kakaoLoginButton).toBeVisible()
    await expect(this.myGamesButton).not.toBeVisible()
    await expect(this.createGameButton).not.toBeVisible()
    await expect(this.avatarButton).not.toBeVisible()
  }

  // 공통 UI 요소 확인 메서드
  async expectCommonUIElements() {
    // 공통 네비게이션 요소들
    await expect(this.logo).toBeVisible()
    await expect(this.themeToggleButton).toBeVisible()

    // 히어로 섹션
    await expect(this.heroTitle).toBeVisible()

    // 게임 섹션
    await expect(this.gameSectionTitle).toBeVisible()
    await expect(this.viewMoreGamesButton).toBeVisible()

    // 게임 카드들 확인
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount > 0) {
      await expect(this.gameCards.first()).toBeVisible()
    } else {
      // 게임이 없는 경우에도 게임 섹션은 표시되어야 함
      await expect(this.gameSectionTitle).toBeVisible()
    }
  }

  // 게임 카드 관련 헬퍼 메서드들
  async expectGameCardInfo() {
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount > 0) {
      const firstGameCard = this.gameCards.first()
      await expect(firstGameCard).toBeVisible()

      // 게임 제목이 표시되어야 한다
      await expect(
        firstGameCard.locator('[data-testid="game-title"]'),
      ).toBeVisible()

      // 문제 개수가 표시되어야 한다
      await expect(
        firstGameCard.locator('[data-testid="question-count"]'),
      ).toBeVisible()
    } else {
      // 게임이 없는 경우 게임 섹션 제목은 표시되어야 함
      await expect(this.gameSectionTitle).toBeVisible()
    }
  }

  async openGamePreview() {
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount === 0) {
      test.skip()
      return null
    }

    await this.gameCards.first().click()
    const gamePreviewDialog = this.page.getByRole("dialog")
    await expect(gamePreviewDialog).toBeVisible()
    return gamePreviewDialog
  }

  async expectGamePreviewInfo(gamePreviewDialog: Locator) {
    // 게임 제목
    await expect(
      gamePreviewDialog.getByRole("heading", { level: 2 }),
    ).toBeVisible()
    // 문제 개수
    await expect(gamePreviewDialog.getByText(/총.*문제/)).toBeVisible()
    // 게임 시작 버튼
    await expect(
      gamePreviewDialog.getByRole("button", { name: "게임 시작" }),
    ).toBeVisible()
  }

  async startGameFromPreview(
    gamePreviewDialog: Locator,
  ) {
    const startButton = gamePreviewDialog.getByRole("button", {
      name: "게임 시작",
    })
    await startButton.click()

    await this.page.waitForURL(/\/game\/\d+(\/setup)?/, { timeout: 10000 })
    await expect(this.page).toHaveURL(/\/game\/\d+(\/setup)?/)
  }
}

// 비로그인 상태 테스트
test.describe("홈페이지 E2E 테스트 - 비로그인 상태", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await page.addInitScript(() => {
      localStorage.removeItem("auth_user")
    })
    await homePage.goto()
  })

  test.describe("기본 UI 요소 표시 확인", () => {
    test("홈 화면 진입 시 공통 UI 요소들이 표시되어야 한다", async () => {
      await homePage.expectCommonUIElements()
    })

    test("게임 카드가 있는 경우 게임명과 문제 개수가 표시되어야 한다", async () => {
      await homePage.expectGameCardInfo()
    })
  })

  test.describe("네비게이션 버튼 동작 확인", () => {
    test("홈 로고 클릭 시 현재 화면이 새로고침되어야 한다", async () => {
      const initialUrl = homePage.page.url()
      await homePage.clickLogo()
      await expect(homePage.page).toHaveURL(initialUrl)
    })

    test("게임 더 보기 버튼 클릭 시 라이브러리 페이지로 이동해야 한다", async () => {
      await homePage.clickViewMoreGames()
      await homePage.expectToBeOnGamesPage()
    })
  })

  test.describe("테마 토글 기능 확인", () => {
    test("테마 토글 버튼이 표시되어야 한다", async () => {
      await expect(homePage.themeToggleButton).toBeVisible()
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "다크 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "false",
      )
    })

    test("초기 상태는 라이트 모드여야 한다", async () => {
      await homePage.expectLightModeToBeActive()
    })

    test("테마 토글 버튼 클릭 시 다크 모드로 전환되어야 한다", async () => {
      await homePage.clickThemeToggle()
      await homePage.expectDarkModeToBeActive()

      // 다크 모드에서 버튼의 접근성 속성 확인
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "라이트 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "true",
      )
    })

    test("다크 모드에서 테마 토글 버튼 클릭 시 라이트 모드로 전환되어야 한다", async () => {
      // 먼저 다크 모드로 전환
      await homePage.clickThemeToggle()
      await homePage.expectDarkModeToBeActive()

      // 다시 라이트 모드로 전환
      await homePage.clickThemeToggle()
      await homePage.expectLightModeToBeActive()

      // 라이트 모드에서 버튼의 접근성 속성 확인
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "다크 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "false",
      )
    })
  })

  test.describe("로그인 관련 UI 확인", () => {
    test("비로그인 상태에서는 카카오 로그인 버튼이 표시되어야 한다", async () => {
      await expect(homePage.kakaoLoginButton).toBeVisible()
      const kakaoLogo =
        homePage.kakaoLoginButton.locator('img[alt="카카오 로고"]')
      await expect(kakaoLogo).toBeVisible()
    })
  })

  test.describe("게임 카드 클릭 동작", () => {
    test("게임 카드 클릭 시 게임 미리보기 팝업이 표시되어야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
    })

    test("게임 미리보기 팝업에 게임 정보가 표시되어야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
      await homePage.expectGamePreviewInfo(gamePreviewDialog)
    })

    test("게임 미리보기 팝업 닫기 버튼 클릭 시 팝업이 닫혀야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return

      const closeButton = gamePreviewDialog.getByRole("button", {
        name: "팝업 닫기",
      })
      await closeButton.click()
      await expect(gamePreviewDialog).not.toBeVisible()
    })

    test("게임 미리보기에서 게임 시작 버튼 클릭 시 게임 진행 화면으로 이동해야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
      await homePage.startGameFromPreview(gamePreviewDialog)
    })
  })
})

// 로그인 상태 테스트
test.describe("홈페이지 E2E 테스트 - 로그인 상태", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)

    await page.addInitScript(() => {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: "test-user-id",
          nickname: "테스트 사용자",
          profileImageUrl: "/avatar.svg",
          email: "test@example.com",
        }),
      )
      
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })

    await homePage.goto()

    await page.waitForTimeout(1000)
  })

  test.describe("로그인 상태 UI 요소 표시 확인", () => {
    test("로그인 상태에서 홈 화면 진입 시 로그인 상태 UI 요소들이 표시되어야 한다", async () => {
      await homePage.expectLoggedInState()
      await homePage.expectCommonUIElements()
    })

    test("로그인 상태에서 사용자 아바타가 표시되어야 한다", async () => {
      await expect(homePage.avatarButton).toBeVisible()
      const avatarImage =
        homePage.avatarButton.locator('img[alt="사용자 아바타"]')
      await expect(avatarImage).toBeVisible()
    })

    test("로그인 상태에서 내 게임 버튼과 게임 만들기 버튼이 표시되어야 한다", async () => {
      await expect(homePage.myGamesButton).toBeVisible()
      await expect(homePage.myGamesButton).toHaveText("내 게임")

      await expect(homePage.createGameButton).toBeVisible()
      await expect(homePage.createGameButton).toHaveText("게임 만들기")

      const addIcon = homePage.createGameButton.locator("svg")
      await expect(addIcon).toBeVisible()
    })
  })

  test.describe("로그인 상태 네비게이션 버튼 동작 확인", () => {
    test("홈 로고 클릭 시 현재 화면이 새로고침되어야 한다", async () => {
      const initialUrl = homePage.page.url()
      await homePage.clickLogo()
      await expect(homePage.page).toHaveURL(initialUrl)
    })

    test("게임 더 보기 버튼 클릭 시 라이브러리 페이지로 이동해야 한다", async () => {
      await homePage.clickViewMoreGames()
      await homePage.expectToBeOnGamesPage()
    })

    test("내 게임 버튼 클릭 시 대시보드 페이지로 이동해야 한다", async () => {
      await homePage.clickMyGames()
      await homePage.expectToBeOnDashboardPage()
    })

    test("게임 만들기 버튼 클릭 시 게임 만들기 페이지로 이동해야 한다", async () => {
      await homePage.clickCreateGame()
      await homePage.expectToBeOnCreatePage()
    })

    test("아바타 버튼 클릭 시 로그아웃 버튼이 표시되어야 한다", async () => {
      await homePage.clickAvatar()
      await expect(homePage.logoutButton).toBeVisible()
    })

    test("로그아웃 버튼 클릭 시 로그아웃되어야 한다", async () => {
      await homePage.clickAvatar()
      await expect(homePage.logoutButton).toBeVisible()

      await homePage.clickLogout()
      await homePage.expectLoggedOutState()
    })
  })

  test.describe("로그인 상태 테마 토글 기능 확인", () => {
    test("로그인 상태에서도 테마 토글 버튼이 표시되어야 한다", async () => {
      await expect(homePage.themeToggleButton).toBeVisible()
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "다크 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "false",
      )
    })

    test("로그인 상태에서 테마 토글 버튼 클릭 시 다크 모드로 전환되어야 한다", async () => {
      await homePage.clickThemeToggle()
      await homePage.expectDarkModeToBeActive()

      // 다크 모드에서 버튼의 접근성 속성 확인
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "라이트 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "true",
      )
    })

    test("로그인 상태에서 다크 모드에서 라이트 모드로 전환되어야 한다", async () => {
      // 먼저 다크 모드로 전환
      await homePage.clickThemeToggle()
      await homePage.expectDarkModeToBeActive()

      // 다시 라이트 모드로 전환
      await homePage.clickThemeToggle()
      await homePage.expectLightModeToBeActive()

      // 라이트 모드에서 버튼의 접근성 속성 확인
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-label",
        "다크 모드 전환",
      )
      await expect(homePage.themeToggleButton).toHaveAttribute(
        "aria-pressed",
        "false",
      )
    })
  })

  test.describe("로그인 상태 게임 카드 클릭 동작", () => {
    test("게임 카드 클릭 시 게임 미리보기 팝업이 표시되어야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
    })

    test("게임 미리보기 팝업에 게임 정보가 표시되어야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
      await homePage.expectGamePreviewInfo(gamePreviewDialog)
    })

    test("게임 미리보기 팝업 닫기 버튼 클릭 시 팝업이 닫혀야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return

      const closeButton = gamePreviewDialog.getByRole("button", {
        name: "팝업 닫기",
      })
      await closeButton.click()
      await expect(gamePreviewDialog).not.toBeVisible()
    })

    test("게임 미리보기에서 게임 시작 버튼 클릭 시 게임 진행 화면으로 이동해야 한다", async () => {
      const gamePreviewDialog = await homePage.openGamePreview()
      if (!gamePreviewDialog) return
      await homePage.startGameFromPreview(gamePreviewDialog)
    })
  })
})
