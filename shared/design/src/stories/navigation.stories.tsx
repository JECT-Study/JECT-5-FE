import type { Meta, StoryObj } from "@storybook/react-vite";

import { Navigation } from "../components/navigation"

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "untitle-noLogin",
        "untitle-login",
        "title-login",
        "searchbar-noLogin",
        "searchbar-login",
        "untitle-createGame",
        "title-startGame",
        "progressbar",
        "title-onGame",
      ],
    },
    playGame: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    searchPlaceholder: {
      control: "text",
    },
    gameName: {
      control: "text",
    },
    progressValue: {
      control: { type: "range", min: 0, max: 100 },
    },
    progressMax: {
      control: { type: "number", min: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const UntitleNoLogin: Story = {
  args: {
    type: "untitle-noLogin",
    playGame: false,
    onHomeClick: () => console.log("Home clicked"),
    onLoginClick: () => console.log("Login clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
  },
}

export const UntitleLogin: Story = {
  args: {
    type: "untitle-login",
    playGame: false,
    onHomeClick: () => console.log("Home clicked"),
    onMyGamesClick: () => console.log("My games clicked"),
    onCreateGameClick: () => console.log("Create game clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onAvatarClick: () => console.log("Avatar clicked"),
  },
}

export const TitleLogin: Story = {
  args: {
    type: "title-login",
    playGame: false,
    title: "내 게임",
    onHomeClick: () => console.log("Home clicked"),
    onCreateGameClick: () => console.log("Create game clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onAvatarClick: () => console.log("Avatar clicked"),
  },
}

export const SearchbarNoLogin: Story = {
  args: {
    type: "searchbar-noLogin",
    playGame: false,
    searchPlaceholder: "오늘의 추천 게임은?",
    onHomeClick: () => console.log("Home clicked"),
    onLoginClick: () => console.log("Login clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onSearchChange: (value) => console.log("Search changed:", value),
  },
}

export const SearchbarLogin: Story = {
  args: {
    type: "searchbar-login",
    playGame: false,
    searchPlaceholder: "오늘의 추천 게임은?",
    onHomeClick: () => console.log("Home clicked"),
    onCreateGameClick: () => console.log("Create game clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onAvatarClick: () => console.log("Avatar clicked"),
    onSearchChange: (value) => console.log("Search changed:", value),
  },
}

export const UntitleCreateGame: Story = {
  args: {
    type: "untitle-createGame",
    playGame: false,
    gameName: "",
    onHomeClick: () => console.log("Home clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onAddQuestionClick: () => console.log("Add question clicked"),
    onSaveGameClick: () => console.log("Save game clicked"),
    onCloseClick: () => console.log("Close clicked"),
    onGameNameChange: (value) => console.log("Game name changed:", value),
  },
}

export const TitleStartGame: Story = {
  args: {
    type: "title-startGame",
    playGame: true,
    title: "참가자 설정",
    onHomeClick: () => console.log("Home clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onStartGameClick: () => console.log("Start game clicked"),
    onCloseClick: () => console.log("Close clicked"),
  },
}

export const Progressbar: Story = {
  args: {
    type: "progressbar",
    playGame: true,
    progressValue: 30,
    progressMax: 100,
    onHomeClick: () => console.log("Home clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onPreviousQuestionClick: () => console.log("Previous question clicked"),
    onNextQuestionClick: () => console.log("Next question clicked"),
    onCloseClick: () => console.log("Close clicked"),
  },
}

export const TitleOnGame: Story = {
  args: {
    type: "title-onGame",
    playGame: true,
    title: "게임 종료",
    onHomeClick: () => console.log("Home clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    onPreviousQuestionClick: () => console.log("Previous question clicked"),
    onCloseClick: () => console.log("Close clicked"),
  },
} 