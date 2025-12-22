import { test as setup } from "@playwright/test"

setup("attach browser logs", async ({ page }) => {
  page.on("console", (msg) => {
    console.log(`[browser:${msg.type()}] ${msg.text()}`)
  })

  page.on("pageerror", (err) => {
    console.log(`[pageerror] ${err.message}\n${err.stack ?? ""}`)
  })

  page.on("requestfailed", (req) => {
    console.log(
      `[requestfailed] ${req.method()} ${req.url()} -> ${req.failure()?.errorText ?? "unknown"}`,
    )
  })

  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.log(
        `[response:${res.status()}] ${res.request().method()} ${res.url()}`,
      )
    }
  })
})
