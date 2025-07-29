"use client"

import { ReactNode } from "react"

import { usePopupManager } from "../model/usePopupManager"
import { FileSizeErrorPopup } from "./popups/fileSizeErrorPopup"
import { FileTypeErrorPopup } from "./popups/fileTypeErrorPopup"
import { LibraryRegisterPopup } from "./popups/libraryRegisterPopup"
import { SaveConfirmPopup } from "./popups/saveConfirmPopup"

interface PopupManagerProps {
  children: ReactNode
}

export function PopupManager({ children }: PopupManagerProps) {
  const { popups, showPopup, hidePopup } = usePopupManager()

  const handleSaveConfirm = () => {
    hidePopup("saveConfirm")
  }

  const handleLibraryRegister = () => {
    hidePopup("libraryRegister")
  }

  const popupContext = {
    showPopup,
    hidePopup,
  }

  return (
    <PopupContext.Provider value={popupContext}>
      {children}
      
      <FileSizeErrorPopup 
        open={popups.fileSizeError} 
        onClose={() => hidePopup("fileSizeError")} 
      />
      
      <FileTypeErrorPopup 
        open={popups.fileTypeError} 
        onClose={() => hidePopup("fileTypeError")} 
      />
      
      <SaveConfirmPopup 
        open={popups.saveConfirm} 
        onClose={() => hidePopup("saveConfirm")}
        onConfirm={handleSaveConfirm}
      />
      
      <LibraryRegisterPopup 
        open={popups.libraryRegister} 
        onClose={() => hidePopup("libraryRegister")}
        onConfirm={handleLibraryRegister}
      />
    </PopupContext.Provider>
  )
}

import { createContext, useContext } from "react"

interface PopupContextType {
  showPopup: (type: "fileSizeError" | "fileTypeError" | "saveConfirm" | "libraryRegister") => void
  hidePopup: (type: "fileSizeError" | "fileTypeError" | "saveConfirm" | "libraryRegister") => void
}

const PopupContext = createContext<PopupContextType | null>(null)

export function usePopup() {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error("usePopup must be used within a PopupManager")
  }
  return context
} 