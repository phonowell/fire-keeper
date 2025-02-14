import { $ } from './index'

const a = () => {
  if (typeof $.os !== 'function') throw new Error('0')
}

export { a }
