import $ from '..'
import kleur from 'kleur'

// interface

import { FnAsync } from '../type'

// function

class M {

  cacheTime: [number, string]
  cacheType: { [key: string]: string }
  isFrozen: boolean
  isSilent: boolean
  regHome: RegExp
  regRoot: RegExp
  separator: string

  constructor() {
    this.cacheTime = [0, '']
    this.cacheType = {
      default: ''
    }
    this.isFrozen = false
    this.isSilent = false
    this.regHome = new RegExp(`^${$.home()}`, 'g')
    this.regRoot = new RegExp(`^${$.root()}`, 'g')
    this.separator = `${kleur.gray('›')} `
  }

  execute(): this
  execute<T>(input: T): T
  execute<T>(type: string, input: T): T
  execute(...args: [string] | [string, unknown]): unknown {
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

  async freeze_(fn_: FnAsync): Promise<unknown> {
    Object.assign(this, {
      isFrozen: true,
      isSilent: true
    })
    const result = await fn_()
    Object.assign(this, {
      isFrozen: false,
      isSilent: false
    })
    return result
  }

  makeTextOfTime(): string {
    const date = new Date()
    const listTime = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ]
    return listTime
      .map(it => it.toString().padStart(2, '0'))
      .join(':')
  }

  pause(): void {
    if (this.isFrozen) return
    this.isSilent = true
  }

  render(type: string, message: string): string {
    return [
      this.renderTime(),
      this.separator,
      this.renderType(type),
      this.renderContent(message)
    ].join('')
  }

  renderContent(message: string): string {
    return this.renderPath(message)
      // 'xxx'
      .replace(/'.*?'/g, text => {
        const cont = text.replace(/'/g, '')
        return cont
          ? kleur.magenta(cont)
          : "''"
      })
  }

  renderPath(message: string): string {
    return message
      .replace(this.regRoot, '.')
      .replace(this.regHome, '~')
  }

  renderTime(): string {
    const cache = this.cacheTime
    const ts = Math.floor(new Date().getTime() / 1e3)

    if (ts === cache[0]) return cache[1]

    cache[0] = ts
    cache[1] = `${kleur.gray(`[${this.makeTextOfTime()}]`)} `
    return cache[1]
  }

  renderType(type: string): string {
    const cache = this.cacheType
    type = type
      .trim()
      .toLowerCase()
    if (typeof cache[type] === 'string') return cache[type]

    const content = kleur.cyan().underline(type)
    const padding = ' '.repeat(Math.max(10 - type.length, 0))

    cache[type] = `${content}${padding}`
    return cache[type]
  }

  resume(): void {
    if (this.isFrozen) return
    this.isSilent = false
  }

  async whisper_(fn_: FnAsync): Promise<unknown> {
    this.pause()
    const result = await fn_()
    this.resume()
    return result
  }
}

// export
const m = new M()
export default m.execute.bind(m) as typeof m.execute