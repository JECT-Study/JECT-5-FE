"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@shared/design/src/components/button"
import { Control, Field, Root } from "@shared/design/src/components/input"
import { ErrorText } from "@shared/design/src/components/input"
import { Sun } from "@shared/design/src/icons"

import { useGameCreation } from "../../model/state/create/useGameCreation"
import { RegisterButton } from "../interactions/registerButton"
import { SaveButton } from "../interactions/saveButton"

export function CreateGameNavigation() {
  const { state, actions, selectors } = useGameCreation();

  const handleGameNameChange = (value: string) => {
    actions.setGameName(value);
  };

  const handleGameNameFocus = () => {
    actions.setGameNameFocus(true);
  };

  const handleGameNameBlur = () => {
    actions.setGameNameFocus(false);
  };

  return (
    <nav
      className={`flex h-[110px] w-full items-center justify-between bg-background-tertiary px-10`}
    >
      <div className="flex w-[420px] items-center gap-2.5 bg-background-tertiary px-10">
        <Root>
          <Field 
            type="noIcon" 
            state={selectors.gameNameError ? "error" : "default"} 
            name="gameTitle" 
            className="bg-background-interactive-input-primary"
          >
            <Control
              placeholder="게임 이름 입력"
              value={state.gameName}
              onChange={handleGameNameChange}
              onFocus={handleGameNameFocus}
              onBlur={handleGameNameBlur}
            />
            {selectors.gameNameError && (
              <ErrorText>{selectors.gameNameError}</ErrorText>
            )}
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