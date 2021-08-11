import { $ } from './index'

// function

const a = () => {
  if ($.type($.getFilename) !== 'function') throw new Error('0')
}

// export
export { a }
