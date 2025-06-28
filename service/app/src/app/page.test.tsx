import { expect, test } from "vitest"

test("Simple math test", () => {
  expect(1 + 1).toBe(2)
})

test("String test", () => {
  expect("hello").toBe("hello")
})

test("Array test", () => {
  const arr = [1, 2, 3]
  expect(arr).toHaveLength(3)
})
