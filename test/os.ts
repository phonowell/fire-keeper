import { $ } from './index'

// function

const a = () => {
  if ($.type($.os) !== 'function') throw new Error('0')
}

// export
export { a }
