import { sleep } from '../src'

const a = async () => {
  const start = new Date().getTime()
  await sleep(200)
  const diff = new Date().getTime() - start
  if (!(diff >= 180 && diff <= 220))
    throw new Error('sleep duration out of range')
}
a.description = 'normal delay'

const b = async () => {
  // Test default delay (0)
  const start = new Date().getTime()
  await sleep()
  const diff = new Date().getTime() - start
  if (diff > 50) throw new Error('default delay took too long')
}
b.description = 'default delay'

const c = async () => {
  // Test longer delay with wider tolerance
  const start = new Date().getTime()
  await sleep(500)
  const diff = new Date().getTime() - start
  if (!(diff >= 450 && diff <= 550))
    throw new Error('longer sleep duration out of range')
}
c.description = 'longer delay'

const d = async () => {
  // Test delay with negative number (should treat as 0)
  const start = new Date().getTime()
  await sleep(-100)
  const diff = new Date().getTime() - start
  if (diff > 50) throw new Error('negative delay took too long')
}
d.description = 'negative delay'

const e = async () => {
  // Test delay with float number (should be rounded)
  const start = new Date().getTime()
  await sleep(100.75)
  const diff = new Date().getTime() - start
  if (!(diff >= 80 && diff <= 120)) throw new Error('float delay out of range')
}
e.description = 'float delay'

export { a, b, c, d, e }
