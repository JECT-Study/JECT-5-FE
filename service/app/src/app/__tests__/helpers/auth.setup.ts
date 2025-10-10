import { expect, test as setup } from "@playwright/test"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "JSESSIONID",
      value: "test-session-value",
      domain: "localhost",
      path: "/",
    },
  ])
  await page.goto("/")

  await page.waitForURL("/")
  await expect(page.getByRole("button", { name: "내 게임" })).toBeVisible()

  await page.context().storageState({ path: authFile })
})
