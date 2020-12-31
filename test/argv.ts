import { $ } from './index'

// function

function a(): void {
  if ($.type($.argv) !== 'function') throw new Error('0')
}

// export
export { a }
