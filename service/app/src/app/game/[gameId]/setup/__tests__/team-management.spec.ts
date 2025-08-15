import { expect, test } from "@playwright/test"

import { GameSetupPage } from "./gameSetupPage"

// 최소 팀 수
const MIN_TEAMS = 2
// 최대 팀 수
const MAX_TEAMS = 10

test.describe("게임 설정 - 팀 관리 E2E 테스트", () => {
  let gameSetupPage: GameSetupPage

  test.beforeEach(async ({ page }) => {
    gameSetupPage = new GameSetupPage(page)
    await gameSetupPage.goto()
  })

  test("초기 팀 목록이 A팀과 B팀으로 렌더링 되어야 한다", async () => {
    // A팀과 B팀이 표시되는지 확인
    await gameSetupPage.expectTeamToBeVisible("A팀")
    await gameSetupPage.expectTeamToBeVisible("B팀")

    // 초기 팀 수가 최소 팀 수와 같은지 확인
    await gameSetupPage.expectTeamCount(MIN_TEAMS)
  })

  test("팀 이름이 수정되면 사이드바가 실시간으로 업데이트 되어야 한다", async () => {
    // 첫 번째 팀 입력 필드 선택
    const firstTeamInput = await gameSetupPage.getFirstTeamInput()

    // 첫 번째 팀 입력 필드가 보이고 A팀이 입력되어 있는지 확인
    await expect(firstTeamInput).toBeVisible()
    await expect(firstTeamInput).toHaveValue("A팀")

    // 팀 이름을 "슈퍼팀"으로 변경
    await gameSetupPage.changeTeamName(0, "슈퍼팀")

    // 사이드바에서 변경된 팀 이름이 표시되고 기존 이름은 사라지는지 확인
    await gameSetupPage.expectTeamToBeVisible("슈퍼팀")
    await gameSetupPage.expectTeamNotToBeVisible("A팀")
  })

  test("추가 버튼을 클릭하면 새 팀이 추가되어야 한다", async () => {
    // 초기 팀 수 확인
    const initialTeamCount = await gameSetupPage.getTeamCount()

    // 팀 추가 실행
    await gameSetupPage.addTeam()

    // 팀 수가 1 증가했는지 확인
    await gameSetupPage.expectTeamCount(initialTeamCount + 1)

    // C팀이 추가되었는지 확인
    await gameSetupPage.expectTeamToBeVisible("C팀")
    await gameSetupPage.expectTeamInputValue("C팀")
  })

  test("최소 팀 수보다 많은 경우 삭제 버튼을 클릭하면 팀이 삭제되어야 한다", async () => {
    // 팀을 하나 추가하여 3개로 만들기
    await gameSetupPage.addTeam()

    await gameSetupPage.expectTeamCount(3)

    // 첫 번째 팀의 삭제 버튼 클릭
    await gameSetupPage.deleteFirstTeam()

    // 팀 수가 1 감소했는지 확인
    await gameSetupPage.expectTeamCount(2)

    // 삭제된 팀(A팀)이 더 이상 보이지 않는지 확인
    await gameSetupPage.expectTeamInputNotVisible("A팀")
  })

  test("최소 팀 수일 때는 팀 삭제가 방지되어야 한다", async () => {
    // 초기 팀 수가 최소 팀 수인지 확인
    await gameSetupPage.expectTeamCount(MIN_TEAMS)

    // 삭제 버튼 클릭 시도
    await gameSetupPage.deleteFirstTeam()

    // 팀 수가 변하지 않았는지 확인 (삭제가 방지됨)
    await gameSetupPage.expectTeamCount(MIN_TEAMS)
  })

  test("최대 팀 수에 도달하면 추가 버튼이 비활성화되어야 한다", async () => {
    // 최대 팀 수까지 팀 추가
    await gameSetupPage.addTeamsToMax(MIN_TEAMS, MAX_TEAMS)

    // 최종 팀 수가 최대치인지 확인
    await gameSetupPage.expectTeamCount(MAX_TEAMS)

    // 추가 버튼이 비활성화되었는지 확인
    await gameSetupPage.expectAddButtonDisabled()
  })

  test("페이지 새로고침 후에는 초기 상태로 돌아가야 한다", async () => {
    // 첫 번째 팀 이름을 "테스트팀"으로 변경하고 팀 하나 추가
    await gameSetupPage.changeTeamName(0, "테스트팀")
    await gameSetupPage.addTeam()

    // 변경사항 확인
    await gameSetupPage.expectTeamCount(3)

    // 페이지 새로고침
    await gameSetupPage.reloadPage()

    // 초기 상태로 돌아갔는지 확인
    await gameSetupPage.expectTeamToBeVisible("A팀")
    await gameSetupPage.expectTeamToBeVisible("B팀")

    // 총 팀 수가 초기값(2개)으로 돌아갔는지 확인
    await gameSetupPage.expectTeamCount(MIN_TEAMS)
  })
})
