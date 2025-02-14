const trimEnd = (source: string, chars?: string) => {
  // 如果没有提供 chars，移除所有空白字符
  if (chars === undefined) {
    return source.replace(/\s+$/, '')
  }

  // 特殊字符映射
  const specialChars: Record<string, string> = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v',
  }

  const _chars = chars
    .split('')
    .map(char => {
      if (char in specialChars) {
        return specialChars[char]
      }
      return char.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
    })
    .join('|')

  return source.replace(new RegExp(`[${_chars}]+$`, 'u'), '')
}

export default trimEnd
