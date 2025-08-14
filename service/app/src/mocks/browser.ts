import { setupWorker } from "msw/browser"

import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)

worker.events.on("request:start", ({ request }) => {
  if (typeof document !== "undefined" && document.cookie) {
    request.headers.set("Cookie", document.cookie)
  }
})
