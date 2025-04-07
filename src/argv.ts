import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Parses command line arguments using yargs.
 * @returns {Promise<{[x: string]: unknown; _: (string | number)[]; $0: string}>} A promise that resolves to an object containing:
 *   - Named arguments as properties (e.g. --name=value becomes { name: "value" })
 *   - Positional arguments in the _ array
 *   - $0: The name of the script being run
 * @example
 * ```typescript
 * // Basic usage with various argument types
 * // Command: node script.js --name=John --age=30 file1.txt file2.txt
 * const args = await argv()
 * console.log(args.name)  // "John"
 * console.log(args.age)   // 30 (automatically converted to number)
 * console.log(args._)     // ["file1.txt", "file2.txt"]
 *
 * // Array arguments
 * // Command: node script.js --tags=js --tags=ts
 * const args = await argv()
 * console.log(args.tags)  // ["js", "ts"]
 *
 * // Boolean flags and special characters
 * // Command: node script.js --flag --path=@/special/#path
 * const args = await argv()
 * console.log(args.flag)  // true
 * console.log(args.path)  // "@/special/#path"
 * ```
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
