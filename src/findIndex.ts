const findIndex = <T>(
  list: T[],
  fn: (value: T, index: number, array: T[]) => boolean,
): number => {
  for (let i = 0; i < list.length; i++) {
    if (fn(list[i], i, list)) {
      return i
    }
  }
  return -1
}

export default findIndex
