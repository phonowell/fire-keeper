import $type from './type'

// interface

type Main = {
  (input: boolean): boolean[]
  (input: number): number[]
  (input: string | string[]): string[]
  (input: unknown | unknown[]): unknown[]
}

// function

const main: Main = (
  input: unknown,
) => {

  if (input instanceof Array) return [...input]
  if (typeof input === 'boolean') return [input]
  if (typeof input === 'number') return [input]
  if (typeof input === 'string') return [input]
  throw new Error(`formatArgument/error: invalid type '${$type(input)}'`)
}

// export
export default main