import yargs from 'yargs'

// interface

type Argv = {
  [x: string]: unknown
  _: (string | number)[]
  $0: string
}

// function

/**
 * Get the arguments.
 * @returns The arguments.
 * @example
 * ```
 * const args = argv()
 * console.log(args)
 * ```
 */
const argv = <T extends Record<string, unknown>>() => yargs.argv as T & Argv

// export
export default argv
