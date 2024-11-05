import { argv, getBasename, glob, prompt } from 'fire-keeper'

// 类型定义
type AsyncFn = <T>() => Promise<T>

/**
 * 执行指定的任务
 * @param taskName 任务名称
 */
const executeTask = async (taskName: string) => {
  const [taskPath] = await glob([
    `./task/${taskName}.js`,
    `./task/${taskName}.ts`,
  ])

  const taskFn = ((await import(taskPath)) as { default: AsyncFn }).default
  await taskFn()
}

/**
 * 加载可用的任务列表
 * @returns 任务名称数组
 */
const loadTasks = async (): Promise<string[]> => {
  const sources = await glob(['./task/*.js', './task/*.ts', '!*.d.ts'])
  return sources
    .filter((source) => getBasename(source) !== 'alice')
    .map(getBasename)
}

/**
 * 提示用户从列表中选择一个任务
 * @param tasks 可选任务列表
 * @returns 选中的任务名称
 */
const promptTask = async (tasks: string[]): Promise<string> => {
  const answer = await prompt({
    id: 'default-task',
    list: tasks,
    message: '选择一个任务',
    type: 'auto',
  })
  if (!answer) return ''
  if (!tasks.includes(answer)) return promptTask(tasks)
  return answer
}

/**
 * 主函数：处理命令行参数或提示用户选择任务，然后执行任务
 */
const main = async () => {
  const taskArg = argv()._[0]
  const task = taskArg
    ? taskArg.toString()
    : await promptTask(await loadTasks())

  if (!task) return
  await executeTask(task)
}

// 执行主函数
main()
