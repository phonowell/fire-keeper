import { $ } from './index'

// function

const a = () => {
  if ($.getType($.root) !== 'function') throw new Error('0')
}

// export
export { a }
