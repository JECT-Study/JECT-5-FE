import { expect, test } from "@playwright/test"

import { CreatePOM } from "./createPOM"

// E2E: 게임 생성 페이지
// guides/playwright-convention.mdc 및 test-convention.mdc 준수

test.describe("게임 생성 페이지: 비로그인 상태", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
  })

  test("비로그인 상태에서 접근하면 alert 표시 후 홈 화면으로 이동해야 한다", async ({
    page,
  }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept()
      await page.waitForURL("/")
    })
  })
})

test.describe("게임 생성 페이지: 게임 신규 생성", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("네비게이션의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.gameNameInput).toBeVisible()
    await expect(pageObj.saveGameButton).toBeVisible()
    await expect(pageObj.crossButton).toBeVisible()
    await expect(pageObj.themeToggleButton).toBeVisible()
  })

  test("파일 업로드 영역이 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.fileUploadArea).toBeVisible()
    await expect(pageObj.uploadedImage).not.toBeVisible()
  })

  test("질문 리스트의 요소들이 모두 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.questionList).toBeVisible()
    await expect(pageObj.questionComponents).toHaveCount(1)
  })

  test("질문/답안 입력 영역이 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.questionInput).toBeVisible()
    await expect(pageObj.answerInput).toBeVisible()
  })

  test("기본 게임 이름이 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.gameNameInput).toHaveValue("새 게임")
  })
})

test.describe("게임 생성 페이지: 네비게이션 기능 확인", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("테마 토글 버튼을 클릭하면 테마가 변경되어야 한다", async () => {
    await pageObj.themeToggleButton.click()
    await expect(pageObj.themeToggleButton).toHaveText(
      "다크 모드에서 라이트 모드로",
    )
    await pageObj.themeToggleButton.click()
    await expect(pageObj.themeToggleButton).toHaveText(
      "라이트 모드에서 다크 모드로",
    )
  })
})

test.describe("게임 생성 페이지: 게임 수정", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)

    await pageObj.fillGameName("테스트")
    await pageObj.fillQuestionAndAnswer(
      "문제 1: 이것은 1번째 문제입니다.",
      "정답 1",
    )
    await pageObj.uploadImage("public/exampleThumbnail.jpg")
    await pageObj.clickSaveGameButton()
    await pageObj.clickPopupConfirmButton(pageObj.saveGamePopup)
    await page.waitForURL("/dashboard")

    const newGameCard = page.getByRole("group", { name: "게임 카드" }).first()
    await newGameCard.getByRole("button", { name: "게임 옵션" }).click()
    await page.getByRole("menuitem", { name: "게임 수정" }).click()

    await page.waitForURL(/\/create/)
  })

  test("게임 수정 페이지에 들어왔을 경우, 기본 게임 이름이 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.gameNameInput).toHaveValue("테스트")
  })

  test("게임 수정 페이지에 들어왔을 경우, 기본 질문이 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.questionInput).toHaveValue(
      "문제 1: 이것은 1번째 문제입니다.",
    )
    await expect(pageObj.answerInput).toHaveValue("정답 1")
  })

  test("게임 수정 페이지에 들어왔을 경우, 기본 이미지가 알맞게 표시되어야 한다", async () => {
    await expect(pageObj.uploadedImage).toBeVisible()
  })

  // test("게임 수정 페이지에 들어왔을 경우, 기본 질문 리스트가 알맞게 표시되어야 한다", async () => {
  //   await expect(pageObj.questionList).toBeVisible()
  //   await expect(pageObj.questionComponents).toHaveCount(1)
  // })
})

test.describe("게임 생성 페이지: 유효성 검사", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("게임 제목이 비어있을 경우 게임 저장 버튼이 비활성화되어야 한다", async () => {
    await pageObj.fillGameName("")
    await expect(pageObj.saveGameButton).toBeDisabled()
  })

  test("파일 업로드 영역에 잘못된 파일을 업로드하면 에러 오버레이가 표시되어야 한다", async () => {
    await pageObj.clickFileUploadArea()
    await pageObj.uploadImage("public/logo.svg")
    await expect(pageObj.invalidFilePopup).toBeVisible()
  })

  test("질문/답안 입력 영역에 입력값이 없을 경우 게임 저장 버튼이 비활성화되어야 한다", async () => {
    await pageObj.fillQuestionInput("")
    await pageObj.fillAnswerInput("")
    await expect(pageObj.saveGameButton).toBeDisabled()
  })

  test("질문/답안 입력 영역, 게임 제목에 입력값이 있을 경우 게임 저장 버튼이 활성화되어야 한다", async () => {
    await pageObj.fillGameName("새 게임")
    await pageObj.fillQuestionInput("질문")
    await pageObj.fillAnswerInput("답안")
    await expect(pageObj.saveGameButton).toBeEnabled()
  })
})

// test.describe("게임 생성 페이지: 문제 관리", () => {
//   test.use({ storageState: "playwright/.auth/user.json" })

//   let pageObj: CreatePOM

//   test.beforeEach(async ({ page }) => {
//     await page.goto("/create")
//     pageObj = new CreatePOM(page)
//   })

//   test("문제 추가 버튼을 클릭하면 새 문제가 추가되어야 한다", async () => {})
// })

test.describe("게임 생성 페이지: 이미지 업로드", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("이미지 업로드 영역에 파일을 업로드하면 이미지가 알맞게 표시되어야 한다", async () => {
    await pageObj.clickFileUploadArea()
    await pageObj.uploadImage("public/exampleThumbnail.jpg")
    await expect(pageObj.uploadedImage).toBeVisible()
  })

  test("이미지 업로드 영역에 업로드된 이미지가 있을 경우 호버시 오버레이가 표시되어야 한다", async () => {
    await pageObj.clickFileUploadArea()
    await pageObj.uploadImage("public/exampleThumbnail.jpg")
    await expect(pageObj.uploadedImage).toBeVisible()
    await pageObj.imageContainer.hover()
    await expect(pageObj.changeImageButton).toBeVisible()
  })

  test("이미지 업로드 영역에 업로드된 이미지가 있을 경우 오버레이의 우측 상단 Cross 버튼을 클릭하면 이미지가 삭제되어야 한다", async () => {})

  test("이미지 업로드 영역에 잘못된 파일을 업로드하면 에러 오버레이가 표시되어야 한다", async () => {
    await pageObj.clickFileUploadArea()
    await pageObj.uploadImage("public/spinner.gif")
  })
})

test.describe("게임 생성 페이지: 게임 저장", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("질문/답안 입력 영역에 입력값이 없을 경우 게임 저장 버튼이 비활성화되어야 한다", async () => {
    await expect(pageObj.saveGameButton).toBeDisabled()
  })

  test("질문/답안 입력 영역에 입력값이 있을 경우 게임 저장 버튼이 활성화되어야 한다", async () => {
    await pageObj.fillQuestionAndAnswer("질문", "답안")
    await expect(pageObj.saveGameButton).toBeEnabled()
  })

  test("게임 저장 버튼을 클릭하면 게임 저장 팝업이 표시되어야 한다", async () => {
    await pageObj.fillQuestionAndAnswer("질문", "답안")
    await pageObj.clickSaveGameButton()
    await expect(pageObj.saveGamePopup).toBeVisible()
  })

  test("게임 저장 팝업에서 '네'를 클릭하면 게임이 저장되고 대시보드로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.fillQuestionAndAnswer("질문", "답안")
    await pageObj.clickSaveGameButton()
    await pageObj.clickPopupConfirmButton(pageObj.saveGamePopup)
    await page.waitForURL("/dashboard")
  })

  test("게임 저장 팝업에서 '네'를 클릭한 뒤 대시보드로 이동하면, 새롭게 생성된 게임을 확인할 수 있어야 한다", async ({
    page,
  }) => {
    await pageObj.fillQuestionAndAnswer("질문", "답안")
    await pageObj.clickSaveGameButton()
    await pageObj.clickPopupConfirmButton(pageObj.saveGamePopup)
    await page.waitForURL("/dashboard")
    const gameCard = page.getByRole("group", { name: "게임 카드" }).first()
    await expect(gameCard).toBeVisible()
    const gameTitle = gameCard.getByRole("heading", { level: 3 })
    await expect(gameTitle).toHaveText("새 게임")
  })

  test("게임 저장 팝업에서 '아니요'를 클릭하면 팝업이 닫히고 페이지에 머무르게 되어야 한다", async () => {
    await pageObj.fillQuestionAndAnswer("질문", "답안")
    await pageObj.clickSaveGameButton()
    await pageObj.clickPopupCancelButton(pageObj.saveGamePopup)
    await expect(pageObj.saveGamePopup).not.toBeVisible()
  })
})

test.describe("게임 생성 페이지: 나가기", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  let pageObj: CreatePOM

  test.beforeEach(async ({ page }) => {
    await page.goto("/create")
    pageObj = new CreatePOM(page)
  })

  test("닫기 아이콘을 클릭하면 나가기 팝업이 표시되어야 한다", async () => {
    await pageObj.clickCrossButton()
    await expect(pageObj.exitPopup).toBeVisible()
  })

  test("나가기 팝업에서 '아니요'를 클릭하면 팝업이 닫히고 페이지에 머무르게 되어야 한다", async () => {
    await pageObj.clickCrossButton()
    await pageObj.clickPopupCancelButton(pageObj.exitPopup)
    await expect(pageObj.exitPopup).not.toBeVisible()
  })

  test("나가기 팝업에서 '네'를 클릭하면 게임 저장 없이 홈화면으로 이동해야 한다", async ({
    page,
  }) => {
    await pageObj.clickCrossButton()
    await pageObj.clickPopupConfirmButton(pageObj.exitPopup)
    await page.waitForURL("/")
  })
})
