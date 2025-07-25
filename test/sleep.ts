import { sleep } from '../src/index.js'

const a = async () => {
  const start = new Date().getTime()
  await sleep(200)
  const diff = new Date().getTime() - start
  if (!(diff >= 180 && diff <= 220))
    throw new Error('sleep duration out of range')
}
a.description = 'normal delay'

const b = async () => {
  const start = new Date().getTime()
  await sleep()
  const diff = new Date().getTime() - start
  if (diff > 50) throw new Error('default delay took too long')
}
b.description = 'default delay'

const c = async () => {
  const start = new Date().getTime()
  await sleep(500)
  const diff = new Date().getTime() - start
  if (!(diff >= 450 && diff <= 550))
    throw new Error('longer sleep duration out of range')
}
c.description = 'longer delay'

const d = async () => {
  const start = new Date().getTime()
  await sleep(-100)
  const diff = new Date().getTime() - start
  if (diff > 50) throw new Error('negative delay took too long')
}
d.description = 'negative delay'

const e = async () => {
  const start = new Date().getTime()
  await sleep(100.75)
  const diff = new Date().getTime() - start
  if (!(diff >= 80 && diff <= 120)) throw new Error('float delay out of range')
}
e.description = 'float delay'

export { a, b, c, d, e }
