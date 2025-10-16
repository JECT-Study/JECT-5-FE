import { v4 as uuidv4 } from "uuid"

import type { Question } from "./types"

export const createInitialQuestion = (order: number): Question => ({
  id: uuidv4(),
  text: "",
  answer: "",
  imageFile: null,
  imageUrl: null,
  previewImageUrl: null,
  order,
})
