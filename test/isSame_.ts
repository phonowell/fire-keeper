import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  const listSource = [
    './readme.md',
    `${temp}/a.md`,
    `${temp}/b.md`,
  ]

  await $.copy_(listSource[0], temp, 'a.md')
  await $.copy_(listSource[0], temp, 'b.md')

  const result = await $.isSame_(listSource)
  if (!result) throw new Error('0')
}

async function b_(): Promise<void> {

  const result = await $.isSame_([
    `${temp}/null/txt`,
    './readme.nd',
  ])
  if (result) throw new Error('0')
}

// export
export {
  a_,
  b_,
}
