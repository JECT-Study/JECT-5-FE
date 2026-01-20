export const formatReportNumber = (num: number): string => {
  return String(num).padStart(2, "0")
}
