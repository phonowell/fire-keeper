import { $ } from './index'

// function

const a = async () => {

  const start = new Date().getTime()
  await $.sleep(200)
  const diff = new Date().getTime() - start
  if (!(diff >= 180 && diff <= 220)) throw new Error('0')
}

// export
export { a }
