import { $ } from './index'

// function

const a = () => {
  if ($.type($.prompt) !== 'function') throw new Error('0')
}

// export
export { a }
