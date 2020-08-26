import { $ } from '..'

// function

function a() {
  if ($.type($.argv) !== 'function') throw new Error('0')
}

// export
export { a }