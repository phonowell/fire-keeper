import { $ } from './index'

// function

const a = () => {
  if ($.getType($.getDirname) !== 'function') throw new Error('0')
}

// export
export { a }
