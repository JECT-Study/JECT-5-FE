import { expect, Page } from "@playwright/test"

/**
 * 테스트용 사용자 데이터 타입
 */
export interface TestUser {
  id: string
  nickname: string
  profileImageUrl: string
  email: string
}

/**
 * 기본 테스트 사용자 데이터
 */
export const DEFAULT_TEST_USER: TestUser = {
  id: "test-user-id",
  nickname: "테스트 사용자",
  profileImageUrl: "/avatar.svg",
  email: "test@example.com",
}

/**
 * 페이지에 로그인 상태를 시뮬레이션합니다.
 * @param page Playwright Page 객체
 * @param user 사용자 데이터 (기본값: DEFAULT_TEST_USER)
 */
export async function setupAuth(
  page: Page,
  user: TestUser = DEFAULT_TEST_USER,
): Promise<void> {
  await page.addInitScript((userData) => {
    // 로컬 스토리지에 사용자 정보 설정
    localStorage.setItem("auth_user", JSON.stringify(userData))

    // 세션 쿠키 설정
    document.cookie = "JSESSIONID=test-session-123; Path=/; SameSite=Lax"
  }, user)
}

/**
 * 페이지에서 로그아웃 상태를 시뮬레이션합니다.
 * @param page Playwright Page 객체
 */
export async function setupLogout(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem("auth_user")

    // 세션 쿠키 제거
    document.cookie =
      "JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
  })
}

/**
 * 페이지에 로그인 상태를 설정하고 페이지를 로드합니다.
 * @param page Playwright Page 객체
 * @param url 로드할 URL (기본값: "/")
 * @param user 사용자 데이터 (기본값: DEFAULT_TEST_USER)
 */
export async function setupAuthAndGoto(
  page: Page,
  url: string = "/",
  user: TestUser = DEFAULT_TEST_USER,
): Promise<void> {
  await setupAuth(page, user)
  await page.goto(url)
  await page.waitForLoadState("networkidle")
  // 인증 상태가 적용될 시간을 기다림
  await page.waitForTimeout(1000)
}

/**
 * 페이지에 로그아웃 상태를 설정하고 페이지를 로드합니다.
 * @param page Playwright Page 객체
 * @param url 로드할 URL (기본값: "/")
 */
export async function setupLogoutAndGoto(
  page: Page,
  url: string = "/",
): Promise<void> {
  await setupLogout(page)
  await page.goto(url)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
}

/**
 * 페이지의 로그인 상태를 확인합니다.
 * @param page Playwright Page 객체
 * @returns 로그인 상태 (true: 로그인됨, false: 로그아웃됨)
 */
export async function checkAuthState(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const authUser = localStorage.getItem("auth_user")
    const hasSessionCookie = document.cookie.includes("JSESSIONID=")
    return !!(authUser && hasSessionCookie)
  })
}

/**
 * 로그인 상태인지 확인하고 검증합니다.
 * @param page Playwright Page 객체
 */
export async function expectLoggedIn(page: Page): Promise<void> {
  const isLoggedIn = await checkAuthState(page)
  expect(isLoggedIn).toBe(true)

  // 로그인 상태 UI 요소들이 표시되는지 확인
  await expect(page.getByRole("button", { name: /사용자 메뉴/ })).toBeVisible()
  await expect(page.getByRole("button", { name: "내 게임" })).toBeVisible()
  await expect(
    page.getByRole("navigation").getByRole("button", { name: "게임 만들기" }),
  ).toBeVisible()
}

/**
 * 로그아웃 상태인지 확인하고 검증합니다.
 * @param page Playwright Page 객체
 */
export async function expectLoggedOut(page: Page): Promise<void> {
  const isLoggedIn = await checkAuthState(page)
  expect(isLoggedIn).toBe(false)

  // 로그아웃 상태 UI 요소들이 표시되는지 확인
  await expect(
    page.getByRole("button", { name: "카카오 간편 로그인" }),
  ).toBeVisible()

  // 로그인 상태 UI 요소들이 표시되지 않는지 확인
  await expect(
    page.getByRole("button", { name: /사용자 메뉴/ }),
  ).not.toBeVisible()
  await expect(page.getByRole("button", { name: "내 게임" })).not.toBeVisible()
  await expect(
    page.getByRole("navigation").getByRole("button", { name: "게임 만들기" }),
  ).not.toBeVisible()
}

/**
 * 현재 사용자 정보를 가져옵니다.
 * @param page Playwright Page 객체
 * @returns 사용자 정보 또는 null
 */
export async function getCurrentUser(page: Page): Promise<TestUser | null> {
  return await page.evaluate(() => {
    const authUser = localStorage.getItem("auth_user")
    if (!authUser) return null

    try {
      return JSON.parse(authUser) as TestUser
    } catch {
      return null
    }
  })
}

/**
 * 특정 사용자로 로그인되어 있는지 확인합니다.
 * @param page Playwright Page 객체
 * @param expectedUser 확인할 사용자 정보
 */
export async function expectLoggedInAs(
  page: Page,
  expectedUser: TestUser,
): Promise<void> {
  await expectLoggedIn(page)

  const currentUser = await getCurrentUser(page)
  expect(currentUser).not.toBeNull()
  expect(currentUser?.nickname).toBe(expectedUser.nickname)
  expect(currentUser?.email).toBe(expectedUser.email)
}

/**
 * 로그인 상태를 토글합니다 (로그인되어 있으면 로그아웃, 로그아웃되어 있으면 로그인).
 * @param page Playwright Page 객체
 * @param user 로그인할 사용자 정보 (기본값: DEFAULT_TEST_USER)
 */
export async function toggleAuthState(
  page: Page,
  user: TestUser = DEFAULT_TEST_USER,
): Promise<void> {
  const isCurrentlyLoggedIn = await checkAuthState(page)

  if (isCurrentlyLoggedIn) {
    await setupLogout(page)
  } else {
    await setupAuth(page, user)
  }
}
