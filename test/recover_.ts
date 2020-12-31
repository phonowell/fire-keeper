import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  const source = `${temp}/readme.md`

  await $.copy_('./readme.md', temp)
  await $.backup_(source)
  await $.remove_(source)

  await $.recover_(source)

  if (!await $.isExisted_(source)) throw new Error('0')
}

// export
export {
  a_,
}
