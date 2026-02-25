import kleur from 'kleur'

import home from './home.js'
import root from './root.js'

type CacheTime = [number, string]

// variable

const cahceTime: CacheTime = [0, '']
const cacheType = new Map<string, string>()

const regHome = new RegExp(`^${home().replace(/\\/g, '\\\\')}`, 'g')
const regRoot = new RegExp(`^${root().replace(/\\/g, '\\\\')}`, 'g')

const separator = `${kleur.gray('›')} `

/**
 * Enhanced console logging with type-based formatting
 * @template T - Message type
 * @param args - Single message or [type, message] tuple
 * @returns The original message value
 * @example
 * echo('info', 'Starting process...')
 * echo('Hello world') // Uses default type
 */
const echo = <T>(...args: [T] | [string, T]): T => {
  const [type, message] = args.length === 1 ? ['default', args[0]] : args

  if (echo.isSilent) return message

  const msg = String(message).trim()
  if (!msg) return message

  console.log(render(type, msg))
  return message
}

/**
 * Temporarily disable echo output while executing an async operation
 * @param callback - Async function or promise to execute silently
 * @returns Result of the callback execution
 * @example
 * ```typescript
 * // Using async function
 * await echo.freeze(async () => {
 *   const result = await heavyOperation()
 *   return result
 * })
 *
 * // Using promise directly
 * await echo.freeze(somePromise)
 * ```
 */
const freeze = async <T>(
  callback: Promise<T> | (() => Promise<T>),
): Promise<T> => {
  const previousFrozen = echo.isFrozen
  const previousSilent = echo.isSilent

  echo.isFrozen = true
  echo.isSilent = true

  try {
    return typeof callback === 'function' ? await callback() : await callback
  } finally {
    echo.isFrozen = previousFrozen
    echo.isSilent = previousSilent
  }
}

const makeTime = (): string => {
  const date = new Date()
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((it) => it.toString().padStart(2, '0'))
    .join(':')
}

/**
 * Pause echo output until resumed
 * @example
 * ```typescript
 * echo('This will show')
 * echo.pause()
 * echo('This will be silent')
 * echo.resume()
 * echo('This will show again')
 * ```
 */
const pause = (): void => {
  if (echo.isFrozen) return
  echo.isSilent = true
}

const render = (type: string, message: string): string =>
  [renderTime(), separator, renderType(type), renderContent(message)].join('')

const renderContent = (input: string): string =>
  renderPath(input)
    // **xxx**
    .replace(/\*\*.*?\*\*/g, (text) => kleur.magenta(text.slice(2, -2)))

const renderPath = (input: string): string =>
  input.replace(regRoot, '.').replace(regHome, '~')

const renderTime = (): string => {
  const ts = Math.floor(Date.now() / 1e3)
  if (ts === cahceTime[0]) return cahceTime[1]

  const result = `${kleur.gray(`[${makeTime()}]`)} `
  cahceTime[0] = ts
  cahceTime[1] = result
  return result
}

const renderType = (type: string): string => {
  const key = type.trim().toLowerCase()
  if (key === 'default') return ''
  if (cacheType.has(key)) return cacheType.get(key) as string

  const content =
    kleur.cyan().underline(key) + ' '.repeat(Math.max(10 - key.length, 0))
  cacheType.set(key, content)
  return content
}

/**
 * Resume echo output after being paused
 * @example
 * ```typescript
 * echo.pause()
 * // ... some operations ...
 * echo.resume() // Echo is now active again
 * ```
 */
const resume = (): void => {
  if (echo.isFrozen) return
  echo.isSilent = false
}

/**
 * Temporarily silence output for an async operation and automatically resume
 * Similar to freeze but uses pause/resume internally
 * @param callback - Async function or promise to execute silently
 * @returns Result of the callback execution
 * @example
 * ```typescript
 * const result = await echo.whisper(async () => {
 *   // These echo calls will be silent
 *   echo('Working...')
 *   await someOperation()
 *   echo('Done!')
 *   return 'success'
 * })
 * // Echo is automatically resumed after completion
 * ```
 */
const whisper = async <T>(
  callback: Promise<T> | (() => Promise<T>),
): Promise<T> => {
  const previousSilent = echo.isSilent
  pause()

  try {
    return typeof callback === 'function' ? await callback() : await callback
  } finally {
    echo.isSilent = previousSilent
  }
}

echo.freeze = freeze
echo.isFrozen = false
echo.isSilent = false
echo.pause = pause
echo.resume = resume
echo.whisper = whisper
export { renderPath }
export default echo
