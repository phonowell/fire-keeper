import { $ } from './index'

// function

const a = () => {
  if ($.type($.getBasename) !== 'function') throw new Error('0')
}

// export
export { a }
