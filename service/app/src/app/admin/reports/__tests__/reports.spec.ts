import { expect, test } from "@playwright/test"

import { ReportsPOM } from "./reportsPOM"

test.describe("신고접수 페이지", () => {
  test.describe("인증 및 권한", () => {
    test("비로그인 사용자는 홈으로 리다이렉트 되어야 한다", async ({
      page,
    }) => {
      await page.goto("/admin/reports")
      await page.waitForURL("/")
    })

    // test("로그인 사용자라도 ADMIN이 아닌 경우 홈으로 리다이렉트 되어야 한다", async ({
    //   page,
    // }) => {
    //   // TODO: USER role로 로그인 상태 설정 필요
    //   await page.goto("/admin/reports")
    //   await page.waitForURL("/")
    // })
  })

  test.describe("초기 UI 요소", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("초기 UI 요소가 잘 표시되어야 한다", async () => {
      await pom.checkNavigationHighlight()
      await pom.checkReportedTable()
    })
  })

  test.describe("네비게이션", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("게임 관리 클릭시 게임 관리 페이지로 이동한다", async ({ page }) => {
      await pom.clickGamesTab()
      await page.waitForURL("/admin/games")
    })

    test("회원 관리 클릭시 회원 관리 페이지로 이동한다", async ({ page }) => {
      await pom.clickUsersTab()
      await page.waitForURL("/admin/users")
    })
  })

  test.describe("기본 리스트 렌더링", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("한 화면에 표시된 row 수가 7개 이하이다", async () => {
      await pom.checkRowCount()
    })

    test("각 row에 컬럼이 존재한다 (번호, 게임명, 제작자, 신고자, 신고일자, 처리여부)", async () => {
      await pom.checkRowColumns()
    })
  })

  test.describe("신고 상세 팝업: 공통", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("신고 항목을 클릭하면 신고 내용 확인 팝업이 표시된다", async () => {
      await pom.clickReportedGameRow(0)
      await pom.checkReportDetailPopup()
    })

    test("게임 정보가 표시된다 (게임명, 전체 문제 수, 신고 사유)", async () => {
      await pom.clickReportedGameRow(0)
      await pom.checkGameInfo()
    })

    test("팝업 닫기 버튼 클릭시 팝업이 닫힌다", async () => {
      await pom.clickReportedGameRow(0)
      await pom.checkReportDetailPopup()
      await pom.clickCloseButton()
      await expect(pom.reportDetail).not.toBeVisible()
    })
  })

  test.describe("신고 상세 팝업: 삭제되지 않은 게임", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("문제 목록이 캐러셀로 노출된다", async () => {
      await pom.clickReportedGameRow(0)
      await pom.checkCarousel()
    })

    test("삭제되지 않은 게임에서 게임 삭제 클릭시 팝업이 닫히고 상태가 삭제 완료로 업데이트된다", async () => {
      await pom.clickReportedGameRow(0)

      await pom.clickDeleteGame()
      await expect(pom.reportDetail).not.toBeVisible()

      await expect(pom.reportedGameRows.nth(1)).toHaveAttribute(
        "aria-label",
        /처리 여부 삭제 완료/,
      )
    })
  })

  test.describe("신고 상세 팝업: 삭제된 게임", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })
    test("삭제된 게임의 경우 삭제 처리된 게임입니다 문구가 표시되고 캐러셀이 노출되지 않는다", async () => {
      await pom.clickReportedGameRow(1)

      await pom.checkDeletedGameMessage()
      await expect(pom.gameQuestionList).not.toBeVisible()
    })

    test("삭제된 게임 클릭시 신고 무시 버튼과 게임 삭제 버튼이 비활성화된다", async () => {
      await pom.clickReportedGameRow(1)

      await pom.checkButtonDisabled(pom.reportIgnoreButton)
      await pom.checkButtonDisabled(pom.gameDeleteButton)
    })
  })

  test.describe("신고 무시", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("신고 무시 클릭시 팝업이 닫히고 상태가 신고 무시로 업데이트된다", async () => {
      await pom.clickReportedGameRow(0)
      const row = pom.reportedGameRows.first()

      await pom.clickIgnoreReport()
      await expect(pom.reportDetail).not.toBeVisible()

      await expect(row).toHaveAttribute("aria-label", /처리 여부 신고 무시/)
    })
  })

  test.describe("사용자 차단", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    let pom: ReportsPOM

    test.beforeEach(async ({ page }) => {
      pom = new ReportsPOM(page)
      await pom.navigateToReports()
    })

    test("사용자 차단 클릭시 사용자 차단 버튼이 비활성화된다", async () => {
      await pom.clickReportedGameRow(0)
      await pom.clickBlockCreator()
      await expect(pom.reportDetail).toBeVisible()
      await pom.checkButtonDisabled(pom.blockCreatorButton)
    })
  })
})
