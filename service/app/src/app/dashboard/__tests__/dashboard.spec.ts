import { expect, type Locator, type Page, test } from "@playwright/test"

/**
 * 대시보드 E2E 테스트
 *
 * Figma: "201. 대시 보드" 기준
 * 테스트 시나리오:
 * - 대시보드 페이지 진입 시 기본 UI 요소 표시 확인
 * - 네비게이션 버튼 동작 확인
 * - 게임 카드 표시 및 기능 확인
 * - 게임 옵션 메뉴 동작 확인
 * - 게임 미리보기 팝업 동작 확인
 * - Alert 팝업 동작 확인
 * - 공유 기능 동작 확인
 */

// Page Object Model: 대시보드 페이지 클래스
class DashboardPage {
  readonly page: Page
  readonly homeButton: Locator
  readonly createGameButton: Locator
  readonly gameCards: Locator
  readonly gameOptionsButtons: Locator
  readonly gamePreviewDialog: Locator
  readonly alertDialog: Locator
  readonly avatarButton: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page

    // 네비게이션 버튼들
    this.homeButton = page.getByRole("button", { name: "홈으로 이동" })
    this.createGameButton = page.getByRole("button", { name: "게임 만들기" }).first()

    // 사용자 메뉴 관련
    this.avatarButton = page.getByRole("button", { name: /테스트 사용자 메뉴 (열기|닫기)/ })
    this.logoutButton = page.getByRole("menuitem", { name: "로그아웃" })

    // 게임 카드 관련
    this.gameCards = page.locator('[data-testid="game-card"]')
    this.gameOptionsButtons = page.getByRole("button", { name: "게임 옵션" })

    // 팝업 관련
    this.gamePreviewDialog = page.getByRole("dialog")
    this.alertDialog = page.getByRole("alertdialog")
  }

  async getFirstSharedGameIndex(): Promise<number | null> {
    const count = await this.gameCards.count()
    for (let i = 0; i < count; i++) {
      if (
        await this.gameCards
          .nth(i)
          .locator('[data-testid="shared-badge"]')
          .isVisible()
      ) {
        return i
      }
    }
    return null
  }

  async getFirstUnsharedGameIndex(): Promise<number | null> {
    const count = await this.gameCards.count()
    for (let i = 0; i < count; i++) {
      if (
        !(await this.gameCards
          .nth(i)
          .locator('[data-testid="shared-badge"]')
          .isVisible())
      ) {
        return i
      }
    }
    return null
  }

  // 페이지 이동 메서드
  async goto() {
    await this.page.goto("http://localhost:3000/dashboard")
    await this.page.waitForLoadState("networkidle")
  }

  // 네비게이션 액션 메서드들
  async clickHomeButton() {
    await this.homeButton.click()
  }

  async clickCreateGameButton() {
    await this.createGameButton.click()
  }

  async clickAvatarButton() {
    await this.avatarButton.click()
  }

  async clickLogoutButton() {
    await this.logoutButton.click()
  }

  // 게임 카드 관련 액션 메서드들
  async clickGameCard(index: number = 0) {
    await this.gameCards.nth(index).click()
  }

  async clickGameOptionsButton(index: number | null = 0) {
    const idx = index ?? 0
    await this.gameOptionsButtons.nth(idx).click()
  }

  async clickGameEditButton() {
    await this.page.getByRole("menuitem", { name: "게임 수정" }).click()
  }

  async clickGameShareButton() {
    await this.page.getByRole("menuitem", { name: "게임 공유" }).click()
  }

  async clickGameUnshareButton() {
    await this.page.getByRole("menuitem", { name: "공유 취소" }).click()
  }

  async clickGameDeleteButton() {
    await this.page.getByRole("menuitem", { name: "게임 삭제" }).click()
  }

  // 게임 미리보기 관련 액션 메서드들
  async clickGamePreviewCloseButton() {
    await this.gamePreviewDialog
      .getByRole("button", { name: "팝업 닫기" })
      .click()
  }

  async clickGamePreviewCloseArea() {
    await this.gamePreviewDialog.locator('[data-testid="close-area"]').click()
  }

  async clickGameStartButton() {
    await this.gamePreviewDialog
      .getByRole("button", { name: "게임 시작" })
      .click()
  }

  // Alert 팝업 관련 액션 메서드들
  async clickAlertNoButton() {
    await this.alertDialog.getByRole("button", { name: "아니요" }).click()
  }

  async clickAlertYesButton() {
    await this.alertDialog.getByRole("button", { name: "네" }).click()
  }

  async clickAlertCloseArea() {
    await this.alertDialog.locator('[data-testid="close-area"]').click()
  }

  // 검증 메서드들
  async expectToBeOnHomePage() {
    await this.page.waitForURL("http://localhost:3000/", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/")
  }

  async expectToBeOnCreatePage() {
    await this.page.waitForURL(/^http:\/\/localhost:3000\/create(\?gameId=\d+)?$/, { timeout: 10000 })
    await expect(this.page).toHaveURL(/^http:\/\/localhost:3000\/create(\?gameId=\d+)?$/)
  }

  async expectToBeOnDashboardPage() {
    await this.page.waitForURL("http://localhost:3000/dashboard", { timeout: 10000 })
    await expect(this.page).toHaveURL("http://localhost:3000/dashboard")
  }

  async expectToBeOnGameSetupPage() {
    await this.page.waitForURL(/\/game\/\d+(\/setup)?/, { timeout: 10000 })
    await expect(this.page).toHaveURL(/\/game\/\d+(\/setup)?/)
  }

  // UI 요소 확인 메서드들
  async expectCommonUIElements() {
    await expect(this.homeButton).toBeVisible()
    await expect(this.createGameButton).toBeVisible()

    // 게임 카드가 최소 1개 이상 표시되어야 함
    const gameCardCount = await this.gameCards.count()
    expect(gameCardCount).toBeGreaterThan(0)
  }

  async expectGameCardInfo(index: number = 0) {
    const gameCard = this.gameCards.nth(index)
    await expect(gameCard).toBeVisible()

    // 게임 제목이 표시되어야 한다
    await expect(gameCard.locator('[data-testid="game-title"]')).toBeVisible()

    // 문제 개수가 표시되어야 한다
    await expect(
      gameCard.locator('[data-testid="question-count"]'),
    ).toBeVisible()

    // 게임 옵션 버튼이 표시되어야 한다
    await expect(
      gameCard.locator('[data-testid="game-options-button"]'),
    ).toBeVisible()
  }

  async expectGamePreviewInfo() {
    await expect(this.gamePreviewDialog).toBeVisible()

    // 게임 제목
    await expect(
      this.gamePreviewDialog.getByRole("heading", { level: 2 }),
    ).toBeVisible()

    // 문제 개수
    await expect(this.gamePreviewDialog.getByText(/총.*문제/)).toBeVisible()

    // 게임 시작 버튼
    await expect(
      this.gamePreviewDialog.getByRole("button", { name: "게임 시작" }),
    ).toBeVisible()
  }

  async expectAlertDialog(title: string) {
    await expect(this.alertDialog).toBeVisible()
    await expect(this.alertDialog.getByRole("heading")).toHaveText(title)
  }

  async expectSharedBadge(index: number | null = 0) {
    const idx = index ?? 0
    const gameCard = this.gameCards.nth(idx)
    await expect(gameCard.locator('[data-testid="shared-badge"]')).toBeVisible()
  }

  async expectNoSharedBadge(index: number | null = 0) {
    const idx = index ?? 0
    const gameCard = this.gameCards.nth(idx)
    await expect(
      gameCard.locator('[data-testid="shared-badge"]'),
    ).not.toBeVisible()
  }

  async expectNoSharedBadgeByTitle(gameTitle: string) {
    const gameCard = this.page.locator(
      `[data-testid="game-card"]:has-text("${gameTitle}")`,
    )
    await expect(
      gameCard.locator('[data-testid="shared-badge"]'),
    ).not.toBeVisible()
  }

  async expectSharedBadgeByTitle(gameTitle: string) {
    const gameCard = this.page.locator(
      `[data-testid="game-card"]:has-text("${gameTitle}")`,
    )
    await expect(gameCard.locator('[data-testid="shared-badge"]')).toBeVisible()
  }

  async expectGameOptionsMenu(index: number = 0) {
    await expect(this.page.getByRole("menu")).toBeVisible()
    await expect(
      this.page.getByRole("menuitem", { name: "게임 수정" }),
    ).toBeVisible()

    const isShared = await this.gameCards
      .nth(index)
      .locator('[data-testid="shared-badge"]')
      .isVisible()
    if (isShared) {
      await expect(
        this.page.getByRole("menuitem", { name: "공유 취소" }),
      ).toBeVisible()
    } else {
      await expect(
        this.page.getByRole("menuitem", { name: "게임 공유" }),
      ).toBeVisible()
    }

    await expect(
      this.page.getByRole("menuitem", { name: "게임 삭제" }),
    ).toBeVisible()
  }

  async expectGameOptionsMenuWithUnshare() {
    await expect(this.page.getByRole("menu")).toBeVisible()
    await expect(
      this.page.getByRole("menuitem", { name: "게임 수정" }),
    ).toBeVisible()
    await expect(
      this.page.getByRole("menuitem", { name: "공유 취소" }),
    ).toBeVisible()
    await expect(
      this.page.getByRole("menuitem", { name: "게임 삭제" }),
    ).toBeVisible()
  }
}

// 기본 UI 확인 테스트
test.describe("대시보드 E2E 테스트 - 기본 UI 확인", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await page.addInitScript(() => {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          profileImageUrl: "/avatar.svg",
          nickname: "testUser",
          email: "test@example.com",
        }),
      )
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })
    await dashboardPage.goto()
  })

  test("대시보드 페이지 진입 시 기본 UI 요소들이 표시되어야 한다", async () => {
    await dashboardPage.expectCommonUIElements()
  })

  test("게임 카드에 게임 정보가 표시되어야 한다", async () => {
    await dashboardPage.expectGameCardInfo()
  })
})

// 네비게이션 기능 테스트
test.describe("대시보드 E2E 테스트 - 네비게이션 기능", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await page.addInitScript(() => {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          profileImageUrl: "/avatar.svg",
          nickname: "testUser",
          email: "test@example.com",
        }),
      )
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })
    await dashboardPage.goto()
  })

  test("홈 버튼 클릭 시 홈페이지로 이동해야 한다", async () => {
    await dashboardPage.clickHomeButton()
    await dashboardPage.expectToBeOnHomePage()
  })

  test("게임 만들기 버튼 클릭 시 게임 만들기 페이지로 이동해야 한다", async () => {
    await dashboardPage.clickCreateGameButton()
    await dashboardPage.expectToBeOnCreatePage()
  })
})

// 게임 카드 기능 테스트
test.describe("대시보드 E2E 테스트 - 게임 카드 기능", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await page.addInitScript(() => {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          profileImageUrl: "/avatar.svg",
          nickname: "testUser",
          email: "test@example.com",
        }),
      )
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })
    await dashboardPage.goto()
  })

  test("게임 카드 클릭 시 게임 미리보기 팝업이 표시되어야 한다", async () => {
    await dashboardPage.clickGameCard()
    await dashboardPage.expectGamePreviewInfo()
  })

  test("게임 미리보기 팝업 닫기 버튼 클릭 시 팝업이 닫혀야 한다", async () => {
    await dashboardPage.clickGameCard()
    await dashboardPage.expectGamePreviewInfo()

    await dashboardPage.clickGamePreviewCloseButton()
    await expect(dashboardPage.gamePreviewDialog).not.toBeVisible()
  })

  test("게임 미리보기에서 게임 시작 버튼 클릭 시 게임 진행 화면으로 이동해야 한다", async () => {
    await dashboardPage.clickGameCard()
    await dashboardPage.expectGamePreviewInfo()

    await dashboardPage.clickGameStartButton()
    await dashboardPage.expectToBeOnGameSetupPage()
  })
})

// 게임 옵션 메뉴 테스트
test.describe("대시보드 E2E 테스트 - 게임 옵션 메뉴", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await page.addInitScript(() => {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          profileImageUrl: "/avatar.svg",
          nickname: "testUser",
          email: "test@example.com",
        }),
      )
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })
    await dashboardPage.goto()
  })

  test("게임 옵션 버튼 클릭 시 옵션 메뉴가 표시되어야 한다", async () => {
    await dashboardPage.clickGameOptionsButton()
    await dashboardPage.expectGameOptionsMenu(0)
  })

  test("게임 수정 버튼 클릭 시 게임 만들기 페이지로 이동해야 한다", async () => {
    await dashboardPage.clickGameOptionsButton()
    await dashboardPage.clickGameEditButton()
    await dashboardPage.expectToBeOnCreatePage()
  })
})

// Alert 팝업 테스트
test.describe("대시보드 E2E 테스트 - Alert 팝업", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await page.addInitScript(() => {
      // 인증 데이터 설정
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          profileImageUrl: "/avatar.svg",
          nickname: "testUser",
          email: "test@example.com",
        }),
      )
      // 쿠키 설정
      document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
    })
    await dashboardPage.goto()
  })

  test("게임 공유 버튼 클릭 시 게임 공유 Alert가 표시되어야 한다", async () => {
    const idx = await dashboardPage.getFirstUnsharedGameIndex()
    if (idx === null) test.skip()
    await dashboardPage.clickGameOptionsButton(idx)
    await dashboardPage.clickGameShareButton()
    await dashboardPage.expectAlertDialog(
      "이 게임을 라이브러리에 등록하시겠습니까?",
    )
  })

  test("게임 공유 Alert에서 아니요 버튼 클릭 시 Alert가 닫혀야 한다", async () => {
    const idx = await dashboardPage.getFirstUnsharedGameIndex()
    if (idx === null) test.skip()
    await dashboardPage.clickGameOptionsButton(idx)
    await dashboardPage.clickGameShareButton()
    await dashboardPage.expectAlertDialog(
      "이 게임을 라이브러리에 등록하시겠습니까?",
    )

    await dashboardPage.clickAlertNoButton()
    await expect(dashboardPage.alertDialog).not.toBeVisible()
  })

  test("게임 공유 Alert에서 네 버튼 클릭 시 공유 완료 뱃지가 생성되어야 한다", async () => {
    const idx = await dashboardPage.getFirstUnsharedGameIndex()
    if (idx === null) test.skip()
    await dashboardPage.clickGameOptionsButton(idx)
    await dashboardPage.clickGameShareButton()
    await dashboardPage.expectAlertDialog(
      "이 게임을 라이브러리에 등록하시겠습니까?",
    )

    await dashboardPage.clickAlertYesButton()
    await expect(dashboardPage.alertDialog).not.toBeVisible()
    await dashboardPage.expectSharedBadge(idx)
  })

  test("공유된 게임의 옵션 메뉴에서 공유 취소 버튼이 표시되어야 한다", async () => {
    // 먼저 게임을 공유
    const idx = await dashboardPage.getFirstUnsharedGameIndex()
    if (idx === null) test.skip()
    await dashboardPage.clickGameOptionsButton(idx)
    await dashboardPage.clickGameShareButton()
    await dashboardPage.clickAlertYesButton()

    // 공유된 게임의 옵션 메뉴 확인
    const sharedIdx = await dashboardPage.getFirstSharedGameIndex()
    if (sharedIdx === null) test.skip()
    await dashboardPage.clickGameOptionsButton(sharedIdx)
    await dashboardPage.expectGameOptionsMenuWithUnshare()
  })

  test("게임 공유 취소 Alert에서 네 버튼 클릭 시 공유 완료 뱃지가 사라져야 한다", async () => {
    // 공유된 게임을 찾아서 공유 취소
    const sharedIdx = await dashboardPage.getFirstSharedGameIndex()
    if (sharedIdx === null) test.skip()

    // 게임 제목을 미리 저장
    const gameTitle = await dashboardPage.gameCards
      .nth(sharedIdx!)
      .locator('[data-testid="game-title"]')
      .textContent()
    if (!gameTitle) test.skip()

    await dashboardPage.clickGameOptionsButton(sharedIdx!)
    await dashboardPage.clickGameUnshareButton()
    await dashboardPage.expectAlertDialog("라이브러리 공유를 취소하시겠습니까?")

    await dashboardPage.clickAlertYesButton()
    await expect(dashboardPage.alertDialog).not.toBeVisible()

    // 게임 제목으로 찾아서 공유 뱃지가 사라졌는지 확인
    await dashboardPage.expectNoSharedBadgeByTitle(gameTitle!)
  })

  test("게임 삭제 버튼 클릭 시 게임 삭제 Alert가 표시되어야 한다", async () => {
    await dashboardPage.clickGameOptionsButton()
    await dashboardPage.clickGameDeleteButton()
    await dashboardPage.expectAlertDialog("게임을 삭제하시겠습니까?")
  })

  test("게임 삭제 Alert에서 네 버튼 클릭 시 게임이 삭제되어야 한다", async () => {
    // 첫 번째 게임의 제목을 미리 저장
    const firstGameTitle = await dashboardPage.gameCards
      .nth(0)
      .locator('[data-testid="game-title"]')
      .textContent()
    if (!firstGameTitle) test.skip()

    await dashboardPage.clickGameOptionsButton()
    await dashboardPage.clickGameDeleteButton()
    await dashboardPage.expectAlertDialog("게임을 삭제하시겠습니까?")

    await dashboardPage.clickAlertYesButton()
    await expect(dashboardPage.alertDialog).not.toBeVisible()

    // 삭제 후 페이지 업데이트 대기
    await dashboardPage.page.waitForLoadState("networkidle")

    // 삭제된 게임이 화면에서 사라졌는지 확인
    await expect(
      dashboardPage.page.locator(
        `[data-testid="game-card"]:has-text("${firstGameTitle}")`,
      ),
    ).not.toBeVisible()
  })
})
