import { expect, type Locator, type Page } from "@playwright/test"

export class GameSetupPOM {
  readonly page: Page
  readonly addTeamButton: Locator
  readonly teamInputs: Locator
  readonly sidebar: Locator
  readonly deleteButtons: Locator
  readonly startButton: Locator

  constructor(page: Page) {
    this.page = page
    this.addTeamButton = page.getByRole("button", {
      name: "참가자 및 팀 추가하기",
    })
    this.teamInputs = page.locator('input[name^="team-"]')
    this.sidebar = page.getByRole("complementary")
    this.deleteButtons = page.getByRole("button", { name: "clear input" })
    this.startButton = page.getByRole("button", { name: "게임 시작" })
  }

  async goto(gameId: string = "1") {
    await this.page.goto(`game/${gameId}/setup`)
    await this.page.waitForLoadState("networkidle")
  }

  async addTeam(): Promise<void> {
    await expect(this.addTeamButton).toBeEnabled()
    await this.addTeamButton.click()
  }

  async getTeamCount(): Promise<number> {
    return await this.teamInputs.count()
  }

  async getFirstTeamInput(): Promise<Locator> {
    return this.teamInputs.first()
  }

  async changeTeamName(index: number, newName: string): Promise<void> {
    const teamInput = this.teamInputs.nth(index)
    await teamInput.clear()
    await teamInput.fill(newName)
  }

  async deleteFirstTeam(): Promise<void> {
    await this.deleteButtons.first().click()
  }

  async addTeamsToMax(minTeams: number, maxTeams: number): Promise<void> {
    const teamsToAdd = maxTeams - minTeams

    for (let i = 0; i < teamsToAdd; i++) {
      await expect(this.addTeamButton).toBeEnabled()
      await this.addTeamButton.click()

      const currentTeamCount = await this.getTeamCount()
      expect(currentTeamCount).toBe(minTeams + i + 1)
    }
  }

  async expectTeamToBeVisible(teamName: string): Promise<void> {
    await expect(this.page.getByText(teamName)).toBeVisible()
  }

  async expectTeamNotToBeVisible(teamName: string): Promise<void> {
    await expect(this.page.getByText(teamName)).not.toBeVisible()
  }

  async expectTeamInputValue(value: string): Promise<void> {
    await expect(this.page.locator(`input[value="${value}"]`)).toBeVisible()
  }

  async expectTeamInputNotVisible(value: string): Promise<void> {
    await expect(this.page.locator(`input[value="${value}"]`)).not.toBeVisible()
  }

  async expectSidebarNotVisible(): Promise<void> {
    await expect(this.sidebar).not.toBeVisible()
  }

  async expectAddButtonDisabled(): Promise<void> {
    await expect(this.addTeamButton).toBeDisabled()
  }

  async expectAddButtonEnabled(): Promise<void> {
    await expect(this.addTeamButton).toBeEnabled()
  }

  async expectTeamCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getTeamCount()
    expect(actualCount).toBe(expectedCount)
  }

  async reloadPage(): Promise<void> {
    await this.page.reload()
    await this.page.waitForLoadState("networkidle")
  }

  async startGame(): Promise<void> {
    await expect(this.startButton).toBeEnabled()
    await this.startButton.click()
    await expect(this.page).toHaveURL(/\/game\/\d+\/play/)
  }
}
