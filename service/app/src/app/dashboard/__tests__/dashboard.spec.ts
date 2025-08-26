import { expect, test } from "@playwright/test"

import { setupAuthAndGoto } from "@/__tests__/testUtils"

import { DashboardPage } from "./dashboardPOM"

test.describe("대시보드 E2E 테스트", () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await setupAuthAndGoto(page, "/dashboard")
  })

  test.describe("대시보드 네비게이션 테스트", () => {
    test("1.5 게임 시작 버튼 기능 확인", async () => {
      // Given: 대시보드에 게임 카드가 있을 때
      await dashboardPage.expectGameCardsVisible()

      // When: 게임 카드를 클릭하여 게임 미리보기 팝업을 띄우고 게임 시작 버튼을 클릭하면
      await dashboardPage.startGameFromPreview(0)

      // Then: 참가자 설정 화면으로 이동한다
      await dashboardPage.expectToBeOnGameSetup()
    })

    // 1.6 내 게임 버튼 기능 확인은 figma에 등록되어 있는 navigation instance와 테스트 설명의 불일치로 삭제

    test("1.7 게임 만들기 버튼 기능 확인", async () => {
      // Given: 대시보드 화면에 있을 때
      await dashboardPage.expectToBeOnDashboard()

      // When: 게임 만들기 버튼을 클릭하면
      await dashboardPage.clickCreateGame()

      // Then: 게임 만들기 화면으로 이동한다
      await dashboardPage.expectToBeOnCreateGame()
    })

    test("1.8 로그아웃 기능 확인", async ({ page }) => {
      // Given: 대시보드 화면에 있을 때
      await dashboardPage.expectToBeOnDashboard()

      // When: 아바타 버튼을 클릭하고 로그아웃 버튼을 클릭하면
      await dashboardPage.logout()

      // Then: 로그아웃 된다 (홈 화면으로 이동)
      await expect(page).toHaveURL("/")
    })
  })

  //   test.describe('대시보드 화면 테스트', () => {
  //     test('6.1 대시보드 진입 시 내 게임 목록 확인', async () => {
  //       // Given: 홈(로그인) 화면에서 내 게임 버튼을 클릭했을 때

  //       // When: 대시보드 화면이 로드되면
  //       await dashboardPage.expectToBeOnDashboard()

  //       // Then: 작성한 게임의 제목이 최신 순으로 나열된다
  //       await dashboardPage.expectGameCardsVisible()
  //       const gameCount = await dashboardPage.getGameCardCount()
  //       expect(gameCount).toBeGreaterThan(0)

  //       // 게임 제목 확인
  //       const firstGameTitle = await dashboardPage.getGameTitle(0)
  //       expect(firstGameTitle).toBeTruthy()
  //     })

  //     test('6.2 게임 옵션 버튼 기능 확인', async ({ page }) => {
  //       // Given: 대시보드에 게임 카드가 있을 때
  //       await dashboardPage.expectGameCardsVisible()

  //       // When: 각 게임 카드에 있는 게임 옵션 아이콘을 클릭하면
  //       await dashboardPage.clickGameOptions(0)

  //       // Then: 세 가지 옵션(게임 미리보기, 게임 수정, 게임 공유) 메뉴가 표시된다
  //       await dashboardPage.expectGameOptionsMenuVisible()

  //       // 메뉴 아이템들이 존재하는지 확인
  //       await expect(page.getByRole('menuitem', { name: '게임 수정' })).toBeVisible()

  //       // 게임 공유 상태에 따라 다른 메뉴 아이템 확인
  //       const isShared = await dashboardPage.isGameShared(0)

  //       if (isShared) {
  //         await expect(page.getByRole('menuitem', { name: '공유 취소' })).toBeVisible()
  //       } else {
  //         await expect(page.getByRole('menuitem', { name: '게임 공유' })).toBeVisible()
  //       }

  //       await expect(page.getByRole('menuitem', { name: '게임 삭제' })).toBeVisible()
  //     })

  //     test('6.3 게임 수정 팝업 기능 확인', async () => {
  //       // Given: 대시보드에 게임 카드가 있을 때
  //       await dashboardPage.expectGameCardsVisible()

  //       // When: 게임 옵션 아이콘 버튼을 클릭하고 게임 수정 버튼을 클릭하면
  //       await dashboardPage.editGame(0)

  //       // Then: 게임 만들기 화면으로 이동하여 해당 게임의 내용을 수정할 수 있다
  //       await dashboardPage.expectToBeOnCreateGame()
  //     })

  //     test('6.4 게임 공유 팝업 기능 확인', async () => {
  //       // Given: 대시보드에 공유되지 않은 게임이 있을 때
  //       await dashboardPage.expectGameCardsVisible()
  //       const isShared = await dashboardPage.isGameShared(0)
  //       expect(isShared).toBe(false)

  //       // When: 라이브러리로 공유를 원하는 게임의 게임 옵션 아이콘 버튼을 클릭하고 게임 공유 버튼을 클릭하면
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameShare()

  //       // Then: 게임 공유 팝업이 뜬다
  //       await dashboardPage.expectShareDialogVisible()
  //     })

  //     test('6.5 게임 공유 기능 확인 (긍정)', async ({ page }) => {
  //       // Given: 게임 공유 팝업이 뜬 상태일 때
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameShare()
  //       await dashboardPage.expectShareDialogVisible()

  //       // When: 네 버튼을 클릭하면
  //       await dashboardPage.confirmDialog()

  //       // Then: 해당 게임이 라이브러리에 공유되고 게임 카드에 공유 배지가 표시된다
  //       await expect(page.getByRole('status', { name: '공유된 게임' })).toBeVisible()
  //     })

  //     test('6.6 게임 공유 기능 확인 (부정)', async ({ page }) => {
  //       // Given: 게임 공유 팝업이 뜬 상태일 때
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameShare()
  //       await dashboardPage.expectShareDialogVisible()

  //       // When: 아니오 버튼을 클릭하면
  //       await dashboardPage.cancelDialog()

  //       // Then: 팝업이 사라진다
  //       await expect(page.getByRole('dialog', { name: /게임 공유/ })).not.toBeVisible()
  //     })

  //     test('6.7 게임 공유 취소 팝업 기능 확인', async () => {
  //       // Given: 대시보드에 공유된 게임이 있을 때
  //       await dashboardPage.expectGameCardsVisible()
  //       const isShared = await dashboardPage.isGameShared(0)
  //       expect(isShared).toBe(true)

  //       // When: 라이브러리로 공유된 게임의 게임 옵션 아이콘 버튼을 클릭하고 게임 공유 취소 버튼을 클릭하면
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameUnshare()

  //       // Then: 게임 공유 취소 팝업이 뜬다
  //       await dashboardPage.expectUnshareDialogVisible()
  //     })

  //     test('6.8 게임 공유 취소 기능 확인 (긍정)', async ({ page }) => {
  //       // Given: 게임 공유 취소 팝업이 뜬 상태일 때
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameUnshare()
  //       await dashboardPage.expectUnshareDialogVisible()

  //       // When: 네 버튼을 클릭하면
  //       await dashboardPage.confirmDialog()

  //       // Then: 해당 게임이 라이브러리의 공유가 해제되고 게임 카드의 공유 배지가 사라진다
  //       await expect(page.getByRole('status', { name: '공유된 게임' })).not.toBeVisible()
  //     })

  //     test('6.9 게임 공유 취소 기능 확인 (부정)', async ({ page }) => {
  //       // Given: 게임 공유 취소 팝업이 뜬 상태일 때
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameUnshare()
  //       await dashboardPage.expectUnshareDialogVisible()

  //       // When: 아니오 버튼을 클릭하면
  //       await dashboardPage.cancelDialog()

  //       // Then: 팝업이 사라진다
  //       await expect(page.getByRole('dialog', { name: /게임 공유 취소/ })).not.toBeVisible()
  //     })

  //     test('6.10 게임 삭제 팝업 기능 확인', async () => {
  //       // Given: 대시보드에 게임 카드가 있을 때
  //       await dashboardPage.expectGameCardsVisible()

  //       // When: 게임 옵션 아이콘 버튼을 클릭하고 게임 삭제 버튼을 클릭하면
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameDelete()

  //       // Then: 게임 삭제 팝업이 뜬다
  //       await dashboardPage.expectDeleteDialogVisible()
  //     })

  //     test('6.11 게임 삭제 기능 확인 (긍정)', async ({ page }) => {
  //       // Given: 게임 삭제 팝업이 뜬 상태일 때
  //       const initialCount = await dashboardPage.getGameCardCount()
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameDelete()
  //       await dashboardPage.expectDeleteDialogVisible()

  //       // When: 네 버튼을 클릭하면
  //       await dashboardPage.confirmDialog()

  //       // Then: 팝업이 사라지고 게임이 삭제된다
  //       await expect(page.getByRole('dialog', { name: /게임 삭제/ })).not.toBeVisible()
  //       const finalCount = await dashboardPage.getGameCardCount()
  //       expect(finalCount).toBe(initialCount - 1)
  //     })

  //     test('6.12 게임 삭제 기능 확인 (부정)', async ({ page }) => {
  //       // Given: 게임 삭제 팝업이 뜬 상태일 때
  //       const initialCount = await dashboardPage.getGameCardCount()
  //       await dashboardPage.clickGameOptions(0)
  //       await dashboardPage.clickGameDelete()
  //       await dashboardPage.expectDeleteDialogVisible()

  //       // When: 아니오 버튼을 클릭하면
  //       await dashboardPage.cancelDialog()

  //       // Then: 팝업이 사라진다
  //       await expect(page.getByRole('dialog', { name: /게임 삭제/ })).not.toBeVisible()
  //       const finalCount = await dashboardPage.getGameCardCount()
  //       expect(finalCount).toBe(initialCount) // 게임 수가 유지됨
  //     })
  //   })
})
