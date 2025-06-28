import { page } from "@vitest/browser/context"
import { expect, test } from "vitest"

test("DOM manipulation test", async () => {
  // 일부러 실패하는 테스트 - 존재하지 않는 요소를 찾음
  const element = page.getByText("This text does not exist")
  expect(element).toBeVisible()
})

test("Another failing test", () => {
  // 일부러 실패하는 테스트
  expect(1 + 1).toBe(3)
})
