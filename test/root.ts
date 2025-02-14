import { $ } from './index'

const a = () => {
  if (typeof $.root !== 'function') throw new Error('0')
}

export { a }
