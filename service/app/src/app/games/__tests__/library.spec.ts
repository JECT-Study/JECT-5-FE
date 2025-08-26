import { test } from "@playwright/test"

import { expectLoggedOut, setupAuthAndGoto } from "../../../__tests__/testUtils"
import { LibraryPage } from "./libraryPOM"

test.describe("라이브러리 E2E 테스트", () => {
  let libraryPage: LibraryPage

  test.beforeEach(async ({ page }) => {
    libraryPage = new LibraryPage(page)
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await libraryPage.goto()
  })

  test.describe("라이브러리 네비게이션 테스트", () => {
    test("1.3 게임 미리보기 팝업 기능 확인", async () => {
      // Given: 라이브러리에 게임 카드가 있을 때
      await libraryPage.expectGameCardsVisible()

      // When: 게임 카드를 클릭하고 팝업이 뜬 상태에서 외부를 클릭하면
      await libraryPage.openGamePreview(0)
      await libraryPage.closeGamePreview()

      // Then: 게임 미리보기 팝업이 닫힌다
      await libraryPage.expectGamePreviewDialogHidden()
    })

    test("1.5 게임 시작 버튼 기능 확인", async () => {
      // Given: 라이브러리에 게임 카드가 있을 때
      await libraryPage.expectGameCardsVisible()

      // When: 게임 카드를 클릭하여 게임 미리보기 팝업을 띄우고 게임 시작 버튼을 클릭하면
      await libraryPage.startGameFromPreview(0)

      // Then: 참가자 설정 화면으로 이동한다
      await libraryPage.expectToBeOnGameSetup()
    })

    // 1.6 내 게임 버튼 기능 확인은 figma에 등록되어 있는 navigation instance와 테스트 설명의 불일치로 삭제

    test("1.7 게임 만들기 버튼 기능 확인", async ({ page }) => {
      // Given: 로그인된 상태에서 라이브러리 화면에 있을 때
      await setupAuthAndGoto(page, "/games")

      // When: 게임 만들기 버튼을 클릭하면
      await libraryPage.clickCreateGame()

      // Then: 게임 만들기 화면으로 이동한다
      await libraryPage.expectToBeOnCreateGame()
    })

    test("1.8 로그아웃 기능 확인", async ({ page }) => {
      // Given: 로그인된 상태에서 라이브러리 화면에 있을 때
      await setupAuthAndGoto(page, "/games")

      // When: 아바타 버튼을 클릭하고 로그아웃 버튼을 클릭하면
      await libraryPage.logout()

      // Then: 로그아웃 된다
      await expectLoggedOut(page)
    })
  })

  test.describe("라이브러리 화면 테스트", () => {
    // 2.1 라이브러리 목록 정렬 확인은 서버의 책임이므로 따로 테스트하지 않음

    test("2.2 검색 기능 (정확한 제목, 띄어쓰기)", async () => {
      // Given: 라이브러리에 "게임90" 게임이 있을 때
      await libraryPage.expectGameCardsVisible()

      // When: 검색창에 '게임 90'를 입력 후 엔터를 누르면
      await libraryPage.searchAndVerifyGame("게임 90", "게임90")

      // And: 검색창에 '게임90'를 입력 후 엔터를 누르면
      await libraryPage.searchAndVerifyGame("게임90", "게임90")

      // Then: '게임90' 1개의 라이브러리가 검색 결과에 표시된다
      await libraryPage.expectGameCardCount(1)
    })

    test("2.3 검색 기능 (검색 결과 없음)", async () => {
      // Given: 라이브러리 화면에 있을 때
      await libraryPage.expectGameCardsVisible()

      // When: 검색창에 '레크레이션'을 입력 후 엔터를 누르면
      await libraryPage.searchAndVerifyNoResults("레크레이션")

      // Then: 검색 결과가 나타나지 않는다
      await libraryPage.expectNoSearchResults()
    })

    test("2.4 홈 버튼 기능 확인", async () => {
      // Given: 라이브러리 화면에 있을 때
      await libraryPage.expectToBeOnLibrary()

      // When: 홈 버튼을 클릭하면
      await libraryPage.clickHome()

      // Then: 홈(비로그인) 화면으로 이동한다
      await libraryPage.expectToBeOnHome()
    })
  })
})
