import { $ } from '..'

// function

function a(): void {
  if ($.type($.getFilename) !== 'function') throw new Error('0')
}

// export
export { a }
