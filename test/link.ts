import { $, temp } from './index'

// function

const a = async () => {
  const target = `${temp}/src`
  await $.link('./src', target)
  if (!(await $.isExist(target))) throw new Error('1')
  if (!(await $.isExist(`${target}/index.ts`))) throw new Error('1')
}

// export
export { a }
