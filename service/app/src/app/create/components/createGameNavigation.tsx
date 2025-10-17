"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@ject-5-fe/design/components/button"
import * as TextField from "@ject-5-fe/design/components/textField"
import { Cross } from "@ject-5-fe/design/icons"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"

import { saveNewGame, updateExistingGame } from "@/entities/game/utils/gameSave"
import { ThemeToggle } from "@/shared/themeToggleButton"

import { useCreateGameStore } from "../store/useCreateGameStore"
import { openErrorDialog } from "./dialog/errorDialog"
import { openExitConfirmDialog } from "./dialog/exitConfirmDialog"
import { openSaveConfirmDialog } from "./dialog/saveConfirmDialog"

export function CreateGameNavigation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    gameName,
    questions,
    gameId,
    version,
    setGameName,
    updateImageUrls,
    reset,
  } = useCreateGameStore(
    useShallow((state) => ({
      gameName: state.gameName,
      questions: state.questions,
      gameId: state.gameId,
      version: state.version,
      setGameName: state.setGameName,
      updateImageUrls: state.updateImageUrls,
      reset: state.reset,
    })),
  )

  const gameNameError = gameName.length > 30 || gameName.length < 1

  const hasInvalidQuestions = questions.some(
    (q) =>
      q.text.trim().length === 0 ||
      q.text.trim().length > 50 ||
      q.answer.trim().length === 0 ||
      q.answer.trim().length > 50,
  )

  const canSave = !gameNameError && !hasInvalidQuestions && questions.length > 0

  const handleSaveGame = async () => {
    if (!canSave) {
      openErrorDialog({
        description:
          "입력하지 않은 질문 또는 답안이 있습니다. 모든 필수 항목을 작성한 후 다시 저장해 주세요.",
      })
      return
    }

    try {
      let result: { gameId: string; imageKeys: Map<number, string> }

      if (gameId && version !== null) {
        result = await updateExistingGame(
          {
            gameName,
            questions,
            selectedQuestionId: questions[0]?.id || "",
            isLoading: false,
            gameId,
            version,
          },
          gameId,
          version,
        )
      } else {
        result = await saveNewGame({
          gameName,
          questions,
          selectedQuestionId: questions[0]?.id || "",
          isLoading: false,
          gameId: null,
          version: null,
        })
      }

      updateImageUrls(result.imageKeys)
      await queryClient.invalidateQueries({ queryKey: ["infiniteMyGames"] })
      reset()
      router.push("/dashboard")
    } catch (error) {
      openErrorDialog({
        description:
          "저장 중 오류가 발생했습니다. 네트워크 상태를 확인하거나, 잠시 후 다시 시도해 주세요.",
      })
    }
  }

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-primary px-10`}
    >
      <div className="flex w-[340px] bg-background-primary">
        <TextField.Root
          name="gameTitle"
          state={gameNameError ? "error" : "default"}
        >
          <TextField.InputWrapper className="bg-background-interactive-input-primary">
            <TextField.Input
              placeholder="게임 이름 입력"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </TextField.InputWrapper>
        </TextField.Root>
      </div>

      <div className="flex w-[420px] items-center justify-end gap-4 px-10">
        <ThemeToggle data-testid="theme-toggle-button" />
        <PrimaryBoxButton
          size="sm"
          disabled={!canSave}
          onClick={() =>
            openSaveConfirmDialog({
              onConfirm: handleSaveGame,
            })
          }
        >
          게임 저장
        </PrimaryBoxButton>
        <SecondaryGhostIconButton
          onClick={() =>
            openExitConfirmDialog({
              onConfirm: () => {
                reset()
                router.push("/")
              },
            })
          }
          data-testid="cross-button"
        >
          <Cross />
        </SecondaryGhostIconButton>
      </div>
    </nav>
  )
}
