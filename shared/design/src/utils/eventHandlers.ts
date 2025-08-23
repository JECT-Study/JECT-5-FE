export function stopAnd(fn?: () => void) {
  return (e: React.MouseEvent) => {
    e.stopPropagation();
    fn?.();
  };
}
