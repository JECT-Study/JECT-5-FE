import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll } from "vitest"

import { handlers } from "../handlers"

const server = setupServer(...handlers)

beforeAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  server.listen({
    onUnhandledRequest: "error",
  })
})

afterAll(async () => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})
