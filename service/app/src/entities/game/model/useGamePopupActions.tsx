"use client"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@shared/design/src/components/dialog"
import { overlay } from "overlay-kit"

export function useGamePopupActions() {
  const showSaveConfirm = (onConfirm: () => void) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent
            data-testid="save-dialog"
            role="dialog"
            aria-labelledby="save-dialog-title"
            aria-describedby="save-dialog-description"
          >
            <DialogHeader id="save-dialog-title">게임을 저장하시겠습니까?</DialogHeader>
            <DialogFooter variant="onlyTitle">
              <DialogButton.Secondary 
                onClick={() => close()}
                data-testid="dialog-no-button"
                aria-label="저장 취소"
              >
                아니요
              </DialogButton.Secondary>
              <DialogButton.Primary
                onClick={() => {
                  onConfirm()
                  close()
                }}
                data-testid="dialog-yes-button"
                aria-label="저장 확인"
              >
                네
              </DialogButton.Primary>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showFileUploadError = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent
            data-testid="upload-error-dialog"
            role="dialog"
            aria-labelledby="upload-error-dialog-title"
            aria-describedby="upload-error-dialog-description"
          >
            <DialogBody id="upload-error-dialog-description">
              JPG, JPEG, PNG 형식만 가능하며, 최대 2MB까지 업로드할 수 있습니다.
            </DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogButton.Secondary 
                onClick={() => close()}
                data-testid="dialog-close-button"
                aria-label="업로드 에러 팝업 닫기"
              >
                닫기
              </DialogButton.Secondary>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  const showLibraryRegister = (onConfirm: () => void) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
          <DialogContent
            data-testid="exit-dialog"
            role="dialog"
            aria-labelledby="exit-dialog-title"
            aria-describedby="exit-dialog-description"
          >
            <DialogHeader id="exit-dialog-title">
              게임을 저장하지 않았습니다. 정말 나가시겠습니까?
            </DialogHeader>
            <DialogBody id="exit-dialog-description">저장하지 않으면 모든 변경사항이 사라집니다.</DialogBody>
            <DialogFooter variant="title">
              <DialogButton.Secondary 
                onClick={() => close()}
                data-testid="dialog-no-button"
                aria-label="나가기 취소"
              >
                아니요
              </DialogButton.Secondary>
              <DialogButton.Primary
                onClick={() => {
                  onConfirm()
                  close()
                }}
                data-testid="dialog-yes-button"
                aria-label="나가기 확인"
              >
                네
              </DialogButton.Primary>
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
          <DialogContent
            data-testid="error-dialog"
            role="dialog"
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
          >
            <DialogBody id="error-dialog-description">
              저장 중 오류가 발생했습니다. <br />
              네트워크 상태를 확인하거나, 잠시 후 <br />
              다시 시도해 주세요.
            </DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogButton.Secondary 
                onClick={() => close()}
                data-testid="dialog-close-button"
                aria-label="에러 팝업 닫기"
              >
                닫기
              </DialogButton.Secondary>
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
          <DialogContent
            data-testid="validation-error-dialog"
            role="dialog"
            aria-labelledby="validation-error-dialog-title"
            aria-describedby="validation-error-dialog-description"
          >
            <DialogBody id="validation-error-dialog-description">
              입력하지 않은 질문 또는 답안이 있습니다. <br />
              모든 필수 항목을 작성한 후 다시 저장해 주세요.
            </DialogBody>
            <DialogFooter variant="onlyBody">
              <DialogButton.Secondary 
                onClick={() => close()}
                data-testid="dialog-close-button"
                aria-label="유효성 검증 에러 팝업 닫기"
              >
                닫기
              </DialogButton.Secondary>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    })
  }

  return {
    showSaveConfirm,
    showFileUploadError,
    showLibraryRegister,
    showSaveError,
    showValidationError,
  }
}
