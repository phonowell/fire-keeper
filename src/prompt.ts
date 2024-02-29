import findIndex from 'lodash/findIndex'
import prompts from 'prompts'

import echo from './echo'
import read from './read'
import toString from './toString'
import write from './write'
import at from './at'

// interface

type Choice<T> = {
  title: string
  description?: string
  value: T
  disabled?: boolean
}

type File = Record<string, Save>

type List<T> = (T | Choice<T>)[]

type Option<T extends Type, U> = T extends 'confirm'
  ? OptionConfirm
  : T extends 'number'
    ? OptionNumber
    : T extends 'auto' | 'multi' | 'select'
      ? OptionSelect<U>
      : T extends 'text'
        ? OptionText
        : T extends 'toggle'
          ? OptionToggle
          : never

type OP<T extends Type, U> = T extends 'confirm'
  ? OPConfirm
  : T extends 'number'
    ? OPNumber
    : T extends 'auto' | 'multi' | 'select'
      ? OPSelect<U>
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
  type: (typeof listTypePrompt)[number]
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

type OptionSelect<T> = OptionGeneral & {
  type: 'auto' | 'multi' | 'select'
  default?: number | string
  list: List<T>
}

type OPSelect<T> = OPGeneral & {
  type: 'autocomplete' | 'multiselect' | 'select'
  choices: Choice<T>[]
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

type Result<T extends Type = Type, U = unknown> = T extends 'confirm'
  ? boolean
  : T extends 'number'
    ? number
    : T extends 'auto' | 'multi' | 'select'
      ? U
      : T extends 'text'
        ? string
        : T extends 'toggle'
          ? boolean
          : never

type Save = {
  type: Omit<Type, 'multi'>
  value: unknown
}

type Type = (typeof listType)[number]

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
  auto: 'input',
  confirm: 'confirm',
  multi: 'select',
  number: 'input number',
  select: 'select',
  text: 'input text',
  toggle: 'toggle',
} as const

const pathCache = './temp/cache-prompt.json' as const

// function

const formatOption = async <T extends Type, U>(
  option: Option<T, U>,
): Promise<OP<T, U>> => {
  if (option.type === 'confirm') {
    const result: OP<'confirm', U> = {
      initial: option.default ?? (await getCache(option)) ?? false,
      message: option.message ?? mapMessageDefault.confirm,
      name: 'value',
      type: 'confirm',
    }
    return result as OP<T, U>
  }

  if (option.type === 'number') {
    const result: OP<'number', U> = {
      initial: option.default ?? (await getCache(option)) ?? option.min,
      max: option.max,
      message: option.message ?? mapMessageDefault.number,
      min: option.min,
      name: 'value',
      type: 'number',
    }
    return result as OP<T, U>
  }

  if (
    option.type === 'auto' ||
    option.type === 'multi' ||
    option.type === 'select'
  ) {
    const list = transChoice(option.list)
    const result: OP<'select', U> = {
      choices: list,
      initial:
        pickDefault(list, option.default ?? (await getCache(option))) || 0,
      message: option.message ?? mapMessageDefault[option.type],
      name: 'value',
      type: transType(option.type),
    }
    return result as OP<T, U>
  }

  if (option.type === 'text') {
    const result: OP<'text', U> = {
      initial: option.default ?? (await getCache(option)) ?? '',
      message: option.message ?? mapMessageDefault.text,
      name: 'value',
      type: 'text',
    }
    return result as OP<T, U>
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (option.type === 'toggle') {
    const result: OP<'toggle', U> = {
      active: option.on ?? 'on',
      inactive: option.off ?? 'off',
      initial: option.default ?? (await getCache(option)) ?? false,
      message: option.message ?? mapMessageDefault.toggle,
      name: 'value',
      type: 'toggle',
    }
    return result as OP<T, U>
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`invalid type '${option.type}'`)
}

const getCache = async <T, U>(
  option: Option<Type, U>,
): Promise<T | undefined> => {
  const { id, type } = option
  if (!id) return undefined
  if (type === 'multi') return undefined

  const cache = await read<File>(pathCache)
  if (!cache) return undefined

  const data = at(cache, id)
  if (!data) return undefined

  if (type !== data.type) return undefined
  return data.value as T
}

const isChoice = <T>(input: unknown): input is Choice<T> =>
  typeof input === 'object'

const main = async <T, U extends Type = Type>(
  option: Option<U, T> & { list?: List<T>; type: U },
): Promise<T & Result<U, T>> => {
  echo.pause()

  const opt: prompts.PromptObject = await formatOption<U, T>(option)
  const result = (await prompts(opt))[opt.name as string] as T & Result<U, T>
  await setCache(option, result)

  echo.resume()

  return result
}

const pickDefault = <T>(list: Choice<T>[], value: unknown = 0): number => {
  if (typeof value === 'number') {
    if (value >= 0) {
      if (value > list.length - 1) return list.length - 1
      return value
    }
    if (0 - value - 1 < 0) return 0
    return list.length + value
  }
  return findIndex(list, it => value === it.value)
}

const setCache = async <T>(option: Option<Type, T>, value: unknown) => {
  const { id, type } = option
  if (!id) return
  if (type === 'multi') return

  const cache = (await read<File>(pathCache)) ?? {}
  cache[id] = { type, value }

  await write(pathCache, cache)
}

const transChoice = <T>(list: List<T>): Choice<T>[] =>
  list.map(it =>
    isChoice<T>(it)
      ? it
      : {
          title: toString(it),
          value: it,
        },
  )

const transType = (type: 'auto' | 'multi' | 'select') => {
  if (type === 'auto') return 'autocomplete'
  if (type === 'multi') return 'multiselect'
  return 'select'
}

// export
export default main
