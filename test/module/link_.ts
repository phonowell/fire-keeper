import { $, temp } from '..'

// function

async function a_() {
  const target = `${temp}/source`
  await $.link_('./source', target)
  if (!await $.isExisted_(target)) throw new Error('1')
  if (!await $.isExisted_(`${target}/index.ts`)) throw new Error('1')
}

// export
export {
  a_
}