import { type Locator, type Page } from "@playwright/test"

export class CreatePOM {
  readonly page: Page

  // 네비게이션 영역
  readonly gameNameInput: Locator
  readonly saveGameButton: Locator
  readonly crossButton: Locator
  readonly themeToggleButton: Locator

  // 파일 업로드 영역
  readonly fileUploadArea: Locator
  readonly uploadedImage: Locator
  readonly changeImageButton: Locator
  readonly deleteImageButton: Locator

  // 질문 리스트 영역
  readonly questionList: Locator
  //   readonly addQuestionButton: Locator

  // 질문/답안 입력 영역
  readonly questionInput: Locator
  readonly answerInput: Locator

  // 팝업
  readonly saveGamePopup: Locator
  readonly serverErrorPopup: Locator
  readonly requiredValuePopup: Locator
  readonly exitPopup: Locator
  readonly invalidFilePopup: Locator

  // question 컴포넌트
  readonly questionComponents: Locator

  constructor(page: Page) {
    this.page = page

    // 네비게이션 영역
    this.gameNameInput = page.getByPlaceholder("게임 이름 입력")
    this.saveGameButton = page.getByRole("button", { name: "게임 저장" })
    this.crossButton = page.getByTestId("cross-button")
    this.themeToggleButton = page.getByTestId("theme-toggle-button")

    // 파일 업로드 영역
    this.fileUploadArea = page.getByTestId("file-upload-area")
    this.uploadedImage = page.getByAltText("업로드된 이미지")
    this.changeImageButton = page.getByRole("button", { name: "이미지 변경" })
    this.deleteImageButton = page.getByRole("button", { name: "이미지 삭제" })

    // 질문 리스트 영역
    this.questionList = page.getByTestId("question-list")
    // this.addQuestionButton = page.getByRole("button", { name: "문제 추가하기" })

    // 질문/답안 입력 영역
    this.questionInput = page.getByPlaceholder("질문 입력")
    this.answerInput = page.getByPlaceholder("답안 입력")

    // 팝업
    this.exitPopup = page.getByRole("dialog", {
      name: /게임을 저장하지 않았습니다/,
    })
    this.serverErrorPopup = page.getByRole("dialog", {
      name: /저장 중 오류가 발생했습니다/,
    })
    this.requiredValuePopup = page.getByRole("dialog", {
      name: /입력하지 않은 질문 또는 답안이 있습니다/,
    })
    this.saveGamePopup = page.getByRole("dialog", {
      name: /게임을 저장하시겠습니까/,
    })
    this.invalidFilePopup = page.getByRole("dialog").filter({
      hasText: /JPG, JPEG, PNG 형식만 가능하며/,
    })
    this.questionComponents = page.getByRole("group", {
      name: /^\d+번째 문제$/,
    })
  }

  getPopupConfirmButton(popup: Locator) {
    return popup.getByRole("button", { name: "네" })
  }

  getPopupCancelButton(popup: Locator) {
    return popup.getByRole("button", { name: "아니요" })
  }

  async clickPopupConfirmButton(popup: Locator) {
    await this.getPopupConfirmButton(popup).click()
  }

  async clickPopupCancelButton(popup: Locator) {
    await this.getPopupCancelButton(popup).click()
  }

  getQuestionComponent(index: number) {
    return this.questionComponents.nth(index - 1)
  }

  getQuestionTitle(index: number) {
    return this.getQuestionComponent(index).getByRole("heading")
  }

  getQuestionImage(index: number) {
    return this.getQuestionComponent(index).getByRole("img")
  }

  getQuestionDeleteButton(index: number) {
    return this.getQuestionComponent(index).getByRole("button", {
      name: `${index}번째 문제 삭제`,
    })
  }

  getQuestionMoveUpButton(index: number) {
    return this.getQuestionComponent(index).getByRole("button", {
      name: `${index}번째 문제 위로 이동`,
    })
  }

  getQuestionMoveDownButton(index: number) {
    return this.getQuestionComponent(index).getByRole("button", {
      name: `${index}번째 문제 아래로 이동`,
    })
  }

  async clickSaveGameButton() {
    await this.saveGameButton.click()
  }

  async clickCrossButton() {
    await this.crossButton.click()
  }

  async clickThemeToggleButton() {
    await this.themeToggleButton.click()
  }

  async fillQuestionInput(question: string) {
    await this.questionInput.fill(question)
  }

  async fillAnswerInput(answer: string) {
    await this.answerInput.fill(answer)
  }

  async fillQuestionAndAnswer(question: string, answer: string) {
    await this.questionInput.clear()
    await this.answerInput.clear()
    await this.fillQuestionInput(question)
    await this.fillAnswerInput(answer)
  }

  async fillGameName(gameName: string) {
    await this.gameNameInput.clear()
    await this.gameNameInput.fill(gameName)
  }

  async clickFileUploadArea() {
    await this.fileUploadArea.click()
  }

  async uploadImage(filePath: string) {
    await this.page.locator("input[type='file']").setInputFiles(filePath)
  }

  get imageContainer() {
    return this.uploadedImage.locator("..")
  }

  async saveGame() {
    await this.saveGameButton.click()
    await this.clickPopupConfirmButton(this.saveGamePopup)
    await this.page.waitForURL("/dashboard")
  }
}
