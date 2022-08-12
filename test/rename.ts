import { $, temp } from './index'

// function

const check = async (
  source: string | string[],
  target: string,
  content: string
): Promise<boolean> => {
  if (await $.isExisted(source)) return false
  if (!(await $.isExisted(target))) return false
  if (content !== (await $.read<string>(target))) return false
  return true
}

const a = async () => {
  const source = `${temp}/a.txt`
  const target = `${temp}/b.txt`
  const content = 'to be or not to be'

  await $.write(source, content)
  await $.rename(source, 'b.txt')

  if (!(await check(source, target, content))) throw new Error('0')
}

// export
export { a }
