import { $, temp } from './index'

const a = async () => {
  await $.copy('./package.json', temp)
  const stat = await $.stat('./package.json')
  if (!stat) throw new Error('0')
  if (!(stat.atime instanceof Date)) throw new Error('1')
  if (typeof stat.size !== 'number') throw new Error('2')
}

const b = async () => {
  const stat = await $.stat(`${temp}/null.txt`)
  if (stat) throw new Error('0')
}

export { a, b }
