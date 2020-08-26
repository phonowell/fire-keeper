import { $, temp } from '..'

// function

async function a_() {

  const source: string = `${temp}/readme.md`
  const target: string = `${temp}/readme.md.bak`

  await $.copy_('./readme.md', temp)
  await $.backup_(source)
  await $.remove_(source)

  await $.recover_(source)

  if (!await $.isExisted_(source)) throw new Error('0')
}

// export
export {
  a_
}