import compact from 'lodash/compact'

import argv from '../source/argv'
import getBasename from '../source/getBasename'
import glob from '../source/glob'
import prompt from '../source/prompt'

// interface

type FnAsync = <T>() => Promise<T>

// function

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

const load = async (): Promise<string[]> => {
  const listSource = await glob(['./task/*.js', './task/*.ts', '!*.d.ts'])

  const listResult = listSource.map(source => {
    const basename = getBasename(source)
    return basename === 'alice' ? '' : basename
  })

  return compact(listResult)
}

const main = async () => {
  const task = argv()._[0]
    ? argv()._[0].toString()
    : await (async () => ask(await load()))()

  if (!task) return
  await run(task)
}

const run = async (task: string) => {
  const [source] = await glob([`./task/${task}.js`, `./task/${task}.ts`])

  const fn: FnAsync = (await import(source)).default
  await fn()
}

// execute
main()
