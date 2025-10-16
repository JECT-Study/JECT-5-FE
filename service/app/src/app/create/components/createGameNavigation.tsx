"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@shared/design/src/components/button"
import * as TextField from "@shared/design/src/components/textField"
import { ThemeToggle } from "@shared/design/src/components/themeToggle"
import { Cross } from "@shared/design/src/icons"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"

import { saveNewGame, updateExistingGame } from "@/entities/game/utils/gameSave"

import { useCreateGameStore } from "../store/useCreateGameStore"
import { openErrorDialog } from "./dialog/errorDialog"
import { openExitConfirmDialog } from "./dialog/exitConfirmDialog"
import { openSaveConfirmDialog } from "./dialog/saveConfirmDialog"

export function CreateGameNavigation() {
  const router = useRouter()

  const { gameName, questions, gameId, version, setGameName, reset } =
    useCreateGameStore(
      useShallow((state) => ({
        gameName: state.gameName,
        questions: state.questions,
        gameId: state.gameId,
        version: state.version,
        setGameName: state.setGameName,
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
      if (gameId && version !== null) {
        await updateExistingGame(
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
        await saveNewGame({
          gameName,
          questions,
          selectedQuestionId: questions[0]?.id || "",
          isLoading: false,
          gameId: null,
          version: null,
        })
      }

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
        <ThemeToggle />
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
        >
          <Cross />
        </SecondaryGhostIconButton>
      </div>
    </nav>
  )
}
