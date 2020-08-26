import { $ } from '..'

// function

function a() {
  if ($.type($.getFilename) !== 'function') throw new Error('0')
}

// export
export { a }