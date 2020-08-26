import $ from '..'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import prompts from 'prompts'

// interface

type IFile = {
  [key: string]: ISave
}

type IOption = {
  active?: string
  choices?: prompts.Choice[]
  inactive?: string
  initial?: IValue
  max?: number
  message?: string
  min?: number
  name?: string
}

interface IOptionThat extends IOption {
  name: string
  type: IType
}

interface IOptionThis extends IOption {
  default?: IOption['initial']
  id?: string
  list?: unknown[]
  type: IType | 'auto'
}

type IType = typeof m.listType[number]

type ISave = {
  type: IType
  value: IValue
}

type IValue = string | number | boolean

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
  async execute_(option: IOptionThis): Promise<IValue> {

    if (!option)
      throw new Error('prompt_/error: empty option')

    $.info().pause()

    const opt: IOptionThat = await this.setOption_(option)
    const result: IValue = (await prompts(opt))[opt.name]
    await this.setCache_(option, result)

    $.info().resume()

    return result
  }

  async getCache_(option: IOptionThis): Promise<IValue | undefined> {

    if (!option.id) return
    if (!this.listTypeCache.includes(
      option.type as typeof m.listTypeCache[number]
    )) return

    const cache: IFile = await $.read_(this.pathCache) as IFile
    const item: ISave = get(cache, option.id)
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

  async setCache_(option: IOptionThis, value: IValue): Promise<void> {

    const { id, type } = option
    if (!id) return

    const cache: IFile = await $.read_(this.pathCache) as IFile || {}

    cache[id] = {
      type: type === 'auto'
        ? 'autocomplete'
        : type,
      value
    }
    await $.write_(this.pathCache, cache)
  }

  async setOption_(option: IOptionThis): Promise<IOptionThat> {

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
      opt.message = this.mapMessage[opt.type] || 'input'
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
      type: IType
    }
  }
}

// export
const m = new M()
export default m.execute_.bind(m) as typeof m.execute_