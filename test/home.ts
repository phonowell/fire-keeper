import { $ } from './index'

// function

const a = () => {
  if ($.getType($.home) !== 'function') throw new Error('0')
}

// export
export { a }
