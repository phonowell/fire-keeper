import $findIndex from 'lodash/findIndex'
import $info from './info'
import $parseString from './parseString'
import $read from './read'
import $write from './write'
import prompts from 'prompts'

// interface

type Choice<T = string> = {
  title: string
  description?: string
  value: T
  disabled?: boolean
}

type File = {
  [id: string]: Save
}

type Option<T extends Type = Type> =
  T extends 'confirm'
  ? OptionConfirm
  : T extends 'number'
  ? OptionNumber
  : T extends 'auto' | 'multi' | 'select'
  ? OptionSelect
  : T extends 'text'
  ? OptionText
  : T extends 'toggle'
  ? OptionToggle
  : never

type OP<T extends Type = Type> =
  T extends 'confirm'
  ? OPConfirm
  : T extends 'number'
  ? OPNumber
  : T extends 'auto' | 'multi' | 'select'
  ? OPSelect
  : T extends 'text'
  ? OPText
  : T extends 'toggle'
  ? OPToggle
  : never

type OptionConfirm = OptionGeneral & {
  type: 'confirm'
  default?: boolean
}

type OPConfirm = OPGeneral & {
  type: 'confirm'
  initial: boolean
}

type OptionGeneral = {
  type: Type
  id?: string
  message?: string
}

type OPGeneral = {
  type: typeof listTypePrompt[number]
  name: 'value'
  message: string
}

type OptionNumber = OptionGeneral & {
  type: 'number'
  default?: number
  max: number
  min: number
}

type OPNumber = OPGeneral & {
  type: 'number'
  initial: number
  min?: number
  max?: number
}

type OptionSelect = OptionGeneral & {
  type: 'auto' | 'multi' | 'select'
  default?: number | string
  list: string[] | Choice[]
}

type OPSelect = OPGeneral & {
  type: 'autocomplete' | 'multiselect' | 'select'
  choices: Choice[]
  initial: number
  hint?: string
  warn?: string
}

type OptionText = OptionGeneral & {
  type: 'text'
  default?: string
}

type OPText = OPGeneral & {
  type: 'text'
  initial: string
}

type OptionToggle = OptionGeneral & {
  type: 'toggle'
  default?: boolean
  off?: string
  on?: string
}

type OPToggle = OPGeneral & {
  type: 'toggle'
  initial: boolean
  active: string
  inactive: string
}

type Result<T extends Type = Type> =
  T extends 'confirm'
  ? boolean
  : T extends 'number'
  ? number
  : T extends 'auto' | 'multi' | 'select'
  ? string
  : T extends 'text'
  ? string
  : T extends 'toggle'
  ? boolean
  : never

type Save = {
  type: Omit<Type, 'multi'>
  value: unknown
}

type Type = typeof listType[number]

// variable

const listType = [
  'auto',
  'confirm',
  'multi',
  'number',
  'select',
  'text',
  'toggle',
] as const

const listTypePrompt = [
  'autocomplete',
  'confirm',
  'multiselect',
  'number',
  'select',
  'text',
  'toggle',
] as const

const mapMessageDefault = {
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

const formatOption = async <T extends Type>(
  option: Option<T>,
): Promise<OP<T>> => {

  if (option.type === 'confirm') {
    const result: OP<'confirm'> = {
      initial: option.default || await getCache(option) || false,
      message: option.message || mapMessageDefault.confirm || '',
      name: 'value',
      type: 'confirm',
    }
    return result as OP<T>
  }

  if (option.type === 'number') {
    const result: OP<'number'> = {
      initial: option.default || await getCache(option) || option.min || 0,
      max: option.max,
      message: option.message || mapMessageDefault.number || '',
      min: option.min,
      name: 'value',
      type: 'number',
    }
    return result as OP<T>
  }

  if (
    option.type === 'auto'
    || option.type === 'multi'
    || option.type === 'select'
  ) {
    const list = transChoice(option.list)
    const result: OP<'select'> = {
      choices: list,
      initial: pickDefault(list, option.default || await getCache(option)) || 0,
      message: option.message || mapMessageDefault[option.type] || '',
      name: 'value',
      type: transType(option.type),
    }
    return result as OP<T>
  }

  if (option.type === 'text') {
    const result: OP<'text'> = {
      initial: option.default || await getCache(option) || '',
      message: option.message || mapMessageDefault.text || '',
      name: 'value',
      type: 'text',
    }
    return result as OP<T>
  }

  if (option.type === 'toggle') {
    const result: OP<'toggle'> = {
      active: option.on || 'on',
      inactive: option.off || 'off',
      initial: option.default || await getCache(option) || false,
      message: option.message || mapMessageDefault.toggle || '',
      name: 'value',
      type: 'toggle',
    }
    return result as OP<T>
  }

  throw new Error(`invalid type '${option.type}'`)
}

const getCache = async <T extends unknown>(
  option: Option,
): Promise<T | undefined> => {

  const { id, type } = option
  if (!id) return undefined
  if (type === 'multi') return undefined

  const cache = await $read<File>(pathCache)
  if (!cache) return undefined
  const data = cache[id]
  if (!data) return undefined
  if (type !== data.type) return undefined
  return data.value as T
}

const main = async <T = void, U extends Type = Type>(
  option: Option<U> & { type: U },
): Promise<T extends void ? Result<U> : T> => {

  if (!option) throw new Error('prompt/error: empty option')

  $info.pause()

  const opt = await formatOption<U>(option)
  const result = (await prompts(opt as prompts.PromptObject))[opt.name]
  await setCache(option, result)

  $info.resume()

  return result
}

const pickDefault = (
  list: Choice[],
  value: unknown = 0,
): number => {
  if (typeof value === 'number') {
    if (value >= 0) {
      if (value > list.length - 1) return list.length - 1
      return value
    }
    if (0 - value - 1 < 0) return 0
    return list.length + value
  }
  return $findIndex(list, it => value === it.value)
}

const setCache = async (
  option: Option,
  value: unknown,
): Promise<void> => {

  const { id, type } = option
  if (!id) return
  if (type === 'multi') return

  const cache = await $read<File>(pathCache) || {}
  cache[id] = { type, value }

  await $write(pathCache, cache)
}

const transChoice = (
  list: (string | Choice)[],
) => list.map(it => (typeof it === 'string'
  ? {
    title: $parseString(it),
    value: it,
  }
  : it))

const transType = (
  type: 'auto' | 'multi' | 'select',
): 'autocomplete' | 'multiselect' | 'select' => {
  if (type === 'auto') return 'autocomplete'
  if (type === 'multi') return 'multiselect'
  return 'select'
}

// export
export default main