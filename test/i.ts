import { $ } from './index'

// function

function a(): void {
  if ($.type($.i) !== 'function') throw new Error('0')
  if ($.i('test') !== 'test') throw new Error('1')
}

// export
export { a }
