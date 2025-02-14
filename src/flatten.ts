const flatten = <T>(array: (T | T[])[]): T[] =>
  array.reduce<T[]>(
    (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
    [],
  )

export default flatten
