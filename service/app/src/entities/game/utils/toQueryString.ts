export const toQueryString = (params: Record<string, any>): string =>
    new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .reduce((acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
    ).toString();