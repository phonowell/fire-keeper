import { $ } from './index'

// function

const a = () => {
  if ($.getType($.os) !== 'function') throw new Error('0')
}

// export
export { a }
