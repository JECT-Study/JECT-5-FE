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
      options: [16, 24, 32],
      defaultValue: 24,
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

export const AllIcons = ({ size = 24 }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      padding: "20px",
    }}
  >
    {icons.map(({ name, component: IconComponent }) => (
      <div
        key={name}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
      >
        <IconComponent size={size} />
        <span style={{ marginTop: "8px", fontSize: "14px", fontWeight: "500" }}>
          {name}
        </span>
      </div>
    ))}
  </div>
)

AllIcons.args = {
  size: 24,
}
