import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@shared/design/src/components/dialog"
import { overlay } from "overlay-kit"

interface ErrorDialogOptions {
  description: string
  closeText?: string
}

export function openErrorDialog({
  description,
  closeText = "닫기",
}: ErrorDialogOptions) {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>{closeText}</DialogButton.Secondary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ))
}
