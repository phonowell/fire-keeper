import { $, temp } from './index'

// function

const a = async () => {

  await $.copy('./package.json', temp)
  const stat = await $.stat('./package.json')
  if (!stat) throw new Error('0')
  if ($.type(stat.atime) !== 'date') throw new Error('1')
  if ($.type(stat.size) !== 'number') throw new Error('2')
}

const b = async () => {

  const stat = await $.stat(`${temp}/null.txt`)
  if (stat) throw new Error('0')
}

// export
export { a, b }
