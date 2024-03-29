import kleur from 'kleur'

import home from './home'
import root from './root'
import toString from './toString'

// interface

type CacheTime = [number, string]

// variable

const cahceTime: CacheTime = [0, '']
const cacheType = new Map<string, string>()

const regHome = new RegExp(`^${home().replace(/\\/g, '\\\\')}`, 'g')
const regRoot = new RegExp(`^${root().replace(/\\/g, '\\\\')}`, 'g')

const separator = `${kleur.gray('›')} `

// functions

/**
 * Print the message.
 * @param args The arguments.
 * @returns The message.
 * @example
 * ```
 * echo('Hello, world!')
 * echo('info', 'Hello, world!')
 * ```
 */
const echo = <T>(...args: [T] | [string, T]) => {
  const [type, message] = args.length === 1 ? ['default', args[0]] : args

  if (echo.isSilent) return message

  const msg = toString(message).trim()
  if (!msg) return message

  console.log(render(type, msg))
  return message
}

/**
 * Freeze the echo.
 * @param callback The callback.
 * @returns The promise.
 * @example
 * ```
 * await echo.freeze(async () => {
 *  console.log('Hello, world!')
 * })
 * ```
 */
const freeze = async <T>(callback: Promise<T> | (() => Promise<T>)) => {
  echo.isFrozen = true
  echo.isSilent = true

  const result =
    typeof callback === 'function' ? await callback() : await callback

  echo.isFrozen = false
  echo.isSilent = false

  return result
}

const makeTime = () => {
  const date = new Date()
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(it => it.toString().padStart(2, '0'))
    .join(':')
}

/**
 * Pause the echo.
 * @example
 * ```
 * echo.pause()
 * ```
 */
const pause = () => {
  if (echo.isFrozen) return
  echo.isSilent = true
}

const render = (type: string, message: string) =>
  [renderTime(), separator, renderType(type), renderContent(message)].join('')

const renderContent = (input: string) =>
  renderPath(input)
    // 'xxx'
    .replace(/'.*?'/g, text => kleur.magenta(text.replace(/'/g, '') || "''"))

const renderPath = (input: string) =>
  input.replace(regRoot, '.').replace(regHome, '~')

const renderTime = () => {
  const ts = Math.floor(Date.now() / 1e3)
  if (ts === cahceTime[0]) return cahceTime[1]

  const result = `${kleur.gray(`[${makeTime()}]`)} `
  cahceTime[0] = ts
  cahceTime[1] = result
  return result
}

const renderType = (type: string) => {
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
 * Resume the echo.
 * @example
 * ```
 * echo.resume()
 * ```
 */
const resume = () => {
  if (echo.isFrozen) return
  echo.isSilent = false
}

/**
 * Whisper the callback.
 * @param callback The callback.
 * @returns The promise.
 * @example
 * ```
 * await echo.whisper(async () => {
 *   console.log('Hello, world!')
 * })
 * ```
 */
const whisper = async <T>(callback: Promise<T> | (() => Promise<T>)) => {
  pause()

  const result =
    typeof callback === 'function' ? await callback() : await callback

  resume()

  return result
}

// export
echo.freeze = freeze
echo.isFrozen = false
echo.isSilent = false
echo.pause = pause
echo.resume = resume
echo.whisper = whisper
export { renderPath }
export default echo
