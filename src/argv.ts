import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Parse command line arguments with type safety
 * @returns Promise resolving to parsed arguments object
 * @example
 * const args = await argv()
 * console.log(args.name) // --name value
 * console.log(args._)    // positional args
 */
const argv = (): Promise<{
  [x: string]: unknown
  _: (string | number)[]
  $0: string
}> =>
  yargs(hideBin(process.argv)).parse() as Promise<{
    [x: string]: unknown
    _: (string | number)[]
    $0: string
  }>

export default argv
