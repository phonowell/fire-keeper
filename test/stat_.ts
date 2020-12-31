import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  await $.copy_('./package.json', temp)
  const stat = await $.stat_('./package.json')
  if (!stat) throw new Error('0')
  if ($.type(stat.atime) !== 'date') throw new Error('1')
  if ($.type(stat.size) !== 'number') throw new Error('2')
}

async function b_(): Promise<void> {

  const stat = await $.stat_(`${temp}/null.txt`)
  if (stat) throw new Error('0')
}

// export
export {
  a_,
  b_,
}
