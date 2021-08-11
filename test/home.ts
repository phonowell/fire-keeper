import { $ } from './index'

// function

const a = () => {
  if ($.type($.home) !== 'function') throw new Error('0')
}

// export
export { a }
