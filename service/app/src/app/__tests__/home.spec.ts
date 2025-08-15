import { expect, type Locator,type Page, test } from '@playwright/test'

/**
 * 홈페이지 E2E 테스트 - 비로그인 상태
 * 
 * Figma: "101. 홈 화면 - 비로그인" 기준
 * 테스트 시나리오:
 * - 홈 화면 진입 시 기본 UI 요소 표시 확인
 * - 네비게이션 요소 확인
 * - 게임 섹션 요소 확인
 * - 기본 버튼 동작 확인
 */

// Page Object Model: 홈페이지 클래스
export class HomePage {
  readonly page: Page
  readonly logo: Locator
  readonly kakaoLoginButton: Locator
  // readonly themeToggleButton: Locator // 다크모드 버튼은 추후 구현 예정
  readonly viewMoreGamesButton: Locator
  readonly gameSectionTitle: Locator
  readonly gameCards: Locator
  readonly heroTitle: Locator

  constructor(page: Page) {
    this.page = page
    
    // 네비게이션 요소들
    this.logo = page.getByRole('img', { name: '홈 로고' })
    this.kakaoLoginButton = page.getByRole('button', { name: /간편로그인해서 게임 만들기/ })
    // this.themeToggleButton = page.getByRole('button', { name: '라이트/다크 모드 전환' }) // 다크모드 버튼은 추후 구현 예정
    
    // 게임 섹션 요소들
    this.viewMoreGamesButton = page.getByRole('button', { name: '게임 더 보기' })
    this.gameSectionTitle = page.getByText('어떤 게임으로 시작해 볼까요?')
    this.gameCards = page.locator('[data-testid="game-card"]')
    
    // 히어로 섹션
    this.heroTitle = page.locator('[data-testid="hero-title"]')
  }

  // 페이지 이동 메서드
  async goto() {
    await this.page.goto('http://localhost:3000')
    await this.page.waitForLoadState('networkidle')
  }

  // 네비게이션 액션 메서드들
  async clickLogo() {
    await this.logo.click()
  }

  async clickKakaoLogin() {
    await this.kakaoLoginButton.click()
  }

  // async clickThemeToggle() {
  //   await this.themeToggleButton.click()
  // } // 다크모드 버튼은 추후 구현 예정

  async clickViewMoreGames() {
    await this.viewMoreGamesButton.click()
  }

  // 검증 메서드들
  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('http://localhost:3000/')
  }

  async expectToBeOnGamesPage() {
    await expect(this.page).toHaveURL('http://localhost:3000/games')
  }

  async expectDarkModeToBeActive() {
    await expect(this.page.locator('html')).toHaveClass(/dark/)
  }

  async expectLightModeToBeActive() {
    await expect(this.page.locator('html')).not.toHaveClass(/dark/)
  }
}

test.describe('홈페이지 E2E 테스트 - 비로그인 상태', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    
    // 비로그인 상태로 시뮬레이션
    await page.addInitScript(() => {
      // 로컬 스토리지에서 인증 정보 제거 (useAuth에서 사용하는 키)
      localStorage.removeItem('auth_user')
    })
    
    await homePage.goto()
  })

  test.describe('기본 UI 요소 표시 확인', () => {
    test('홈 화면 진입 시 기본 UI 요소들이 표시되어야 한다', async () => {
      // Given: 비로그인 상태에서 홈 화면에 진입했을 때
      
      // Then: 네비게이션 요소들이 표시되어야 한다
      await expect(homePage.logo).toBeVisible()
      await expect(homePage.kakaoLoginButton).toBeVisible()
      // await expect(homePage.themeToggleButton).toBeVisible() // 다크모드 버튼은 추후 구현 예정
      
      // Then: 히어로 섹션이 표시되어야 한다
      await expect(homePage.heroTitle).toBeVisible()
      
      // Then: 게임 섹션이 표시되어야 한다
      await expect(homePage.gameSectionTitle).toBeVisible()
      await expect(homePage.viewMoreGamesButton).toBeVisible()
      
      // Then: 게임 카드들이 로딩되거나 게임 섹션이 표시되어야 한다
      const gameCardCount = await homePage.gameCards.count()
      if (gameCardCount > 0) {
        await expect(homePage.gameCards.first()).toBeVisible()
      } else {
        // 게임이 없는 경우에도 게임 섹션은 표시되어야 함
        await expect(homePage.gameSectionTitle).toBeVisible()
      }
    })

    test('게임 카드가 있는 경우 게임명과 문제 개수가 표시되어야 한다', async () => {
      // Given: 홈 화면에 진입했을 때
      
      // Then: 게임 카드가 로딩되거나 게임 섹션이 표시되어야 한다
      const gameCardCount = await homePage.gameCards.count()
      if (gameCardCount > 0) {
        const firstGameCard = homePage.gameCards.first()
        await expect(firstGameCard).toBeVisible()
        
        // 게임 제목이 표시되어야 한다
        await expect(firstGameCard.locator('[data-testid="game-title"]')).toBeVisible()
        
        // 문제 개수가 표시되어야 한다
        await expect(firstGameCard.locator('[data-testid="question-count"]')).toBeVisible()
      } else {
        // 게임이 없는 경우 게임 섹션 제목은 표시되어야 함
        await expect(homePage.gameSectionTitle).toBeVisible()
      }
    })
  })

  test.describe('네비게이션 버튼 동작 확인', () => {
    test('홈 로고 클릭 시 현재 화면이 새로고침되어야 한다', async () => {
      // Given: 홈 화면에 진입했을 때
      const initialUrl = homePage.page.url()
      
      // When: 홈 로고를 클릭하면
      await homePage.clickLogo()
      
      // Then: 현재 화면이 새로고침되어야 한다 (URL은 동일하지만 페이지가 리로드됨)
      await expect(homePage.page).toHaveURL(initialUrl)
    })

    test('게임 더 보기 버튼 클릭 시 라이브러리 페이지로 이동해야 한다', async () => {
      // Given: 홈 화면에 진입했을 때
      
      // When: 게임 더 보기 버튼을 클릭하면
      await homePage.clickViewMoreGames()
      
      // Then: 라이브러리 페이지로 이동해야 한다
      await homePage.expectToBeOnGamesPage()
    })

    // test('라이트/다크 모드 버튼 클릭 시 테마가 전환되어야 한다', async () => {
    //   // Given: 홈 화면에 진입했을 때 (기본 라이트 모드)
    //   
    //   // When: 라이트/다크 모드 버튼을 클릭하면
    //   await homePage.clickThemeToggle()
    //   
    //   // Then: 다크 모드로 전환되어야 한다
    //   await homePage.expectDarkModeToBeActive()
    //   
    //   // When: 다시 클릭하면
    //   await homePage.clickThemeToggle()
    //   
    //   // Then: 라이트 모드로 돌아가야 한다
    //   await homePage.expectLightModeToBeActive()
    // }) // 다크모드 버튼은 추후 구현 예정
  })

  test.describe('로그인 관련 UI 확인', () => {
    test('비로그인 상태에서는 카카오 로그인 버튼이 표시되어야 한다', async () => {
      // Given: 비로그인 상태에서 홈 화면에 진입했을 때
      
      // Then: 카카오 로그인 버튼이 표시되어야 한다
      await expect(homePage.kakaoLoginButton).toBeVisible()
      
      // And: 로그인 버튼에 카카오 로고가 포함되어야 한다
      const kakaoLogo = homePage.kakaoLoginButton.locator('img[alt="카카오 로고"]')
      await expect(kakaoLogo).toBeVisible()
    })

    test('카카오 로그인 버튼 클릭 시 카카오 로그인 페이지로 이동해야 한다', async () => {
      // Given: 비로그인 상태에서 홈 화면에 진입했을 때
      
      // When: 카카오 로그인 버튼을 클릭하면
      await homePage.clickKakaoLogin()
      
      // Then: 카카오 로그인 페이지로 이동해야 한다
      await expect(homePage.page).toHaveURL(/\/login\/kakao/)
    })
  })

  test.describe('게임 카드 클릭 동작', () => {
    test('게임 카드 클릭 시 게임 미리보기 팝업이 표시되어야 한다', async () => {
      // Given: 홈 화면에 진입했을 때
      
      // 게임 카드가 있는지 확인
      const gameCardCount = await homePage.gameCards.count()
      if (gameCardCount === 0) {
        test.skip()
        return
      }
      
      // When: 첫 번째 게임 카드를 클릭하면
      await homePage.gameCards.first().click()
      
      // Then: 게임 미리보기 팝업이 표시되어야 한다
      const gamePreviewDialog = homePage.page.getByRole('dialog')
      await expect(gamePreviewDialog).toBeVisible()
    })
  })
})
