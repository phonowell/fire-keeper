import { $ } from './index'

// function

const a = () => {
  if ($.getType($.argv) !== 'function') throw new Error('0')
}

// export
export { a }
