/**
 * Remove specified characters from the end of a string
 * @param source - String to trim
 * @param chars - Characters to remove (defaults to whitespace)
 * @returns Trimmed string
 * @example
 * trimEnd('  hello  ')        // '  hello'
 * trimEnd('hello...', '.')    // 'hello'
 */
const trimEnd = (source: string, chars?: string) => {
  if (chars === undefined) return source.replace(/\s+$/, '')

  // 特殊字符映射，保持原始行为
  const specialChars: Record<string, string> = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v',
  }

  const _chars = chars
    .split('')
    .map((char) => {
      if (char in specialChars) return specialChars[char]
      return char.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
    })
    .join('|')

  return source.replace(new RegExp(`[${_chars}]+$`, 'u'), '')
}

export default trimEnd
