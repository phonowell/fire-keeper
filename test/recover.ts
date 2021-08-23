import { $, temp } from './index'

// function

const a = async () => {

  const source = `${temp}/readme.md`

  await $.copy('./readme.md', temp)
  await $.backup(source)
  await $.remove(source)

  await $.recover(source)

  if (!await $.isExisted(source)) throw new Error('0')
}

// export
export { a }
