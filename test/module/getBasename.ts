import { $ } from '..'

// function

function a(): void {
  if ($.type($.getBasename) !== 'function') throw new Error('0')
}

// export
export { a }
