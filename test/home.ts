import { $ } from './index'

// function

function a(): void {
  if ($.type($.home) !== 'function') throw new Error('0')
}

// export
export { a }
