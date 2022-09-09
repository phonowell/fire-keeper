import home from './home'
import kleur from 'kleur'
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

// function

const freeze = async <T>(
  callback: Promise<T> | (() => Promise<T>)
): Promise<T> => {
  main.isFrozen = true
  main.isSilent = true

  const result =
    typeof callback === 'function' ? await callback() : await callback

  main.isFrozen = false
  main.isSilent = false

  return result
}

const main = <T>(...args: [T] | [string, T]): T => {
  const [type, message] = args.length === 1 ? ['default', args[0]] : args

  if (main.isSilent) return message

  const msg = toString(message).trim()
  if (!msg) return message

  console.log(render(type, msg))
  return message
}

const makeTime = () => {
  const date = new Date()
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(it => it.toString().padStart(2, '0'))
    .join(':')
}

const pause = () => {
  if (main.isFrozen) return
  main.isSilent = true
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

const resume = () => {
  if (main.isFrozen) return
  main.isSilent = false
}

const whisper = async <T>(
  callback: Promise<T> | (() => Promise<T>)
): Promise<T> => {
  pause()

  const result =
    typeof callback === 'function' ? await callback() : await callback

  resume()

  return result
}

// export
main.freeze = freeze
main.isFrozen = false
main.isSilent = false
main.pause = pause
main.resume = resume
main.whisper = whisper
export { renderPath }
export default main
