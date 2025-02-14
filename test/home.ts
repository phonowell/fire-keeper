import { $ } from './index'

const a = () => {
  if (typeof $.home !== 'function') throw new Error('0')
}

export { a }
