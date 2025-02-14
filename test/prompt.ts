import { $ } from './index'

const a = () => {
  // Test prompt type exists and is a function
  if (typeof $.prompt !== 'function') throw new Error('prompt not found')
}
a.description = 'prompt exists'

export { a }
