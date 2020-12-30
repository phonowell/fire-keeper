import $ from '..'
import kleur from 'kleur'

// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// function

class M {

  cacheTime: [number, string] = [0, '']
  cacheType: { [key: string]: string } = {
    default: '',
  }
  isFrozen = false
  isSilent = false
  regHome = new RegExp(`^${$.home()}`, 'gu')
  regRoot = new RegExp(`^${$.root()}`, 'gu')
  separator = `${kleur.gray('›')} `

  static makeTextOfTime(): string {

    const date = new Date()
    const listTime = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ]
    return listTime
      .map(it => it.toString().padStart(2, '0'))
      .join(':')
  }

  execute(): this
  execute<T>(input: T): T
  execute<T>(type: string, input: T): T
  execute(
    ...args: [string] | [string, unknown]
  ): unknown {

    if (!args.length) return this
    const [type, message] = args.length > 1
      ? args
      : ['default', args[0]]

    if (this.isSilent) return message

    const msg = $.parseString(message)
      .trim()
    if (!msg) return message

    $.i(this.render(type, msg))
    return message
  }

  async freeze_(
    fn_: FnAsync
  ): Promise<unknown> {

    Object.assign(this, {
      isFrozen: true,
      isSilent: true,
    })
    const result = await fn_()
    Object.assign(this, {
      isFrozen: false,
      isSilent: false,
    })
    return result
  }

  pause(): void {

    if (this.isFrozen) return
    this.isSilent = true
  }

  render(
    type: string,
    message: string
  ): string {

    return [
      this.renderTime(),
      this.separator,
      this.renderType(type),
      this.renderContent(message),
    ].join('')
  }

  renderContent(
    message: string
  ): string {

    return this.renderPath(message)
      // 'xxx'
      .replace(/'.*?'/gu, text => {
        const cont = text.replace(/'/gu, '')
        return cont
          ? kleur.magenta(cont)
          : "''"
      })
  }

  renderPath(
    message: string
  ): string {

    return message
      .replace(this.regRoot, '.')
      .replace(this.regHome, '~')
  }

  renderTime(): string {

    const cache = this.cacheTime
    const ts = Math.floor(new Date().getTime() / 1e3)

    if (ts === cache[0]) return cache[1]

    cache[0] = ts
    cache[1] = `${kleur.gray(`[${M.makeTextOfTime()}]`)} `
    return cache[1]
  }

  renderType(
    type: string
  ): string {

    const cache = this.cacheType
    const _type = type
      .trim()
      .toLowerCase()
    if (typeof cache[_type] === 'string') return cache[_type]

    const content = kleur.cyan().underline(_type)
    const padding = ' '.repeat(Math.max(10 - _type.length, 0))

    cache[_type] = `${content}${padding}`
    return cache[_type]
  }

  resume(): void {

    if (this.isFrozen) return
    this.isSilent = false
  }

  async whisper_(
    fn_: FnAsync
  ): Promise<unknown> {

    this.pause()
    const result = await fn_()
    this.resume()
    return result
  }
}

// export
const m = new M()
export default m.execute.bind(m) as typeof m.execute
