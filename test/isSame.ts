import { $, temp } from './index'

// function

const a = async () => {

  const listSource = [
    './readme.md',
    `${temp}/a.md`,
    `${temp}/b.md`,
  ]

  await $.copy(listSource[0], temp, 'a.md')
  await $.copy(listSource[0], temp, 'b.md')

  const result = await $.isSame(listSource)
  if (!result) throw new Error('0')
}

const b = async () => {

  const result = await $.isSame([
    `${temp}/null/txt`,
    './readme.nd',
  ])
  if (result) throw new Error('0')
}

// export
export { a, b }
