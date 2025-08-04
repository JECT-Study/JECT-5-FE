"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@shared/design/src/components/dialog"
import { overlay } from "overlay-kit"

import { saveGame } from "../utils/gameSave"
import { useGameCreationContext } from "./state/create/gameCreationContext"
import { selectors } from "./state/create/selectors"

export function useGamePopupActions() {
  const { state, actions } = useGameCreationContext()

  const showSaveConfirm = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogHeader>게임을 저장하시겠습니까?</DialogHeader>
            <DialogFooter variant="onlyTitle">
              <DialogClose asChild>
                <DialogButton.Secondary>아니요</DialogButton.Secondary>
              </DialogClose>
              <DialogClose asChild>
                <DialogButton.Primary
                  onClick={async () => {
                    try {
                      actions.saveGameStart()

                      const cleanedQuestions = selectors.cleanedQuestions(state)

                      const result = await saveGame({
                        ...state,
                        questions: cleanedQuestions,
                      })

                      if (result.success) {
                        actions.saveGameSuccess()
                      } else {
                        actions.saveGameError(
                          result.error || "저장에 실패했습니다.",
                        )
                      }
                    } catch (error) {
                      actions.saveGameError("알 수 없는 오류가 발생했습니다.")
                    }
                  }}
                >
                  네
                </DialogButton.Primary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showFileSizeError = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogBody>최대 2MB 이하 이미지만 업로드 가능합니다.</DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogClose asChild>
                <DialogButton.Secondary>닫기</DialogButton.Secondary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showFileTypeError = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogBody>JPG, JPEG, PNG 파일만 업로드 가능합니다.</DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogClose asChild>
                <DialogButton.Secondary>닫기</DialogButton.Secondary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showLibraryRegister = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogHeader>
              이 게임을 라이브러리에 등록하시겠습니까?
            </DialogHeader>
            <DialogBody>
              등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이
              불가능합니다.
            </DialogBody>
            <DialogFooter variant="title">
              <DialogClose asChild>
                <DialogButton.Secondary>아니요</DialogButton.Secondary>
              </DialogClose>
              <DialogClose asChild>
                <DialogButton.Primary>네</DialogButton.Primary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showSaveError = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogBody>
              저장 중 오류가 발생했습니다. <br />
              네트워크 상태를 확인하거나, 잠시 후 <br />
              다시 시도해 주세요.
            </DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogClose asChild>
                <DialogButton.Secondary>닫기</DialogButton.Secondary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showValidationError = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent>
            <DialogBody>
              입력하지 않은 질문 또는 답안이 있습니다. <br />
              모든 필수 항목을 작성한 후 다시 저장해 주세요.
            </DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogClose asChild>
                <DialogButton.Secondary>닫기</DialogButton.Secondary>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  return {
    showSaveConfirm,
    showFileSizeError,
    showFileTypeError,
    showLibraryRegister,
    showSaveError,
    showValidationError,
  }
}
