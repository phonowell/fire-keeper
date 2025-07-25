import { prompt } from '../src/index.js'

const a = () => {
  if (typeof prompt !== 'function') throw new Error('prompt not found')
}
a.description = 'prompt exists'

export { a }
