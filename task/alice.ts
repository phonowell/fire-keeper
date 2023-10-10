import compact from 'lodash/compact'

import { argv, getBasename, glob, prompt } from '../src'

// interface

type FnAsync = <T>() => Promise<T>

/**
 * Prompts the user to select a task from a list of options.
 * @param list - The list of options to choose from.
 * @returns A Promise that resolves to the selected task as a string.
 */
const ask = async (list: string[]): Promise<string> => {
  const answer = await prompt({
    id: 'default-task',
    list,
    message: 'select a task',
    type: 'auto',
  })
  if (!answer) return ''
  if (!list.includes(answer)) return ask(list)
  return answer
}

/**
 * Finds all files in the `./task` directory with a `.js` or `.ts` extension, except for `.d.ts` files.
 * @returns A Promise that resolves to an array of file names as strings.
 */
const load = async () => {
  const listSource = await glob(['./task/*.js', './task/*.ts', '!*.d.ts'])

  const listResult = listSource.map(source => {
    const basename: string = getBasename(source)
    return basename === 'alice' ? '' : basename
  })

  return compact(listResult)
}

/**
 * The main function that runs the program.
 */
const main = async () => {
  const task: string = argv()._[0]
    ? argv()._[0].toString()
    : await (async () => ask(await load()))()

  if (!task) return
  await run(task)
}

/**
 * Imports the file corresponding to the selected task and calls the default exported function.
 * @param task - The name of the task to run.
 */
const run = async (task: string) => {
  const [source] = await glob([`./task/${task}.js`, `./task/${task}.ts`])

  const fn: FnAsync = ((await import(source)) as { default: FnAsync }).default
  await fn()
}

// execute
main()
