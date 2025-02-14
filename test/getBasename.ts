import { $ } from './index'

const a = () => {
  if (typeof $.getBasename !== 'function') throw new Error('0')
}

export { a }
