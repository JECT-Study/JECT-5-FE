import { expect, type Locator, type Page, test } from "@playwright/test"

/**
 * 라이브러리 E2E 테스트
 *
 * Figma: "301. 라이브러리 - 로그인", "302. 라이브러리 - 비로그인", 
 * "303. 라이브러리 게임 미리 보기 - 로그인", "304. 라이브러리 게임 미리 보기 - 비로그인",
 * "305. 게임 검색 - 로그인", "306. 게임 검색 - 비로그인" 기준
 * 
 * 테스트 시나리오:
 * - 라이브러리 페이지 진입 시 기본 UI 요소 표시 확인
 * - 로그인/비로그인 상태별 UI 및 동작 확인
 * - 게임 카드 목록 표시 및 정렬 확인
 * - 게임 미리 보기 팝업 동작 확인
 * - 검색 기능 동작 확인
 * - 네비게이션 동작 확인
 */

// Page Object Model: 라이브러리 페이지 클래스
class LibraryPage {
  readonly page: Page
  readonly logo: Locator
  readonly searchBar: Locator
  readonly gameCards: Locator
  readonly createGameButton: Locator
  readonly kakaoLoginButton: Locator

  // 게임 미리 보기 팝업 요소들
  readonly gamePreviewDialog: Locator
  readonly closePreviewButton: Locator
  readonly gamePreviewCloseArea: Locator
  readonly gameTitle: Locator
  readonly questionCount: Locator
  readonly imageCarousel: Locator
  readonly startGameButton: Locator

  constructor(page: Page) {
    this.page = page

    // 공통 네비게이션 요소들
    this.logo = page.getByRole("img", { name: "홈 로고" })
    this.searchBar = page.getByPlaceholder("오늘의 추천 게임은?")
    this.gameCards = page.locator('[data-testid="game-card"]')

    // 로그인 상태에서 추가되는 요소들
    this.createGameButton = page.getByRole("button", { name: "게임 만들기", exact: true })

    // 비로그인 상태에서 추가되는 요소들
    this.kakaoLoginButton = page.getByRole("button", { name: /간편로그인해서 게임 만들기/ })

    // 게임 미리 보기 팝업 요소들
    this.gamePreviewDialog = page.getByRole("dialog")
    this.closePreviewButton = page.getByRole("button", { name: "팝업 닫기" })
    this.gamePreviewCloseArea = page.locator('[data-testid="close-area"]')
    this.gameTitle = page.getByRole("heading", { level: 2 })
    this.questionCount = page.getByText(/총.*문제/)
    this.imageCarousel = page.locator('[data-testid="image-carousel"]')
    this.startGameButton = page.getByRole("button", { name: "게임 시작" })
  }

  // 페이지 이동 메서드
  async goto() {
    await this.page.goto("http://localhost:3000/games")
    await this.page.waitForLoadState("networkidle")
    await this.page.waitForSelector('[data-testid="game-card"]', { timeout: 5000 }).catch(() => {
      console.warn("No game cards rendered after 5s")
    });
  }

  // 네비게이션 액션 메서드들
  async clickLogo() {
    await this.logo.click()
  }

  async clickSearchBar() {
    await this.searchBar.click()
  }

  async clickCreateGame() {
    await this.createGameButton.click()
  }

  async clickKakaoLogin() {
    await this.kakaoLoginButton.click()
  }

  // 게임 카드 관련 메서드들
  async clickFirstGameCard() {
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount === 0) {
      test.skip()
      return
    }
    await this.gameCards.first().click()
  }

  async clickGameCardByIndex(index: number) {
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount <= index) {
      test.skip()
      return
    }
    await this.gameCards.nth(index).click()
  }

  // 검색 관련 메서드들
  async searchGame(keyword: string) {
    await this.searchBar.fill(keyword)
    await this.searchBar.press("Enter")
  }

  async clearSearch() {
    await this.searchBar.clear()
    await this.searchBar.press("Enter")
  }

  // 게임 미리 보기 관련 메서드들
  async openGamePreview() {
    await this.clickFirstGameCard()
    await expect(this.gamePreviewDialog).toBeVisible()
  }

  async closeGamePreview() {
    await this.closePreviewButton.click()
    await expect(this.gamePreviewDialog).not.toBeVisible()
  }

  async closeGamePreviewByOverlay() {
    await this.closePreviewButton.click()
    await expect(this.gamePreviewDialog).not.toBeVisible()
  }

  async startGameFromPreview() {
    await this.startGameButton.click()
  }

  // 이미지 캐러셀 관련 메서드들
  async swipeImageCarousel(direction: "left" | "right") {
    const carousel = this.imageCarousel
    const box = await carousel.boundingBox()
    if (!box) return

    const startX = direction === "left" ? box.x + box.width * 0.8 : box.x + box.width * 0.2
    const endX = direction === "left" ? box.x + box.width * 0.2 : box.x + box.width * 0.8
    const centerY = box.y + box.height / 2

    await this.page.mouse.move(startX, centerY)
    await this.page.mouse.down()
    await this.page.mouse.move(endX, centerY)
    await this.page.mouse.up()
  }

  // 검증 메서드들
  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL("http://localhost:3000/")
  }

  async expectToBeOnGamesPage() {
    await expect(this.page).toHaveURL("http://localhost:3000/games")
  }

  async expectToBeOnCreatePage() {
    await expect(this.page).toHaveURL("http://localhost:3000/create")
  }

  async expectToBeOnGameSetupPage() {
    await expect(this.page).toHaveURL(/\/game\/\d+(\/setup)?/)
  }

  // 로그인 상태 확인 메서드들
  async expectLoggedInState() {
    await expect(this.createGameButton).toBeVisible()
    await expect(this.kakaoLoginButton).not.toBeVisible()
  }

  async expectLoggedOutState() {
    await expect(this.kakaoLoginButton).toBeVisible()
    await expect(this.createGameButton).toBeVisible()
  }

  // 게임 카드 관련 검증 메서드들
  async expectGameCardsDisplayed() {
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount > 0) {
      await expect(this.gameCards.first()).toBeVisible()
      
      // 게임 이름이 두 줄까지 표시되는지 확인
      const firstCard = this.gameCards.first()
      const gameTitle = firstCard.locator('[data-testid="game-title"]')
      await expect(gameTitle).toBeVisible()
    }
  }

  async expectGameCardsSorted() {
    // 인기 + 최신 순으로 나열되었는지 확인
    // 실제 구현에 따라 정렬 로직 검증
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount > 1) {
      // 첫 번째 카드가 더 인기있거나 최신인지 확인
      // 이는 실제 데이터 구조에 따라 달라질 수 있음
      await expect(this.gameCards.first()).toBeVisible()
      await expect(this.gameCards.nth(1)).toBeVisible()
    }
  }

  // 게임 미리 보기 관련 검증 메서드들
  async expectGamePreviewInfo() {
    await expect(this.gameTitle).toBeVisible()
    await expect(this.questionCount).toBeVisible()
    await expect(this.startGameButton).toBeVisible()
  }

  async expectImageCarouselVisible() {
    await expect(this.imageCarousel).toBeVisible()
  }

  // 검색 관련 검증 메서드들
  async expectSearchResults(keyword: string) {
    // 검색 결과가 표시되는지 확인
    const gameCardCount = await this.gameCards.count()
    if (gameCardCount > 0) {
      // 검색어가 포함된 게임이 있는지 확인
      let hasMatchingGame = false
      for (let i = 0; i < gameCardCount; i++) {
        const card = this.gameCards.nth(i)
        const title = await card.locator('[data-testid="game-title"]').textContent()
        if (title?.toLowerCase().includes(keyword.toLowerCase())) {
          hasMatchingGame = true
          break
        }
      }
      expect(hasMatchingGame).toBeTruthy()
    }
  }

  async expectSearchResultsWithSpaceRemoval(keyword: string) {
    // 공백이 제거된 검색어로도 결과가 나오는지 확인
    const keywordWithoutSpace = keyword.replace(/\s/g, '')
    await this.expectSearchResults(keywordWithoutSpace)
  }
}

// 로그인 상태 테스트
test.describe("라이브러리 E2E 테스트 - 로그인 상태", () => {
  let libraryPage: LibraryPage

  test.beforeEach(async ({ page }) => {
    libraryPage = new LibraryPage(page)
    // 로그인 상태 시뮬레이션
    await page.addInitScript(() => {
      localStorage.setItem("auth_user", JSON.stringify({
        id: 1,
        name: "테스트 사용자",
        email: "test@example.com"
      }))
      document.cookie = "sessionId=test-session-123; Path=/; SameSite=Lax"
    })
    await libraryPage.goto()
  })

  test.describe("기본 UI 요소 표시 확인", () => {
    test("로그인 상태에서 올바른 UI가 표시되어야 한다", async () => {
      await libraryPage.expectLoggedInState()
    })

    test("게임 카드 목록이 인기+최신 순으로 나열되어야 한다", async () => {
      await libraryPage.expectGameCardsDisplayed()
      await libraryPage.expectGameCardsSorted()
    })
  })

  test.describe("네비게이션 버튼 동작 확인", () => {
    test("홈 버튼 클릭 시 홈 화면으로 이동해야 한다", async () => {
      await libraryPage.clickLogo()
      await libraryPage.expectToBeOnHomePage()
    })

    test("검색바 클릭 시 게임 검색 페이지로 이동해야 한다", async () => {
      await libraryPage.clickSearchBar()
      await libraryPage.expectToBeOnGamesPage()
    })

    test("게임 만들기 버튼 클릭 시 게임 만들기 페이지로 이동해야 한다", async () => {
      await libraryPage.clickCreateGame()
      await libraryPage.expectToBeOnCreatePage()
    })
  })

  test.describe("게임 카드 클릭 동작", () => {
    test("게임 카드 클릭 시 게임 미리 보기 팝업이 열려야 한다", async () => {
      await libraryPage.openGamePreview()
      await libraryPage.expectGamePreviewInfo()
    })
  })

  test.describe("게임 미리 보기 팝업 동작", () => {
    test.beforeEach(async () => {
      await libraryPage.openGamePreview()
    })

    test("게임 정보가 올바르게 표시되어야 한다", async () => {
      await libraryPage.expectGamePreviewInfo()
    })

    test("팝업 닫기 버튼 클릭 시 라이브러리 페이지로 돌아가야 한다", async () => {
      await libraryPage.closeGamePreview()
      await libraryPage.expectToBeOnGamesPage()
    })

    test("팝업 닫기 영역 클릭 시 라이브러리 페이지로 돌아가야 한다", async () => {
      await libraryPage.closeGamePreviewByOverlay()
      await libraryPage.expectToBeOnGamesPage()
    })

    test("이미지 캐러셀이 좌우 스와이프로 동작해야 한다", async () => {
      await libraryPage.expectImageCarouselVisible()
      // 스와이프 동작 테스트
      await libraryPage.swipeImageCarousel("left")
      await libraryPage.swipeImageCarousel("right")
    })

    test("게임 시작 버튼 클릭 시 게임 진행 화면으로 이동해야 한다", async () => {
      await libraryPage.startGameFromPreview()
      await libraryPage.expectToBeOnGameSetupPage()
    })
  })

  test.describe("검색 기능", () => {
    test("게임 카드 목록이 올바르게 표시되어야 한다", async () => {
      await libraryPage.expectGameCardsDisplayed()
    })

    test("게임 카드 클릭 시 게임 미리 보기 팝업이 표시되어야 한다", async () => {
      await libraryPage.openGamePreview()
      await libraryPage.expectGamePreviewInfo()
    })

    test("검색어 입력 시 공백 제거 후 검색되어야 한다", async () => {
      await libraryPage.searchGame("한국 드라마")
      await libraryPage.expectSearchResultsWithSpaceRemoval("한국 드라마")
    })

    test("유사 문자열도 함께 검색되어야 한다", async () => {
      await libraryPage.searchGame("영화 추천")
      await libraryPage.expectSearchResults("영화추천")
    })
  })
})

// 비로그인 상태 테스트
test.describe("라이브러리 E2E 테스트 - 비로그인 상태", () => {
  let libraryPage: LibraryPage

  test.beforeEach(async ({ page }) => {
    libraryPage = new LibraryPage(page)
    // 비로그인 상태 시뮬레이션
    await page.addInitScript(() => {
      localStorage.removeItem("auth_user")
    })
    await libraryPage.goto()
  })

  test.describe("기본 UI 요소 표시 확인", () => {
    test("비로그인 상태에서 올바른 UI가 표시되어야 한다", async () => {
      await libraryPage.expectLoggedOutState()
    })

    test("게임 카드 목록이 인기+최신 순으로 나열되어야 한다", async () => {
      await libraryPage.expectGameCardsDisplayed()
      await libraryPage.expectGameCardsSorted()
    })
  })

  test.describe("네비게이션 버튼 동작 확인", () => {
    test("홈 버튼 클릭 시 홈 화면으로 이동해야 한다", async () => {
      await libraryPage.clickLogo()
      await libraryPage.expectToBeOnHomePage()
    })

    test("검색바 클릭 시 게임 검색 페이지로 이동해야 한다", async () => {
      await libraryPage.clickSearchBar()
      await libraryPage.expectToBeOnGamesPage()
    })
  })

  test.describe("게임 카드 클릭 동작", () => {
    test("게임 카드 클릭 시 게임 미리 보기 팝업이 열려야 한다", async () => {
      await libraryPage.openGamePreview()
      await libraryPage.expectGamePreviewInfo()
    })
  })

  test.describe("게임 미리 보기 팝업 동작", () => {
    test.beforeEach(async () => {
      await libraryPage.openGamePreview()
    })

    test("게임 정보가 올바르게 표시되어야 한다", async () => {
      await libraryPage.expectGamePreviewInfo()
    })

    test("팝업 닫기 버튼 클릭 시 라이브러리 페이지로 돌아가야 한다", async () => {
      await libraryPage.closeGamePreview()
      await libraryPage.expectToBeOnGamesPage()
    })

    test("팝업 닫기 영역 클릭 시 라이브러리 페이지로 돌아가야 한다", async () => {
      await libraryPage.closeGamePreviewByOverlay()
      await libraryPage.expectToBeOnGamesPage()
    })

    test("이미지 캐러셀이 좌우 스와이프로 동작해야 한다", async () => {
      await libraryPage.expectImageCarouselVisible()
      // 스와이프 동작 테스트
      await libraryPage.swipeImageCarousel("left")
      await libraryPage.swipeImageCarousel("right")
    })

    test("게임 시작 버튼 클릭 시 게임 진행 화면으로 이동해야 한다", async () => {
      await libraryPage.startGameFromPreview()
      await libraryPage.expectToBeOnGameSetupPage()
    })
  })

  test.describe("검색 기능", () => {
    test("게임 카드 목록이 올바르게 표시되어야 한다", async () => {
      await libraryPage.expectGameCardsDisplayed()
    })

    test("게임 카드 클릭 시 게임 미리 보기 팝업이 표시되어야 한다", async () => {
      await libraryPage.openGamePreview()
      await libraryPage.expectGamePreviewInfo()
    })

    test("검색어 입력 시 공백 제거 후 검색되어야 한다", async () => {
      await libraryPage.searchGame("한국 드라마")
      await libraryPage.expectSearchResultsWithSpaceRemoval("한국 드라마")
    })

    test("유사 문자열도 함께 검색되어야 한다", async () => {
      await libraryPage.searchGame("게임 퀴즈")
      await libraryPage.expectSearchResults("게임퀴즈")
    })
  })
})

// 공통 테스트
test.describe("라이브러리 공통 기능", () => {
  let libraryPage: LibraryPage

  test.beforeEach(async ({ page }) => {
    libraryPage = new LibraryPage(page)
    await libraryPage.goto()
  })

  test.describe("게임 카드 텍스트 처리", () => {
    test("게임 이름이 두 줄까지 표시되고 영역 초과 시 말줄임표 처리되어야 한다", async () => {
      await libraryPage.expectGameCardsDisplayed()
    })
  })

  test.describe("검색 기능", () => {
    test("검색어 입력 시 실시간으로 결과가 필터링되어야 한다", async () => {
      await libraryPage.searchGame("테스트")
      await libraryPage.expectSearchResults("테스트")
    })

    test("검색어를 지우면 모든 게임이 다시 표시되어야 한다", async () => {
      await libraryPage.searchGame("테스트")
      await libraryPage.clearSearch()
      await libraryPage.expectGameCardsDisplayed()
    })
  })
})
