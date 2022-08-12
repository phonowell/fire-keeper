import glob, { Options } from 'fast-glob'
import normalizePath from './normalizePath'
import toArray from './toArray'

// interface

type ListSource = string[] & {
  __is_listed_as_source__: true
}

// function

const isListedAsSource = (
  input: string | string[] | ListSource
): input is ListSource =>
  input instanceof Array &&
  (input as ListSource).__is_listed_as_source__ === true

const main = async (
  input: string | string[] | ListSource,
  options?: Options
) => {
  if (isListedAsSource(input)) return input

  const result = (await glob(toArray(input).map(normalizePath), {
    absolute: true,
    suppressErrors: true,
    ...options,
  })) as ListSource
  result.__is_listed_as_source__ = true

  return result
}

// export
export default main
