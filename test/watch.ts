import { $ } from './index'

// function

const a = () => {
  if (typeof $.watch !== 'function') throw new Error('0')
}

// export
export { a }
