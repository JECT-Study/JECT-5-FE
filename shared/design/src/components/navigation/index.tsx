"use client"

import { Add, Cross, Sun } from "../../icons"
import { cn } from "../../utils/cn"
import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
  SecondaryOutlineBoxButton,
  SecondaryPlainIconButton,
} from "../button"
import { Image } from "../Image"
import { Input } from "../input"
import { Avatar } from "../playerStatus"
import { Progress } from "../progress"

export type NavigationType =
  | "untitle-noLogin"
  | "untitle-login"
  | "title-login"
  | "searchbar-noLogin"
  | "searchbar-login"
  | "untitle-createGame"
  | "title-startGame"
  | "progressbar"
  | "title-onGame"

export type NavigationProps = {
  type: NavigationType
  playGame?: boolean
  title?: string
  searchPlaceholder?: string
  gameName?: string
  progressValue?: number
  progressMax?: number
  onHomeClick?: () => void
  onMyGamesClick?: () => void
  onCreateGameClick?: () => void
  onLoginClick?: () => void
  onThemeToggle?: () => void
  onAvatarClick?: () => void
  onCloseClick?: () => void
  onAddQuestionClick?: () => void
  onSaveGameClick?: () => void
  onStartGameClick?: () => void
  onPreviousQuestionClick?: () => void
  onNextQuestionClick?: () => void
  onSearchChange?: (value: string) => void
  onGameNameChange?: (value: string) => void
  className?: string
}

export const Navigation = ({
  type,
  playGame = false,
  title,
  searchPlaceholder = "오늘의 추천 게임은?",
  gameName,
  progressValue = 0,
  progressMax = 100,
  onHomeClick,
  onMyGamesClick,
  onCreateGameClick,
  onLoginClick,
  onThemeToggle,
  onAvatarClick,
  onCloseClick,
  onAddQuestionClick,
  onSaveGameClick,
  onStartGameClick,
  onPreviousQuestionClick,
  onNextQuestionClick,
  onSearchChange,
  onGameNameChange,
  className,
}: NavigationProps) => {
  const isLoggedIn = type.includes("login")
  const hasSearchBar = type.includes("searchbar")
  const hasTitle = type.includes("title")
  const isCreateGame = type === "untitle-createGame"
  const isStartGame = type === "title-startGame"
  const isProgressBar = type === "progressbar"
  const isOnGame = type === "title-onGame"

  return (
    <nav
      className={cn(
        "flex h-[110px] w-full items-center justify-between",
        playGame || isCreateGame ? "bg-background-tertiary" : "",
        className
      )}
    >
      <div className="flex w-[420px] items-center gap-2.5 px-10">
        <div
          className="flex h-[60px] w-[268px] cursor-pointer items-center justify-center p-3.5"
          onClick={onHomeClick}
        >
          <Image
            src="/logo.svg"
            alt="홈 로고"
            className="size-full"
            width={268}
            height={60}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2.5">
        {hasSearchBar && (
          <Input
            type="leftIcon"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-[64px] w-[871px]"
          />
        )}

        {isCreateGame && (
          <Input
            type="noIcon"
            placeholder="게임 이름 입력"
            value={gameName}
            onChange={(e) => onGameNameChange?.(e.target.value)}
            className="h-[47px] w-[320px]"
          />
        )}

        {hasTitle && title && (
          <h1 className="text-[28px] font-semibold text-text-primary">
            {title}
          </h1>
        )}

        {isProgressBar && (
          <div className="flex-1">
            <Progress value={progressValue} max={progressMax} />
          </div>
        )}
      </div>

      <div className="flex w-[420px] flex-col items-end justify-center gap-2.5">
        <div className="flex items-center gap-4 px-10">
          {!isLoggedIn && !isCreateGame && !isStartGame && !isProgressBar && !isOnGame && (
            <SecondaryOutlineBoxButton size="md" onClick={onLoginClick}>
              <Image
                src="/kakao-logo.svg"
                alt="카카오 로고"
                className="size-8"
                width={32}
                height={32}
              />
              간편로그인해서 게임 만들기
            </SecondaryOutlineBoxButton>
          )}

          {isLoggedIn && !hasSearchBar && !hasTitle && !isCreateGame && !isStartGame && !isProgressBar && !isOnGame && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onMyGamesClick}
            >
              내 게임
            </PrimaryBoxButton>
          )}

          {isLoggedIn && !isCreateGame && !isStartGame && !isProgressBar && !isOnGame && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onCreateGameClick}
            >
              <Add className="size-6" />
              게임 만들기
            </PrimaryBoxButton>
          )}

          {isCreateGame && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onAddQuestionClick}
            >
              문제 추가
            </PrimaryBoxButton>
          )}

          {isCreateGame && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onSaveGameClick}
            >
              게임 저장
            </PrimaryBoxButton>
          )}

          {isStartGame && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onStartGameClick}
            >
              게임 시작
            </PrimaryBoxButton>
          )}

          {(isProgressBar || isOnGame) && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onPreviousQuestionClick}
            >
              이전 문제
            </PrimaryBoxButton>
          )}

          {isProgressBar && (
            <PrimaryBoxButton
              size="sm"
              _style="solid"
              onClick={onNextQuestionClick}
            >
              다음 문제
            </PrimaryBoxButton>
          )}

          {isLoggedIn && !isCreateGame && !isStartGame && !isProgressBar && !isOnGame && (
            <Avatar
              menu={false}
              onClick={onAvatarClick}
              className="size-[42px]"
            />
          )}

          {(isCreateGame || isStartGame || isProgressBar || isOnGame) && (
            <SecondaryPlainIconButton
              size="lg"
              onClick={onCloseClick}
            >
              <Cross className="size-8" />
            </SecondaryPlainIconButton>
          )}

          <SecondaryGhostIconButton onClick={onThemeToggle}>
            <Sun />
          </SecondaryGhostIconButton>
        </div>
      </div>
    </nav>
  )
} 