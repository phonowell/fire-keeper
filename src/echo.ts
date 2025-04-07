import kleur from 'kleur'

import home from './home'
import root from './root'

type CacheTime = [number, string]

// variable

const cahceTime: CacheTime = [0, '']
const cacheType = new Map<string, string>()

const regHome = new RegExp(`^${home().replace(/\\/g, '\\\\')}`, 'g')
const regRoot = new RegExp(`^${root().replace(/\\/g, '\\\\')}`, 'g')

const separator = `${kleur.gray('›')} `

/**
 * Enhanced console logging utility with formatting, message types, and flow control.
 *
 * @template T - The type of the message to log
 * @param {[T] | [string, T]} args - Either:
 *   - Single argument: The message to log (uses 'default' type)
 *   - Two arguments: [type, message] where type affects formatting
 * @returns {T} The message that was logged (for chaining)
 *
 * @property {boolean} isSilent - When true, suppresses all output
 * @property {boolean} isFrozen - When true, output is temporarily disabled
 * @property {function} pause - Temporarily disable output
 * @property {function} resume - Re-enable output after pause
 * @property {function} whisper - Log with minimal formatting
 * @property {function} freeze - Temporarily disable output while executing an async operation
 *
 * @example
 * ```typescript
 * // Basic logging
 * echo('Hello world')               // Basic gray text
 * echo('info', 'Processing...')     // With type prefix
 *
 * // Message types with different formatting
 * echo('error', 'Failed to connect')  // Red error text
 * echo('success', 'Completed')        // Green success text
 *
 * // Return value chaining
 * const config = echo('config', { port: 3000 })  // Logs and returns config
 *
 * // Flow control
 * echo.pause()
 * echo('Silent operation')  // Nothing logged
 * echo.resume()
 *
 * // Async operation with temporary silence
 * await echo.freeze(async () => {
 *   await heavyOperation()  // Output suppressed
 * })
 *
 * // Minimal logging
 * await echo.whisper(async () => {
 *   // Minimal output formatting
 * })
 * ```
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
  echo.isFrozen = true
  echo.isSilent = true

  const result =
    typeof callback === 'function' ? await callback() : await callback

  echo.isFrozen = false
  echo.isSilent = false

  return result
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
    // 'xxx'
    .replace(/'.*?'/g, (text) => kleur.magenta(text.replace(/'/g, '') || "''"))

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

const renderType = (type: string): string | undefined => {
  const key = type.trim().toLowerCase()
  if (key === 'default') return ''
  if (cacheType.has(key)) return cacheType.get(key)

  const content = [
    kleur.cyan().underline(key),
    ' '.repeat(Math.max(10 - key.length, 0)),
  ].join('')

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
  pause()

  const result =
    typeof callback === 'function' ? await callback() : await callback

  resume()

  return result
}

echo.freeze = freeze
echo.isFrozen = false
echo.isSilent = false
echo.pause = pause
echo.resume = resume
echo.whisper = whisper
export { renderPath }
export default echo
