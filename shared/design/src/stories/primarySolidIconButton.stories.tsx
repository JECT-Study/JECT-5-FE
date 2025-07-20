import { PrimarySolidIconButton } from "../components/button/primarySolidIconButton"
import {
  Add,
  Edit,
  Iconplaceholder_24px,
  Magnifier,
  Play,
  Trash,
} from "../icons"

export default {
  title: "Button/Icon/PrimarySolidIconButton",
  component: PrimarySolidIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable the button and change to disabled styling",
    },
    children: {
      control: false,
      description: "Icon element to display",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
}

export const Playground = {
  args: {
    disabled: false,
    children: <Iconplaceholder_24px />,
  },
}

export const InteractiveStates = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <PrimarySolidIconButton>
          <Play />
        </PrimarySolidIconButton>
        <p className="mt-2 text-sm">Default</p>
      </div>
      <div className="text-center">
        <PrimarySolidIconButton disabled>
          <Play />
        </PrimarySolidIconButton>
        <p className="mt-2 text-sm">Disabled</p>
      </div>
    </div>
  ),
}

export const WithDifferentIcons = {
  render: () => (
    <div className="flex items-center gap-4">
      <PrimarySolidIconButton>
        <Play />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton>
        <Edit />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton>
        <Add />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton>
        <Magnifier />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton>
        <Trash />
      </PrimarySolidIconButton>
    </div>
  ),
}

export const CustomStyling = {
  render: () => (
    <div className="flex items-center gap-4">
      <PrimarySolidIconButton className="shadow-lg">
        <Play />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton className="ring-2 ring-blue-200">
        <Edit />
      </PrimarySolidIconButton>
      <PrimarySolidIconButton className="transition-transform hover:scale-105">
        <Add />
      </PrimarySolidIconButton>
    </div>
  ),
}

export const AsChildPattern = {
  render: () => (
    <div className="flex items-center gap-4">
      <PrimarySolidIconButton asChild>
        <a href="#" role="button">
          <Play />
        </a>
      </PrimarySolidIconButton>
      <PrimarySolidIconButton asChild>
        <div role="button" tabIndex={0}>
          <Edit />
        </div>
      </PrimarySolidIconButton>
    </div>
  ),
}
