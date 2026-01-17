import { RadioGroup, type RadioGroupProps } from "./RadioGroup"
import { RadioItem, type RadioItemProps } from "./RadioItem"

/**
 * @remarks
 * 반공변성으로 인해 props 타입을 T로 좁히기 위한 타입 단언 사용
 *
 * @example
 * ```tsx
 * const ReportRadio = createRadioGroup<"SPAM" | "ABUSE">()
 *
 * <ReportRadio.Root onValueChange={(v) => {
 *   // v: "SPAM" | "ABUSE" (타입 캐스팅 불필요)
 * }}>
 *   <ReportRadio.Item value="SPAM">스팸</ReportRadio.Item>
 *   <ReportRadio.Item value="ABUSE">욕설</ReportRadio.Item>
 * </ReportRadio.Root>
 * ```
 */
export const createRadioGroup = <T extends string>() =>
  ({ Root: RadioGroup, Item: RadioItem }) as {
    Root: (props: RadioGroupProps<T>) => ReturnType<typeof RadioGroup>
    Item: (props: RadioItemProps<T>) => ReturnType<typeof RadioItem>
  }
