import { $ } from './index'

// function

const a = () => {
  if ($.getType($.getFilename) !== 'function') throw new Error('0')
}

// export
export { a }
