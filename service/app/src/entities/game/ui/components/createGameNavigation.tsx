"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@shared/design/src/components/button"
import { Control, Field, Root } from "@shared/design/src/components/input"
import { Sun } from "@shared/design/src/icons"

import { RegisterButton } from "../interactions/registerButton"
import { SaveButton } from "../interactions/saveButton"

export function CreateGameNavigation() {
  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary px-10`}
    >
      <div className="flex w-[420px] items-center gap-2.5 bg-background-tertiary px-10">
        <Root>
          <Field
            type="noIcon"
            state="default"
            name="gameTitle"
            className="bg-background-interactive-input-primary"
          >
            <Control placeholder="게임 이름 입력" />
          </Field>
        </Root>
      </div>

      <div className="flex w-[420px] items-center justify-end gap-4 px-10">
        <SecondaryGhostIconButton>
          <Sun />
        </SecondaryGhostIconButton>

        <PrimaryBoxButton size="sm" _style="solid">
          문제 추가
        </PrimaryBoxButton>

        <SaveButton />

        <RegisterButton />
      </div>
    </nav>
  )
}
