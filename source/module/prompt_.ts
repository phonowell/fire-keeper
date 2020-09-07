import $ from '..'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import prompts from 'prompts'

// interface

type File = {
  [key: string]: Save
}

type Option = {
  active?: string
  choices?: prompts.Choice[]
  inactive?: string
  initial?: Value
  max?: number
  message?: string
  min?: number
  name?: string
}

interface OptionThat extends Option {
  name: string
  type: Type
}

interface OptionThis extends Option {
  default?: Option['initial']
  id?: string
  list?: unknown[]
  type: Type | 'auto'
}

type Type = typeof m.listType[number]

type Save = {
  type: Type
  value: Value
}

type Value = string | number | boolean

// function

class M {

  listType = [
    'autocomplete',
    'confirm',
    'multiselect',
    'number',
    'select',
    'text',
    'toggle'
  ] as const

  listTypeCache = [
    'autocomplete',
    'confirm',
    'number',
    'select',
    'text',
    'toggle'
  ] as const

  mapMessage = {
    autocomplete: 'input',
    confirm: 'confirm',
    multiselect: 'select',
    number: 'input number',
    select: 'select',
    text: 'input text',
    toggle: 'toggle'
  } as const

  pathCache = './temp/cache-prompt.json' as const

  // function

  async execute_(option: {
    default?: boolean
    id?: string
    message?: string
    type: 'confirm'
  }): Promise<boolean>
  async execute_(option: {
    default?: number
    max?: number
    message?: string
    min?: number
    type: 'number'
  }): Promise<number>
  async execute_(option: {
    default?: string
    id?: string
    message?: string
    type: 'text'
  }): Promise<string>
  async execute_(option: {
    default?: string
    id?: string
    list: prompts.Choice[] | unknown[]
    message?: string
    type: 'auto' | 'autocomplete' | 'select'
  }): Promise<string>
  async execute_(option: OptionThis): Promise<Value> {

    if (!option)
      throw new Error('prompt_/error: empty option')

    $.info().pause()

    const opt: OptionThat = await this.setOption_(option)
    const result: Value = (await prompts(opt))[opt.name]
    await this.setCache_(option, result)

    $.info().resume()

    return result
  }

  async getCache_(option: OptionThis): Promise<Value | undefined> {

    if (!option.id) return
    if (!this.listTypeCache.includes(
      option.type as typeof m.listTypeCache[number]
    )) return

    const cache: File = await $.read_(this.pathCache) as File
    const item: Save = get(cache, option.id)
    if (!item) return

    const { type, value } = item
    if (type !== option.type) return

    if (type === 'select') {
      const index = findIndex(option.choices, { value })
      return ~index
        ? index
        : undefined
    }

    return value
  }

  async setCache_(option: OptionThis, value: Value): Promise<void> {

    const { id, type } = option
    if (!id) return

    const cache: File = await $.read_(this.pathCache) as File || {}

    cache[id] = {
      type: type === 'auto'
        ? 'autocomplete'
        : type,
      value
    }
    await $.write_(this.pathCache, cache)
  }

  async setOption_(option: OptionThis): Promise<OptionThat> {

    // clone
    const opt = { ...option }
    Object.assign(opt, {
      id: undefined
    })

    // alias
    if (opt.type === 'auto')
      opt.type = 'autocomplete'

    // check type
    if (!this.listType.includes(opt.type))
      throw new Error(`prompt_/error: invalid type '${opt.type}'`)

    // default value
    if (!opt.message)
      opt.message = this.mapMessage[opt.type]
    if (!opt.name)
      opt.name = 'value'

    if (['autocomplete', 'multiselect', 'select'].includes(opt.type)) {
      if (!opt.list)
        throw new Error('prompt_/error: empty list')
      opt.choices = [...opt.list]
        .map((it): prompts.Choice =>
          $.type(it) === 'object'
            ? it as prompts.Choice
            : {
              title: $.parseString(it),
              value: it
            }
        )
      opt.list = undefined
    } else if (opt.type === 'toggle') {
      if (!opt.active) opt.active = 'on'
      if (!opt.inactive) opt.inactive = 'off'
    }

    // have to be here
    // behind option.choices
    if (['null', 'undefined'].includes(typeof opt.initial))
      opt.initial = opt.default || await this.getCache_(option)
    opt.default = undefined

    return opt as typeof opt & {
      message: string
      name: string
      type: Type
    }
  }
}

// export
const m = new M()
export default m.execute_.bind(m) as typeof m.execute_