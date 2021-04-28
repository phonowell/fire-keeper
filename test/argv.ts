import { $ } from './index'

// function

const a = (): void => {
  if ($.type($.argv) !== 'function') throw new Error('0')
}

// export
export { a }
