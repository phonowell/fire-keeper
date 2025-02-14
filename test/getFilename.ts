import { $ } from './index'

const a = () => {
  if (typeof $.getFilename !== 'function') throw new Error('0')
}

export { a }
