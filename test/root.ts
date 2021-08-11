import { $ } from './index'

// function

const a = () => {
  if ($.type($.root) !== 'function') throw new Error('0')
}

// export
export { a }
