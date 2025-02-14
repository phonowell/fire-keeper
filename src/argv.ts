import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Get the arguments.
 * @returns The arguments.
 * @example
 * ```
 * const args = await argv()
 * console.log(args)
 * ```
 */
const argv = () =>
  yargs(hideBin(process.argv)).parse() as Promise<{
    [x: string]: unknown
    _: (string | number)[]
    $0: string
  }>

export default argv
