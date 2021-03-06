import { $ } from './index'

// function

async function a_(): Promise<void> {

  const start = new Date().getTime()
  await $.sleep_(200)
  const diff = new Date().getTime() - start
  if (!(diff >= 180 && diff <= 220)) throw new Error('0')
}

// export
export { a_ }
