import { expect, test as setup } from "@playwright/test"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  await page.goto("/")

  await page.getByRole("button", { name: "간편로그인해서 게임 만들기" }).click()

  await expect(page.getByRole("button", { name: "내 게임" })).toBeVisible()

  await page.context().storageState({ path: authFile })
})
