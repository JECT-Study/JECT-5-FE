import { expect, test } from "@playwright/test"

// default로 A팀,B팀이 존재
// 팀 최소 2명, 최대 10명
// 팀명 수정, 팀 추가, 팀 삭제 기능 테스트
test.describe("GameSetup - 팀 관리 E2E 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/game/1/setup")
  })

  test("초기 팀 목록(A팀, B팀)이 렌더링된다", async ({ page }) => {
    // 좌측 사이드바 팀 목록 확인
    const sidebar = page.locator("aside")
    await expect(sidebar).toBeVisible()

    // 초기 팀명 확인
    await expect(page.getByText("A팀")).toBeVisible()
    await expect(page.getByText("B팀")).toBeVisible()
  })

  test("팀명을 수정하면 사이드바가 실시간 업데이트된다", async ({ page }) => {
    const firstTeamInput = page.locator("input").first()
    await expect(firstTeamInput).toBeVisible()
    await expect(firstTeamInput).toHaveValue("A팀")

    // 팀명 변경
    await firstTeamInput.fill("슈퍼팀")

    // 사이드바에서 변경된 팀명 확인
    await expect(page.getByText("슈퍼팀")).toBeVisible()
    await expect(page.getByText("A팀")).not.toBeVisible()
  })

  test("참가자 및 팀 추가하기 버튼으로 새 팀을 추가할 수 있다", async ({
    page,
  }) => {
    const addButton = page.getByText("참가자 및 팀 추가하기")
    await expect(addButton).toBeVisible()

    // 팀 추가
    await addButton.click()

    // C팀이 추가되었는지 확인
    await expect(page.getByText("C팀")).toBeVisible()
    await expect(page.locator('input[value="C팀"]')).toBeVisible()
  })

  test("팀 삭제 버튼으로 팀을 제거할 수 있다", async ({ page }) => {
    // 먼저 팀을 추가 (3팀 이상이어야 삭제 가능)
    const addButton = page.getByText("참가자 및 팀 추가하기")
    await addButton.click()

    // 삭제 버튼 클릭 (리셋 아이콘)
    const deleteButton = page.locator('[aria-label="clear input"]').first()
    await deleteButton.click()

    // A팀이 삭제되었는지 확인
    await expect(page.locator('input[value="A팀"]')).not.toBeVisible()
  })

  test("2팀(최소)일 때 삭제 버튼 클릭 시 팀이 삭제되지 않는다", async ({
    page,
  }) => {
    // 초기 상태에서는 2팀이므로 삭제 버튼 클릭해도 팀이 삭제되지 않아야 함
    const deleteButtons = page.locator('[aria-label="clear input"]')
    const initialTeamCount = await page.locator('input[type="text"]').count()

    // 삭제 버튼 클릭
    await deleteButtons.first().click()

    // 팀 개수가 그대로 유지되는지 확인
    const currentTeamCount = await page.locator('input[type="text"]').count()
    expect(currentTeamCount).toBe(initialTeamCount)
    //현재는 input 내부의 reset버튼으로 팀 삭제를 제어하고 있어 추후 변경가능
  })

  test("10팀 달성 시 추가 버튼이 비활성화된다", async ({ page }) => {
    const addButton = page.getByText("참가자 및 팀 추가하기")

    // 8번 더 추가해서 10팀 만들기
    for (let i = 0; i < 8; i++) {
      await addButton.click()
    }

    // 10팀 달성 시 버튼 비활성화 확인
    await expect(addButton).toBeDisabled()
  })
})
