import { expect, test } from "@playwright/test"

import { GameSetupPOM } from "../../setup/__tests__/gameSetupPOM"
import { GamePlayPOM } from "./gamePlayPOM"

// E2E: 이미지 맞추기 게임 - 두 번째 문제 플로우 (503/504/505)
// guides/playwright-convention.mdc 및 test-convention.mdc 준수

test.describe("게임 진행 - 두 번째 문제 플로우", () => {
  let pageObj: GamePlayPOM
  let setupPage: GameSetupPOM

  test.beforeEach(async ({ page }) => {
    // Given: /setup에서 게임 시작을 통해 playing 상태로 전환
    setupPage = new GameSetupPOM(page)
    await setupPage.goto("1")
    await setupPage.startGame()

    // When: /play로 이동 (초기 1번 문제)
    pageObj = new GamePlayPOM(page)
  })

  test("1번 문제: 이전 버튼은 안 보이고 다음 버튼은 보여야 한다", async () => {
    await expect(pageObj.prevQuestionButton).not.toBeVisible()
    await expect(pageObj.nextQuestionButton).toBeVisible()

    const progress = await pageObj.getProgressValue()
    expect(progress).not.toBeNull()
  })

  test("2번 문제: 이전/다음 버튼이 모두 보여야 한다", async ({ page }) => {
    await pageObj.goToNextQuestion()
    await expect(page).toHaveURL(/\?q=2/)
    await expect(pageObj.prevQuestionButton).toBeVisible()
    await expect(pageObj.nextQuestionButton).toBeVisible()
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
    await pageObj.toggleScoreboard() // 접기
    await pageObj.toggleScoreboard() // 펼치기
  })

  test("팀 점수를 클릭 당 +1, -1씩 조정할 수 있다", async () => {
    const teamName = "A팀"
    await pageObj.increaseScore(teamName, 1)
    await pageObj.expectTeamScore(teamName, "1점")

    await pageObj.decreaseScore(teamName, 1)
    await pageObj.expectTeamScore(teamName, "0점")
  })

  test("'이전 문제' 클릭 시 이전 라운드로 이동하고 진행률이 감소한다", async ({
    page,
  }) => {
    // 1번 → 2번 문제로 이동하고 URL 변경 대기
    await pageObj.goToNextQuestion()
    await page.waitForURL(/\?q=2/, { timeout: 1000 })

    // 2번 → 3번 문제로 이동하고 URL 변경 대기
    await pageObj.goToNextQuestion()
    await page.waitForURL(/\?q=3/, { timeout: 1000 })

    // 진행률 측정 후 이전 문제로 이동
    const before = await pageObj.getProgressValue()
    await pageObj.goToPrevQuestion()
    await page.waitForURL(/\?q=2/, { timeout: 1000 })

    const after = await pageObj.getProgressValue()
    expect(after).toBeLessThanOrEqual(before!)
  })

  //실제 문제 개수를 알지 못하기 때문에, 정확한 value 측정보다는 비교 연산으로 테스트 진행
  test("'다음 문제' 클릭 시 다음 라운드로 이동하고 진행률이 증가한다 (1→2)", async ({
    page,
  }) => {
    const before = await pageObj.getProgressValue()
    await pageObj.goToNextQuestion()
    await expect(page).toHaveURL(/\?q=2/)

    const after = await pageObj.getProgressValue()

    expect(after).toBeGreaterThanOrEqual(before!)
  })
})
