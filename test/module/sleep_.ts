import { $ } from '..'

// function

async function a_() {
  const start = new Date().getTime()
  await $.sleep_(200)
  const diff = new Date().getTime() - start
  if (!(180 <= diff && diff <= 220)) throw new Error('0')
}

// export
export { a_ }