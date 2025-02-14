import { $ } from './index'

const a = () => {
  if (typeof $.getDirname !== 'function') throw new Error('0')
}

// export
export { a }
