"use client"

import { useState } from "react"

export type PopupType = 
  | "fileSizeError" 
  | "fileTypeError" 
  | "saveConfirm" 
  | "libraryRegister"

interface PopupState {
  fileSizeError: boolean
  fileTypeError: boolean
  saveConfirm: boolean
  libraryRegister: boolean
}

export function usePopupManager() {
  const [popups, setPopups] = useState<PopupState>({
    fileSizeError: false,
    fileTypeError: false,
    saveConfirm: false,
    libraryRegister: false,
  })

  const showPopup = (type: PopupType) => 
    setPopups(prev => ({ ...prev, [type]: true }))
  
  const hidePopup = (type: PopupType) => 
    setPopups(prev => ({ ...prev, [type]: false }))

  return { 
    popups, 
    showPopup, 
    hidePopup, 
  }
} 