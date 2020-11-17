import $ from '..'

// function

function main(input: boolean): boolean[]
function main(input: number): number[]
function main(input: string | string[]): string[]
function main(input: unknown | unknown[]): unknown[]
function main(input: unknown): unknown[] {
  
  if (input instanceof Array) return [...input]
  if (typeof input === 'boolean') return [input]
  if (typeof input === 'number') return [input]
  if (typeof input === 'string') return [input]
  throw new Error(`formatArgument/error: invalid type '${$.type(input)}'`)
}

// export
export default main