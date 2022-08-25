import { $ } from './index'

// function

const a = () => {
  if ($.getType($.prompt) !== 'function') throw new Error('0')
}

// export
export { a }
