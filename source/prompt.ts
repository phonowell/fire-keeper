import $info from './info'
import $parseString from './parseString'
import $read from './read'
import $type from './type'
import $write from './write'
import _findIndex from 'lodash/findIndex'
import _get from 'lodash/get'
import prompts from 'prompts'

// interface

type Choice<T = Value> = {
  title: string
  value: T
}

type File = {
  [key: string]: Save
}

type Main = {
  (option: OptionConfirm): Promise<boolean>
  (option: OptionNumber): Promise<number>
  (option: OptionText): Promise<string>
  (option: OptionToggle): Promise<boolean>
  <T = string>(option: OptionSelect<T>): Promise<T>
}

type Option = OptionConfirm
  | OptionNumber
  | OptionText
  | OptionToggle
  | OptionSelect

type OptionConfirm = {
  default?: boolean
  id?: string
  message?: string
  type: 'confirm'
}

type OptionNumber = {
  default?: number
  id?: string
  max?: number
  message?: string
  min?: number
  type: 'number'
}

type OptionPrompt = Option & {
  active: string
  choices: Choice[]
  inactive: string
  initial: Option['default']
  name: string
  type: Type
}

type OptionSelect<T = string> = {
  default?: number | string
  id?: string
  list: Choice<T>[] | T[]
  message?: string
  type: 'auto' | 'autocomplete' | 'multi' | 'multiselect' | 'select'
}

type OptionText = {
  default?: string
  id?: string
  message?: string
  type: 'text'
}

type OptionToggle = {
  default?: boolean | string
  id?: string
  message?: string
  off?: string
  on?: string
  type: 'toggle'
}

type Type = typeof listType[number]

type Save = {
  type: Type
  value: Value
}

type Value = Option['default']

// variable

const listTypePrompt = [
  'autocomplete',
  'confirm',
  'multiselect',
  'number',
  'select',
  'text',
  'toggle',
] as const

const listType = [
  ...listTypePrompt,
  'auto',
  'multi',
] as const

const listTypeCache = [
  'autocomplete',
  'confirm',
  'number',
  'select',
  'text',
  'toggle',
] as const

const mapMessage = {
  autocomplete: 'input',
  confirm: 'confirm',
  multiselect: 'select',
  number: 'input number',
  select: 'select',
  text: 'input text',
  toggle: 'toggle',
} as const

const pathCache = './temp/cache-prompt.json' as const

// function

const formatOption = async (
  option: Option,
): Promise<OptionPrompt> => {

  const opt: OptionPrompt = {
    active: 'on',
    choices: [],
    inactive: 'off',
    initial: undefined,
    name: '',
    ...option,
  }

  // type alias
  if (opt.type === 'auto') opt.type = 'autocomplete'
  if (opt.type === 'multi') opt.type = 'multiselect'

  // check type
  if (!listTypePrompt.includes(opt.type))
    throw new Error(`prompt_/error: invalid type '${opt.type}'`)

  // default value
  if (!opt.message) opt.message = mapMessage[opt.type]
  if (!opt.name) opt.name = 'value'

  // list -> choices
  if (validateAsSelect(opt)) {
    if (!opt.list) throw new Error('prompt_/error: empty list')
    opt.choices = [...opt.list].map(it => validateAsChoice(it)
      ? it
      : {
        title: $parseString(it),
        value: it,
      })
    opt.initial = typeof opt.default === 'number'
      ? (() => {
        let result = opt.default >= 0
          ? opt.default
          : opt.list.length + opt.default
        if (result < 0) result = 0
        if (result >= opt.list.length) result = opt.list.length - 1
        return result
      })()
      : _findIndex(opt.choices, it => opt.default === it.value)
    opt.list = []
  }

  // on -> active, off -> inactive
  if (opt.type === 'toggle') {
    if (opt.on) opt.active = opt.on
    if (opt.off) opt.inactive = opt.off
    opt.initial = opt.default === opt.on
    opt.on = undefined
    opt.off = undefined
  }

  // have to be here
  // behind option.choices
  if (opt.initial === undefined || opt.initial === null)
    opt.initial = opt.default || await getCache(opt)
  opt.default = undefined

  return opt
}

const getCache = async (
  option: OptionPrompt,
): Promise<Value> => {

  if (!option.id) return undefined
  if (!listTypeCache.includes(
    option.type as typeof listTypeCache[number],
  )) return undefined

  const cache = await $read<File>(pathCache)
  const item = _get(cache, option.id)
  if (!item) return undefined

  const { type, value } = item
  if (type !== option.type) return undefined

  if (type === 'select') {
    const index = _findIndex(option.choices, { value })
    return ~index
      ? index
      : undefined
  }

  return value
}

const main: Main = async (
  option: Option,
) => {

  if (!option)
    throw new Error('prompt_/error: empty option')

  $info().pause()

  const opt = await formatOption(option)
  const result = (await prompts(opt as prompts.PromptObject))[opt.name]
  await setCache(opt, result)

  $info().resume()

  return result
}

const setCache = async (
  option: OptionPrompt,
  value: Value,
): Promise<void> => {

  const { id, type } = option
  if (!id) return

  const cache = await $read<File>(pathCache) || {}
  cache[id] = { type, value }

  await $write(pathCache, cache)
}

const validateAsChoice = (
  input: unknown,
): input is Choice => $type(input) === 'object'

const validateAsSelect = (
  option: Option,
): option is OptionSelect => ['autocomplete', 'multiselect', 'select'].includes(option.type)

// export
export default main