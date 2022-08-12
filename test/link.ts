import { $, temp } from './index'

// function

const a = async () => {
  const target = `${temp}/source`
  await $.link('./source', target)
  if (!(await $.isExisted(target))) throw new Error('1')
  if (!(await $.isExisted(`${target}/index.ts`))) throw new Error('1')
}

// export
export { a }
