import { $ } from './index'

// function

const a = () => {
  if ($.getType($.getBasename) !== 'function') throw new Error('0')
}

// export
export { a }
