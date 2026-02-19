import { expect, test } from "@playwright/test"

import { GameSetupPOM } from "../../setup/__tests__/gameSetupPOM"
import { GamePlayPOM } from "./gamePlayPOM"

// E2E: 게임 플레이 페이지 테스트
// guides/playwright-convention.mdc 및 test-convention.mdc 준수

test.describe("게임 진행 - 기본 UI", () => {
  let pageObj: GamePlayPOM
  let setupPage: GameSetupPOM

  test.beforeEach(async ({ page }) => {
    setupPage = new GameSetupPOM(page)
    await setupPage.goto("1")
    await setupPage.startGame()
    pageObj = new GamePlayPOM(page)
  })

  test("1번 문제: '정답은?' 버튼이 표시되어야 한다", async () => {
    await expect(pageObj.showAnswerButton).toBeVisible()
    await expect(pageObj.nextQuestionButton).not.toBeVisible()

    const progress = await pageObj.getProgressValue()
    expect(progress).not.toBeNull()
  })

  test("홈 로고 클릭 시 나가기 다이얼로그가 뜨고, '아니요' 클릭 시 페이지에 머문다", async ({
    page,
  }) => {
    await pageObj.clickHomeLogo()
    await pageObj.cancelExit()
    await expect(page).toHaveURL(/\/game\/\d+\/play/)
  })

  test("게임 종료 아이콘 클릭 시 나가기 다이얼로그가 뜬다", async () => {
    await pageObj.clickExitIcon()
    await expect(pageObj.exitDialogConfirmButton).toBeVisible()
    await pageObj.cancelExit()
  })

  test("점수판을 접고 다시 펼칠 수 있어야 한다", async () => {
    await pageObj.toggleScoreboard()
    await pageObj.toggleScoreboard()
  })

  test("팀 점수를 클릭 당 +1, -1씩 조정할 수 있다", async () => {
    const teamName = "A팀"
    await pageObj.increaseScore(teamName, 1)
    await pageObj.expectTeamScore(teamName, "1점")

    await pageObj.decreaseScore(teamName, 1)
    await pageObj.expectTeamScore(teamName, "0점")
  })
})

test.describe("게임 진행 - 버튼 클릭 조작", () => {
  let pageObj: GamePlayPOM
  let setupPage: GameSetupPOM

  test.beforeEach(async ({ page }) => {
    setupPage = new GameSetupPOM(page)
    await setupPage.goto("1")
    await setupPage.startGame()
    pageObj = new GamePlayPOM(page)
  })

  test("'정답은?' 버튼 클릭 시 정답이 공개되고 '다음' 버튼이 표시된다", async ({
    page,
  }) => {
    await pageObj.clickShowAnswer()
    await expect(page).toHaveURL(/answer=true/)
    await expect(pageObj.nextQuestionButton).toBeVisible()
    await expect(pageObj.showAnswerButton).not.toBeVisible()
  })

  test("정답 공개 후 '다음' 버튼 클릭 시 다음 문제로 이동한다", async ({
    page,
  }) => {
    await pageObj.clickShowAnswer()
    await pageObj.clickNext()
    await expect(page).toHaveURL(/\?q=2/)
    await expect(pageObj.showAnswerButton).toBeVisible()
  })
})

test.describe("게임 진행 - 키보드 조작", () => {
  let pageObj: GamePlayPOM
  let setupPage: GameSetupPOM

  test.beforeEach(async ({ page }) => {
    setupPage = new GameSetupPOM(page)
    await setupPage.goto("1")
    await setupPage.startGame()
    pageObj = new GamePlayPOM(page)
  })

  test("Enter 키로 정답을 공개할 수 있다", async ({ page }) => {
    await pageObj.pressEnter()
    await expect(page).toHaveURL(/answer=true/)
    await expect(pageObj.nextQuestionButton).toBeVisible()
  })

  test("→ 키로 정답을 공개할 수 있다", async ({ page }) => {
    await pageObj.pressArrowRight()
    await expect(page).toHaveURL(/answer=true/)
    await expect(pageObj.nextQuestionButton).toBeVisible()
  })

  test("정답 공개 후 Enter 키로 다음 문제로 이동할 수 있다", async ({
    page,
  }) => {
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await expect(page).toHaveURL(/\?q=2/)
    await expect(pageObj.showAnswerButton).toBeVisible()
  })

  test("정답 공개 후 → 키로 다음 문제로 이동할 수 있다", async ({ page }) => {
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressArrowRight()
    await expect(page).toHaveURL(/\?q=2/)
    await expect(pageObj.showAnswerButton).toBeVisible()
  })

  test("← 키로 이전 문제로 이동할 수 있다 (2번 문제에서)", async ({ page }) => {
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await page.waitForURL(/\?q=2/)

    await pageObj.pressArrowLeft()
    await expect(page).toHaveURL(/\?q=1/)
  })

  test("1번 문제에서 ← 키는 무반응이다", async ({ page }) => {
    const urlBefore = page.url()
    await pageObj.pressArrowLeft()
    await expect(page).toHaveURL(urlBefore)
    await expect(pageObj.showAnswerButton).toBeVisible()
  })

  test("이전 문제로 돌아가면 정답 숨김 상태로 시작한다", async ({ page }) => {
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await page.waitForURL(/\?q=2/)

    await pageObj.pressArrowLeft()
    await expect(page).toHaveURL(/\?q=1/)
    await expect(page).not.toHaveURL(/answer=true/)
    await expect(pageObj.showAnswerButton).toBeVisible()
  })
})

test.describe("게임 진행 - 문제 이동 및 진행률", () => {
  let pageObj: GamePlayPOM
  let setupPage: GameSetupPOM

  test.beforeEach(async ({ page }) => {
    setupPage = new GameSetupPOM(page)
    await setupPage.goto("1")
    await setupPage.startGame()
    pageObj = new GamePlayPOM(page)
  })

  test("다음 문제로 이동하면 진행률이 증가한다", async ({ page }) => {
    const before = await pageObj.getProgressValue()
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await expect(page).toHaveURL(/\?q=2/)

    const after = await pageObj.getProgressValue()
    expect(after).toBeGreaterThan(before!)
  })

  test("이전 문제로 이동하면 진행률이 감소한다", async ({ page }) => {
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await page.waitForURL(/\?q=2/)
    await pageObj.pressEnter()
    await page.waitForURL(/answer=true/)
    await pageObj.pressEnter()
    await page.waitForURL(/\?q=3/)

    const before = await pageObj.getProgressValue()
    await pageObj.pressArrowLeft()
    await page.waitForURL(/\?q=2/)

    const after = await pageObj.getProgressValue()
    expect(after).toBeLessThan(before!)
  })
})
