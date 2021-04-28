import { $ } from './index'

// function

function a(): void {
  if ($.type($.prompt_) !== 'function') throw new Error('0')
}

// export
export { a }
