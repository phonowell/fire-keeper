import { $ } from './index'

const a = () => {
  if (typeof $.argv !== 'function') throw new Error('0')
}

export { a }
