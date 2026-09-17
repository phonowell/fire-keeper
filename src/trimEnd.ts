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
  if (!chars) return source

  const escaped = chars.replace(/[\\^$.*+?()[\]{}|-]/g, '\\$&')
  return source.replace(new RegExp(`[${escaped}]+$`, 'u'), '')
}

export default trimEnd
