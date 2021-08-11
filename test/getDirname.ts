import { $ } from './index'

// function

const a = () => {
  if ($.type($.getDirname) !== 'function') throw new Error('0')
}

// export
export { a }
