const findIndex = <T>(
  list: T[],
  fn: (value: T, index: number, array: T[]) => boolean,
): number => {
  const safeCopy = [...list]
  for (let i = 0; i < list.length; i++) {
    if (fn(list[i], i, safeCopy)) return i
  }
  return -1
}

export default findIndex
