import { expect, test } from "@playwright/test"

import { HomePOM } from "./homePOM"

// E2E: 홈 화면
// guides/playwright-convention.mdc 및 test-convention.mdc 준수

test.describe("홈 화면: 비로그인 상태", () => {
  let pageObj: HomePOM
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    pageObj = new HomePOM(page)
  })

  test("홈 네비게이션의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.homeLogoImage).toBeVisible()
    await expect(pageObj.themeToggleButton).toBeVisible()
    await expect(pageObj.kakaoLoginButton).toBeVisible()
  })

  test("간편로그인 버튼을 클릭하면 카카오 로그인 페이지로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickKakaoLoginButton()
    await page.waitForURL("/login")
  })
})

test.describe("홈 화면: 로그인 상태", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: HomePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    pageObj = new HomePOM(page)
  })

  test("홈 네비게이션의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.myGamesButton).toBeVisible()
    await expect(pageObj.createGameButton).toBeVisible()
    await expect(pageObj.userAvatar).toBeVisible()
    await expect(pageObj.themeToggleButton).toBeVisible()
  })

  test("내 게임 버튼을 클릭하면 내 게임 페이지로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickMyGamesButton()
    await page.waitForURL("/dashboard")
  })

  test("게임 만들기 버튼을 클릭하면 게임 만들기 페이지로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickCreateGameButton()
    await page.waitForURL("/create")
  })

  test("아바타를 클릭하면 아바타 드롭다운 메뉴가 표시되어야 한다", async () => {
    await pageObj.clickUserAvatar()
    await expect(pageObj.userDropdownMenu).toBeVisible()
  })

  test("아바타 드롭다운 메뉴에 로그아웃 버튼이 있어야 한다", async () => {
    await pageObj.clickUserAvatar()
    await expect(pageObj.logoutButton).toBeVisible()
  })

  test("로그아웃 버튼을 클릭하면 로그아웃 처리되어야 한다", async () => {
    await pageObj.clickUserAvatar()
    await pageObj.logoutButton.waitFor({ state: "visible" })
    await pageObj.clickLogoutButton()
    await expect(pageObj.myGamesButton).not.toBeVisible()
  })
})

test.describe("홈 화면: 공통", () => {
  let pageObj: HomePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    pageObj = new HomePOM(page)
  })

  test("hero 섹션의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.heroTitle).toBeVisible()
  })

  test("game 섹션의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.gameSectionTitle).toBeVisible()
    await expect(pageObj.gameSectionCards).toBeVisible()
    await expect(pageObj.viewMoreGamesButton).toBeVisible()
  })

  test("홈 버튼을 클릭하면 홈 화면으로 이동해야 한다", async ({ page }) => {
    await pageObj.clickHomeLogo()
    await page.waitForURL("/")
  })

  test("게임 더 보기 버튼을 클릭하면 라이브러리 페이지로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickViewMoreGamesButton()
    await page.waitForURL("/games")
  })

  test("게임 카드를 클릭하면 게임 미리보기 팝업이 표시되어야 한다", async () => {
    await pageObj.clickGameSectionCard()
    await expect(pageObj.gamePreview).toBeVisible()
  })

  test("게임 미리보기 팝업의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await pageObj.clickGameSectionCard()
    await expect(pageObj.gamePreviewGameTitle).toBeVisible()
    await expect(pageObj.gamePreviewCreatorName).toBeVisible()
    await expect(pageObj.gamePreviewQuestionCount).toBeVisible()
    await expect(pageObj.gamePreviewQuestions).toBeVisible()
  })

  test("게임 미리보기 팝업에서 팝업 닫기 버튼을 클릭하면 게임 미리보기 팝업이 닫혀야 한다", async () => {
    await pageObj.clickGameSectionCard()
    await pageObj.clickGamePreviewCloseButton()
    await expect(pageObj.gamePreview).not.toBeVisible()
  })

  test("게임 미리보기 팝업에서 게임 시작 버튼을 클릭하면 게임 진행 페이지로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickGameSectionCard()
    await pageObj.clickGamePreviewStartButton()
    await page.waitForURL(/\/game\/\d+/)
  })

  test("테마 토글을 클릭하면 테마가 변경되어야 한다", async () => {
    await pageObj.clickThemeToggleButton()
    await expect(pageObj.themeToggleButton).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})
