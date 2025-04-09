import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Parses command line arguments using yargs
 * @returns {Promise<{[x: string]: unknown; _: (string | number)[]; $0: string}>} Object containing:
 * - Named arguments as properties (--key=value becomes {key: 'value'})
 * - Positional arguments in _ array
 * - Script name in $0
 * @example
 * const args = await argv()
 * // node script.js --name=value file1.txt --flag
 * console.log(args.name)  // 'value'
 * console.log(args._)     // ['file1.txt']
 * console.log(args.flag)  // true
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
