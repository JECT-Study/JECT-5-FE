"use client"

import { overlay } from "overlay-kit"
import type { ReactNode } from "react"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../dialog"

export interface ButtonConfig {
  label: string
  onClick?: () => void
}

export type DialogConfig = {
  title?: string
  body?: ReactNode
  role?: "dialog" | "alertdialog"
  secondary?: ButtonConfig
} & (
  | { primary?: ButtonConfig; destructive?: never }
  | { primary?: never; destructive?: ButtonConfig }
)

export interface DialogActions {
  open: (config: DialogConfig) => void
  openAsync: (config: DialogConfig) => Promise<boolean>
}

function renderDialog(
  config: DialogConfig,
  {
    isOpen,
    close,
  }: {
    isOpen: boolean
    close: (result: boolean) => void
  },
) {
  const { title, body, role, primary, secondary, destructive } = config

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close(false)}>
      <DialogContent role={role}>
        {title && <DialogHeader>{title}</DialogHeader>}
        {body && <DialogBody>{body}</DialogBody>}
        <DialogFooter>
          {secondary && (
            <DialogButton.Secondary
              onClick={() => {
                secondary.onClick?.()
                close(false)
              }}
            >
              {secondary.label}
            </DialogButton.Secondary>
          )}
          {primary && (
            <DialogButton.Primary
              onClick={() => {
                primary.onClick?.()
                close(true)
              }}
            >
              {primary.label}
            </DialogButton.Primary>
          )}
          {destructive && (
            <DialogButton.Destructive
              onClick={() => {
                destructive.onClick?.()
                close(true)
              }}
            >
              {destructive.label}
            </DialogButton.Destructive>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useDialog(): DialogActions {
  return {
    open: (config) => {
      overlay.open(({ isOpen, close }) =>
        renderDialog(config, { isOpen, close: () => close() }),
      )
    },

    openAsync: (config) => {
      return overlay.openAsync<boolean>(({ isOpen, close }) =>
        renderDialog(config, { isOpen, close }),
      )
    },
  }
}
