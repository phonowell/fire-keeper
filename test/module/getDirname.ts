import { $ } from '..'

// function

function a(): void {
  if ($.type($.getDirname) !== 'function') throw new Error('0')
}

// export
export { a }
