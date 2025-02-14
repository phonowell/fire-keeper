import { $ } from './index'

const a = () => {
  if (typeof $.getExtname !== 'function') throw new Error('0')
}

export { a }
