export const toQueryString = (params: object): string =>
  new URLSearchParams(
    Object.entries(params as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .reduce(
        (acc, [k, v]) => {
          acc[k] = String(v)
          return acc
        },
        {} as Record<string, string>,
      ),
  ).toString()
