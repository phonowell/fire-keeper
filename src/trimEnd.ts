/**
 * Removes specified characters from the end of a string.
 * @param {string} source - The string to trim
 * @param {string} [chars] - The characters to remove from the end. If omitted, removes whitespace
 * @returns {string} The trimmed string
 * @example
 * ```typescript
 * // Trim whitespace
 * trimEnd('  hello  ');
 * //=> '  hello'
 *
 * // Trim specific characters
 * trimEnd('hello...', '.');
 * //=> 'hello'
 *
 * // Trim multiple characters
 * trimEnd('hello123', '123');
 * //=> 'hello'
 *
 * // Trim special characters
 * trimEnd('hello\n\t', '\n\t');
 * //=> 'hello'
 *
 * // No trimming needed
 * trimEnd('hello');
 * //=> 'hello'
 * ```
 */
const trimEnd = (source: string, chars?: string) => {
  // 如果没有提供 chars，移除所有空白字符
  if (chars === undefined) return source.replace(/\s+$/, '')

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
    .map((char) => {
      if (char in specialChars) return specialChars[char]

      return char.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
    })
    .join('|')

  return source.replace(new RegExp(`[${_chars}]+$`, 'u'), '')
}

export default trimEnd
