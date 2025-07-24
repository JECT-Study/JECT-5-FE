import {
  Add,
  Arrow,
  Cross,
  Edit,
  Hidden,
  Iconplaceholder_16px,
  Iconplaceholder_24px,
  Iconplaceholder_28px,
  Iconplaceholder_32px,
  Magnifier,
  Minus,
  MoreDot,
  Play,
  Show,
  Sun,
  Trash,
  Unshare,
  Upload,
} from "../icons"

export default {
  title: "Icons",
  component: () => null,
  argTypes: {
    size: {
      control: { type: "select" },
      options: [16, 24, 28, 32],
      defaultValue: 24,
    },
    color: {
      control: { type: "select" },
      options: [
        "text-black",
        "text-gray-500",
        "text-blue-500",
        "text-red-500",
        "text-green-500",
      ],
      defaultValue: "text-black",
    },
  },
}

const icons = [
  { name: "Add", component: Add },
  { name: "Arrow", component: Arrow },
  { name: "Cross", component: Cross },
  { name: "Edit", component: Edit },
  { name: "Hidden", component: Hidden },
  { name: "Iconplaceholder 16px", component: Iconplaceholder_16px },
  { name: "Iconplaceholder 24px", component: Iconplaceholder_24px },
  { name: "Iconplaceholder 28px", component: Iconplaceholder_28px },
  { name: "Iconplaceholder 32px", component: Iconplaceholder_32px },
  { name: "Magnifier", component: Magnifier },
  { name: "Minus", component: Minus },
  { name: "MoreDot", component: MoreDot },
  { name: "Play", component: Play },
  { name: "Show", component: Show },
  { name: "Sun", component: Sun },
  { name: "Trash", component: Trash },
  { name: "Unshare", component: Unshare },
  { name: "Upload", component: Upload },
]

export const AllIcons = ({ size = 24, color = "text-black" }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
    {icons.map(({ name, component: IconComponent }) => (
      <div
        key={name}
        className="flex flex-col items-center rounded-lg border border-gray-200 p-4"
      >
        <IconComponent size={size} className={color} />
        <span className="mt-2 text-sm font-medium">{name}</span>
      </div>
    ))}
  </div>
)

AllIcons.args = {
  size: 24,
  color: "text-black",
}

export const ColorTests = () => (
  <div className="space-y-6 p-5">
    <h3 className="text-lg font-semibold">Color Injection Tests</h3>
    {[
      "text-black",
      "text-gray-500",
      "text-blue-500",
      "text-red-500",
      "text-green-500",
    ].map((colorClass) => (
      <div key={colorClass} className="space-y-3">
        <h4 className="font-medium">{colorClass}</h4>
        <div className="flex flex-wrap gap-4">
          {icons.slice(0, 5).map(({ name, component: IconComponent }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded border border-gray-200 p-3"
            >
              <IconComponent size={24} className={colorClass} />
              <span className="mt-1 text-xs">{name}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const SizeTests = () => (
  <div className="space-y-6 p-5">
    <h3 className="text-lg font-semibold">Size Injection Tests</h3>
    {[16, 24, 28, 32].map((size) => (
      <div key={size} className="space-y-3">
        <h4 className="font-medium">Size: {size}px</h4>
        <div className="flex flex-wrap gap-4">
          {icons.slice(0, 5).map(({ name, component: IconComponent }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded border border-gray-200 p-3"
            >
              <IconComponent size={size} className="text-black" />
              <span className="mt-1 text-xs">{name}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)
