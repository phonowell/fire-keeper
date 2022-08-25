import { $ } from './index'

// function

const a = () => {
  if ($.getType($.getExtname) !== 'function') throw new Error('0')
}

// export
export { a }
