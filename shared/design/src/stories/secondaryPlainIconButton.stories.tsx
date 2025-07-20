import { SecondaryPlainIconButton } from "../components/button/secondaryPlainIconButton"
import { Edit, Play, Trash } from "../icons"

export default {
  title: "Button/Icon/SecondaryPlainIconButton",
  component: SecondaryPlainIconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size - affects icon dimensions and corner radius",
    },
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
    size: "md",
    disabled: false,
    children: <Play />,
  },
}

export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <SecondaryPlainIconButton size="sm">
          <Edit />
        </SecondaryPlainIconButton>
        <p className="mt-2 text-sm">Small (24px)</p>
      </div>
      <div className="text-center">
        <SecondaryPlainIconButton size="md">
          <Edit />
        </SecondaryPlainIconButton>
        <p className="mt-2 text-sm">Medium (28px)</p>
      </div>
      <div className="text-center">
        <SecondaryPlainIconButton size="lg">
          <Edit />
        </SecondaryPlainIconButton>
        <p className="mt-2 text-sm">Large (32px)</p>
      </div>
    </div>
  ),
}

export const InteractiveStates = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <SecondaryPlainIconButton>
          <Play />
        </SecondaryPlainIconButton>
        <p className="mt-2 text-sm">Default</p>
      </div>
      <div className="text-center">
        <SecondaryPlainIconButton disabled>
          <Play />
        </SecondaryPlainIconButton>
        <p className="mt-2 text-sm">Disabled</p>
      </div>
    </div>
  ),
}

export const WithDifferentIcons = {
  render: () => (
    <div className="flex items-center gap-4">
      <SecondaryPlainIconButton size="md">
        <Play />
      </SecondaryPlainIconButton>
      <SecondaryPlainIconButton size="md">
        <Edit />
      </SecondaryPlainIconButton>
      <SecondaryPlainIconButton size="md">
        <Trash />
      </SecondaryPlainIconButton>
    </div>
  ),
}
